package com.pepsico.vehicleexitpass.mapper;

import com.pepsico.vehicleexitpass.dto.VehicleExitPassDto;
import com.pepsico.vehicleexitpass.entity.User;
import com.pepsico.vehicleexitpass.entity.VehicleExitPass;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoField;
import javax.annotation.processing.Generated;
import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeConstants;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-17T21:46:16-0600",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.14 (Eclipse Adoptium)"
)
@Component
public class VehicleExitPassMapperImpl implements VehicleExitPassMapper {

    @Autowired
    private UserMapper userMapper;
    private final DatatypeFactory datatypeFactory;

    public VehicleExitPassMapperImpl() {
        try {
            datatypeFactory = DatatypeFactory.newInstance();
        }
        catch ( DatatypeConfigurationException ex ) {
            throw new RuntimeException( ex );
        }
    }

    @Override
    public VehicleExitPassDto toDto(VehicleExitPass vehicleExitPass) {
        if ( vehicleExitPass == null ) {
            return null;
        }

        VehicleExitPassDto vehicleExitPassDto = new VehicleExitPassDto();

        if ( vehicleExitPass.getId() != null ) {
            vehicleExitPassDto.setId( Long.parseLong( vehicleExitPass.getId() ) );
        }
        vehicleExitPassDto.setFolio( vehicleExitPass.getFolio() );
        vehicleExitPassDto.setEstado( vehicleExitPass.getEstado() );
        vehicleExitPassDto.setRazonSocial( vehicleExitPass.getRazonSocial() );
        vehicleExitPassDto.setFecha( xmlGregorianCalendarToLocalDateTime( localDateToXmlGregorianCalendar( vehicleExitPass.getFecha() ) ) );
        vehicleExitPassDto.setTractorEco( vehicleExitPass.getTractorEco() );
        vehicleExitPassDto.setTractorPlaca( vehicleExitPass.getTractorPlaca() );
        vehicleExitPassDto.setRemolque1Eco( vehicleExitPass.getRemolque1Eco() );
        vehicleExitPassDto.setRemolque1Placa( vehicleExitPass.getRemolque1Placa() );
        vehicleExitPassDto.setRemolque2Eco( vehicleExitPass.getRemolque2Eco() );
        vehicleExitPassDto.setRemolque2Placa( vehicleExitPass.getRemolque2Placa() );
        vehicleExitPassDto.setOperadorNombre( vehicleExitPass.getOperadorNombre() );
        vehicleExitPassDto.setOperadorApellidoPaterno( vehicleExitPass.getOperadorApellidoPaterno() );
        vehicleExitPassDto.setOperadorApellidoMaterno( vehicleExitPass.getOperadorApellidoMaterno() );
        vehicleExitPassDto.setEcoDolly( vehicleExitPass.getEcoDolly() );
        vehicleExitPassDto.setPlacasDolly( vehicleExitPass.getPlacasDolly() );
        vehicleExitPassDto.setComentarios( vehicleExitPass.getComentarios() );
        vehicleExitPassDto.setFirma( vehicleExitPass.getFirma() );
        vehicleExitPassDto.setSello( vehicleExitPass.getSello() );
        vehicleExitPassDto.setFechaCreacion( vehicleExitPass.getFechaCreacion() );
        vehicleExitPassDto.setFechaFirma( vehicleExitPass.getFechaFirma() );
        vehicleExitPassDto.setFechaAutorizacion( vehicleExitPass.getFechaAutorizacion() );
        vehicleExitPassDto.setCreatedBy( userMapper.toDto( vehicleExitPass.getCreatedBy() ) );
        vehicleExitPassDto.setAuthorizedBy( userMapper.toDto( vehicleExitPass.getAuthorizedBy() ) );

        return vehicleExitPassDto;
    }

