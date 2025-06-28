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
    
    public VehicleExitPassDto createPass(VehicleExitPassDto passDto) {
        VehicleExitPass pass = passMapper.toEntity(passDto);
        
        // Generate unique folio if not provided
        if (pass.getFolio() == null || pass.getFolio().isEmpty()) {
            pass.setFolio(generateUniqueFolio());
        }
        
        // Set initial status
        pass.setEstado(PassStatus.PENDIENTE);
        
        // Set created by user if authenticated
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
            User user = userRepository.findById(userPrincipal.getId())
                .orElse(null);
            pass.setOperador(user);
        }
        
        VehicleExitPass savedPass = passRepository.save(pass);
        bitacoraService.registrarAccion(savedPass, "CREACION", "Pase creado");
        return passMapper.toDto(savedPass);
    }
    
    public VehicleExitPassDto updatePass(String id, VehicleExitPassDto passDto) {
        VehicleExitPass existingPass = passRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Pass not found with id: " + id));
        
        // Update fields
        existingPass.setRazonSocial(passDto.getRazonSocial());
        existingPass.setFecha(passDto.getFecha());
        existingPass.setTractorEco(passDto.getTractorEco());
        existingPass.setTractorPlaca(passDto.getTractorPlaca());
        existingPass.setComentarios(passDto.getComentarios());
        
        VehicleExitPass updatedPass = passRepository.save(existingPass);
        bitacoraService.registrarAccion(updatedPass, "ACTUALIZACION", "Pase actualizado");
        return passMapper.toDto(updatedPass);
    }
    
    public VehicleExitPassDto signPass(String id, String signature, String seal) {
        VehicleExitPass pass = passRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Pass not found with id: " + id));
        
        if (pass.getEstado() != PassStatus.PENDIENTE) {
            throw new RuntimeException("Pass can only be signed when in PENDIENTE status");
        }
        
        pass.setFirma(signature);
        pass.setSello(seal);
        pass.setEstado(PassStatus.FIRMADO);
        pass.setFechaFirma(LocalDateTime.now());
        
        VehicleExitPass updatedPass = passRepository.save(pass);
        bitacoraService.registrarAccion(updatedPass, "FIRMA", "Pase firmado con sello digital");
        return passMapper.toDto(updatedPass);
    }
    
    public VehicleExitPassDto authorizePass(String id) {
        VehicleExitPass pass = passRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Pass not found with id: " + id));
        
        if (pass.getEstado() != PassStatus.FIRMADO) {
            throw new RuntimeException("Pass can only be authorized when in FIRMADO status");
        }
        
        pass.setEstado(PassStatus.AUTORIZADO);
        pass.setFechaAutorizacion(LocalDateTime.now());
        
        VehicleExitPass updatedPass = passRepository.save(pass);
        bitacoraService.registrarAccion(updatedPass, "AUTORIZACION", "Pase autorizado");
        return passMapper.toDto(updatedPass);
    }
    
    public VehicleExitPassDto rejectPass(String id, String reason) {
        VehicleExitPass pass = passRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Pass not found with id: " + id));
        
        if (pass.getEstado() == PassStatus.AUTORIZADO) {
            throw new RuntimeException("Cannot reject an already authorized pass");
        }
        
        pass.setEstado(PassStatus.RECHAZADO);
        pass.setComentarios(pass.getComentarios() + "\n\nRechazado: " + reason);
        
        VehicleExitPass updatedPass = passRepository.save(pass);
        bitacoraService.registrarAccion(updatedPass, "RECHAZO", "Pase rechazado: " + reason);
        return passMapper.toDto(updatedPass);
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
