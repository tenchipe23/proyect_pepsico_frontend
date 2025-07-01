-- Insertar usuarios por defecto
INSERT INTO usuarios (id, email, nombre, apellido, password, rol, fecha_creacion, estado) 
VALUES 
('admin-001', 'admin@pepsico.com', 'Administrador', 'Sistema', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'ADMIN', NOW(), true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO usuarios (id, email, nombre, apellido, password, rol, fecha_creacion, estado) 
VALUES 
('seg-001', 'seguridad@pepsico.com', 'Guardia', 'Seguridad', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'SEGURIDAD', NOW(), true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO usuarios (id, email, nombre, apellido, password, rol, fecha_creacion, estado) 
VALUES 
('aut-001', 'autorizador@pepsico.com', 'Supervisor', 'Autorizador', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'AUTORIZADOR', NOW(), true)
ON CONFLICT (id) DO NOTHING;

-- Insertar vehículos de ejemplo
INSERT INTO vehiculos (id, tipo, numero_economico, placa, descripcion, estado) 
VALUES 
('veh-001', 'TRACTOR', 'T001', 'ABC-123', 'Tractor Kenworth T800', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO vehiculos (id, tipo, numero_economico, placa, descripcion, estado) 
VALUES 
('veh-002', 'TRACTOR', 'T002', 'DEF-456', 'Tractor Freightliner Cascadia', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO vehiculos (id, tipo, numero_economico, placa, descripcion, estado) 
VALUES 
('veh-003', 'REMOLQUE', 'R001', 'GHI-789', 'Remolque 53 pies', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO vehiculos (id, tipo, numero_economico, placa, descripcion, estado) 
VALUES 
('veh-004', 'REMOLQUE', 'R002', 'JKL-012', 'Remolque 48 pies', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO vehiculos (id, tipo, numero_economico, placa, descripcion, estado) 
VALUES 
('veh-005', 'DOLLY', 'D001', 'MNO-345', 'Dolly convertidor', true)
ON CONFLICT (id) DO NOTHING;

-- Insertar pase de ejemplo
INSERT INTO pases (id, folio, estado, razon_social, fecha, tractor_eco, tractor_placa, operador_id, fecha_creacion) 
VALUES 
('pase-001', 'PASE-2024-001', 'PENDIENTE', 'Transportes PepsiCo', '2024-01-15', 'T001', 'ABC-123', 'seg-001', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insertar relación pase-vehículo
INSERT INTO pase_vehiculos (id, pase_id, vehiculo_id, tipo) 
VALUES 
('pv-001', 'pase-001', 'veh-001', 'TRACTOR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO pase_vehiculos (id, pase_id, vehiculo_id, tipo) 
VALUES 
('pv-002', 'pase-001', 'veh-003', 'REMOLQUE1')
ON CONFLICT (id) DO NOTHING;

-- Insertar entrada en bitácora
INSERT INTO bitacora (id, pase_id, usuario_id, accion, fecha, detalles) 
VALUES 
('bit-001', 'pase-001', 'seg-001', 'CREACION', NOW(), 'Pase creado por el sistema')
ON CONFLICT (id) DO NOTHING;
