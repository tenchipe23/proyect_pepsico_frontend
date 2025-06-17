package com.pepsico.vehicleexitpass.service;

import com.pepsico.vehicleexitpass.dto.VehiculoDto;
import com.pepsico.vehicleexitpass.entity.TipoVehiculo;
import com.pepsico.vehicleexitpass.entity.Vehiculo;
import com.pepsico.vehicleexitpass.exception.ResourceNotFoundException;
import com.pepsico.vehicleexitpass.mapper.VehiculoMapper;
import com.pepsico.vehicleexitpass.repository.VehiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class VehiculoService {
    
    @Autowired
    private VehiculoRepository vehiculoRepository;
    
    @Autowired
    private VehiculoMapper vehiculoMapper;
    
    public List<VehiculoDto> getAllVehiculos() {
        return vehiculoRepository.findByEstadoTrue().stream()
            .map(vehiculoMapper::toDto)
            .collect(Collectors.toList());
    }
    
    public Page<VehiculoDto> getAllVehiculos(Pageable pageable) {
        return vehiculoRepository.findByEstadoTrue(pageable)
            .map(vehiculoMapper::toDto);
    }
    
    public List<VehiculoDto> getVehiculosByTipo(TipoVehiculo tipo) {
        return vehiculoRepository.findByTipo(tipo).stream()
            .map(vehiculoMapper::toDto)
            .collect(Collectors.toList());
    }
    
    public Page<VehiculoDto> searchVehiculos(String search, Pageable pageable) {
        return vehiculoRepository.findActiveVehiculosWithSearch(search, pageable)
            .map(vehiculoMapper::toDto);
    }
    
    public VehiculoDto getVehiculoById(String id) {
        Vehiculo vehiculo = vehiculoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Vehiculo not found with id: " + id));
        return vehiculoMapper.toDto(vehiculo);
    }
    
    public VehiculoDto createVehiculo(VehiculoDto vehiculoDto) {
        if (vehiculoRepository.existsByNumeroEconomico(vehiculoDto.getNumeroEconomico())) {
            throw new RuntimeException("Número económico ya existe!");
        }
        
        if (vehiculoRepository.existsByPlaca(vehiculoDto.getPlaca())) {
            throw new RuntimeException("Placa ya existe!");
        }
        
        Vehiculo vehiculo = vehiculoMapper.toEntity(vehiculoDto);
        vehiculo.setEstado(true);
        
        Vehiculo savedVehiculo = vehiculoRepository.save(vehiculo);
        return vehiculoMapper.toDto(savedVehiculo);
    }
    
    public VehiculoDto updateVehiculo(String id, VehiculoDto vehiculoDto) {
        Vehiculo vehiculo = vehiculoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Vehiculo not found with id: " + id));
        
        // Check if numero economico is being changed and if it's already in use
        if (!vehiculo.getNumeroEconomico().equals(vehiculoDto.getNumeroEconomico()) && 
            vehiculoRepository.existsByNumeroEconomico(vehiculoDto.getNumeroEconomico())) {
            throw new RuntimeException("Número económico ya existe!");
        }
        
        // Check if placa is being changed and if it's already in use
        if (!vehiculo.getPlaca().equals(vehiculoDto.getPlaca()) && 
            vehiculoRepository.existsByPlaca(vehiculoDto.getPlaca())) {
            throw new RuntimeException("Placa ya existe!");
        }
        
        vehiculo.setTipo(vehiculoDto.getTipo());
        vehiculo.setNumeroEconomico(vehiculoDto.getNumeroEconomico());
        vehiculo.setPlaca(vehiculoDto.getPlaca());
        vehiculo.setDescripcion(vehiculoDto.getDescripcion());
        
        Vehiculo updatedVehiculo = vehiculoRepository.save(vehiculo);
        return vehiculoMapper.toDto(updatedVehiculo);
    }
    
    public void deleteVehiculo(String id) {
        Vehiculo vehiculo = vehiculoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Vehiculo not found with id: " + id));
        
        // Soft delete
        vehiculo.setEstado(false);
        vehiculoRepository.save(vehiculo);
    }
}
