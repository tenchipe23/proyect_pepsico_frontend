package com.pepsico.vehicleexitpass.mapper;

import com.pepsico.vehicleexitpass.dto.UserDto;
import com.pepsico.vehicleexitpass.entity.User;
import com.pepsico.vehicleexitpass.entity.VehicleExitPass;
import com.pepsico.vehicleexitpass.entity.Bitacora;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface UserMapper {
    
    @Mapping(target = "pases", source = "pases")
    @Mapping(target = "bitacoras", source = "bitacoras")
    User toEntity(UserDto dto);
    
    @Mapping(target = "pases", source = "pases")
    @Mapping(target = "bitacoras", source = "bitacoras")
    UserDto toDto(User entity);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "fechaCreacion", ignore = true)
    @Mapping(target = "pases", source = "pases")
    @Mapping(target = "bitacoras", source = "bitacoras")
    void updateFromDto(UserDto dto, @MappingTarget User entity);
    
    // Métodos para el mapeo de colecciones
    @Named("mapPases")
    default Set<VehicleExitPass> mapPases(Set<VehicleExitPass> pases) {
        return pases; // MapStruct manejará el mapeo de los objetos individuales
    }
    
    @Named("mapBitacoras")
    default Set<Bitacora> mapBitacoras(Set<Bitacora> bitacoras) {
        return bitacoras; // MapStruct manejará el mapeo de los objetos individuales
    }
}
