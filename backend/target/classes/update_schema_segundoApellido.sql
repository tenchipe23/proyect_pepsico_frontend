-- Script para actualizar el esquema de la base de datos
-- Agregar columna segundoApellido a la tabla usuarios

DO $$
BEGIN
    -- Agregar columna segundoApellido si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'usuarios' AND column_name = 'segundo_apellido') THEN
        ALTER TABLE usuarios ADD COLUMN segundo_apellido VARCHAR(100);
        RAISE NOTICE 'Columna segundo_apellido agregada a la tabla usuarios';
    ELSE
        RAISE NOTICE 'La columna segundo_apellido ya existe en la tabla usuarios';
    END IF;
    
    RAISE NOTICE 'Esquema de la base de datos actualizado correctamente';
END $$;