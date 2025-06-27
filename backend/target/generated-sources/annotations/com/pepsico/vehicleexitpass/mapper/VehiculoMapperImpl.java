package com.pepsico.vehicleexitpass.mapper;

import com.pepsico.vehicleexitpass.dto.VehiculoDto;
import com.pepsico.vehicleexitpass.entity.PaseVehiculo;
import com.pepsico.vehicleexitpass.entity.Vehiculo;
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
public class VehiculoMapperImpl implements VehiculoMapper {

    @Override
    public VehiculoDto toDto(Vehiculo vehiculo) {
        if ( vehiculo == null ) {
            return null;
        }

        VehiculoDto vehiculoDto = new VehiculoDto();

        Set<PaseVehiculo> set = vehiculo.getPaseVehiculos();
        if ( set != null ) {
            vehiculoDto.setPaseVehiculos( new LinkedHashSet<PaseVehiculo>( set ) );
        }
        vehiculoDto.setId( vehiculo.getId() );
        vehiculoDto.setTipo( vehiculo.getTipo() );
        vehiculoDto.setNumeroEconomico( vehiculo.getNumeroEconomico() );
        vehiculoDto.setPlaca( vehiculo.getPlaca() );
        vehiculoDto.setDescripcion( vehiculo.getDescripcion() );
        vehiculoDto.setEstado( vehiculo.getEstado() );

        return vehiculoDto;
    }

    @Override
    public Vehiculo toEntity(VehiculoDto vehiculoDto) {
        if ( vehiculoDto == null ) {
            return null;
        }

        Vehiculo vehiculo = new Vehiculo();

        Set<PaseVehiculo> set = vehiculoDto.getPaseVehiculos();
        if ( set != null ) {
            vehiculo.setPaseVehiculos( new LinkedHashSet<PaseVehiculo>( set ) );
        }
        vehiculo.setId( vehiculoDto.getId() );
        vehiculo.setTipo( vehiculoDto.getTipo() );
        vehiculo.setNumeroEconomico( vehiculoDto.getNumeroEconomico() );
        vehiculo.setPlaca( vehiculoDto.getPlaca() );
        vehiculo.setDescripcion( vehiculoDto.getDescripcion() );
        vehiculo.setEstado( vehiculoDto.getEstado() );

        return vehiculo;
    }

    @Override
    public void updateFromDto(VehiculoDto dto, Vehiculo entity) {
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
        entity.setTipo( dto.getTipo() );
        entity.setNumeroEconomico( dto.getNumeroEconomico() );
        entity.setPlaca( dto.getPlaca() );
        entity.setDescripcion( dto.getDescripcion() );
        entity.setEstado( dto.getEstado() );
    }
}
