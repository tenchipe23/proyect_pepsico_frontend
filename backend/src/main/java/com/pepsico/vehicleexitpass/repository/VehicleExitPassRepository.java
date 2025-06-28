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
           "LOWER(p.tractorPlaca) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.operadorNombre) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.operadorApellidoPaterno) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.operadorApellidoMaterno) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<VehicleExitPass> findWithSearch(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT p FROM VehicleExitPass p WHERE p.estado = :estado AND (" +
           "LOWER(p.folio) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.razonSocial) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.tractorEco) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.tractorPlaca) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.operadorNombre) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.operadorApellidoPaterno) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.operadorApellidoMaterno) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<VehicleExitPass> findByEstadoWithSearch(@Param("estado") PassStatus estado, 
                                                @Param("search") String search, 
                                                Pageable pageable);
    
    // Global search method - searches across all relevant fields
    @Query("SELECT p FROM VehicleExitPass p WHERE " +
           "LOWER(p.folio) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.razonSocial) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.tractorEco) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.tractorPlaca) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.remolque1Eco) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.remolque1Placa) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.remolque2Eco) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.remolque2Placa) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.operadorNombre) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.operadorApellidoPaterno) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.operadorApellidoMaterno) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.ecoDolly) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.placasDolly) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.comentarios) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "CAST(p.estado AS string) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<VehicleExitPass> globalSearch(@Param("query") String query, Pageable pageable);
}
