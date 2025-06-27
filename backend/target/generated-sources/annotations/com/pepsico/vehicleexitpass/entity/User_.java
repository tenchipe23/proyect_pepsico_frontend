package com.pepsico.vehicleexitpass.entity;

import jakarta.persistence.metamodel.SetAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(User.class)
public abstract class User_ {

	public static volatile SingularAttribute<User, String> password;
	public static volatile SingularAttribute<User, Boolean> estado;
	public static volatile SingularAttribute<User, String> apellido;
	public static volatile SetAttribute<User, VehicleExitPass> pases;
	public static volatile SingularAttribute<User, LocalDateTime> fechaCreacion;
	public static volatile SetAttribute<User, Bitacora> bitacoras;
	public static volatile SingularAttribute<User, String> id;
	public static volatile SingularAttribute<User, LocalDateTime> ultimoAcceso;
	public static volatile SingularAttribute<User, String> nombre;
	public static volatile SingularAttribute<User, String> email;
	public static volatile SingularAttribute<User, UserRole> rol;

	public static final String PASSWORD = "password";
	public static final String ESTADO = "estado";
	public static final String APELLIDO = "apellido";
	public static final String PASES = "pases";
	public static final String FECHA_CREACION = "fechaCreacion";
	public static final String BITACORAS = "bitacoras";
	public static final String ID = "id";
	public static final String ULTIMO_ACCESO = "ultimoAcceso";
	public static final String NOMBRE = "nombre";
	public static final String EMAIL = "email";
	public static final String ROL = "rol";

}

