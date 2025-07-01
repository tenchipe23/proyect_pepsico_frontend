package com.pepsico.vehicleexitpass.dto;

import com.pepsico.vehicleexitpass.entity.PassStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonSetter;

public class VehicleExitPassDto {
    private String id;
    private String folio;
    private PassStatus estado;
    private String razonSocial;
    private String operadorNombre;
    private String operadorApellidoPaterno;
    private String operadorApellidoMaterno;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fecha;
    
    // For JSON deserialization
    @JsonSetter("fecha")
    public void setFechaFromString(String dateString) {
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
    private String tractorEco;
    private String tractorPlaca;
    private String remolque1Eco;
    private String remolque1Placa;
    private String remolque2Eco;
    private String remolque2Placa;
    private String ecoDolly;
    private String placasDolly;
    private String comentarios;
    private String firma;
    private String sello;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss[.SSS][X]", timezone = "UTC")
    private LocalDateTime fechaCreacion;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss[.SSS][X]", timezone = "UTC")
    private LocalDateTime fechaFirma;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss[.SSS][X]", timezone = "UTC")
    private LocalDateTime fechaAutorizacion;
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
