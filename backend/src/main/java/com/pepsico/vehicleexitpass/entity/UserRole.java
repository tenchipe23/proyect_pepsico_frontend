package com.pepsico.vehicleexitpass.entity;

public enum UserRole {
    ADMIN("admin"),
    AUTORIZADOR("autorizador"),
    SEGURIDAD("seguridad"),
    CLIENTE("cliente");
    
    private final String value;
    
    UserRole(String value) {
        this.value = value;
    }
    
    public String getValue() {
        return value;
    }
    
    public static UserRole fromString(String value) {
        for (UserRole role : UserRole.values()) {
            if (role.value.equalsIgnoreCase(value)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Unknown role: " + value);
    }
}
