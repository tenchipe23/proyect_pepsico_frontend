package com.pepsico.vehicleexitpass.mapper;

import com.pepsico.vehicleexitpass.dto.UserDto;
import com.pepsico.vehicleexitpass.dto.VehicleExitPassDto;
import com.pepsico.vehicleexitpass.entity.User;
import com.pepsico.vehicleexitpass.entity.VehicleExitPass;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-30T21:05:26-0600",
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
        vehicleExitPassDto.setRemolque1Eco( vehicleExitPass.getRemolque1Eco() );
        vehicleExitPassDto.setRemolque1Placa( vehicleExitPass.getRemolque1Placa() );
        vehicleExitPassDto.setRemolque2Eco( vehicleExitPass.getRemolque2Eco() );
        vehicleExitPassDto.setRemolque2Placa( vehicleExitPass.getRemolque2Placa() );
        vehicleExitPassDto.setEcoDolly( vehicleExitPass.getEcoDolly() );
        vehicleExitPassDto.setPlacasDolly( vehicleExitPass.getPlacasDolly() );
        vehicleExitPassDto.setComentarios( vehicleExitPass.getComentarios() );
        vehicleExitPassDto.setFirma( vehicleExitPass.getFirma() );
        vehicleExitPassDto.setSello( vehicleExitPass.getSello() );
        vehicleExitPassDto.setFechaCreacion( vehicleExitPass.getFechaCreacion() );
        vehicleExitPassDto.setFechaFirma( vehicleExitPass.getFechaFirma() );
        vehicleExitPassDto.setFechaAutorizacion( vehicleExitPass.getFechaAutorizacion() );
        vehicleExitPassDto.setOperadorNombre( vehicleExitPass.getOperadorNombre() );
        vehicleExitPassDto.setOperadorApellidoPaterno( vehicleExitPass.getOperadorApellidoPaterno() );
        vehicleExitPassDto.setOperadorApellidoMaterno( vehicleExitPass.getOperadorApellidoMaterno() );
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
        vehicleExitPass.setOperadorNombre( vehicleExitPassDto.getOperadorNombre() );
        vehicleExitPass.setOperadorApellidoPaterno( vehicleExitPassDto.getOperadorApellidoPaterno() );
        vehicleExitPass.setOperadorApellidoMaterno( vehicleExitPassDto.getOperadorApellidoMaterno() );
        vehicleExitPass.setRemolque1Eco( vehicleExitPassDto.getRemolque1Eco() );
        vehicleExitPass.setRemolque1Placa( vehicleExitPassDto.getRemolque1Placa() );
        vehicleExitPass.setRemolque2Eco( vehicleExitPassDto.getRemolque2Eco() );
        vehicleExitPass.setRemolque2Placa( vehicleExitPassDto.getRemolque2Placa() );
        vehicleExitPass.setEcoDolly( vehicleExitPassDto.getEcoDolly() );
        vehicleExitPass.setPlacasDolly( vehicleExitPassDto.getPlacasDolly() );

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
        vehicleExitPass.setOperadorNombre( vehicleExitPassDto.getOperadorNombre() );
        vehicleExitPass.setOperadorApellidoPaterno( vehicleExitPassDto.getOperadorApellidoPaterno() );
        vehicleExitPass.setOperadorApellidoMaterno( vehicleExitPassDto.getOperadorApellidoMaterno() );
        vehicleExitPass.setRemolque1Eco( vehicleExitPassDto.getRemolque1Eco() );
        vehicleExitPass.setRemolque1Placa( vehicleExitPassDto.getRemolque1Placa() );
        vehicleExitPass.setRemolque2Eco( vehicleExitPassDto.getRemolque2Eco() );
        vehicleExitPass.setRemolque2Placa( vehicleExitPassDto.getRemolque2Placa() );
        vehicleExitPass.setEcoDolly( vehicleExitPassDto.getEcoDolly() );
        vehicleExitPass.setPlacasDolly( vehicleExitPassDto.getPlacasDolly() );
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
}
