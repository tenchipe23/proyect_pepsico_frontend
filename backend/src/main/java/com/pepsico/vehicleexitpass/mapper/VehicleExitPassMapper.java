package com.pepsico.vehicleexitpass.mapper;

import com.pepsico.vehicleexitpass.dto.VehicleExitPassDto;
import com.pepsico.vehicleexitpass.entity.VehicleExitPass;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface VehicleExitPassMapper {
    
    @Mapping(target = "paseVehiculos", ignore = true)
    @Mapping(target = "bitacoras", ignore = true)
    VehicleExitPassDto toDto(VehicleExitPass vehicleExitPass);
    
    @Mapping(target = "paseVehiculos", ignore = true)
    @Mapping(target = "bitacoras", ignore = true)
    @Mapping(target = "fechaCreacion", ignore = true)
    VehicleExitPass toEntity(VehicleExitPassDto vehicleExitPassDto);
    
    @Mapping(target = "paseVehiculos", ignore = true)
    @Mapping(target = "bitacoras", ignore = true)
    @Mapping(target = "fechaCreacion", ignore = true)
    void updateEntityFromDto(VehicleExitPassDto vehicleExitPassDto, @MappingTarget VehicleExitPass vehicleExitPass);
}
