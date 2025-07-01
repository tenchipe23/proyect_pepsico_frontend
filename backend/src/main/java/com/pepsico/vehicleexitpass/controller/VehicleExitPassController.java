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
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

@RestController
@RequestMapping("/passes")
@CrossOrigin(origins = "*", maxAge = 3600)
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
    public ResponseEntity<?> getAllPasses(
            @RequestParam(required = false, defaultValue = "0") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size,
            @RequestParam(required = false, defaultValue = "fechaCreacion") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        
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
            
            if (status != null && search != null && !search.isEmpty()) {
                try {
                    String normalizedStatus = normalizeStatus(status);
                    PassStatus passStatus = PassStatus.valueOf(normalizedStatus.toUpperCase());
                    passes = passService.searchPassesByStatus(passStatus, search, pageable);
                } catch (IllegalArgumentException e) {
                    return createErrorResponse("Invalid status value: " + status + ". Valid values are: pendiente, firmado, autorizado, rechazado", HttpStatus.BAD_REQUEST);
                }
            } else if (status != null) {
                try {
                    String normalizedStatus = normalizeStatus(status);
                    PassStatus passStatus = PassStatus.valueOf(normalizedStatus.toUpperCase());
                    passes = passService.getPassesByStatus(passStatus, pageable);
                } catch (IllegalArgumentException e) {
                    return createErrorResponse("Invalid status value: " + status + ". Valid values are: pendiente, firmado, autorizado, rechazado", HttpStatus.BAD_REQUEST);
                }
            } else if (search != null && !search.isEmpty()) {
                try {
                    passes = passService.searchPasses(search, pageable);
                } catch (Exception e) {
                    return createErrorResponse("Error searching passes: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
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
    public ResponseEntity<VehicleExitPassDto> getPassById(@PathVariable String id) {
        VehicleExitPassDto pass = passService.getPassById(id);
        return ResponseEntity.ok(pass);
    }
    
    @GetMapping("/folio/{folio}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR', 'SEGURIDAD')")
    public ResponseEntity<VehicleExitPassDto> getPassByFolio(@PathVariable String folio) {
        VehicleExitPassDto pass = passService.getPassByFolio(folio);
        return ResponseEntity.ok(pass);
    }
    
    @PostMapping("/create")
    public ResponseEntity<VehicleExitPassDto> createPass(@Valid @RequestBody VehicleExitPassDto passDto) {
        VehicleExitPassDto createdPass = passService.createPass(passDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPass);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR')")
    public ResponseEntity<VehicleExitPassDto> updatePass(@PathVariable String id, 
                                                        @Valid @RequestBody VehicleExitPassDto passDto) {
        VehicleExitPassDto updatedPass = passService.updatePass(id, passDto);
        return ResponseEntity.ok(updatedPass);
    }
    
    @PostMapping("/{id}/sign")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR')")
    public ResponseEntity<VehicleExitPassDto> signPass(@PathVariable String id, 
                                                      @RequestBody Map<String, String> signData) {
        String signature = signData.get("signature");
        String seal = signData.get("seal");
        VehicleExitPassDto signedPass = passService.signPass(id, signature, seal);
        return ResponseEntity.ok(signedPass);
    }
    
    @PostMapping("/authorize/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR')")
    public ResponseEntity<VehicleExitPassDto> authorizePass(@PathVariable String id) {
        VehicleExitPassDto authorizedPass = passService.authorizePass(id);
        return ResponseEntity.ok(authorizedPass);
    }
    
    @PostMapping("/reject/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR')")
    public ResponseEntity<VehicleExitPassDto> rejectPass(@PathVariable String id, 
                                                        @RequestBody Map<String, String> rejectData) {
        String reason = rejectData.get("reason");
        VehicleExitPassDto rejectedPass = passService.rejectPass(id, reason);
        return ResponseEntity.ok(rejectedPass);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletePass(@PathVariable String id) {
        passService.deletePass(id);
        return ResponseEntity.ok().body("{\"message\": \"Pass deleted successfully!\"}");
    }
    
    @GetMapping("/stats/count-by-status")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR', 'SEGURIDAD')")
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
    public ResponseEntity<?> getPassCountBySpecificStatus(@PathVariable String status) {
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
    public ResponseEntity<Long> getPassCountCreatedToday() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        long count = passService.getPassCountCreatedSince(startOfDay);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR', 'SEGURIDAD')")
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
