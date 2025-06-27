package com.pepsico.vehicleexitpass.dto;

import com.pepsico.vehicleexitpass.entity.TipoVehiculo;
import com.pepsico.vehicleexitpass.entity.PaseVehiculo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.Set;

public class VehiculoDto {
    
    private String id;
    
    @NotNull(message = "Tipo is required")
    private TipoVehiculo tipo;
    
    @NotBlank(message = "Número económico is required")
    @Size(max = 50, message = "Número económico must not exceed 50 characters")
    private String numeroEconomico;
    
    @NotBlank(message = "Placa is required")
    @Size(max = 50, message = "Placa must not exceed 50 characters")
    private String placa;
    
    @Size(max = 200, message = "Descripción must not exceed 200 characters")
    private String descripcion;
    
    private Boolean estado;
    
    private Set<PaseVehiculo> paseVehiculos;

    // Constructors
    public VehiculoDto() {}
    
    public VehiculoDto(String id, TipoVehiculo tipo, String numeroEconomico, String placa, String descripcion, Boolean estado) {
        this.id = id;
        this.tipo = tipo;
        this.numeroEconomico = numeroEconomico;
        this.placa = placa;
        this.descripcion = descripcion;
        this.estado = estado;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public TipoVehiculo getTipo() { return tipo; }
    public void setTipo(TipoVehiculo tipo) { this.tipo = tipo; }
    
    public String getNumeroEconomico() { return numeroEconomico; }
    public void setNumeroEconomico(String numeroEconomico) { this.numeroEconomico = numeroEconomico; }
    
    public String getPlaca() { return placa; }
    public void setPlaca(String placa) { this.placa = placa; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    public Boolean getEstado() { return estado; }
    public void setEstado(Boolean estado) { this.estado = estado; }
    
    public Set<PaseVehiculo> getPaseVehiculos() { return paseVehiculos; }
    public void setPaseVehiculos(Set<PaseVehiculo> paseVehiculos) { this.paseVehiculos = paseVehiculos; }
}
