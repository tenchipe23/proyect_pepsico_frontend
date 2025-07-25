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
    
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.estado = true")
    Optional<User> findByEmailAndEstadoTrue(@Param("email") String email);
    
    List<User> findByEstadoTrue();
    
    Page<User> findByEstadoTrue(Pageable pageable);
    
    List<User> findByRol(UserRole rol);
    
    long countByRolAndEstadoTrue(UserRole rol);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.estado = true AND " +
           "(LOWER(u.nombre) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.apellido) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> findActiveUsersWithSearch(@Param("search") String search, Pageable pageable);
    
    long countByEstadoTrue();
}
