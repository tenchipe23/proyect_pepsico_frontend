package com.pepsico.vehicleexitpass.service;

import com.pepsico.vehicleexitpass.entity.Bitacora;
import com.pepsico.vehicleexitpass.entity.User;
import com.pepsico.vehicleexitpass.entity.VehicleExitPass;
import com.pepsico.vehicleexitpass.repository.BitacoraRepository;
import com.pepsico.vehicleexitpass.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(propagation = Propagation.REQUIRES_NEW)
public class BitacoraService {
    
    @Autowired
    private BitacoraRepository bitacoraRepository;
    
    public void registrarAccion(VehicleExitPass pase, String accion, String detalles) {
        try {
            if (pase == null) {
                throw new IllegalArgumentException("El pase no puede ser nulo");
            }
            
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User usuario = null;
            
            if (auth != null && auth.getPrincipal() instanceof UserPrincipal) {
                UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
                if (userPrincipal != null && userPrincipal.getId() != null) {
                    usuario = new User();
                    usuario.setId(userPrincipal.getId());
                }
            }
            
            Bitacora bitacora = new Bitacora(pase, usuario, accion, detalles);
            bitacoraRepository.save(bitacora);
        } catch (Exception e) {
            // Log the error but don't propagate it to avoid rolling back the main transaction
            System.err.println("Error al registrar en bitácora: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    public List<Bitacora> getBitacoraPorPase(VehicleExitPass pase) {
        return bitacoraRepository.findByPase(pase);
    }
    
    public Page<Bitacora> getBitacoraPorPase(VehicleExitPass pase, Pageable pageable) {
        return bitacoraRepository.findByPase(pase, pageable);
    }
    
    public List<Bitacora> getBitacoraPorRangoFecha(LocalDateTime inicio, LocalDateTime fin) {
        return bitacoraRepository.findByDateRange(inicio, fin);
    }
    
    public Page<Bitacora> buscarBitacora(String search, Pageable pageable) {
        return bitacoraRepository.findWithSearch(search, pageable);
    }
}
