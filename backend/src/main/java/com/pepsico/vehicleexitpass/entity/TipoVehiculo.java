package com.pepsico.vehicleexitpass.entity;

public enum TipoVehiculo {
    TRACTOR("tractor"),
    REMOLQUE("remolque"),
    DOLLY("dolly");
    
    private final String value;
    
    TipoVehiculo(String value) {
        this.value = value;
    }
    
    public String getValue() {
        return value;
    }
    
    public static TipoVehiculo fromString(String value) {
        for (TipoVehiculo tipo : TipoVehiculo.values()) {
            if (tipo.value.equalsIgnoreCase(value)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Unknown vehicle type: " + value);
    }
}
