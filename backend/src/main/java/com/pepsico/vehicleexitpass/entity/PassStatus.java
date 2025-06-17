package com.pepsico.vehicleexitpass.entity;

public enum PassStatus {
    PENDIENTE("pendiente"),
    FIRMADO("firmado"),
    AUTORIZADO("autorizado"),
    RECHAZADO("rechazado");
    
    private final String value;
    
    PassStatus(String value) {
        this.value = value;
    }
    
    public String getValue() {
        return value;
    }
    
    public static PassStatus fromString(String value) {
        for (PassStatus status : PassStatus.values()) {
            if (status.value.equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown status: " + value);
    }
}
