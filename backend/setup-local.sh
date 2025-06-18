#!/bin/bash

echo "🚀 Configurando Backend PepsiCo localmente..."

# Verificar si Java está instalado
if ! command -v java &> /dev/null; then
    echo "❌ Java no está instalado. Por favor instala Java 17 o superior."
    exit 1
fi

# Verificar si Maven está instalado
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven no está instalado. Por favor instala Maven."
    exit 1
fi

# Verificar si PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL no está instalado. Instalando con Homebrew..."
    if command -v brew &> /dev/null; then
        brew install postgresql
        brew services start postgresql
    else
        echo "❌ Por favor instala PostgreSQL manualmente."
        exit 1
    fi
fi

# Crear base de datos
echo "📊 Creando base de datos..."
createdb pepsico_vehicle_pass 2>/dev/null || echo "Base de datos ya existe"

# Crear usuario de base de datos
psql -d postgres -c "CREATE USER pepsico_user WITH PASSWORD 'pepsico123';" 2>/dev/null || echo "Usuario ya existe"
psql -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE pepsico_vehicle_pass TO pepsico_user;" 2>/dev/null

# Limpiar y compilar
echo "🔧 Compilando proyecto..."
mvn clean install -DskipTests

# Ejecutar aplicación
echo "🎯 Iniciando aplicación..."
mvn spring-boot:run
