package com.pepsico.vehicleexitpass.controller;

import com.pepsico.vehicleexitpass.dto.LoginRequest;
import com.pepsico.vehicleexitpass.dto.LoginResponse;
import com.pepsico.vehicleexitpass.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticación", description = "API para la autenticación de usuarios")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión", description = "Autentica un usuario y devuelve un token JWT")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Autenticación exitosa", 
                    content = @Content(schema = @Schema(implementation = LoginResponse.class))),
        @ApiResponse(responseCode = "401", description = "Credenciales inválidas")
    })
    public ResponseEntity<LoginResponse> authenticateUser(
            @Parameter(description = "Credenciales de inicio de sesión") @Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/logout")
    @Operation(summary = "Cerrar sesión", description = "Cierra la sesión del usuario (el token debe ser invalidado en el cliente)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Sesión cerrada exitosamente")
    })
    public ResponseEntity<?> logoutUser() {
        // Since we're using JWT, logout is handled client-side by removing the token
        return ResponseEntity.ok().body("{\"message\": \"User logged out successfully!\"}");
    }
}