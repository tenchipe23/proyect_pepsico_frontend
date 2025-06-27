package com.pepsico.vehicleexitpass.service;

import com.pepsico.vehicleexitpass.dto.VehicleExitPassDto;
import com.pepsico.vehicleexitpass.entity.PassStatus;
import com.pepsico.vehicleexitpass.entity.User;
import com.pepsico.vehicleexitpass.entity.VehicleExitPass;
import com.pepsico.vehicleexitpass.exception.ResourceNotFoundException;
import com.pepsico.vehicleexitpass.mapper.VehicleExitPassMapper;
import com.pepsico.vehicleexitpass.repository.UserRepository;
import com.pepsico.vehicleexitpass.repository.VehicleExitPassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class VehicleExitPassService {

    private final VehicleExitPassRepository vehicleExitPassRepository;
    private final UserRepository userRepository;
    private final VehicleExitPassMapper vehicleExitPassMapper;
    private final BitacoraService bitacoraService;

    @Autowired
    public VehicleExitPassService(VehicleExitPassRepository vehicleExitPassRepository,
                                 UserRepository userRepository,
                                 VehicleExitPassMapper vehicleExitPassMapper,
                                 BitacoraService bitacoraService) {
        this.vehicleExitPassRepository = vehicleExitPassRepository;
        this.userRepository = userRepository;
        this.vehicleExitPassMapper = vehicleExitPassMapper;
        this.bitacoraService = bitacoraService;
    }

    public List<VehicleExitPassDto> getAllPasses() {
        return vehicleExitPassRepository.findAll().stream()
            .map(vehicleExitPassMapper::toDto)
            .collect(Collectors.toList());
    }

    public Page<VehicleExitPassDto> getAllPasses(Pageable pageable) {
        return vehicleExitPassRepository.findAll(pageable)
            .map(vehicleExitPassMapper::toDto);
    }

    public Page<VehicleExitPassDto> getPassesByStatus(String status, Pageable pageable) {
        return vehicleExitPassRepository.findByEstado(PassStatus.valueOf(status.toUpperCase()), pageable)
            .map(vehicleExitPassMapper::toDto);
    }

    public Page<VehicleExitPassDto> searchPasses(String search, Pageable pageable) {
        if (search == null || search.trim().isEmpty()) {
            return vehicleExitPassRepository.findAll(pageable)
                .map(vehicleExitPassMapper::toDto);
        }
        
        return vehicleExitPassRepository.buscarPorTractorPlacaONombreOperadorOComentarios(
            search, search, search, pageable)
            .map(vehicleExitPassMapper::toDto);
    }

    public VehicleExitPassDto getPassById(String id) {
        VehicleExitPass pass = vehicleExitPassRepository.findById(UUID.fromString(id))
            .orElseThrow(() -> new ResourceNotFoundException("Pass not found with id: " + id));
        return vehicleExitPassMapper.toDto(pass);
    }

    public VehicleExitPassDto getPassByFolio(String folio) {
        VehicleExitPass pass = vehicleExitPassRepository.findByFolio(folio)
            .orElseThrow(() -> new ResourceNotFoundException("Pass not found with folio: " + folio));
        return vehicleExitPassMapper.toDto(pass);
    }

    public VehicleExitPassDto createPass(VehicleExitPassDto passDto) {
        VehicleExitPass pass = vehicleExitPassMapper.toEntity(passDto);
        
        // Generate unique folio if not provided
        if (pass.getFolio() == null || pass.getFolio().isEmpty()) {
            pass.setFolio(generateUniqueFolio());
        }
        
        // Set initial status
        pass.setEstado(PassStatus.PENDIENTE);
        
        // Set created by user if authenticated
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
            pass.setOperador(user);
        }
        
        VehicleExitPass savedPass = vehicleExitPassRepository.save(pass);
        bitacoraService.registrarAccion(savedPass, "CREACION", "Pase creado");
        return vehicleExitPassMapper.toDto(savedPass);
    }

    public VehicleExitPassDto updatePass(String id, VehicleExitPassDto passDto) {
        VehicleExitPass existingPass = vehicleExitPassRepository.findById(UUID.fromString(id))
            .orElseThrow(() -> new ResourceNotFoundException("Pass not found with id: " + id));
        
        // Update fields
        vehicleExitPassMapper.updateFromDto(passDto, existingPass);
        
        VehicleExitPass updatedPass = vehicleExitPassRepository.save(existingPass);
        bitacoraService.registrarAccion(updatedPass, "ACTUALIZACION", "Pase actualizado");
        return vehicleExitPassMapper.toDto(updatedPass);
    }

    public VehicleExitPassDto signPass(String id, String signature, String seal) {
        VehicleExitPass pass = vehicleExitPassRepository.findById(UUID.fromString(id))
            .orElseThrow(() -> new ResourceNotFoundException("Pass not found with id: " + id));
            
        if (pass.getEstado() != PassStatus.PENDIENTE) {
            throw new RuntimeException("Pass can only be signed when in PENDIENTE status");
        }
        
        pass.setFirma(signature);
        pass.setSello(seal);
        pass.setEstado(PassStatus.FIRMADO);
        pass.setFechaFirma(LocalDateTime.now());
        
        VehicleExitPass updatedPass = vehicleExitPassRepository.save(pass);
        bitacoraService.registrarAccion(updatedPass, "FIRMA", "Pase firmado con sello digital");
        return vehicleExitPassMapper.toDto(updatedPass);
    }

    public VehicleExitPassDto authorizePass(String id) {
        VehicleExitPass pass = vehicleExitPassRepository.findById(UUID.fromString(id))
            .orElseThrow(() -> new ResourceNotFoundException("Pass not found with id: " + id));
            
        if (pass.getEstado() != PassStatus.FIRMADO) {
            throw new RuntimeException("Pass can only be authorized when in FIRMADO status");
        }
        
        pass.setEstado(PassStatus.AUTORIZADO);
        pass.setFechaAutorizacion(LocalDateTime.now());
        
        VehicleExitPass updatedPass = vehicleExitPassRepository.save(pass);
        bitacoraService.registrarAccion(updatedPass, "AUTORIZACION", "Pase autorizado");
        return vehicleExitPassMapper.toDto(updatedPass);
    }

    public VehicleExitPassDto rejectPass(String id, String reason) {
        VehicleExitPass pass = vehicleExitPassRepository.findById(UUID.fromString(id))
            .orElseThrow(() -> new ResourceNotFoundException("Pass not found with id: " + id));
            
        if (pass.getEstado() == PassStatus.AUTORIZADO) {
            throw new RuntimeException("Cannot reject an already authorized pass");
        }
        
        pass.setEstado(PassStatus.RECHAZADO);
        pass.setComentarios((pass.getComentarios() != null ? pass.getComentarios() + "\n" : "") + 
                           "Rechazado: " + reason);
        
        VehicleExitPass updatedPass = vehicleExitPassRepository.save(pass);
        bitacoraService.registrarAccion(updatedPass, "RECHAZO", "Pase rechazado: " + reason);
        return vehicleExitPassMapper.toDto(updatedPass);
    }

    public void deletePass(String id) {
        VehicleExitPass pass = vehicleExitPassRepository.findById(UUID.fromString(id))
            .orElseThrow(() -> new ResourceNotFoundException("Pass not found with id: " + id));
            
        if (pass.getEstado() == PassStatus.AUTORIZADO) {
            throw new RuntimeException("Cannot delete an authorized pass");
        }
        
        vehicleExitPassRepository.delete(pass);
    }

    private String generateUniqueFolio() {
        String folio;
        do {
            folio = "PEP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (vehicleExitPassRepository.existsByFolio(folio));
        return folio;
    }
}
