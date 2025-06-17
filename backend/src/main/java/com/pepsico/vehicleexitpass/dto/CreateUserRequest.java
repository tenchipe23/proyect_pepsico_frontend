package com.pepsico.vehicleexitpass.dto;

import com.pepsico.vehicleexitpass.entity.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateUserRequest {
    
    @NotBlank
    @Size(max = 100)
    private String name;
    
    @Size(max = 100)
    private String apellido;
    
    @NotBlank
    @Email
    @Size(max = 100)
    private String email;
    
    @NotBlank
    @Size(min = 6, max = 100)
    private String password;
    
    @NotNull
    private UserRole role;
    
    // Constructors
    public CreateUserRequest() {}
    
    public CreateUserRequest(String name, String apellido, String email, String password, UserRole role) {
        this.name = name;
        this.apellido = apellido;
        this.email = email;
        this.password = password;
        this.role = role;
    }
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
}