    @Override
    public VehicleExitPass toEntity(VehicleExitPassDto vehicleExitPassDto) {
        if ( vehicleExitPassDto == null ) {
            return null;
        }

        VehicleExitPass vehicleExitPass = new VehicleExitPass();

        if ( vehicleExitPassDto.getId() != null ) {
            vehicleExitPass.setId( String.valueOf( vehicleExitPassDto.getId() ) );
        }
        vehicleExitPass.setFolio( vehicleExitPassDto.getFolio() );
        vehicleExitPass.setEstado( vehicleExitPassDto.getEstado() );
        vehicleExitPass.setRazonSocial( vehicleExitPassDto.getRazonSocial() );
        vehicleExitPass.setFecha( xmlGregorianCalendarToLocalDate( localDateTimeToXmlGregorianCalendar( vehicleExitPassDto.getFecha() ) ) );
        vehicleExitPass.setTractorEco( vehicleExitPassDto.getTractorEco() );
        vehicleExitPass.setTractorPlaca( vehicleExitPassDto.getTractorPlaca() );
        vehicleExitPass.setFechaCreacion( vehicleExitPassDto.getFechaCreacion() );
        vehicleExitPass.setFirma( vehicleExitPassDto.getFirma() );
        vehicleExitPass.setSello( vehicleExitPassDto.getSello() );
        vehicleExitPass.setComentarios( vehicleExitPassDto.getComentarios() );
        vehicleExitPass.setFechaFirma( vehicleExitPassDto.getFechaFirma() );
        vehicleExitPass.setFechaAutorizacion( vehicleExitPassDto.getFechaAutorizacion() );
        vehicleExitPass.setCreatedBy( userMapper.toEntity( vehicleExitPassDto.getCreatedBy() ) );
        vehicleExitPass.setAuthorizedBy( userMapper.toEntity( vehicleExitPassDto.getAuthorizedBy() ) );
        vehicleExitPass.setRemolque1Eco( vehicleExitPassDto.getRemolque1Eco() );
        vehicleExitPass.setRemolque1Placa( vehicleExitPassDto.getRemolque1Placa() );
        vehicleExitPass.setRemolque2Eco( vehicleExitPassDto.getRemolque2Eco() );
        vehicleExitPass.setRemolque2Placa( vehicleExitPassDto.getRemolque2Placa() );
        vehicleExitPass.setOperadorNombre( vehicleExitPassDto.getOperadorNombre() );
        vehicleExitPass.setOperadorApellidoPaterno( vehicleExitPassDto.getOperadorApellidoPaterno() );
        vehicleExitPass.setOperadorApellidoMaterno( vehicleExitPassDto.getOperadorApellidoMaterno() );
        vehicleExitPass.setEcoDolly( vehicleExitPassDto.getEcoDolly() );
        vehicleExitPass.setPlacasDolly( vehicleExitPassDto.getPlacasDolly() );

        return vehicleExitPass;
    }

    @Override
    public void updateEntityFromDto(VehicleExitPassDto vehicleExitPassDto, VehicleExitPass vehicleExitPass) {
        if ( vehicleExitPassDto == null ) {
            return;
        }

        if ( vehicleExitPassDto.getId() != null ) {
            vehicleExitPass.setId( String.valueOf( vehicleExitPassDto.getId() ) );
        }
        else {
            vehicleExitPass.setId( null );
        }
        vehicleExitPass.setFolio( vehicleExitPassDto.getFolio() );
        vehicleExitPass.setEstado( vehicleExitPassDto.getEstado() );
        vehicleExitPass.setRazonSocial( vehicleExitPassDto.getRazonSocial() );
        vehicleExitPass.setFecha( xmlGregorianCalendarToLocalDate( localDateTimeToXmlGregorianCalendar( vehicleExitPassDto.getFecha() ) ) );
        vehicleExitPass.setTractorEco( vehicleExitPassDto.getTractorEco() );
        vehicleExitPass.setTractorPlaca( vehicleExitPassDto.getTractorPlaca() );
        vehicleExitPass.setFechaCreacion( vehicleExitPassDto.getFechaCreacion() );
        vehicleExitPass.setFirma( vehicleExitPassDto.getFirma() );
        vehicleExitPass.setSello( vehicleExitPassDto.getSello() );
        vehicleExitPass.setComentarios( vehicleExitPassDto.getComentarios() );
        vehicleExitPass.setFechaFirma( vehicleExitPassDto.getFechaFirma() );
        vehicleExitPass.setFechaAutorizacion( vehicleExitPassDto.getFechaAutorizacion() );
        if ( vehicleExitPassDto.getCreatedBy() != null ) {
            if ( vehicleExitPass.getCreatedBy() == null ) {
                vehicleExitPass.setCreatedBy( new User() );
            }
            userMapper.updateEntityFromDto( vehicleExitPassDto.getCreatedBy(), vehicleExitPass.getCreatedBy() );
        }
        else {
            vehicleExitPass.setCreatedBy( null );
        }
        if ( vehicleExitPassDto.getAuthorizedBy() != null ) {
            if ( vehicleExitPass.getAuthorizedBy() == null ) {
                vehicleExitPass.setAuthorizedBy( new User() );
            }
            userMapper.updateEntityFromDto( vehicleExitPassDto.getAuthorizedBy(), vehicleExitPass.getAuthorizedBy() );
        }
        else {
            vehicleExitPass.setAuthorizedBy( null );
        }
        vehicleExitPass.setRemolque1Eco( vehicleExitPassDto.getRemolque1Eco() );
        vehicleExitPass.setRemolque1Placa( vehicleExitPassDto.getRemolque1Placa() );
        vehicleExitPass.setRemolque2Eco( vehicleExitPassDto.getRemolque2Eco() );
        vehicleExitPass.setRemolque2Placa( vehicleExitPassDto.getRemolque2Placa() );
        vehicleExitPass.setOperadorNombre( vehicleExitPassDto.getOperadorNombre() );
        vehicleExitPass.setOperadorApellidoPaterno( vehicleExitPassDto.getOperadorApellidoPaterno() );
        vehicleExitPass.setOperadorApellidoMaterno( vehicleExitPassDto.getOperadorApellidoMaterno() );
        vehicleExitPass.setEcoDolly( vehicleExitPassDto.getEcoDolly() );
        vehicleExitPass.setPlacasDolly( vehicleExitPassDto.getPlacasDolly() );
    }

