package com.pepsico.vehicleexitpass.controller;

import com.pepsico.vehicleexitpass.dto.VehicleExitPassDto;
import com.pepsico.vehicleexitpass.service.VehicleExitPassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/vehicle-exit-passes")
@CrossOrigin(origins = "*", maxAge = 3600)
public class VehicleExitPassController {
    
    private final VehicleExitPassService passService;

    @Autowired
    public VehicleExitPassController(VehicleExitPassService passService) {
        this.passService = passService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR', 'SEGURIDAD')")
    public ResponseEntity<List<VehicleExitPassDto>> getAllPasses() {
        return ResponseEntity.ok(passService.getAllPasses());
    }

    @GetMapping("/page")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR', 'SEGURIDAD')")
    public ResponseEntity<Page<VehicleExitPassDto>> getAllPasses(Pageable pageable) {
        return ResponseEntity.ok(passService.getAllPasses(pageable));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR', 'SEGURIDAD')")
    public ResponseEntity<Page<VehicleExitPassDto>> getPassesByStatus(
            @PathVariable String status, 
            Pageable pageable) {
        return ResponseEntity.ok(passService.getPassesByStatus(status, pageable));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR', 'SEGURIDAD')")
    public ResponseEntity<Page<VehicleExitPassDto>> searchPasses(
            @RequestParam String search, 
            Pageable pageable) {
        return ResponseEntity.ok(passService.searchPasses(search, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR', 'SEGURIDAD')")
    public ResponseEntity<VehicleExitPassDto> getPassById(@PathVariable String id) {
        return ResponseEntity.ok(passService.getPassById(id));
    }

    @GetMapping("/folio/{folio}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR', 'SEGURIDAD')")
    public ResponseEntity<VehicleExitPassDto> getPassByFolio(@PathVariable String folio) {
        return ResponseEntity.ok(passService.getPassByFolio(folio));
    }

    @PostMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<VehicleExitPassDto> createPass(@Valid @RequestBody VehicleExitPassDto passDto) {
        return ResponseEntity.ok(passService.createPass(passDto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR')")
    public ResponseEntity<VehicleExitPassDto> updatePass(
            @PathVariable String id, 
            @Valid @RequestBody VehicleExitPassDto passDto) {
        return ResponseEntity.ok(passService.updatePass(id, passDto));
    }

    @PostMapping("/{id}/sign")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR')")
    public ResponseEntity<VehicleExitPassDto> signPass(
            @PathVariable String id, 
            @RequestBody Map<String, String> signData) {
        String signature = signData.get("signature");
        String seal = signData.get("seal");
        return ResponseEntity.ok(passService.signPass(id, signature, seal));
    }

    @PostMapping("/{id}/authorize")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR')")
    public ResponseEntity<VehicleExitPassDto> authorizePass(@PathVariable String id) {
        return ResponseEntity.ok(passService.authorizePass(id));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR')")
    public ResponseEntity<VehicleExitPassDto> rejectPass(
            @PathVariable String id, 
            @RequestBody Map<String, String> rejectData) {
        String reason = rejectData.get("reason");
        return ResponseEntity.ok(passService.rejectPass(id, reason));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletePass(@PathVariable String id) {
        passService.deletePass(id);
        return ResponseEntity.ok().body("{\"message\": \"Pass deleted successfully!\"}");
    }
}
