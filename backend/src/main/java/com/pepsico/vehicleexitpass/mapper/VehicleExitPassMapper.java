package com.pepsico.vehicleexitpass.mapper;

import com.pepsico.vehicleexitpass.dto.VehicleExitPassDto;
import com.pepsico.vehicleexitpass.entity.VehicleExitPass;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface VehicleExitPassMapper {
    
    VehicleExitPassDto toDto(VehicleExitPass vehicleExitPass);
    
    @Mapping(target = "fechaCreacion", ignore = true)
    @Mapping(target = "paseVehiculos", ignore = true)
    @Mapping(target = "bitacoras", ignore = true)
    @Mapping(target = "operador", ignore = true)
    VehicleExitPass toEntity(VehicleExitPassDto vehicleExitPassDto);
    
    @Mapping(target = "paseVehiculos", ignore = true)
    @Mapping(target = "bitacoras", ignore = true)
    @Mapping(target = "fechaCreacion", ignore = true)
    @Mapping(target = "operador", ignore = true)
    void updateEntityFromDto(VehicleExitPassDto vehicleExitPassDto, @MappingTarget VehicleExitPass vehicleExitPass);
}
