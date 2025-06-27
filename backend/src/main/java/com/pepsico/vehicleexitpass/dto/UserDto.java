package com.pepsico.vehicleexitpass.dto;

import com.pepsico.vehicleexitpass.entity.UserRole;
import com.pepsico.vehicleexitpass.entity.VehicleExitPass;
import com.pepsico.vehicleexitpass.entity.Bitacora;

import java.time.LocalDateTime;
import java.util.Set;

public class UserDto {
    private String id;
    private String email;
    private String nombre;
    private String apellido;
    private String password;
    private UserRole rol;
    private LocalDateTime fechaCreacion;
    private LocalDateTime ultimoAcceso;
    private Boolean estado;
    private Set<VehicleExitPass> pases;
    private Set<Bitacora> bitacoras;

    // Constructors
    public UserDto() {}

    public UserDto(String id, String email, String nombre, String apellido, UserRole rol) {
        this.id = id;
        this.email = email;
        this.nombre = nombre;
        this.apellido = apellido;
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

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public UserRole getRol() { return rol; }
    public void setRol(UserRole rol) { this.rol = rol; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public LocalDateTime getUltimoAcceso() { return ultimoAcceso; }
    public void setUltimoAcceso(LocalDateTime ultimoAcceso) { this.ultimoAcceso = ultimoAcceso; }

    public Boolean getEstado() { return estado; }
    public void setEstado(Boolean estado) { this.estado = estado; }

    public Set<VehicleExitPass> getPases() { return pases; }
    public void setPases(Set<VehicleExitPass> pases) { this.pases = pases; }

    public Set<Bitacora> getBitacoras() { return bitacoras; }
    public void setBitacoras(Set<Bitacora> bitacoras) { this.bitacoras = bitacoras; }

    public String getNombreCompleto() {
        return nombre + " " + apellido;
    }
}
