package com.pepsico.vehicleexitpass.repository;

import com.pepsico.vehicleexitpass.entity.Bitacora;
import com.pepsico.vehicleexitpass.entity.User;
import com.pepsico.vehicleexitpass.entity.VehicleExitPass;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BitacoraRepository extends JpaRepository<Bitacora, String> {
    
    List<Bitacora> findByPase(VehicleExitPass pase);
    
    List<Bitacora> findByUsuario(User usuario);
    
    Page<Bitacora> findByPase(VehicleExitPass pase, Pageable pageable);
    
    @Query("SELECT b FROM Bitacora b WHERE b.fecha BETWEEN :startDate AND :endDate ORDER BY b.fecha DESC")
    List<Bitacora> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                  @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT b FROM Bitacora b WHERE " +
           "LOWER(b.accion) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(b.detalles) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "ORDER BY b.fecha DESC")
    Page<Bitacora> findWithSearch(@Param("search") String search, Pageable pageable);
}
