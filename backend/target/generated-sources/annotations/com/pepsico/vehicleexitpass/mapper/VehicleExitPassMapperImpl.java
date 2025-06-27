package com.pepsico.vehicleexitpass.mapper;

import com.pepsico.vehicleexitpass.dto.VehicleExitPassDto;
import com.pepsico.vehicleexitpass.entity.Bitacora;
import com.pepsico.vehicleexitpass.entity.PaseVehiculo;
import com.pepsico.vehicleexitpass.entity.User;
import com.pepsico.vehicleexitpass.entity.VehicleExitPass;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-24T14:52:51-0600",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.14 (Eclipse Adoptium)"
)
@Component
public class VehicleExitPassMapperImpl implements VehicleExitPassMapper {

    @Autowired
    private UserMapper userMapper;

    @Override
    public VehicleExitPassDto toDto(VehicleExitPass vehicleExitPass) {
        if ( vehicleExitPass == null ) {
            return null;
        }

        VehicleExitPassDto vehicleExitPassDto = new VehicleExitPassDto();

        Set<PaseVehiculo> set = vehicleExitPass.getPaseVehiculos();
        if ( set != null ) {
            vehicleExitPassDto.setPaseVehiculos( new LinkedHashSet<PaseVehiculo>( set ) );
        }
        Set<Bitacora> set1 = vehicleExitPass.getBitacoras();
        if ( set1 != null ) {
            vehicleExitPassDto.setBitacoras( new LinkedHashSet<Bitacora>( set1 ) );
        }
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
        vehicleExitPassDto.setOperador( userMapper.toDto( vehicleExitPass.getOperador() ) );

        return vehicleExitPassDto;
    }

    @Override
    public VehicleExitPass toEntity(VehicleExitPassDto vehicleExitPassDto) {
        if ( vehicleExitPassDto == null ) {
            return null;
        }

        VehicleExitPass vehicleExitPass = new VehicleExitPass();

        Set<PaseVehiculo> set = vehicleExitPassDto.getPaseVehiculos();
        if ( set != null ) {
            vehicleExitPass.setPaseVehiculos( new LinkedHashSet<PaseVehiculo>( set ) );
        }
        Set<Bitacora> set1 = vehicleExitPassDto.getBitacoras();
        if ( set1 != null ) {
            vehicleExitPass.setBitacoras( new LinkedHashSet<Bitacora>( set1 ) );
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
        vehicleExitPass.setOperador( userMapper.toEntity( vehicleExitPassDto.getOperador() ) );

        return vehicleExitPass;
    }

    @Override
    public void updateFromDto(VehicleExitPassDto dto, VehicleExitPass entity) {
        if ( dto == null ) {
            return;
        }

        if ( entity.getPaseVehiculos() != null ) {
            Set<PaseVehiculo> set = dto.getPaseVehiculos();
            if ( set != null ) {
                entity.getPaseVehiculos().clear();
                entity.getPaseVehiculos().addAll( set );
            }
            else {
                entity.setPaseVehiculos( null );
            }
        }
        else {
            Set<PaseVehiculo> set = dto.getPaseVehiculos();
            if ( set != null ) {
                entity.setPaseVehiculos( new LinkedHashSet<PaseVehiculo>( set ) );
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
        entity.setId( dto.getId() );
        entity.setFolio( dto.getFolio() );
        entity.setEstado( dto.getEstado() );
        entity.setRazonSocial( dto.getRazonSocial() );
        entity.setFecha( dto.getFecha() );
        entity.setTractorEco( dto.getTractorEco() );
        entity.setTractorPlaca( dto.getTractorPlaca() );
        entity.setFirma( dto.getFirma() );
        entity.setSello( dto.getSello() );
        entity.setComentarios( dto.getComentarios() );
        entity.setFechaFirma( dto.getFechaFirma() );
        entity.setFechaAutorizacion( dto.getFechaAutorizacion() );
        if ( dto.getOperador() != null ) {
            if ( entity.getOperador() == null ) {
                entity.setOperador( new User() );
            }
            userMapper.updateFromDto( dto.getOperador(), entity.getOperador() );
        }
        else {
            entity.setOperador( null );
        }
    }
}
