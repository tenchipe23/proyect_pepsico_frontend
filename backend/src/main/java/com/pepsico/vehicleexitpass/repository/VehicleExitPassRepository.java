package com.pepsico.vehicleexitpass.repository;

import com.pepsico.vehicleexitpass.entity.PassStatus;
import com.pepsico.vehicleexitpass.entity.VehicleExitPass;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface VehicleExitPassRepository extends JpaRepository<VehicleExitPass, String> {
    
    Optional<VehicleExitPass> findByFolio(String folio);
    
    Page<VehicleExitPass> findByEstado(PassStatus estado, Pageable pageable);
    
    long countByEstado(PassStatus estado);
    
    boolean existsByFolio(String folio);
    
    @Query("SELECT COUNT(p) FROM VehicleExitPass p WHERE p.fechaCreacion >= :date")
    long countCreatedSince(@Param("date") LocalDateTime date);
    
    @Query("SELECT p FROM VehicleExitPass p WHERE " +
           "LOWER(p.folio) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.razonSocial) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.tractorEco) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.tractorPlaca) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<VehicleExitPass> findWithSearch(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT p FROM VehicleExitPass p WHERE p.estado = :estado AND (" +
           "LOWER(p.folio) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.razonSocial) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.tractorEco) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.tractorPlaca) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<VehicleExitPass> findByEstadoWithSearch(@Param("estado") PassStatus estado, 
                                                @Param("search") String search, 
                                                Pageable pageable);
}
