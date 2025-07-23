package com.pepsico.vehicleexitpass.dto;

import com.pepsico.vehicleexitpass.entity.TipoVehiculo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Datos de un vehículo")
public class VehiculoDto {
    
    @Schema(description = "Identificador único del vehículo", example = "5f07c259-4463-4c71-a3cc-b8d59478d83a")
    private String id;
    
    @Schema(description = "Tipo de vehículo", example = "TRACTOR", required = true)
    @NotNull(message = "Tipo is required")
    private TipoVehiculo tipo;
    
    @Schema(description = "Número económico del vehículo", example = "ECO-12345", required = true)
    @NotBlank(message = "Número económico is required")
    @Size(max = 50, message = "Número económico must not exceed 50 characters")
    private String numeroEconomico;
    
    @Schema(description = "Placa del vehículo", example = "ABC-123", required = true)
    @NotBlank(message = "Placa is required")
    @Size(max = 50, message = "Placa must not exceed 50 characters")
    private String placa;
    
    @Schema(description = "Descripción del vehículo", example = "Tractor marca Kenworth modelo 2020")
    @Size(max = 200, message = "Descripción must not exceed 200 characters")
    private String descripcion;
    
    @Schema(description = "Estado del vehículo (activo/inactivo)", example = "true")
    private Boolean estado;
    
    // Constructors
    public VehiculoDto() {}
    
    public VehiculoDto(String id, TipoVehiculo tipo, String numeroEconomico, String placa, String descripcion, Boolean estado) {
        this.id = id;
        this.tipo = tipo;
        this.numeroEconomico = numeroEconomico;
        this.placa = placa;
        this.descripcion = descripcion;
        this.estado = estado;
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
}
