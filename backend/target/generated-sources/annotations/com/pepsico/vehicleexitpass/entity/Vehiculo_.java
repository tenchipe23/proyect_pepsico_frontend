package com.pepsico.vehicleexitpass.entity;

import jakarta.persistence.metamodel.SetAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Vehiculo.class)
public abstract class Vehiculo_ {

	public static volatile SingularAttribute<Vehiculo, String> descripcion;
	public static volatile SetAttribute<Vehiculo, PaseVehiculo> paseVehiculos;
	public static volatile SingularAttribute<Vehiculo, TipoVehiculo> tipo;
	public static volatile SingularAttribute<Vehiculo, Boolean> estado;
	public static volatile SingularAttribute<Vehiculo, String> id;
	public static volatile SingularAttribute<Vehiculo, String> numeroEconomico;
	public static volatile SingularAttribute<Vehiculo, String> placa;

	public static final String DESCRIPCION = "descripcion";
	public static final String PASE_VEHICULOS = "paseVehiculos";
	public static final String TIPO = "tipo";
	public static final String ESTADO = "estado";
	public static final String ID = "id";
	public static final String NUMERO_ECONOMICO = "numeroEconomico";
	public static final String PLACA = "placa";

}

