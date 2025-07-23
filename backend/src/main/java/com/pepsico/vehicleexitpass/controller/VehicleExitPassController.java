package com.pepsico.vehicleexitpass.controller;

import com.pepsico.vehicleexitpass.dto.VehicleExitPassDto;
import com.pepsico.vehicleexitpass.entity.PassStatus;
import com.pepsico.vehicleexitpass.service.VehicleExitPassService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.core.JsonProcessingException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/passes")
@Tag(name = "Pases de Salida", description = "API para gestionar los pases de salida de vehículos")
@SecurityRequirement(name = "bearerAuth")
public class VehicleExitPassController {
    
    @Autowired
    private VehicleExitPassService passService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    private String normalizeStatus(String status) {
        if (status == null) return null;
        
        // Convert to lowercase and handle Spanish plural forms
        String normalized = status.toLowerCase();
        
        // Map Spanish plural forms to singular
        Map<String, String> statusMap = Map.of(
            "pendientes", "pendiente",
            "firmados", "firmado",
            "autorizados", "autorizado",
            "rechazados", "rechazado"
        );
        
        return statusMap.getOrDefault(normalized, normalized);
    }
    
    private ResponseEntity<String> createErrorResponse(String message, HttpStatus status) {
        Map<String, Object> errorResponse = new LinkedHashMap<>();
        errorResponse.put("status", status.value());
        errorResponse.put("error", status.getReasonPhrase());
        errorResponse.put("message", message);
        
        try {
            return ResponseEntity.status(status)
                .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                .body(objectMapper.writeValueAsString(errorResponse));
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(org.springframework.http.MediaType.TEXT_PLAIN)
                .body("Error creating error response: " + e.getMessage());
        }
    }
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR', 'SEGURIDAD')")
    @Operation(summary = "Obtener todos los pases", description = "Obtiene una lista paginada de pases de salida con opciones de filtrado y búsqueda")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Pases encontrados exitosamente", 
                    content = @Content(schema = @Schema(implementation = Page.class))),
        @ApiResponse(responseCode = "400", description = "Parámetros de solicitud inválidos"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public ResponseEntity<?> getAllPasses(
            @Parameter(description = "Número de página (0-indexed)") @RequestParam(required = false, defaultValue = "0") Integer page,
            @Parameter(description = "Tamaño de página") @RequestParam(required = false, defaultValue = "10") Integer size,
            @Parameter(description = "Campo para ordenar") @RequestParam(required = false, defaultValue = "fechaCreacion") String sortBy,
            @Parameter(description = "Dirección de ordenamiento: asc o desc") @RequestParam(required = false, defaultValue = "desc") String sortDir,
            @Parameter(description = "Término de búsqueda") @RequestParam(required = false) String search,
            @Parameter(description = "Filtro por estado: pendiente, firmado, autorizado, rechazado") @RequestParam(required = false) String status) {
        
        try {
            // Set default values if not provided
            page = page != null ? page : 0;
            size = size != null ? size : 10;
            sortBy = sortBy != null ? sortBy : "fechaCreacion";
            sortDir = sortDir != null ? sortDir : "desc";
            
            // Validate sort direction
            if (!sortDir.equalsIgnoreCase("asc") && !sortDir.equalsIgnoreCase("desc")) {
                return createErrorResponse("Invalid sort direction. Use 'asc' or 'desc'.", HttpStatus.BAD_REQUEST);
            }
            
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<VehicleExitPassDto> passes;
            
            if (search != null && !search.isEmpty()) {
                try {
                    if (status != null) {
                        List<PassStatus> statusList;
                        if (status.contains(",")) {
                            String[] statusValues = status.split(",");
                            statusList = new ArrayList<>();
                            for (String statusValue : statusValues) {
                                String normalizedStatus = normalizeStatus(statusValue.trim());
                                statusList.add(PassStatus.valueOf(normalizedStatus.toUpperCase()));
                            }
                        } else {
                            String normalizedStatus = normalizeStatus(status);
                            statusList = List.of(PassStatus.valueOf(normalizedStatus.toUpperCase()));
                        }
                        passes = passService.globalSearchByStatuses(search, statusList, pageable);
                    } else {
                        passes = passService.globalSearch(search, pageable);
                    }
                } catch (IllegalArgumentException e) {
                    return createErrorResponse("Invalid status value: " + status + ". Valid values are: pendiente, firmado, autorizado, rechazado", HttpStatus.BAD_REQUEST);
                } catch (Exception e) {
                    return createErrorResponse("Error searching passes: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
                }
            } else if (status != null) {
                try {
                    if (status.contains(",")) {
                        String[] statusValues = status.split(",");
                        List<PassStatus> statusList = new ArrayList<>();
                        for (String statusValue : statusValues) {
                            String normalizedStatus = normalizeStatus(statusValue.trim());
                            statusList.add(PassStatus.valueOf(normalizedStatus.toUpperCase()));
                        }
                        passes = passService.getPassesByStatusList(statusList, pageable);
                    } else {
                        String normalizedStatus = normalizeStatus(status);
                        PassStatus passStatus = PassStatus.valueOf(normalizedStatus.toUpperCase());
                        passes = passService.getPassesByStatus(passStatus, pageable);
                    }
                } catch (IllegalArgumentException e) {
                    return createErrorResponse("Invalid status value: " + status + ". Valid values are: pendiente, firmado, autorizado, rechazado", HttpStatus.BAD_REQUEST);
                }
            } else {
                try {
                    passes = passService.getAllPasses(pageable);
                } catch (Exception e) {
                    return createErrorResponse("Error retrieving passes: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
            
            return ResponseEntity.ok(passes);
        } catch (Exception e) {
            return createErrorResponse("An unexpected error occurred: " + e.getMessage(), 
                HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR', 'SEGURIDAD')")
    @Operation(summary = "Obtener pase por ID", description = "Obtiene un pase de salida específico por su ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Pase encontrado exitosamente", 
                    content = @Content(schema = @Schema(implementation = VehicleExitPassDto.class))),
        @ApiResponse(responseCode = "404", description = "Pase no encontrado")
    })
    public ResponseEntity<VehicleExitPassDto> getPassById(
            @Parameter(description = "ID del pase") @PathVariable String id) {
        VehicleExitPassDto pass = passService.getPassById(id);
        return ResponseEntity.ok(pass);
    }
    
    @GetMapping("/folio/{folio}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR', 'SEGURIDAD')")
    @Operation(summary = "Obtener pase por folio", description = "Obtiene un pase de salida específico por su número de folio")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Pase encontrado exitosamente", 
                    content = @Content(schema = @Schema(implementation = VehicleExitPassDto.class))),
        @ApiResponse(responseCode = "404", description = "Pase no encontrado")
    })
    public ResponseEntity<VehicleExitPassDto> getPassByFolio(
            @Parameter(description = "Número de folio del pase") @PathVariable String folio) {
        VehicleExitPassDto pass = passService.getPassByFolio(folio);
        return ResponseEntity.ok(pass);
    }
    
    @PostMapping("/create")
    @Operation(summary = "Crear nuevo pase", description = "Crea un nuevo pase de salida de vehículo")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Pase creado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos de solicitud inválidos"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public ResponseEntity<?> createPass(
            @Parameter(description = "Datos del pase a crear") @Valid @RequestBody Map<String, Object> passData) {
        try {
            // Log de depuración
            System.out.println("Datos recibidos en createPass: " + passData);
            
            // Configurar ObjectMapper para manejar fechas
            ObjectMapper objectMapper = new ObjectMapper()
                .registerModule(new JavaTimeModule())
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
                
            // No incluir fechaCreacion en los datos recibidos, se establecerá después
            if (passData.containsKey("fechaCreacion")) {
                passData.remove("fechaCreacion");
            }
            
            // Si se envía la fecha como string, asegurarse de que tenga el formato correcto
            if (passData.containsKey("fecha") && passData.get("fecha") instanceof String) {
                String fechaStr = (String) passData.get("fecha");
                if (fechaStr.contains("T")) {
                    // Si es una fecha ISO 8601 con tiempo, extraer solo la parte de la fecha
                    passData.put("fecha", fechaStr.substring(0, 10));
                }
            }
            
            // Convertir el mapa a JSON y luego a DTO para asegurar el formato correcto
            String json = objectMapper.writeValueAsString(passData);
            System.out.println("JSON convertido: " + json);
            
            VehicleExitPassDto passDto = objectMapper.readValue(json, VehicleExitPassDto.class);
            
            // Asegurarse de que la fecha de creación esté establecida
            if (passDto.getFechaCreacion() == null) {
                passDto.setFechaCreacion(LocalDateTime.now());
            }
            
            // Validar campos requeridos
            if (passDto.getRazonSocial() == null || passDto.getRazonSocial().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("El campo 'razonSocial' es requerido", HttpStatus.BAD_REQUEST));
            }
            if (passDto.getFecha() == null) {
                return ResponseEntity.badRequest().body(createErrorResponse("El campo 'fecha' es requerido", HttpStatus.BAD_REQUEST));
            }
            if (passDto.getTractorEco() == null || passDto.getTractorEco().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("El campo 'tractorEco' es requerido", HttpStatus.BAD_REQUEST));
            }
            if (passDto.getTractorPlaca() == null || passDto.getTractorPlaca().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("El campo 'tractorPlaca' es requerido", HttpStatus.BAD_REQUEST));
            }
            if (passDto.getOperadorNombre() == null || passDto.getOperadorNombre().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El campo 'operadorNombre' es requerido");
            }
            if (passDto.getOperadorApellidoPaterno() == null || passDto.getOperadorApellidoPaterno().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El campo 'operadorApellidoPaterno' es requerido");
            }
            
            // Crear el pase
            System.out.println("Creando pase con DTO: " + passDto);
            VehicleExitPassDto createdPass = passService.createPass(passDto);
            System.out.println("Pase creado exitosamente: " + createdPass.getId());
            
            // Asegurarse de que la respuesta tenga el formato correcto
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", createdPass);
            
            return new ResponseEntity<>(response, HttpStatus.CREATED);
            
        } catch (JsonProcessingException e) {
            System.err.println("Error de procesamiento JSON: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(createErrorResponse("Formato de datos inválido: " + e.getMessage(), HttpStatus.BAD_REQUEST));
                
        } catch (IllegalArgumentException e) {
            System.err.println("Error de argumento inválido: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(createErrorResponse("Datos inválidos: " + e.getMessage(), HttpStatus.BAD_REQUEST));
                
        } catch (Exception e) {
            System.err.println("Error inesperado al crear el pase: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Error interno del servidor: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR')")
    @Operation(summary = "Actualizar pase", description = "Actualiza un pase de salida existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Pase actualizado exitosamente", 
                    content = @Content(schema = @Schema(implementation = VehicleExitPassDto.class))),
        @ApiResponse(responseCode = "404", description = "Pase no encontrado"),
        @ApiResponse(responseCode = "400", description = "Datos de solicitud inválidos")
    })
    public ResponseEntity<VehicleExitPassDto> updatePass(
            @Parameter(description = "ID del pase") @PathVariable String id, 
            @Parameter(description = "Datos actualizados del pase") @Valid @RequestBody VehicleExitPassDto passDto) {
        VehicleExitPassDto updatedPass = passService.updatePass(id, passDto);
        return ResponseEntity.ok(updatedPass);
    }
    
    @PostMapping("/{id}/sign")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR')")
    @Operation(summary = "Firmar pase", description = "Firma un pase de salida con firma y sello")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Pase firmado exitosamente", 
                    content = @Content(schema = @Schema(implementation = VehicleExitPassDto.class))),
        @ApiResponse(responseCode = "404", description = "Pase no encontrado"),
        @ApiResponse(responseCode = "400", description = "Datos de solicitud inválidos")
    })
    public ResponseEntity<VehicleExitPassDto> signPass(
            @Parameter(description = "ID del pase") @PathVariable String id, 
            @Parameter(description = "Datos de firma y sello") @RequestBody Map<String, String> signData) {
        String signature = signData.get("signature");
        String seal = signData.get("seal");
        VehicleExitPassDto signedPass = passService.signPass(id, signature, seal);
        return ResponseEntity.ok(signedPass);
    }
    
    @PostMapping("/{id}/authorize")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR')")
    @Operation(summary = "Autorizar pase", description = "Autoriza un pase de salida previamente firmado")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Pase autorizado exitosamente", 
                    content = @Content(schema = @Schema(implementation = VehicleExitPassDto.class))),
        @ApiResponse(responseCode = "404", description = "Pase no encontrado"),
        @ApiResponse(responseCode = "400", description = "El pase no está en estado firmado")
    })
    public ResponseEntity<VehicleExitPassDto> authorizePass(
            @Parameter(description = "ID del pase") @PathVariable String id) {
        VehicleExitPassDto authorizedPass = passService.authorizePass(id);
        return ResponseEntity.ok(authorizedPass);
    }
    
    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR')")
    @Operation(summary = "Rechazar pase", description = "Rechaza un pase de salida con motivo de rechazo")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Pase rechazado exitosamente", 
                    content = @Content(schema = @Schema(implementation = VehicleExitPassDto.class))),
        @ApiResponse(responseCode = "404", description = "Pase no encontrado"),
        @ApiResponse(responseCode = "400", description = "Datos de solicitud inválidos")
    })
    public ResponseEntity<VehicleExitPassDto> rejectPass(
            @Parameter(description = "ID del pase") @PathVariable String id, 
            @Parameter(description = "Motivo de rechazo") @RequestBody Map<String, String> rejectData) {
        String reason = rejectData.get("reason");
        VehicleExitPassDto rejectedPass = passService.rejectPass(id, reason);
        return ResponseEntity.ok(rejectedPass);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR')")
    @Operation(summary = "Eliminar pase", description = "Elimina un pase de salida existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Pase eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Pase no encontrado")
    })
    public ResponseEntity<?> deletePass(
            @Parameter(description = "ID del pase") @PathVariable String id) {
        passService.deletePass(id);
        return ResponseEntity.ok().body("{\"message\": \"Pass deleted successfully!\"}");
    }
    
    @GetMapping("/stats/count-by-status")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR', 'SEGURIDAD')")
    @Operation(summary = "Obtener conteo por estado", description = "Obtiene el conteo de pases por cada estado")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Conteo obtenido exitosamente")
    })
    public ResponseEntity<Map<String, Long>> getPassCountByStatus() {
        Map<String, Long> counts = new HashMap<>();
        
        for (PassStatus status : PassStatus.values()) {
            long count = passService.getPassCountByStatus(status);
            counts.put(status.name().toLowerCase(), count);
        }
        
        return ResponseEntity.ok(counts);
    }
    
    @GetMapping("/stats/count-by-status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR', 'SEGURIDAD')")
    @Operation(summary = "Obtener conteo por estado específico", description = "Obtiene el conteo de pases para un estado específico")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Conteo obtenido exitosamente"),
        @ApiResponse(responseCode = "400", description = "Estado inválido")
    })
    public ResponseEntity<?> getPassCountBySpecificStatus(
            @Parameter(description = "Estado del pase (pendiente, firmado, autorizado, rechazado)") @PathVariable String status) {
        try {
            PassStatus passStatus = PassStatus.valueOf(status.toUpperCase());
            long count = passService.getPassCountByStatus(passStatus);
            return ResponseEntity.ok(count);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"Invalid status: " + status + "\"}");
        }
    }
    
    @GetMapping("/stats/count-created-today")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR', 'SEGURIDAD')")
    @Operation(summary = "Obtener conteo de pases creados hoy", description = "Obtiene el número de pases creados en el día actual")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Conteo obtenido exitosamente")
    })
    public ResponseEntity<Long> getPassCountCreatedToday() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        long count = passService.getPassCountCreatedSince(startOfDay);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR', 'SEGURIDAD')")
    @Operation(summary = "Obtener estadísticas de pases", description = "Obtiene estadísticas generales sobre los pases de salida")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Estadísticas obtenidas exitosamente")
    })
    public ResponseEntity<Map<String, Object>> getPassStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPasses", passService.getAllPasses().size());
        stats.put("pendingPasses", passService.getPassCountByStatus(PassStatus.PENDIENTE));
        stats.put("signedPasses", passService.getPassCountByStatus(PassStatus.FIRMADO));
        stats.put("authorizedPasses", passService.getPassCountByStatus(PassStatus.AUTORIZADO));
        stats.put("rejectedPasses", passService.getPassCountByStatus(PassStatus.RECHAZADO));
        
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        stats.put("todayPasses", passService.getPassCountCreatedSince(startOfDay));
        
        return ResponseEntity.ok(stats);
    }
}
