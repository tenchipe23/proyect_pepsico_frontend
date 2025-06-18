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
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id", referencedColumnName = "id")
    private User createdBy;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "authorized_by_id", referencedColumnName = "id")
    private User authorizedBy;
    
    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
    
    public User getAuthorizedBy() { return authorizedBy; }
    public void setAuthorizedBy(User authorizedBy) { this.authorizedBy = authorizedBy; }
    
    @Column(name = "remolque1_eco")
    private String remolque1Eco;
    
    @Column(name = "remolque1_placa")
    private String remolque1Placa;
    
    @Column(name = "remolque2_eco")
    private String remolque2Eco;
    
    @Column(name = "remolque2_placa")
    private String remolque2Placa;
    
    @Column(name = "operador_nombre")
    private String operadorNombre;
    
    @Column(name = "operador_apellido_paterno")
    private String operadorApellidoPaterno;
    
    @Column(name = "operador_apellido_materno")
    private String operadorApellidoMaterno;
    
    @Column(name = "eco_dolly")
    private String ecoDolly;
    
    @Column(name = "placas_dolly")
    private String placasDolly;
    
    public String getRemolque1Eco() { return remolque1Eco; }
    public void setRemolque1Eco(String remolque1Eco) { this.remolque1Eco = remolque1Eco; }
    
    public String getRemolque1Placa() { return remolque1Placa; }
    public void setRemolque1Placa(String remolque1Placa) { this.remolque1Placa = remolque1Placa; }
    
    public String getRemolque2Eco() { return remolque2Eco; }
    public void setRemolque2Eco(String remolque2Eco) { this.remolque2Eco = remolque2Eco; }
    
    public String getRemolque2Placa() { return remolque2Placa; }
    public void setRemolque2Placa(String remolque2Placa) { this.remolque2Placa = remolque2Placa; }
    
    public String getOperadorNombre() { return operadorNombre; }
    public void setOperadorNombre(String operadorNombre) { this.operadorNombre = operadorNombre; }
    
    public String getOperadorApellidoPaterno() { return operadorApellidoPaterno; }
    public void setOperadorApellidoPaterno(String operadorApellidoPaterno) { this.operadorApellidoPaterno = operadorApellidoPaterno; }
    
    public String getOperadorApellidoMaterno() { return operadorApellidoMaterno; }
    public void setOperadorApellidoMaterno(String operadorApellidoMaterno) { this.operadorApellidoMaterno = operadorApellidoMaterno; }
    
    public String getEcoDolly() { return ecoDolly; }
    public void setEcoDolly(String ecoDolly) { this.ecoDolly = ecoDolly; }
    
    public String getPlacasDolly() { return placasDolly; }
    public void setPlacasDolly(String placasDolly) { this.placasDolly = placasDolly; }
}
