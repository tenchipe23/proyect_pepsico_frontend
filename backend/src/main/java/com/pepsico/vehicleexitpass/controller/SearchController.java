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

@RestController
@RequestMapping("/search")
@PreAuthorize("hasAnyRole('ADMIN', 'AUTORIZADOR', 'SEGURIDAD')")
public class SearchController {
    
    @Autowired
    private VehicleExitPassService passService;
    
    @GetMapping("/global")
    public ResponseEntity<Page<VehicleExitPassDto>> globalSearch(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "fechaCreacion") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<VehicleExitPassDto> results = passService.globalSearch(query, pageable);
        return ResponseEntity.ok(results);
    }
}
