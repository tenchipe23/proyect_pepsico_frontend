package com.pepsico.vehicleexitpass.mapper;

import com.pepsico.vehicleexitpass.dto.UserDto;
import com.pepsico.vehicleexitpass.dto.VehicleExitPassDto;
import com.pepsico.vehicleexitpass.entity.User;
import com.pepsico.vehicleexitpass.entity.VehicleExitPass;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-30T16:41:41-0600",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.14 (Eclipse Adoptium)"
)
@Component
public class VehicleExitPassMapperImpl implements VehicleExitPassMapper {

    @Override
    public VehicleExitPassDto toDto(VehicleExitPass vehicleExitPass) {
        if ( vehicleExitPass == null ) {
            return null;
        }

        VehicleExitPassDto vehicleExitPassDto = new VehicleExitPassDto();

        vehicleExitPassDto.setId( vehicleExitPass.getId() );
        vehicleExitPassDto.setFolio( vehicleExitPass.getFolio() );
        vehicleExitPassDto.setEstado( vehicleExitPass.getEstado() );
        vehicleExitPassDto.setRazonSocial( vehicleExitPass.getRazonSocial() );
        vehicleExitPassDto.setFecha( vehicleExitPass.getFecha() );
        vehicleExitPassDto.setTractorEco( vehicleExitPass.getTractorEco() );
        vehicleExitPassDto.setTractorPlaca( vehicleExitPass.getTractorPlaca() );
        vehicleExitPassDto.setComentarios( vehicleExitPass.getComentarios() );
        vehicleExitPassDto.setFirma( vehicleExitPass.getFirma() );
        vehicleExitPassDto.setSello( vehicleExitPass.getSello() );
        vehicleExitPassDto.setFechaCreacion( vehicleExitPass.getFechaCreacion() );
        vehicleExitPassDto.setFechaFirma( vehicleExitPass.getFechaFirma() );
        vehicleExitPassDto.setFechaAutorizacion( vehicleExitPass.getFechaAutorizacion() );
        vehicleExitPassDto.setOperador( userToUserDto( vehicleExitPass.getOperador() ) );

        return vehicleExitPassDto;
    }

    @Override
    public VehicleExitPass toEntity(VehicleExitPassDto vehicleExitPassDto) {
        if ( vehicleExitPassDto == null ) {
            return null;
        }

        VehicleExitPass vehicleExitPass = new VehicleExitPass();

        vehicleExitPass.setId( vehicleExitPassDto.getId() );
        vehicleExitPass.setFolio( vehicleExitPassDto.getFolio() );
        vehicleExitPass.setEstado( vehicleExitPassDto.getEstado() );
        vehicleExitPass.setRazonSocial( vehicleExitPassDto.getRazonSocial() );
        vehicleExitPass.setFecha( vehicleExitPassDto.getFecha() );
        vehicleExitPass.setTractorEco( vehicleExitPassDto.getTractorEco() );
        vehicleExitPass.setTractorPlaca( vehicleExitPassDto.getTractorPlaca() );
        vehicleExitPass.setFirma( vehicleExitPassDto.getFirma() );
        vehicleExitPass.setSello( vehicleExitPassDto.getSello() );
        vehicleExitPass.setComentarios( vehicleExitPassDto.getComentarios() );
        vehicleExitPass.setFechaFirma( vehicleExitPassDto.getFechaFirma() );
        vehicleExitPass.setFechaAutorizacion( vehicleExitPassDto.getFechaAutorizacion() );
        vehicleExitPass.setOperador( userDtoToUser( vehicleExitPassDto.getOperador() ) );

        return vehicleExitPass;
    }

    @Override
    public void updateEntityFromDto(VehicleExitPassDto vehicleExitPassDto, VehicleExitPass vehicleExitPass) {
        if ( vehicleExitPassDto == null ) {
            return;
        }

        vehicleExitPass.setId( vehicleExitPassDto.getId() );
        vehicleExitPass.setFolio( vehicleExitPassDto.getFolio() );
        vehicleExitPass.setEstado( vehicleExitPassDto.getEstado() );
        vehicleExitPass.setRazonSocial( vehicleExitPassDto.getRazonSocial() );
        vehicleExitPass.setFecha( vehicleExitPassDto.getFecha() );
        vehicleExitPass.setTractorEco( vehicleExitPassDto.getTractorEco() );
        vehicleExitPass.setTractorPlaca( vehicleExitPassDto.getTractorPlaca() );
        vehicleExitPass.setFirma( vehicleExitPassDto.getFirma() );
        vehicleExitPass.setSello( vehicleExitPassDto.getSello() );
        vehicleExitPass.setComentarios( vehicleExitPassDto.getComentarios() );
        vehicleExitPass.setFechaFirma( vehicleExitPassDto.getFechaFirma() );
        vehicleExitPass.setFechaAutorizacion( vehicleExitPassDto.getFechaAutorizacion() );
        if ( vehicleExitPassDto.getOperador() != null ) {
            if ( vehicleExitPass.getOperador() == null ) {
                vehicleExitPass.setOperador( new User() );
            }
            userDtoToUser1( vehicleExitPassDto.getOperador(), vehicleExitPass.getOperador() );
        }
        else {
            vehicleExitPass.setOperador( null );
        }
    }

    protected UserDto userToUserDto(User user) {
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

    protected User userDtoToUser(UserDto userDto) {
        if ( userDto == null ) {
            return null;
        }

        User user = new User();

        user.setId( userDto.getId() );
        user.setEmail( userDto.getEmail() );
        user.setNombre( userDto.getNombre() );
        user.setApellido( userDto.getApellido() );
        user.setRol( userDto.getRol() );
        user.setFechaCreacion( userDto.getFechaCreacion() );
        user.setUltimoAcceso( userDto.getUltimoAcceso() );
        user.setEstado( userDto.getEstado() );

        return user;
    }

    protected void userDtoToUser1(UserDto userDto, User mappingTarget) {
        if ( userDto == null ) {
            return;
        }

        mappingTarget.setId( userDto.getId() );
        mappingTarget.setEmail( userDto.getEmail() );
        mappingTarget.setNombre( userDto.getNombre() );
        mappingTarget.setApellido( userDto.getApellido() );
        mappingTarget.setRol( userDto.getRol() );
        mappingTarget.setFechaCreacion( userDto.getFechaCreacion() );
        mappingTarget.setUltimoAcceso( userDto.getUltimoAcceso() );
        mappingTarget.setEstado( userDto.getEstado() );
    }
}
