package com.pepsico.vehicleexitpass.dto;

import com.pepsico.vehicleexitpass.entity.PassStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class VehicleExitPassDto {
    
    private Long id;
    
    @NotBlank(message = "Folio is required")
    @Size(max = 50, message = "Folio must not exceed 50 characters")
    private String folio;
    
    private PassStatus estado;
    
    @NotBlank(message = "Razón social is required")
    @Size(max = 200, message = "Razón social must not exceed 200 characters")
    private String razonSocial;
    
    @NotNull(message = "Fecha is required")
    private LocalDateTime fecha;
    
    @NotBlank(message = "Tractor ECO is required")
    @Size(max = 50, message = "Tractor ECO must not exceed 50 characters")
    private String tractorEco;
    
    @NotBlank(message = "Tractor placa is required")
    @Size(max = 50, message = "Tractor placa must not exceed 50 characters")
    private String tractorPlaca;
    
    @Size(max = 50, message = "Remolque 1 ECO must not exceed 50 characters")
    private String remolque1Eco;
    
    @Size(max = 50, message = "Remolque 1 placa must not exceed 50 characters")
    private String remolque1Placa;
    
    @Size(max = 50, message = "Remolque 2 ECO must not exceed 50 characters")
    private String remolque2Eco;
    
    @Size(max = 50, message = "Remolque 2 placa must not exceed 50 characters")
    private String remolque2Placa;
    
    @NotBlank(message = "Operator name is required")
    @Size(max = 100, message = "Operator name must not exceed 100 characters")
    private String operadorNombre;
    
    @NotBlank(message = "Operator apellido paterno is required")
    @Size(max = 100, message = "Operator apellido paterno must not exceed 100 characters")
    private String operadorApellidoPaterno;
    
    @Size(max = 100, message = "Operator apellido materno must not exceed 100 characters")
    private String operadorApellidoMaterno;
    
    @Size(max = 50, message = "ECO dolly must not exceed 50 characters")
    private String ecoDolly;
    
    @Size(max = 50, message = "Placas dolly must not exceed 50 characters")
    private String placasDolly;
    
    private String comentarios;
    private String firma;
    private String sello;
    
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    private LocalDateTime fechaFirma;
    private LocalDateTime fechaAutorizacion;
    
    private UserDto createdBy;
    private UserDto authorizedBy;
    
    // Constructors
    public VehicleExitPassDto() {}
    
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
    
    public UserDto getCreatedBy() { return createdBy; }
    public void setCreatedBy(UserDto createdBy) { this.createdBy = createdBy; }
    
    public UserDto getAuthorizedBy() { return authorizedBy; }
    public void setAuthorizedBy(UserDto authorizedBy) { this.authorizedBy = authorizedBy; }
}
