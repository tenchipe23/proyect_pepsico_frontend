package com.pepsico.vehicleexitpass.repository;

import com.pepsico.vehicleexitpass.entity.User;
import com.pepsico.vehicleexitpass.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByEmailAndEstadoTrue(String email);
    
    boolean existsByEmail(String email);
    
    List<User> findByRol(UserRole rol);
    
    List<User> findByEstadoTrue();
    
    Page<User> findByEstadoTrue(Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.estado = true AND " +
           "(LOWER(u.nombre) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.apellido) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> findActiveUsersWithSearch(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.rol = :rol AND u.estado = true")
    long countByRolAndEstadoTrue(@Param("rol") UserRole rol);
}
