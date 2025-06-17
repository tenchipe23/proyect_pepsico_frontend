package com.pepsico.vehicleexitpass.mapper;

import com.pepsico.vehicleexitpass.dto.UserDto;
import com.pepsico.vehicleexitpass.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    
    @Mapping(target = "pases", ignore = true)
    @Mapping(target = "bitacoras", ignore = true)
    @Mapping(target = "password", ignore = true)
    UserDto toDto(User user);
    
    @Mapping(target = "pases", ignore = true)
    @Mapping(target = "bitacoras", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "fechaCreacion", ignore = true)
    @Mapping(target = "ultimoAcceso", ignore = true)
    User toEntity(UserDto userDto);
    
    @Mapping(target = "pases", ignore = true)
    @Mapping(target = "bitacoras", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "fechaCreacion", ignore = true)
    @Mapping(target = "ultimoAcceso", ignore = true)
    void updateEntityFromDto(UserDto userDto, @MappingTarget User user);
}
