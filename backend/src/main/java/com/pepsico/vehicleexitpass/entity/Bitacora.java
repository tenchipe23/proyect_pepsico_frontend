package com.pepsico.vehicleexitpass.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "bitacora")
@EntityListeners(AuditingEntityListener.class)
public class Bitacora {
    
    @Id
    @Column(name = "id", columnDefinition = "VARCHAR(36)")
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pase_id", referencedColumnName = "id")
    private VehicleExitPass pase;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", referencedColumnName = "id")
    private User usuario;
    
    @Column(nullable = false)
    private String accion;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime fecha;
    
    @Column(columnDefinition = "TEXT")
    private String detalles;
    
    // Constructors
    public Bitacora() {
        this.id = UUID.randomUUID().toString();
    }
    
    public Bitacora(VehicleExitPass pase, User usuario, String accion, String detalles) {
        this();
        this.pase = pase;
        this.usuario = usuario;
        this.accion = accion;
        this.detalles = detalles;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public VehicleExitPass getPase() { return pase; }
    public void setPase(VehicleExitPass pase) { this.pase = pase; }
    
    public User getUsuario() { return usuario; }
    public void setUsuario(User usuario) { this.usuario = usuario; }
    
    public String getAccion() { return accion; }
    public void setAccion(String accion) { this.accion = accion; }
    
    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
    
    public String getDetalles() { return detalles; }
    public void setDetalles(String detalles) { this.detalles = detalles; }
}
