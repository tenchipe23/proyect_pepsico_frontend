-- Insert default users
INSERT IGNORE INTO users (id, name, email, password, role, active, created_at, updated_at) VALUES
(1, 'Administrador', 'admin@pepsico.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'ADMIN', true, NOW(), NOW()),
(2, 'Autorizador', 'autorizador@pepsico.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'AUTORIZADOR', true, NOW(), NOW()),
(3, 'Seguridad', 'seguridad@pepsico.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'SEGURIDAD', true, NOW(), NOW());

-- Note: The password hash above corresponds to 'password123' - you should change this in production
-- To generate a new hash, you can use: BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(); encoder.encode("yourpassword");

-- Insert sample vehicle exit passes
INSERT IGNORE INTO vehicle_exit_passes (
    id, folio, estado, razon_social, fecha, 
    tractor_eco, tractor_placa, remolque1_eco, remolque1_placa,
    operador_nombre, operador_apellido_paterno, operador_apellido_materno,
    comentarios, fecha_creacion, created_by_id
) VALUES
(1, 'PASE-001', 'PENDIENTE', 'Transportes del Norte S.A.', '2024-01-15 08:00:00',
 'ECO-001', 'ABC-123', 'REM-001', 'DEF-456',
 'Juan', 'Pérez', 'García',  '2024-01-15 08:00:00',
 'ECO-001', 'ABC-123', 'REM-001', 'DEF-456',
 'Juan', 'Pérez', 'García',
 'Transporte de mercancía general', NOW(), 1),
(2, 'PASE-002', 'FIRMADO', 'Logística Integral S.A.', '2024-01-16 10:30:00',
 'ECO-002', 'GHI-789', 'REM-002', 'JKL-012',
 'María', 'González', 'López',
 'Carga refrigerada', NOW(), 1),
(3, 'PASE-003', 'AUTORIZADO', 'Distribuidora Central S.A.', '2024-01-17 14:15:00',
 'ECO-003', 'MNO-345', 'REM-003', 'PQR-678',
 'Carlos', 'Rodríguez', 'Martínez',
 'Entrega urgente', NOW(), 2);
