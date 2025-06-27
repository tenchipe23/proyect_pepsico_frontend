package com.pepsico.vehicleexitpass.mapper;

import com.pepsico.vehicleexitpass.dto.VehicleExitPassDto;
import com.pepsico.vehicleexitpass.entity.VehicleExitPass;
import com.pepsico.vehicleexitpass.entity.PaseVehiculo;
import com.pepsico.vehicleexitpass.entity.Bitacora;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.Set;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface VehicleExitPassMapper {
    
    @Mapping(target = "paseVehiculos", source = "paseVehiculos")
    @Mapping(target = "bitacoras", source = "bitacoras")
    VehicleExitPassDto toDto(VehicleExitPass vehicleExitPass);
    
    @Mapping(target = "fechaCreacion", ignore = true)
    @Mapping(target = "paseVehiculos", source = "paseVehiculos")
    @Mapping(target = "bitacoras", source = "bitacoras")
    VehicleExitPass toEntity(VehicleExitPassDto vehicleExitPassDto);
    
    @Mapping(target = "fechaCreacion", ignore = true)
    @Mapping(target = "paseVehiculos", source = "paseVehiculos")
    @Mapping(target = "bitacoras", source = "bitacoras")
    void updateFromDto(VehicleExitPassDto dto, @MappingTarget VehicleExitPass entity);
    
    // Métodos para el mapeo de colecciones
    @Named("mapPaseVehiculos")
    default Set<PaseVehiculo> mapPaseVehiculos(Set<PaseVehiculo> paseVehiculos) {
        return paseVehiculos; // MapStruct manejará el mapeo de los objetos individuales
    }
    
    @Named("mapBitacoras")
    default Set<Bitacora> mapBitacoras(Set<Bitacora> bitacoras) {
        return bitacoras; // MapStruct manejará el mapeo de los objetos individuales
    }
}