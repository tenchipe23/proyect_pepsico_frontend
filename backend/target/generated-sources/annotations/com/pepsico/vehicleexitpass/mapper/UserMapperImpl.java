package com.pepsico.vehicleexitpass.mapper;

import com.pepsico.vehicleexitpass.dto.UserDto;
import com.pepsico.vehicleexitpass.entity.Bitacora;
import com.pepsico.vehicleexitpass.entity.User;
import com.pepsico.vehicleexitpass.entity.VehicleExitPass;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-24T14:52:51-0600",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.14 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User toEntity(UserDto dto) {
        if ( dto == null ) {
            return null;
        }

        User user = new User();

        Set<VehicleExitPass> set = dto.getPases();
        if ( set != null ) {
            user.setPases( new LinkedHashSet<VehicleExitPass>( set ) );
        }
        Set<Bitacora> set1 = dto.getBitacoras();
        if ( set1 != null ) {
            user.setBitacoras( new LinkedHashSet<Bitacora>( set1 ) );
        }
        user.setId( dto.getId() );
        user.setEmail( dto.getEmail() );
        user.setNombre( dto.getNombre() );
        user.setApellido( dto.getApellido() );
        user.setPassword( dto.getPassword() );
        user.setRol( dto.getRol() );
        user.setFechaCreacion( dto.getFechaCreacion() );
        user.setUltimoAcceso( dto.getUltimoAcceso() );
        user.setEstado( dto.getEstado() );

        return user;
    }

    @Override
    public UserDto toDto(User entity) {
        if ( entity == null ) {
            return null;
        }

        UserDto userDto = new UserDto();

        Set<VehicleExitPass> set = entity.getPases();
        if ( set != null ) {
            userDto.setPases( new LinkedHashSet<VehicleExitPass>( set ) );
        }
        Set<Bitacora> set1 = entity.getBitacoras();
        if ( set1 != null ) {
            userDto.setBitacoras( new LinkedHashSet<Bitacora>( set1 ) );
        }
        userDto.setId( entity.getId() );
        userDto.setEmail( entity.getEmail() );
        userDto.setNombre( entity.getNombre() );
        userDto.setApellido( entity.getApellido() );
        userDto.setPassword( entity.getPassword() );
        userDto.setRol( entity.getRol() );
        userDto.setFechaCreacion( entity.getFechaCreacion() );
        userDto.setUltimoAcceso( entity.getUltimoAcceso() );
        userDto.setEstado( entity.getEstado() );

        return userDto;
    }

    @Override
    public void updateFromDto(UserDto dto, User entity) {
        if ( dto == null ) {
            return;
        }

        if ( entity.getPases() != null ) {
            Set<VehicleExitPass> set = dto.getPases();
            if ( set != null ) {
                entity.getPases().clear();
                entity.getPases().addAll( set );
            }
            else {
                entity.setPases( null );
            }
        }
        else {
            Set<VehicleExitPass> set = dto.getPases();
            if ( set != null ) {
                entity.setPases( new LinkedHashSet<VehicleExitPass>( set ) );
            }
        }
        if ( entity.getBitacoras() != null ) {
            Set<Bitacora> set1 = dto.getBitacoras();
            if ( set1 != null ) {
                entity.getBitacoras().clear();
                entity.getBitacoras().addAll( set1 );
            }
            else {
                entity.setBitacoras( null );
            }
        }
        else {
            Set<Bitacora> set1 = dto.getBitacoras();
            if ( set1 != null ) {
                entity.setBitacoras( new LinkedHashSet<Bitacora>( set1 ) );
            }
        }
        entity.setEmail( dto.getEmail() );
        entity.setNombre( dto.getNombre() );
        entity.setApellido( dto.getApellido() );
        entity.setPassword( dto.getPassword() );
        entity.setRol( dto.getRol() );
        entity.setUltimoAcceso( dto.getUltimoAcceso() );
        entity.setEstado( dto.getEstado() );
    }
}
