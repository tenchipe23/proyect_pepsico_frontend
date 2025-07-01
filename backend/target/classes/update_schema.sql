-- Script para actualizar el esquema de la base de datos
-- Agregar columnas faltantes a la tabla pases

-- Verificar si las columnas ya existen antes de intentar agregarlas
DO $$
BEGIN
    -- Agregar columna operador_nombre si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'pases' AND column_name = 'operador_nombre') THEN
        ALTER TABLE pases ADD COLUMN operador_nombre VARCHAR(100);
    END IF;
    
    -- Agregar columna operador_apellido_paterno si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'pases' AND column_name = 'operador_apellido_paterno') THEN
        ALTER TABLE pases ADD COLUMN operador_apellido_paterno VARCHAR(100);
    END IF;
    
    -- Agregar columna operador_apellido_materno si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'pases' AND column_name = 'operador_apellido_materno') THEN
        ALTER TABLE pases ADD COLUMN operador_apellido_materno VARCHAR(100);
    END IF;
    
    -- Agregar columna remolque1_eco si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'pases' AND column_name = 'remolque1_eco') THEN
        ALTER TABLE pases ADD COLUMN remolque1_eco VARCHAR(50);
    END IF;
    
    -- Agregar columna remolque1_placa si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'pases' AND column_name = 'remolque1_placa') THEN
        ALTER TABLE pases ADD COLUMN remolque1_placa VARCHAR(50);
    END IF;
    
    -- Agregar columna remolque2_eco si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'pases' AND column_name = 'remolque2_eco') THEN
        ALTER TABLE pases ADD COLUMN remolque2_eco VARCHAR(50);
    END IF;
    
    -- Agregar columna remolque2_placa si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'pases' AND column_name = 'remolque2_placa') THEN
        ALTER TABLE pases ADD COLUMN remolque2_placa VARCHAR(50);
    END IF;
    
    -- Agregar columna eco_dolly si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'pases' AND column_name = 'eco_dolly') THEN
        ALTER TABLE pases ADD COLUMN eco_dolly VARCHAR(50);
    END IF;
    
    -- Agregar columna placas_dolly si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'pases' AND column_name = 'placas_dolly') THEN
        ALTER TABLE pases ADD COLUMN placas_dolly VARCHAR(50);
    END IF;
    
    -- Actualizar el pase de ejemplo con datos de operador si existe
    UPDATE pases 
    SET operador_nombre = 'Operador', 
        operador_apellido_paterno = 'Ejemplo',
        operador_apellido_materno = 'Sistema'
    WHERE id = 'pase-001';
    
    RAISE NOTICE 'Esquema de la base de datos actualizado correctamente';
END $$;
