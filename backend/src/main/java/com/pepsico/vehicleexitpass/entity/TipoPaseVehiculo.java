package com.pepsico.vehicleexitpass.entity;

public enum TipoPaseVehiculo {
    TRACTOR("tractor"),
    REMOLQUE1("remolque1"),
    REMOLQUE2("remolque2"),
    DOLLY("dolly");
    
    private final String value;
    
    TipoPaseVehiculo(String value) {
        this.value = value;
    }
    
    public String getValue() {
        return value;
    }
    
    public static TipoPaseVehiculo fromString(String value) {
        for (TipoPaseVehiculo tipo : TipoPaseVehiculo.values()) {
            if (tipo.value.equalsIgnoreCase(value)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Unknown pase vehicle type: " + value);
    }
}
