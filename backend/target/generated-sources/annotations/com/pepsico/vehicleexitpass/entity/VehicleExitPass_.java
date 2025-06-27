package com.pepsico.vehicleexitpass.entity;

import jakarta.persistence.metamodel.SetAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(VehicleExitPass.class)
public abstract class VehicleExitPass_ {

	public static volatile SetAttribute<VehicleExitPass, PaseVehiculo> paseVehiculos;
	public static volatile SingularAttribute<VehicleExitPass, PassStatus> estado;
	public static volatile SingularAttribute<VehicleExitPass, String> tractorEco;
	public static volatile SetAttribute<VehicleExitPass, Bitacora> bitacoras;
	public static volatile SingularAttribute<VehicleExitPass, String> firma;
	public static volatile SingularAttribute<VehicleExitPass, LocalDate> fecha;
	public static volatile SingularAttribute<VehicleExitPass, String> razonSocial;
	public static volatile SingularAttribute<VehicleExitPass, String> tractorPlaca;
	public static volatile SingularAttribute<VehicleExitPass, LocalDateTime> fechaFirma;
	public static volatile SingularAttribute<VehicleExitPass, String> folio;
	public static volatile SingularAttribute<VehicleExitPass, LocalDateTime> fechaCreacion;
	public static volatile SingularAttribute<VehicleExitPass, String> sello;
	public static volatile SingularAttribute<VehicleExitPass, UUID> id;
	public static volatile SingularAttribute<VehicleExitPass, String> comentarios;
	public static volatile SingularAttribute<VehicleExitPass, User> operador;
	public static volatile SingularAttribute<VehicleExitPass, LocalDateTime> fechaAutorizacion;

	public static final String PASE_VEHICULOS = "paseVehiculos";
	public static final String ESTADO = "estado";
	public static final String TRACTOR_ECO = "tractorEco";
	public static final String BITACORAS = "bitacoras";
	public static final String FIRMA = "firma";
	public static final String FECHA = "fecha";
	public static final String RAZON_SOCIAL = "razonSocial";
	public static final String TRACTOR_PLACA = "tractorPlaca";
	public static final String FECHA_FIRMA = "fechaFirma";
	public static final String FOLIO = "folio";
	public static final String FECHA_CREACION = "fechaCreacion";
	public static final String SELLO = "sello";
	public static final String ID = "id";
	public static final String COMENTARIOS = "comentarios";
	public static final String OPERADOR = "operador";
	public static final String FECHA_AUTORIZACION = "fechaAutorizacion";

}

