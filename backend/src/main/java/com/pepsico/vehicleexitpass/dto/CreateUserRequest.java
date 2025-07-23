package com.pepsico.vehicleexitpass.dto;

import com.pepsico.vehicleexitpass.entity.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Solicitud para crear un nuevo usuario")
public class CreateUserRequest {
    
    @Schema(description = "Nombre del usuario", example = "Juan", required = true)
    @NotBlank
    @Size(max = 100)
    private String name;
    
    @Schema(description = "Primer apellido del usuario", example = "Pérez")
    @Size(max = 100)
    private String apellido;
    
    @Schema(description = "Segundo apellido del usuario", example = "García")
    @Size(max = 100)
    private String segundoApellido;
    
    @Schema(description = "Correo electrónico del usuario", example = "juan.perez@pepsico.com", required = true)
    @NotBlank
    @Email
    @Size(max = 100)
    private String email;
    
    @Schema(description = "Contraseña del usuario", example = "password123", required = true, minLength = 6)
    @NotBlank
    @Size(min = 6, max = 100)
    private String password;
    
    @Schema(description = "Rol del usuario", example = "ADMIN", required = true)
    @NotNull
    private UserRole role;
    
    // Constructors
    public CreateUserRequest() {}
    
    public CreateUserRequest(String name, String apellido, String segundoApellido, String email, String password, UserRole role) {
        this.name = name;
        this.apellido = apellido;
        this.segundoApellido = segundoApellido;
        this.email = email;
        this.password = password;
        this.role = role;
    }
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    
    public String getSegundoApellido() { return segundoApellido; }
    public void setSegundoApellido(String segundoApellido) { this.segundoApellido = segundoApellido; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
}
