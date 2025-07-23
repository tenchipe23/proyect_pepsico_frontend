package com.pepsico.vehicleexitpass.dto;

import com.pepsico.vehicleexitpass.entity.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "Datos de un usuario")
public class UserDto {
    @Schema(description = "Identificador único del usuario", example = "5f07c259-4463-4c71-a3cc-b8d59478d83a")
    private String id;
    
    @Schema(description = "Correo electrónico del usuario", example = "usuario@pepsico.com")
    private String email;
    
    @Schema(description = "Nombre del usuario", example = "Juan")
    private String nombre;
    
    @Schema(description = "Primer apellido del usuario", example = "Pérez")
    private String apellido;
    
    @Schema(description = "Segundo apellido del usuario", example = "García")
    private String segundoApellido;
    
    @Schema(description = "Rol del usuario", example = "ADMIN")
    private UserRole rol;
    
    @Schema(description = "Fecha de creación de la cuenta", example = "2023-01-01T12:00:00")
    private LocalDateTime fechaCreacion;
    
    @Schema(description = "Fecha del último acceso del usuario", example = "2023-01-15T08:30:00")
    private LocalDateTime ultimoAcceso;
    
    @Schema(description = "Estado del usuario (activo/inactivo)", example = "true")
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

    @Schema(description = "Nombre completo del usuario", example = "Juan Pérez García")
    public String getNombreCompleto() {
        if (segundoApellido != null && !segundoApellido.isEmpty()) {
            return nombre + " " + apellido + " " + segundoApellido;
        }
        return nombre + " " + apellido;
    }
}
