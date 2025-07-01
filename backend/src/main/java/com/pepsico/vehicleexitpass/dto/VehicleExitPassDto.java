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
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fecha;
    
    // For JSON deserialization
    @JsonSetter("fecha")
    public void setFechaFromString(String dateString) {
        if (dateString != null) {
            this.fecha = LocalDate.parse(dateString);
        }
    }
    private String tractorEco;
    private String tractorPlaca;
    private String comentarios;
    private String firma;
    private String sello;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaFirma;
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
    
    public UserDto getOperador() { return operador; }
    public void setOperador(UserDto operador) { this.operador = operador; }
}
