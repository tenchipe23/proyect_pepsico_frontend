package com.pepsico.vehicleexitpass.service;

import com.pepsico.vehicleexitpass.dto.VehicleExitPassDto;
import com.pepsico.vehicleexitpass.entity.PassStatus;
import com.pepsico.vehicleexitpass.entity.User;
import com.pepsico.vehicleexitpass.entity.VehicleExitPass;
import com.pepsico.vehicleexitpass.exception.ResourceNotFoundException;
import com.pepsico.vehicleexitpass.mapper.VehicleExitPassMapper;
import com.pepsico.vehicleexitpass.repository.UserRepository;
import com.pepsico.vehicleexitpass.repository.VehicleExitPassRepository;
import com.pepsico.vehicleexitpass.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class VehicleExitPassService {
    
    @Autowired
    private VehicleExitPassRepository passRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private VehicleExitPassMapper passMapper;

    @Autowired
    private BitacoraService bitacoraService;
    
    public List<VehicleExitPassDto> getAllPasses() {
        return passRepository.findAll().stream()
            .map(passMapper::toDto)
            .collect(Collectors.toList());
    }
    
    public Page<VehicleExitPassDto> getAllPasses(Pageable pageable) {
        return passRepository.findAll(pageable)
            .map(passMapper::toDto);
    }
    
    public Page<VehicleExitPassDto> getPassesByStatus(PassStatus status, Pageable pageable) {
        return passRepository.findByEstado(status, pageable)
            .map(passMapper::toDto);
    }
    
    public Page<VehicleExitPassDto> searchPasses(String search, Pageable pageable) {
        return passRepository.findWithSearch(search, pageable)
            .map(passMapper::toDto);
    }
    
    public Page<VehicleExitPassDto> searchPassesByStatus(PassStatus status, String search, Pageable pageable) {
        return passRepository.findByEstadoWithSearch(status, search, pageable)
            .map(passMapper::toDto);
    }
    
    // New global search method
    public Page<VehicleExitPassDto> globalSearch(String query, Pageable pageable) {
        return passRepository.globalSearch(query, pageable)
            .map(passMapper::toDto);
    }
    
    public VehicleExitPassDto getPassById(String id) {
        VehicleExitPass pass = passRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Pass not found with id: " + id));
        return passMapper.toDto(pass);
    }
    
    public VehicleExitPassDto getPassByFolio(String folio) {
        VehicleExitPass pass = passRepository.findByFolio(folio)
            .orElseThrow(() -> new ResourceNotFoundException("Pass not found with folio: " + folio));
        return passMapper.toDto(pass);
    }
    
    @Transactional
    public VehicleExitPassDto createPass(VehicleExitPassDto passDto) {
        try {
            // Validar campos requeridos
            if (passDto.getRazonSocial() == null || passDto.getRazonSocial().trim().isEmpty()) {
                throw new IllegalArgumentException("El campo 'razonSocial' es requerido");
            }
            if (passDto.getTractorEco() == null || passDto.getTractorEco().trim().isEmpty()) {
                throw new IllegalArgumentException("El campo 'tractorEco' es requerido");
            }
            if (passDto.getTractorPlaca() == null || passDto.getTractorPlaca().trim().isEmpty()) {
                throw new IllegalArgumentException("El campo 'tractorPlaca' es requerido");
            }
            if (passDto.getOperadorNombre() == null || passDto.getOperadorNombre().trim().isEmpty()) {
                throw new IllegalArgumentException("El campo 'operadorNombre' es requerido");
            }
            if (passDto.getOperadorApellidoPaterno() == null || passDto.getOperadorApellidoPaterno().trim().isEmpty()) {
                throw new IllegalArgumentException("El campo 'operadorApellidoPaterno' es requerido");
            }
            
            // Crear una nueva entidad
            VehicleExitPass pass = new VehicleExitPass();
            
            // Mapear campos básicos
            pass.setId(passDto.getId() != null ? passDto.getId() : UUID.randomUUID().toString());
            pass.setRazonSocial(passDto.getRazonSocial());
            pass.setFecha(passDto.getFecha());
            pass.setTractorEco(passDto.getTractorEco());
            pass.setTractorPlaca(passDto.getTractorPlaca());
            
            // Campos opcionales con manejo de nulos
            if (passDto.getComentarios() != null) {
                pass.setComentarios(passDto.getComentarios());
            }
            if (passDto.getRemolque1Eco() != null) {
                pass.setRemolque1Eco(passDto.getRemolque1Eco());
            }
            if (passDto.getRemolque1Placa() != null) {
                pass.setRemolque1Placa(passDto.getRemolque1Placa());
            }
            if (passDto.getRemolque2Eco() != null) {
                pass.setRemolque2Eco(passDto.getRemolque2Eco());
            }
            if (passDto.getRemolque2Placa() != null) {
                pass.setRemolque2Placa(passDto.getRemolque2Placa());
            }
            if (passDto.getEcoDolly() != null) {
                pass.setEcoDolly(passDto.getEcoDolly());
            }
            if (passDto.getPlacasDolly() != null) {
                pass.setPlacasDolly(passDto.getPlacasDolly());
            }
            
            // Generar folio único si no se proporciona
            if (passDto.getFolio() == null || passDto.getFolio().trim().isEmpty()) {
                pass.setFolio(generateUniqueFolio());
            } else {
                pass.setFolio(passDto.getFolio());
            }
            
            // Establecer estado inicial
            pass.setEstado(PassStatus.PENDIENTE);
            pass.setFechaCreacion(LocalDateTime.now());
            
            // Establecer información del operador
            pass.setOperadorNombre(passDto.getOperadorNombre().trim());
            pass.setOperadorApellidoPaterno(passDto.getOperadorApellidoPaterno().trim());
            if (passDto.getOperadorApellidoMaterno() != null && !passDto.getOperadorApellidoMaterno().trim().isEmpty()) {
                pass.setOperadorApellidoMaterno(passDto.getOperadorApellidoMaterno().trim());
            }
            
            // Establecer usuario autenticado si existe
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof UserPrincipal) {
                UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
                User user = userRepository.findById(userPrincipal.getId())
                    .orElse(null);
                pass.setOperador(user);
            }
            
            System.out.println("Guardando pase: " + pass);
            
            // Guardar el pase
            VehicleExitPass savedPass = passRepository.save(pass);
            
            System.out.println("Pase guardado con ID: " + savedPass.getId());
            
            // Registrar en bitácora en una nueva transacción
            try {
                bitacoraService.registrarAccion(savedPass, "CREACION", "Pase creado");
                System.out.println("Registro de bitácora creado exitosamente");
            } catch (Exception e) {
                // No propagar el error de la bitácora para no afectar la creación del pase
                System.err.println("Error al registrar en bitácora: " + e.getMessage());
                e.printStackTrace();
            }
            
            return passMapper.toDto(savedPass);
        } catch (Exception e) {
            System.err.println("Error en createPass: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al crear el pase: " + e.getMessage(), e);
        }
    }
    
    @Transactional
    public VehicleExitPassDto updatePass(String id, VehicleExitPassDto passDto) {
        try {
            VehicleExitPass existingPass = passRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pass not found with id: " + id));
            
            // Update fields
            existingPass.setRazonSocial(passDto.getRazonSocial());
            existingPass.setFecha(passDto.getFecha());
            existingPass.setTractorEco(passDto.getTractorEco());
            existingPass.setTractorPlaca(passDto.getTractorPlaca());
            
            if (passDto.getComentarios() != null) {
                existingPass.setComentarios(passDto.getComentarios());
            }
            
            VehicleExitPass updatedPass = passRepository.save(existingPass);
            
            // This will now run in a separate transaction
            try {
                bitacoraService.registrarAccion(updatedPass, "ACTUALIZACION", "Pase actualizado");
            } catch (Exception e) {
                // Log the error but don't fail the main operation
                System.err.println("Error al registrar en bitácora: " + e.getMessage());
            }
            
            return passMapper.toDto(updatedPass);
        } catch (Exception e) {
            throw new RuntimeException("Error al actualizar el pase: " + e.getMessage(), e);
        }
    }
    
    @Transactional
    public VehicleExitPassDto signPass(String id, String signature, String seal) {
        try {
            VehicleExitPass pass = passRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pass not found with id: " + id));
            
            if (pass.getEstado() != PassStatus.PENDIENTE) {
                throw new IllegalStateException("El pase solo puede ser firmado cuando está en estado PENDIENTE");
            }
            
            if (signature == null || signature.trim().isEmpty()) {
                throw new IllegalArgumentException("La firma es requerida");
            }
            
            if (seal == null || seal.trim().isEmpty()) {
                throw new IllegalArgumentException("El sello es requerido");
            }
            
            pass.setFirma(signature);
            pass.setSello(seal);
            pass.setEstado(PassStatus.FIRMADO);
            pass.setFechaFirma(LocalDateTime.now());
            
            VehicleExitPass updatedPass = passRepository.save(pass);
            
            try {
                bitacoraService.registrarAccion(updatedPass, "FIRMA", "Pase firmado con sello digital");
            } catch (Exception e) {
                System.err.println("Error al registrar en bitácora: " + e.getMessage());
            }
            
            return passMapper.toDto(updatedPass);
        } catch (Exception e) {
            throw new RuntimeException("Error al firmar el pase: " + e.getMessage(), e);
        }
    }
    
    @Transactional
    public VehicleExitPassDto authorizePass(String id) {
        try {
            VehicleExitPass pass = passRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el pase con id: " + id));
            
            if (pass.getEstado() != PassStatus.FIRMADO) {
                throw new IllegalStateException("El pase solo puede ser autorizado cuando está en estado FIRMADO");
            }
            
            pass.setEstado(PassStatus.AUTORIZADO);
            pass.setFechaAutorizacion(LocalDateTime.now());
            
            VehicleExitPass updatedPass = passRepository.save(pass);
            
            try {
                bitacoraService.registrarAccion(updatedPass, "AUTORIZACION", "Pase autorizado");
            } catch (Exception e) {
                System.err.println("Error al registrar en bitácora: " + e.getMessage());
            }
            
            return passMapper.toDto(updatedPass);
        } catch (Exception e) {
            throw new RuntimeException("Error al autorizar el pase: " + e.getMessage(), e);
        }
    }
    
    @Transactional
    public VehicleExitPassDto rejectPass(String id, String reason) {
        try {
            if (reason == null || reason.trim().isEmpty()) {
                throw new IllegalArgumentException("La razón del rechazo es requerida");
            }
            
            VehicleExitPass pass = passRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el pase con id: " + id));
            
            if (pass.getEstado() == PassStatus.AUTORIZADO) {
                throw new IllegalStateException("No se puede rechazar un pase que ya ha sido autorizado");
            }
            
            pass.setEstado(PassStatus.RECHAZADO);
            
            // Append the rejection reason to the comments
            String comments = pass.getComentarios() != null ? pass.getComentarios() : "";
            pass.setComentarios(comments + (comments.isEmpty() ? "" : "\n\n") + 
                "[RECHAZO " + LocalDateTime.now() + "] " + reason);
            
            VehicleExitPass updatedPass = passRepository.save(pass);
            
            try {
                bitacoraService.registrarAccion(updatedPass, "RECHAZO", "Pase rechazado: " + reason);
            } catch (Exception e) {
                System.err.println("Error al registrar en bitácora: " + e.getMessage());
            }
            
            return passMapper.toDto(updatedPass);
        } catch (Exception e) {
            throw new RuntimeException("Error al rechazar el pase: " + e.getMessage(), e);
        }
    }
    
    public void deletePass(String id) {
        VehicleExitPass pass = passRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Pass not found with id: " + id));
        
        if (pass.getEstado() == PassStatus.AUTORIZADO) {
            throw new RuntimeException("Cannot delete an authorized pass");
        }
        
        passRepository.delete(pass);
    }
    
    public long getPassCountByStatus(PassStatus status) {
        return passRepository.countByEstado(status);
    }
    
    public long getPassCountCreatedSince(LocalDateTime date) {
        return passRepository.countCreatedSince(date);
    }
    
    private String generateUniqueFolio() {
        String folio;
        do {
            folio = "PASE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (passRepository.existsByFolio(folio));
        return folio;
    }
}
