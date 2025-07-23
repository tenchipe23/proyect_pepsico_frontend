package com.pepsico.vehicleexitpass.controller;

import com.pepsico.vehicleexitpass.dto.VehicleExitPassDto;
import com.pepsico.vehicleexitpass.service.VehicleExitPassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/search")
@PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR', 'SEGURIDAD')")
@Tag(name = "Búsqueda", description = "API para realizar búsquedas globales en el sistema")
@SecurityRequirement(name = "bearerAuth")
public class SearchController {
    
    @Autowired
    private VehicleExitPassService passService;
    
    @GetMapping("/global")
    @Operation(summary = "Búsqueda global", description = "Realiza una búsqueda global de pases de salida en todo el sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Búsqueda realizada exitosamente", 
                    content = @Content(schema = @Schema(implementation = Page.class))),
        @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<Page<VehicleExitPassDto>> globalSearch(
            @Parameter(description = "Término de búsqueda") @RequestParam String query,
            @Parameter(description = "Número de página (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de página") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Campo para ordenar") @RequestParam(defaultValue = "fechaCreacion") String sortBy,
            @Parameter(description = "Dirección de ordenamiento: asc o desc") @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<VehicleExitPassDto> results = passService.globalSearch(query, pageable);
        return ResponseEntity.ok(results);
    }
}
