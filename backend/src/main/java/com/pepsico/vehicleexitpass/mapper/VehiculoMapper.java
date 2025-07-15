package com.pepsico.vehicleexitpass.mapper;

import com.pepsico.vehicleexitpass.dto.VehiculoDto;
import com.pepsico.vehicleexitpass.entity.Vehiculo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface VehiculoMapper {
    
    VehiculoDto toDto(Vehiculo vehiculo);
    
    Vehiculo toEntity(VehiculoDto vehiculoDto);
    
    void updateEntityFromDto(VehiculoDto vehiculoDto, @MappingTarget Vehiculo vehiculo);
}
