package com.pepsico.vehicleexitpass.dto;

import com.pepsico.vehicleexitpass.entity.PassStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSetter;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Datos de un pase de salida de vehículo")
public class VehicleExitPassDto {
    @Schema(description = "Identificador único del pase", example = "5f07c259-4463-4c71-a3cc-b8d59478d83a")
    private String id;
    
    @Schema(description = "Folio único del pase", example = "PSV-2023-001")
    private String folio;
    
    @Schema(description = "Estado actual del pase", example = "PENDIENTE")
    private PassStatus estado;
    
    @Schema(description = "Razón social", example = "Transportes XYZ S.A. de C.V.")
    private String razonSocial;
    
    @Schema(description = "Nombre del operador", example = "Juan")
    private String operadorNombre;
    
    @Schema(description = "Apellido paterno del operador", example = "Pérez")
    private String operadorApellidoPaterno;
    
    @Schema(description = "Apellido materno del operador", example = "García")
    private String operadorApellidoMaterno;
    
    @Schema(description = "Fecha programada de salida", example = "2023-01-15")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fecha;
    
    // Used for date format conversion in mapping
    @Schema(hidden = true)
    private String fechaFromString;
    
    // For JSON deserialization of 'fecha' field
    @JsonSetter("fecha")
    public void setFechaFromJson(String dateString) {
        if (dateString != null) {
            // Manejar tanto fechas ISO 8601 como fechas simples
            if (dateString.contains("T")) {
                // Si es una fecha ISO 8601 con tiempo, extraer solo la parte de la fecha
                this.fecha = LocalDate.parse(dateString.substring(0, 10));
            } else {
                this.fecha = LocalDate.parse(dateString);
            }
        }
    }
    
    @Schema(description = "Número económico del tractor", example = "ECO-T-12345")
    private String tractorEco;
    
    @Schema(description = "Placa del tractor", example = "ABC-123")
    private String tractorPlaca;
    
    @Schema(description = "Número económico del remolque 1", example = "ECO-R1-12345")
    private String remolque1Eco;
    
    @Schema(description = "Placa del remolque 1", example = "XYZ-789")
    private String remolque1Placa;
    
    @Schema(description = "Número económico del remolque 2", example = "ECO-R2-12345")
    private String remolque2Eco;
    
    @Schema(description = "Placa del remolque 2", example = "DEF-456")
    private String remolque2Placa;
    
    @Schema(description = "Número económico del dolly", example = "ECO-D-12345")
    private String ecoDolly;
    
    @Schema(description = "Placa del dolly", example = "GHI-789")
    private String placasDolly;
    
    @Schema(description = "Comentarios adicionales", example = "Transporte de producto terminado a centro de distribución")
    private String comentarios;
    
    @Schema(description = "Firma digital del operador (Base64)", example = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...")
    private String firma;
    
    @Schema(description = "Sello digital de autorización (Base64)", example = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...")
    private String sello;
    
    @Schema(description = "Fecha y hora de creación del pase", example = "2023-01-01T12:00:00")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss[.SSS][X]", timezone = "UTC")
    private LocalDateTime fechaCreacion;
    
    @Schema(description = "Fecha y hora de firma del pase", example = "2023-01-01T14:30:00")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss[.SSS][X]", timezone = "UTC")
    private LocalDateTime fechaFirma;
    
    @Schema(description = "Fecha y hora de autorización del pase", example = "2023-01-01T15:45:00")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss[.SSS][X]", timezone = "UTC")
    private LocalDateTime fechaAutorizacion;
    
    @Schema(description = "Datos del operador")
    private UserDto operador;
    
    // Constructors
    public VehicleExitPassDto() {}
    
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
    
    @JsonIgnore
    public String getFechaFromString() { return fechaFromString; }
    public void setFechaFromString(String fechaFromString) { this.fechaFromString = fechaFromString; }
    
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
    
    public LocalDateTime getFechaFirma() { return fechaFirma; }
    public void setFechaFirma(LocalDateTime fechaFirma) { this.fechaFirma = fechaFirma; }
    
    public LocalDateTime getFechaAutorizacion() { return fechaAutorizacion; }
    public void setFechaAutorizacion(LocalDateTime fechaAutorizacion) { this.fechaAutorizacion = fechaAutorizacion; }
    
    public String getOperadorNombre() { return operadorNombre; }
    public void setOperadorNombre(String operadorNombre) { this.operadorNombre = operadorNombre; }
    
    public String getOperadorApellidoPaterno() { return operadorApellidoPaterno; }
    public void setOperadorApellidoPaterno(String operadorApellidoPaterno) { this.operadorApellidoPaterno = operadorApellidoPaterno; }
    
    public String getOperadorApellidoMaterno() { return operadorApellidoMaterno; }
    public void setOperadorApellidoMaterno(String operadorApellidoMaterno) { this.operadorApellidoMaterno = operadorApellidoMaterno; }
    
    public UserDto getOperador() { return operador; }
    public void setOperador(UserDto operador) { this.operador = operador; }
}
