package com.pepsico.vehicleexitpass.mapper;

import com.pepsico.vehicleexitpass.dto.UserDto;
import com.pepsico.vehicleexitpass.dto.VehicleExitPassDto;
import com.pepsico.vehicleexitpass.entity.User;
import com.pepsico.vehicleexitpass.entity.VehicleExitPass;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-23T17:32:34-0600",
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

        vehicleExitPassDto.setFechaFromString( vehicleExitPass.getFechaCreacion() != null ? vehicleExitPass.getFechaCreacion().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) : null );

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
        vehicleExitPass.setOperadorNombre( vehicleExitPassDto.getOperadorNombre() );
        vehicleExitPass.setOperadorApellidoPaterno( vehicleExitPassDto.getOperadorApellidoPaterno() );
        vehicleExitPass.setOperadorApellidoMaterno( vehicleExitPassDto.getOperadorApellidoMaterno() );
        vehicleExitPass.setRemolque1Eco( vehicleExitPassDto.getRemolque1Eco() );
        vehicleExitPass.setRemolque1Placa( vehicleExitPassDto.getRemolque1Placa() );
        vehicleExitPass.setRemolque2Eco( vehicleExitPassDto.getRemolque2Eco() );
        vehicleExitPass.setRemolque2Placa( vehicleExitPassDto.getRemolque2Placa() );
        vehicleExitPass.setEcoDolly( vehicleExitPassDto.getEcoDolly() );
        vehicleExitPass.setPlacasDolly( vehicleExitPassDto.getPlacasDolly() );

        vehicleExitPass.setFechaCreacion( vehicleExitPassDto.getFechaFromString() != null ? java.time.LocalDateTime.parse(vehicleExitPassDto.getFechaFromString(), java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) : null );

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

    protected User userDtoToUser(UserDto userDto) {
        if ( userDto == null ) {
            return null;
        }

        User user = new User();

        user.setId( userDto.getId() );
        user.setEmail( userDto.getEmail() );
        user.setNombre( userDto.getNombre() );
        user.setApellido( userDto.getApellido() );
        user.setSegundoApellido( userDto.getSegundoApellido() );
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
        mappingTarget.setSegundoApellido( userDto.getSegundoApellido() );
        mappingTarget.setRol( userDto.getRol() );
        mappingTarget.setFechaCreacion( userDto.getFechaCreacion() );
        mappingTarget.setUltimoAcceso( userDto.getUltimoAcceso() );
        mappingTarget.setEstado( userDto.getEstado() );
    }
}
