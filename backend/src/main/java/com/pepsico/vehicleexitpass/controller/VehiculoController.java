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

@RestController
@RequestMapping("/vehiculos")
public class VehiculoController {
    
    @Autowired
    private VehiculoService vehiculoService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SEGURIDAD')")
    public ResponseEntity<List<VehiculoDto>> getAllVehiculos() {
        List<VehiculoDto> vehiculos = vehiculoService.getAllVehiculos();
        return ResponseEntity.ok(vehiculos);
    }
    
    @GetMapping("/paginated")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SEGURIDAD')")
    public ResponseEntity<Page<VehiculoDto>> getAllVehiculosPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "numeroEconomico") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : 
            Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<VehiculoDto> vehiculos = vehiculoService.getAllVehiculos(pageable);
        return ResponseEntity.ok(vehiculos);
    }
    
    @GetMapping("/tipo/{tipo}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SEGURIDAD')")
    public ResponseEntity<List<VehiculoDto>> getVehiculosByTipo(@PathVariable TipoVehiculo tipo) {
        List<VehiculoDto> vehiculos = vehiculoService.getVehiculosByTipo(tipo);
        return ResponseEntity.ok(vehiculos);
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SEGURIDAD')")
    public ResponseEntity<Page<VehiculoDto>> searchVehiculos(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<VehiculoDto> vehiculos = vehiculoService.searchVehiculos(query, pageable);
        return ResponseEntity.ok(vehiculos);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SEGURIDAD')")
    public ResponseEntity<VehiculoDto> getVehiculoById(@PathVariable String id) {
        VehiculoDto vehiculo = vehiculoService.getVehiculoById(id);
        return ResponseEntity.ok(vehiculo);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehiculoDto> createVehiculo(@Valid @RequestBody VehiculoDto vehiculoDto) {
        VehiculoDto createdVehiculo = vehiculoService.createVehiculo(vehiculoDto);
        return ResponseEntity.ok(createdVehiculo);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehiculoDto> updateVehiculo(@PathVariable String id, 
                                                     @Valid @RequestBody VehiculoDto vehiculoDto) {
        VehiculoDto updatedVehiculo = vehiculoService.updateVehiculo(id, vehiculoDto);
        return ResponseEntity.ok(updatedVehiculo);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteVehiculo(@PathVariable String id) {
        vehiculoService.deleteVehiculo(id);
        return ResponseEntity.ok().build();
    }
}
