package com.pepsico.vehicleexitpass.mapper;

import com.pepsico.vehicleexitpass.dto.VehiculoDto;
import com.pepsico.vehicleexitpass.entity.Vehiculo;
import com.pepsico.vehicleexitpass.entity.PaseVehiculo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface VehiculoMapper {
    
    @Mapping(target = "paseVehiculos", source = "paseVehiculos")
    VehiculoDto toDto(Vehiculo vehiculo);
    
    @Mapping(target = "paseVehiculos", source = "paseVehiculos")
    Vehiculo toEntity(VehiculoDto vehiculoDto);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "paseVehiculos", source = "paseVehiculos")
    void updateFromDto(VehiculoDto dto, @MappingTarget Vehiculo entity);
    
    // Método para el mapeo de la colección
    @Named("mapPaseVehiculos")
    default Set<PaseVehiculo> mapPaseVehiculos(Set<PaseVehiculo> paseVehiculos) {
        return paseVehiculos; // MapStruct manejará el mapeo de los objetos individuales
    }
}