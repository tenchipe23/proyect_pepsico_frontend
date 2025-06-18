package com.pepsico.vehicleexitpass.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pepsico.vehicleexitpass.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

public class UserPrincipal implements UserDetails {
    
    private String id;
<<<<<<< HEAD
    private String name;
=======
    private String nombre;
    private String apellido;
>>>>>>> 06a5d025459bc02eb04ef0e954262d8207c0757d
    private String email;
    private Boolean estado;
    private String role;
    
    @JsonIgnore
    private String password;
    
    private Collection<? extends GrantedAuthority> authorities;
    
<<<<<<< HEAD
    public UserPrincipal(String id, String name, String email, String password, 
                        String role, Boolean estado, 
=======
    public UserPrincipal(String id, String nombre, String apellido, String email, String password, 
>>>>>>> 06a5d025459bc02eb04ef0e954262d8207c0757d
                        Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.password = password;
        this.role = role;
        this.estado = estado;
        this.authorities = authorities;
    }
    
    public static UserPrincipal create(User user) {
<<<<<<< HEAD
        List<GrantedAuthority> authorities = Collections.singletonList(
=======
        Collection<GrantedAuthority> authorities = Collections.singletonList(
>>>>>>> 06a5d025459bc02eb04ef0e954262d8207c0757d
            new SimpleGrantedAuthority("ROLE_" + user.getRol().name())
        );

        return new UserPrincipal(
            user.getId(),
<<<<<<< HEAD
            user.getNombre() + " " + user.getApellido(),
=======
            user.getNombre(),
            user.getApellido(),
>>>>>>> 06a5d025459bc02eb04ef0e954262d8207c0757d
            user.getEmail(),
            user.getPassword(),
            user.getRol().name(),
            user.getEstado(),
            authorities
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }
    
    public String getId() {
        return id;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public String getApellido() {
        return apellido;
    }
    
    public String getNombreCompleto() {
        return nombre + " " + apellido;
    }
    
    public String getEmail() {
        return email;
    }
    
    @Override
    public String getUsername() {
        return email;
    }
    
    @Override
    public String getPassword() {
        return password;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return true;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserPrincipal that = (UserPrincipal) o;
        return Objects.equals(id, that.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
