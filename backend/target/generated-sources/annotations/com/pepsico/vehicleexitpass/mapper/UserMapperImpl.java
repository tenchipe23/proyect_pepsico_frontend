package com.pepsico.vehicleexitpass.mapper;

import com.pepsico.vehicleexitpass.dto.UserDto;
import com.pepsico.vehicleexitpass.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-30T21:05:24-0600",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.14 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDto toDto(User user) {
        if ( user == null ) {
            return null;
        }

        UserDto userDto = new UserDto();

        userDto.setId( user.getId() );
        userDto.setEmail( user.getEmail() );
        userDto.setNombre( user.getNombre() );
        userDto.setApellido( user.getApellido() );
        userDto.setRol( user.getRol() );
        userDto.setFechaCreacion( user.getFechaCreacion() );
        userDto.setUltimoAcceso( user.getUltimoAcceso() );
        userDto.setEstado( user.getEstado() );

        return userDto;
    }

    @Override
    public User toEntity(UserDto userDto) {
        if ( userDto == null ) {
            return null;
        }

        User user = new User();

        user.setId( userDto.getId() );
        user.setEmail( userDto.getEmail() );
        user.setNombre( userDto.getNombre() );
        user.setApellido( userDto.getApellido() );
        user.setRol( userDto.getRol() );
        user.setEstado( userDto.getEstado() );

        return user;
    }

    @Override
    public void updateEntityFromDto(UserDto userDto, User user) {
        if ( userDto == null ) {
            return;
        }

        user.setId( userDto.getId() );
        user.setEmail( userDto.getEmail() );
        user.setNombre( userDto.getNombre() );
        user.setApellido( userDto.getApellido() );
        user.setRol( userDto.getRol() );
        user.setEstado( userDto.getEstado() );
    }
}
