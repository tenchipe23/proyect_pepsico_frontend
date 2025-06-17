package com.pepsico.vehicleexitpass.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_exit_passes")
@EntityListeners(AuditingEntityListener.class)
public class VehicleExitPass {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 50)
    @Column(nullable = false, unique = true)
    private String folio;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PassStatus estado = PassStatus.PENDIENTE;
    
    @NotBlank
    @Size(max = 200)
    @Column(nullable = false)
    private String razonSocial;
    
    @NotNull
    @Column(nullable = false)
    private LocalDateTime fecha;
    
    // Vehicle Information
    @NotBlank
    @Size(max = 50)
    @Column(nullable = false)
    private String tractorEco;
    
    @NotBlank
    @Size(max = 50)
    @Column(nullable = false)
    private String tractorPlaca;
    
    @Size(max = 50)
    private String remolque1Eco;
    
    @Size(max = 50)
    private String remolque1Placa;
    
    @Size(max = 50)
    private String remolque2Eco;
    
    @Size(max = 50)
    private String remolque2Placa;
    
    // Operator Information
    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String operadorNombre;
    
    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String operadorApellidoPaterno;
    
    @Size(max = 100)
    private String operadorApellidoMaterno;
    
    // Dolly Information
    @Size(max = 50)
    private String ecoDolly;
    
    @Size(max = 50)
    private String placasDolly;
    
    @Column(columnDefinition = "TEXT")
    private String comentarios;
    
    // Digital Signature and Seal
    @Column(columnDefinition = "LONGTEXT")
    private String firma;
    
    @Column(columnDefinition = "LONGTEXT")
    private String sello;
    
    // Audit fields
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;
    
    @LastModifiedDate
    private LocalDateTime fechaActualizacion;
    
    private LocalDateTime fechaFirma;
    
    private LocalDateTime fechaAutorizacion;
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private User createdBy;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "authorized_by_id")
    private User authorizedBy;
    
    // Constructors
    public VehicleExitPass() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getFolio() { return folio; }
    public void setFolio(String folio) { this.folio = folio; }
    
    public PassStatus getEstado() { return estado; }
    public void setEstado(PassStatus estado) { this.estado = estado; }
    
    public String getRazonSocial() { return razonSocial; }
    public void setRazonSocial(String razonSocial) { this.razonSocial = razonSocial; }
    
    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
    
    public String getTractorEco() { return tractorEco; }
    public void setTractorEco(String tractorEco) { this.tractorEco = tractorEco; }
    
    public String getTractorPlaca() { return tractorPlaca; }
    public void setTractorPlaca(String tractorPlaca) { this.tractorPlaca = tractorPlaca; }
    
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
    
    public String getComentarios() { return comentarios; }
    public void setComentarios(String comentarios) { this.comentarios = comentarios; }
    
    public String getFirma() { return firma; }
    public void setFirma(String firma) { this.firma = firma; }
    
    public String getSello() { return sello; }
    public void setSello(String sello) { this.sello = sello; }
    
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    
    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
    
    public LocalDateTime getFechaFirma() { return fechaFirma; }
    public void setFechaFirma(LocalDateTime fechaFirma) { this.fechaFirma = fechaFirma; }
    
    public LocalDateTime getFechaAutorizacion() { return fechaAutorizacion; }
    public void setFechaAutorizacion(LocalDateTime fechaAutorizacion) { this.fechaAutorizacion = fechaAutorizacion; }
    
    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
    
    public User getAuthorizedBy() { return authorizedBy; }
    public void setAuthorizedBy(User authorizedBy) { this.authorizedBy = authorizedBy; }
}
