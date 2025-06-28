package com.pepsico.vehicleexitpass.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "vehiculos")
public class Vehiculo {
    
    @Id
    @Column(name = "id", columnDefinition = "VARCHAR(36)")
    private String id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoVehiculo tipo;
    
    @NotBlank
    @Size(max = 50)
    @Column(name = "numero_economico", nullable = false)
    private String numeroEconomico;
    
    @NotBlank
    @Size(max = 50)
    @Column(nullable = false)
    private String placa;
    
    @Size(max = 200)
    private String descripcion;
    
    @Column(nullable = false)
    private Boolean estado = true;
    
    @OneToMany(mappedBy = "vehiculo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<PaseVehiculo> paseVehiculos = new HashSet<>();
    
    // Constructors
    public Vehiculo() {
        this.id = UUID.randomUUID().toString();
    }
    
    public Vehiculo(TipoVehiculo tipo, String numeroEconomico, String placa, String descripcion) {
        this();
        this.tipo = tipo;
        this.numeroEconomico = numeroEconomico;
        this.placa = placa;
        this.descripcion = descripcion;
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
