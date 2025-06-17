package com.pepsico.vehicleexitpass.repository;

import com.pepsico.vehicleexitpass.entity.TipoVehiculo;
import com.pepsico.vehicleexitpass.entity.Vehiculo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehiculoRepository extends JpaRepository<Vehiculo, String> {
    
    List<Vehiculo> findByTipo(TipoVehiculo tipo);
    
    List<Vehiculo> findByEstadoTrue();
    
    Page<Vehiculo> findByEstadoTrue(Pageable pageable);
    
    Optional<Vehiculo> findByNumeroEconomico(String numeroEconomico);
    
    Optional<Vehiculo> findByPlaca(String placa);
    
    boolean existsByNumeroEconomico(String numeroEconomico);
    
    boolean existsByPlaca(String placa);
    
    @Query("SELECT v FROM Vehiculo v WHERE v.estado = true AND v.tipo = :tipo AND " +
           "(LOWER(v.numeroEconomico) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(v.placa) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(v.descripcion) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Vehiculo> findByTipoWithSearch(@Param("tipo") TipoVehiculo tipo, 
                                       @Param("search") String search, 
                                       Pageable pageable);
    
    @Query("SELECT v FROM Vehiculo v WHERE v.estado = true AND " +
           "(LOWER(v.numeroEconomico) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(v.placa) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(v.descripcion) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Vehiculo> findActiveVehiculosWithSearch(@Param("search") String search, Pageable pageable);
}
