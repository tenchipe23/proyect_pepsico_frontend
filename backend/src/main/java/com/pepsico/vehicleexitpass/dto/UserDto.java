package com.pepsico.vehicleexitpass.dto;

import com.pepsico.vehicleexitpass.entity.UserRole;

import java.time.LocalDateTime;

public class UserDto {
    private String id;
    private String email;
    private String nombre;
    private String apellido;
    private String segundoApellido;
    private UserRole rol;
    private LocalDateTime fechaCreacion;
    private LocalDateTime ultimoAcceso;
    private Boolean estado;

    // Constructors
    public UserDto() {}

    public UserDto(String id, String email, String nombre, String apellido, String segundoApellido, UserRole rol) {
        this.id = id;
        this.email = email;
        this.nombre = nombre;
        this.apellido = apellido;
        this.segundoApellido = segundoApellido;
        this.rol = rol;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getSegundoApellido() { return segundoApellido; }
    public void setSegundoApellido(String segundoApellido) { this.segundoApellido = segundoApellido; }

    public UserRole getRol() { return rol; }
    public void setRol(UserRole rol) { this.rol = rol; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public LocalDateTime getUltimoAcceso() { return ultimoAcceso; }
    public void setUltimoAcceso(LocalDateTime ultimoAcceso) { this.ultimoAcceso = ultimoAcceso; }

    public Boolean getEstado() { return estado; }
    public void setEstado(Boolean estado) { this.estado = estado; }

    public String getNombreCompleto() {
        if (segundoApellido != null && !segundoApellido.isEmpty()) {
            return nombre + " " + apellido + " " + segundoApellido;
        }
        return nombre + " " + apellido;
    }
}
