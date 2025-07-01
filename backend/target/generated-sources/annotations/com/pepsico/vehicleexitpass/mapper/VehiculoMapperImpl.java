package com.pepsico.vehicleexitpass.mapper;

import com.pepsico.vehicleexitpass.dto.VehiculoDto;
import com.pepsico.vehicleexitpass.entity.Vehiculo;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-30T21:05:25-0600",
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

        vehiculo.setId( vehiculoDto.getId() );
        vehiculo.setTipo( vehiculoDto.getTipo() );
        vehiculo.setNumeroEconomico( vehiculoDto.getNumeroEconomico() );
        vehiculo.setPlaca( vehiculoDto.getPlaca() );
        vehiculo.setDescripcion( vehiculoDto.getDescripcion() );
        vehiculo.setEstado( vehiculoDto.getEstado() );

        return vehiculo;
    }

    @Override
    public void updateEntityFromDto(VehiculoDto vehiculoDto, Vehiculo vehiculo) {
        if ( vehiculoDto == null ) {
            return;
        }

        vehiculo.setId( vehiculoDto.getId() );
        vehiculo.setTipo( vehiculoDto.getTipo() );
        vehiculo.setNumeroEconomico( vehiculoDto.getNumeroEconomico() );
        vehiculo.setPlaca( vehiculoDto.getPlaca() );
        vehiculo.setDescripcion( vehiculoDto.getDescripcion() );
        vehiculo.setEstado( vehiculoDto.getEstado() );
    }
}
