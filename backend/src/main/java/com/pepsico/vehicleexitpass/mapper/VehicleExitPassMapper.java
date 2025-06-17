package com.pepsico.vehicleexitpass.mapper;

import com.pepsico.vehicleexitpass.dto.VehicleExitPassDto;
import com.pepsico.vehicleexitpass.entity.VehicleExitPass;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface VehicleExitPassMapper {
    
    VehicleExitPassDto toDto(VehicleExitPass vehicleExitPass);
    
    VehicleExitPass toEntity(VehicleExitPassDto vehicleExitPassDto);
    
    void updateEntityFromDto(VehicleExitPassDto vehicleExitPassDto, @MappingTarget VehicleExitPass vehicleExitPass);
}
