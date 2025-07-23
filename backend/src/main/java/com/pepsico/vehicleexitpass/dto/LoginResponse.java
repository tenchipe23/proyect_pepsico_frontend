package com.pepsico.vehicleexitpass.dto;

import com.pepsico.vehicleexitpass.entity.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Respuesta de inicio de sesión exitoso")
public class LoginResponse {
    
    @Schema(description = "Token JWT de autenticación", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String token;
    
    @Schema(description = "Tipo de token", example = "Bearer")
    private String type = "Bearer";
    
    @Schema(description = "Identificador único del usuario", example = "5f07c259-4463-4c71-a3cc-b8d59478d83a")
    private String id;
    
    @Schema(description = "Nombre del usuario", example = "Juan Pérez")
    private String name;
    
    @Schema(description = "Correo electrónico del usuario", example = "juan.perez@pepsico.com")
    private String email;
    
    @Schema(description = "Rol del usuario", example = "ADMIN")
    private UserRole role;
    
    // Constructors
    public LoginResponse() {}
    
    public LoginResponse(String token, String id, String name, String email, UserRole role) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }
    
    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
}
