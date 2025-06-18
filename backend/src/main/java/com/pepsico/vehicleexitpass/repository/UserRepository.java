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
    
    Optional<User> findByEmailAndEstadoTrue(String email);
<<<<<<< HEAD
=======
    
>>>>>>> 06a5d025459bc02eb04ef0e954262d8207c0757d
    List<User> findByEstadoTrue();
    Page<User> findByEstadoTrue(Pageable pageable);
    List<User> findByRolAndEstadoTrue(UserRole rol);
    long countByRolAndEstadoTrue(UserRole rol);
    boolean existsByEmail(String email); 
    
    List<User> findByRol(UserRole rol);
    
    long countByRolAndEstadoTrue(UserRole rol);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.estado = true AND " +
           "(LOWER(u.nombre) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.apellido) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))")
<<<<<<< HEAD
    Page<User> findEstadoTrueUsersWithSearch(@Param("search") String search, Pageable pageable);
=======
    Page<User> findActiveUsersWithSearch(@Param("search") String search, Pageable pageable);
>>>>>>> 06a5d025459bc02eb04ef0e954262d8207c0757d
}
