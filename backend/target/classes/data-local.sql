-- Insertar usuarios por defecto
INSERT INTO usuarios (id, email, nombre, apellido, password, rol, fecha_creacion, estado) 
VALUES 
    ('admin-001', 'admin@pepsico.com', 'Administrador', 'Sistema', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKXYLFPZpO8HgEKw/hsaWxrpvKzO', 'ADMIN', NOW(), true),
    ('seg-001', 'seguridad@pepsico.com', 'Jefe', 'Seguridad', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKXYLFPZpO8HgEKw/hsaWxrpvKzO', 'SEGURIDAD', NOW(), true),
    ('aut-001', 'autorizador@pepsico.com', 'Supervisor', 'Autorizador', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKXYLFPZpO8HgEKw/hsaWxrpvKzO', 'AUTORIZADOR', NOW(), true),
    ('cli-001', 'cliente@pepsico.com', 'Cliente', 'Prueba', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKXYLFPZpO8HgEKw/hsaWxrpvKzO', 'CLIENTE', NOW(), true)
ON CONFLICT (email) DO NOTHING;

-- Insertar vehículos de ejemplo
INSERT INTO vehiculos (id, tipo, numero_economico, placa, descripcion, estado)
VALUES 
    ('veh-001', 'TRACTOR', 'ECO-001', 'ABC-123', 'Tractor Kenworth T800', true),
    ('veh-002', 'TRACTOR', 'ECO-002', 'DEF-456', 'Tractor Freightliner Cascadia', true),
    ('veh-003', 'REMOLQUE', 'REM-001', 'GHI-789', 'Remolque 53 pies', true),
    ('veh-004', 'REMOLQUE', 'REM-002', 'JKL-012', 'Remolque 48 pies', true),
    ('veh-005', 'DOLLY', 'DOL-001', 'MNO-345', 'Dolly convertidor', true)
ON CONFLICT (numero_economico) DO NOTHING;

-- Insertar pases de ejemplo
INSERT INTO pases (id, folio, estado, razon_social, fecha, tractor_eco, tractor_placa, operador_id, fecha_creacion, comentarios)
VALUES 
    ('pase-001', 'PASE-2024-001', 'PENDIENTE', 'Transportes PepsiCo SA de CV', '2024-06-17', 'ECO-001', 'ABC-123', 'cli-001', NOW(), 'Pase de prueba'),
    ('pase-002', 'PASE-2024-002', 'FIRMADO', 'Logística Integral SA', '2024-06-17', 'ECO-002', 'DEF-456', 'cli-001', NOW(), 'Pase firmado digitalmente')
ON CONFLICT (folio) DO NOTHING;