    private XMLGregorianCalendar localDateToXmlGregorianCalendar( LocalDate localDate ) {
        if ( localDate == null ) {
            return null;
        }

        return datatypeFactory.newXMLGregorianCalendarDate(
            localDate.getYear(),
            localDate.getMonthValue(),
            localDate.getDayOfMonth(),
            DatatypeConstants.FIELD_UNDEFINED );
    }

    private XMLGregorianCalendar localDateTimeToXmlGregorianCalendar( LocalDateTime localDateTime ) {
        if ( localDateTime == null ) {
            return null;
        }

        return datatypeFactory.newXMLGregorianCalendar(
            localDateTime.getYear(),
            localDateTime.getMonthValue(),
            localDateTime.getDayOfMonth(),
            localDateTime.getHour(),
            localDateTime.getMinute(),
            localDateTime.getSecond(),
            localDateTime.get( ChronoField.MILLI_OF_SECOND ),
            DatatypeConstants.FIELD_UNDEFINED );
    }

    private static LocalDate xmlGregorianCalendarToLocalDate( XMLGregorianCalendar xcal ) {
        if ( xcal == null ) {
            return null;
        }

        return LocalDate.of( xcal.getYear(), xcal.getMonth(), xcal.getDay() );
    }

    private static LocalDateTime xmlGregorianCalendarToLocalDateTime( XMLGregorianCalendar xcal ) {
        if ( xcal == null ) {
            return null;
        }

        if ( xcal.getYear() != DatatypeConstants.FIELD_UNDEFINED
            && xcal.getMonth() != DatatypeConstants.FIELD_UNDEFINED
            && xcal.getDay() != DatatypeConstants.FIELD_UNDEFINED
            && xcal.getHour() != DatatypeConstants.FIELD_UNDEFINED
            && xcal.getMinute() != DatatypeConstants.FIELD_UNDEFINED
        ) {
            if ( xcal.getSecond() != DatatypeConstants.FIELD_UNDEFINED
                && xcal.getMillisecond() != DatatypeConstants.FIELD_UNDEFINED ) {
                return LocalDateTime.of(
                    xcal.getYear(),
                    xcal.getMonth(),
                    xcal.getDay(),
                    xcal.getHour(),
                    xcal.getMinute(),
                    xcal.getSecond(),
                    Duration.ofMillis( xcal.getMillisecond() ).getNano()
                );
            }
            else if ( xcal.getSecond() != DatatypeConstants.FIELD_UNDEFINED ) {
                return LocalDateTime.of(
                    xcal.getYear(),
                    xcal.getMonth(),
                    xcal.getDay(),
                    xcal.getHour(),
                    xcal.getMinute(),
                    xcal.getSecond()
                );
            }
            else {
                return LocalDateTime.of(
                    xcal.getYear(),
                    xcal.getMonth(),
                    xcal.getDay(),
                    xcal.getHour(),
                    xcal.getMinute()
                );
            }
        }
        return null;
    }
}
