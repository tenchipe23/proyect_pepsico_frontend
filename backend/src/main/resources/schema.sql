-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id VARCHAR(20) PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    estado BOOLEAN DEFAULT true
);

-- Tabla de vehículos
CREATE TABLE IF NOT EXISTS vehiculos (
    id VARCHAR(20) PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL,
    numero_economico VARCHAR(20) NOT NULL,
    placa VARCHAR(20) NOT NULL,
    descripcion TEXT,
    estado BOOLEAN DEFAULT true
);

-- Tabla de pases
CREATE TABLE IF NOT EXISTS pases (
    id VARCHAR(20) PRIMARY KEY,
    folio VARCHAR(50) NOT NULL UNIQUE,
    estado VARCHAR(20) NOT NULL,
    razon_social VARCHAR(100) NOT NULL,
    fecha DATE NOT NULL,
    tractor_eco VARCHAR(20),
    tractor_placa VARCHAR(20),
    operador_id VARCHAR(20) REFERENCES usuarios(id),
    fecha_creacion TIMESTAMP NOT NULL
);

-- Tabla de relación pase-vehículo
CREATE TABLE IF NOT EXISTS pase_vehiculos (
    id VARCHAR(20) PRIMARY KEY,
    pase_id VARCHAR(20) REFERENCES pases(id) ON DELETE CASCADE,
    vehiculo_id VARCHAR(20) REFERENCES vehiculos(id),
    tipo VARCHAR(20) NOT NULL
);

-- Tabla de bitácora
CREATE TABLE IF NOT EXISTS bitacora (
    id VARCHAR(20) PRIMARY KEY,
    pase_id VARCHAR(20) REFERENCES pases(id) ON DELETE CASCADE,
    usuario_id VARCHAR(20) REFERENCES usuarios(id),
    accion VARCHAR(50) NOT NULL,
    fecha TIMESTAMP NOT NULL,
    detalles TEXT
);
