package com.pepsico.vehicleexitpass.controller;

import com.pepsico.vehicleexitpass.dto.VehiculoDto;
import com.pepsico.vehicleexitpass.entity.TipoVehiculo;
import com.pepsico.vehicleexitpass.service.VehiculoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/vehiculos")
@Tag(name = "Vehículos", description = "API para la gestión de vehículos")
@SecurityRequirement(name = "bearerAuth")
public class VehiculoController {
    
    @Autowired
    private VehiculoService vehiculoService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SEGURIDAD')")
    @Operation(summary = "Obtener todos los vehículos", description = "Obtiene una lista de todos los vehículos registrados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Vehículos encontrados exitosamente"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<List<VehiculoDto>> getAllVehiculos() {
        List<VehiculoDto> vehiculos = vehiculoService.getAllVehiculos();
        return ResponseEntity.ok(vehiculos);
    }
    
    @GetMapping("/paginated")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SEGURIDAD')")
    @Operation(summary = "Obtener vehículos paginados", description = "Obtiene una lista paginada de vehículos con opciones de ordenamiento")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Vehículos encontrados exitosamente", 
                    content = @Content(schema = @Schema(implementation = Page.class))),
        @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<Page<VehiculoDto>> getAllVehiculosPaginated(
            @Parameter(description = "Número de página (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de página") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Campo para ordenar") @RequestParam(defaultValue = "numeroEconomico") String sortBy,
            @Parameter(description = "Dirección de ordenamiento: asc o desc") @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : 
            Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<VehiculoDto> vehiculos = vehiculoService.getAllVehiculos(pageable);
        return ResponseEntity.ok(vehiculos);
    }
    
    @GetMapping("/tipo/{tipo}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SEGURIDAD')")
    @Operation(summary = "Obtener vehículos por tipo", description = "Obtiene una lista de vehículos filtrados por su tipo")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Vehículos encontrados exitosamente"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<List<VehiculoDto>> getVehiculosByTipo(
            @Parameter(description = "Tipo de vehículo") @PathVariable TipoVehiculo tipo) {
        List<VehiculoDto> vehiculos = vehiculoService.getVehiculosByTipo(tipo);
        return ResponseEntity.ok(vehiculos);
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SEGURIDAD')")
    @Operation(summary = "Buscar vehículos", description = "Busca vehículos que coincidan con el término de búsqueda")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Vehículos encontrados exitosamente", 
                    content = @Content(schema = @Schema(implementation = Page.class))),
        @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<Page<VehiculoDto>> searchVehiculos(
            @Parameter(description = "Término de búsqueda") @RequestParam String query,
            @Parameter(description = "Número de página (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de página") @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<VehiculoDto> vehiculos = vehiculoService.searchVehiculos(query, pageable);
        return ResponseEntity.ok(vehiculos);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SEGURIDAD')")
    @Operation(summary = "Obtener vehículo por ID", description = "Obtiene un vehículo específico por su ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Vehículo encontrado exitosamente", 
                    content = @Content(schema = @Schema(implementation = VehiculoDto.class))),
        @ApiResponse(responseCode = "404", description = "Vehículo no encontrado"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<VehiculoDto> getVehiculoById(
            @Parameter(description = "ID del vehículo") @PathVariable String id) {
        VehiculoDto vehiculo = vehiculoService.getVehiculoById(id);
        return ResponseEntity.ok(vehiculo);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Crear vehículo", description = "Crea un nuevo vehículo en el sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Vehículo creado exitosamente", 
                    content = @Content(schema = @Schema(implementation = VehiculoDto.class))),
        @ApiResponse(responseCode = "400", description = "Datos de solicitud inválidos"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<VehiculoDto> createVehiculo(
            @Parameter(description = "Datos del vehículo a crear") @Valid @RequestBody VehiculoDto vehiculoDto) {
        VehiculoDto createdVehiculo = vehiculoService.createVehiculo(vehiculoDto);
        return ResponseEntity.ok(createdVehiculo);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Actualizar vehículo", description = "Actualiza un vehículo existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Vehículo actualizado exitosamente", 
                    content = @Content(schema = @Schema(implementation = VehiculoDto.class))),
        @ApiResponse(responseCode = "404", description = "Vehículo no encontrado"),
        @ApiResponse(responseCode = "400", description = "Datos de solicitud inválidos"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<VehiculoDto> updateVehiculo(
            @Parameter(description = "ID del vehículo") @PathVariable String id, 
            @Parameter(description = "Datos actualizados del vehículo") @Valid @RequestBody VehiculoDto vehiculoDto) {
        VehiculoDto updatedVehiculo = vehiculoService.updateVehiculo(id, vehiculoDto);
        return ResponseEntity.ok(updatedVehiculo);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar vehículo", description = "Elimina un vehículo existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Vehículo eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Vehículo no encontrado"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<?> deleteVehiculo(
            @Parameter(description = "ID del vehículo") @PathVariable String id) {
        vehiculoService.deleteVehiculo(id);
        return ResponseEntity.ok().build();
    }
}
