package com.pepsico.vehicleexitpass.mapper;

import com.pepsico.vehicleexitpass.dto.VehicleExitPassDto;
import com.pepsico.vehicleexitpass.entity.VehicleExitPass;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface VehicleExitPassMapper {
    
    @Mapping(target = "fechaFromString", expression = "java(vehicleExitPass.getFechaCreacion() != null ? vehicleExitPass.getFechaCreacion().format(java.time.format.DateTimeFormatter.ofPattern(\"dd/MM/yyyy HH:mm\")) : null)")
    @Mapping(target = "operador", ignore = true)
    VehicleExitPassDto toDto(VehicleExitPass vehicleExitPass);
    
    @Mapping(target = "fechaCreacion", expression = "java(vehicleExitPassDto.getFechaFromString() != null ? java.time.LocalDateTime.parse(vehicleExitPassDto.getFechaFromString(), java.time.format.DateTimeFormatter.ofPattern(\"dd/MM/yyyy HH:mm\")) : null)")
    VehicleExitPass toEntity(VehicleExitPassDto vehicleExitPassDto);
    
    @Mapping(target = "fechaCreacion", ignore = true)
    void updateEntityFromDto(VehicleExitPassDto vehicleExitPassDto, @MappingTarget VehicleExitPass vehicleExitPass);
}
