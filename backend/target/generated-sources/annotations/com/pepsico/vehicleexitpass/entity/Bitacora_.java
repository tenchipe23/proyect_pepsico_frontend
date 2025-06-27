package com.pepsico.vehicleexitpass.entity;

import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Bitacora.class)
public abstract class Bitacora_ {

	public static volatile SingularAttribute<Bitacora, String> accion;
	public static volatile SingularAttribute<Bitacora, LocalDateTime> fecha;
	public static volatile SingularAttribute<Bitacora, VehicleExitPass> pase;
	public static volatile SingularAttribute<Bitacora, User> usuario;
	public static volatile SingularAttribute<Bitacora, String> detalles;
	public static volatile SingularAttribute<Bitacora, String> id;

	public static final String ACCION = "accion";
	public static final String FECHA = "fecha";
	public static final String PASE = "pase";
	public static final String USUARIO = "usuario";
	public static final String DETALLES = "detalles";
	public static final String ID = "id";

}

