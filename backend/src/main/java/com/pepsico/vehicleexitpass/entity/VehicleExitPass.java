package com.pepsico.vehicleexitpass.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "pases")
@EntityListeners(AuditingEntityListener.class)
public class VehicleExitPass {
    
    @Id
    @Column(name = "id", columnDefinition = "VARCHAR(36)")
    private String id;
    
    @NotBlank
    @Size(max = 50)
    @Column(nullable = false, unique = true)
    private String folio;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PassStatus estado = PassStatus.PENDIENTE;
    
    @NotBlank
    @Size(max = 200)
    @Column(name = "razon_social", nullable = false)
    private String razonSocial;
    
    @NotNull
    @Column(nullable = false)
    private LocalDate fecha;
    
    @NotBlank
    @Size(max = 50)
    @Column(name = "tractor_eco", nullable = false)
    private String tractorEco;
    
    @NotBlank
    @Size(max = 50)
    @Column(name = "tractor_placa", nullable = false)
    private String tractorPlaca;
    
    @CreatedDate
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;
    
    @Column(columnDefinition = "TEXT")
    private String firma;
    
    @Column(columnDefinition = "TEXT")
    private String sello;
    
    @Column(columnDefinition = "TEXT")
    private String comentarios;
    
    @Column(name = "fecha_firma")
    private LocalDateTime fechaFirma;
    
    @Column(name = "fecha_autorizacion")
    private LocalDateTime fechaAutorizacion;
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operador_id", referencedColumnName = "id")
    private User operador;
    
    @OneToMany(mappedBy = "pase", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<PaseVehiculo> paseVehiculos = new HashSet<>();
    
    @OneToMany(mappedBy = "pase", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Bitacora> bitacoras = new HashSet<>();
    
    // Constructors
    public VehicleExitPass() {
        this.id = UUID.randomUUID().toString();
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getFolio() { return folio; }
    public void setFolio(String folio) { this.folio = folio; }
    
    public PassStatus getEstado() { return estado; }
    public void setEstado(PassStatus estado) { this.estado = estado; }
    
    public String getRazonSocial() { return razonSocial; }
    public void setRazonSocial(String razonSocial) { this.razonSocial = razonSocial; }
    
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    
    public String getTractorEco() { return tractorEco; }
    public void setTractorEco(String tractorEco) { this.tractorEco = tractorEco; }
    
    public String getTractorPlaca() { return tractorPlaca; }
    public void setTractorPlaca(String tractorPlaca) { this.tractorPlaca = tractorPlaca; }
    
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    
    public String getFirma() { return firma; }
    public void setFirma(String firma) { this.firma = firma; }
    
    public String getSello() { return sello; }
    public void setSello(String sello) { this.sello = sello; }
    
    public String getComentarios() { return comentarios; }
    public void setComentarios(String comentarios) { this.comentarios = comentarios; }
    
    public LocalDateTime getFechaFirma() { return fechaFirma; }
    public void setFechaFirma(LocalDateTime fechaFirma) { this.fechaFirma = fechaFirma; }
    
    public LocalDateTime getFechaAutorizacion() { return fechaAutorizacion; }
    public void setFechaAutorizacion(LocalDateTime fechaAutorizacion) { this.fechaAutorizacion = fechaAutorizacion; }
    
    public User getOperador() { return operador; }
    public void setOperador(User operador) { this.operador = operador; }
    
    public Set<PaseVehiculo> getPaseVehiculos() { return paseVehiculos; }
    public void setPaseVehiculos(Set<PaseVehiculo> paseVehiculos) { this.paseVehiculos = paseVehiculos; }
    
    public Set<Bitacora> getBitacoras() { return bitacoras; }
    public void setBitacoras(Set<Bitacora> bitacoras) { this.bitacoras = bitacoras; }
}
