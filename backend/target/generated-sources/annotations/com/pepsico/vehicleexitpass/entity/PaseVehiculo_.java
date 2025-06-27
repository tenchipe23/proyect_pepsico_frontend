package com.pepsico.vehicleexitpass.entity;

import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(PaseVehiculo.class)
public abstract class PaseVehiculo_ {

	public static volatile SingularAttribute<PaseVehiculo, TipoPaseVehiculo> tipo;
	public static volatile SingularAttribute<PaseVehiculo, VehicleExitPass> pase;
	public static volatile SingularAttribute<PaseVehiculo, String> id;
	public static volatile SingularAttribute<PaseVehiculo, Vehiculo> vehiculo;

	public static final String TIPO = "tipo";
	public static final String PASE = "pase";
	public static final String ID = "id";
	public static final String VEHICULO = "vehiculo";

}

