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
import java.util.Map;

@RestController
@RequestMapping("/passes")
@CrossOrigin(origins = "*", maxAge = 3600)
public class VehicleExitPassController {
    
    @Autowired
    private VehicleExitPassService passService;
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR', 'SEGURIDAD')")
    public ResponseEntity<Page<VehicleExitPassDto>> getAllPasses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "fechaCreacion") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) PassStatus status) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<VehicleExitPassDto> passes;
        
        if (status != null && search != null && !search.isEmpty()) {
            passes = passService.searchPassesByStatus(status, search, pageable);
        } else if (status != null) {
            passes = passService.getPassesByStatus(status, pageable);
        } else if (search != null && !search.isEmpty()) {
            passes = passService.searchPasses(search, pageable);
        } else {
            passes = passService.getAllPasses(pageable);
        }
        
        return ResponseEntity.ok(passes);
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
    
    @GetMapping("/stats/count-by-status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR', 'SEGURIDAD')")
    public ResponseEntity<Long> getPassCountByStatus(@PathVariable PassStatus status) {
        long count = passService.getPassCountByStatus(status);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats/count-created-today")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR', 'SEGURIDAD')")
    public ResponseEntity<Long> getPassCountCreatedToday() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        long count = passService.getPassCountCreatedSince(startOfDay);
        return ResponseEntity.ok(count);
    }
}
