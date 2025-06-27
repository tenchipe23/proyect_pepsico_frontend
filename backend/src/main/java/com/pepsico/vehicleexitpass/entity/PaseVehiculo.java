package com.pepsico.vehicleexitpass.entity;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "pase_vehiculos")
public class PaseVehiculo {
    
    @Id
    @Column(name = "id", columnDefinition = "VARCHAR(36)")
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pase_id", referencedColumnName = "id")
    private VehicleExitPass pase;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehiculo_id", referencedColumnName = "id")
    private Vehiculo vehiculo;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoPaseVehiculo tipo;
    
    // Constructors
    public PaseVehiculo() {
        this.id = UUID.randomUUID().toString();
    }
    
    public PaseVehiculo(VehicleExitPass pase, Vehiculo vehiculo, TipoPaseVehiculo tipo) {
        this();
        this.pase = pase;
        this.vehiculo = vehiculo;
        this.tipo = tipo;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public VehicleExitPass getPase() { return pase; }
    public void setPase(VehicleExitPass pase) { this.pase = pase; }
    
    public Vehiculo getVehiculo() { return vehiculo; }
    public void setVehiculo(Vehiculo vehiculo) { this.vehiculo = vehiculo; }
    
    public TipoPaseVehiculo getTipo() { return tipo; }
    public void setTipo(TipoPaseVehiculo tipo) { this.tipo = tipo; }
}