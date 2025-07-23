package com.pepsico.vehicleexitpass.controller;

import com.pepsico.vehicleexitpass.dto.CreateUserRequest;
import com.pepsico.vehicleexitpass.dto.UserDto;
import com.pepsico.vehicleexitpass.entity.UserRole;
import com.pepsico.vehicleexitpass.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Administración de Usuarios", description = "API para la gestión de usuarios (solo administradores)")
@SecurityRequirement(name = "bearerAuth")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    @Operation(summary = "Obtener todos los usuarios", description = "Obtiene una lista paginada de usuarios con opciones de filtrado y búsqueda")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuarios encontrados exitosamente", 
                    content = @Content(schema = @Schema(implementation = Page.class))),
        @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<Page<UserDto>> getAllUsers(
            @Parameter(description = "Número de página (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de página") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Campo para ordenar") @RequestParam(defaultValue = "fechaCreacion") String sortBy,
            @Parameter(description = "Dirección de ordenamiento: asc o desc") @RequestParam(defaultValue = "desc") String sortDir,
            @Parameter(description = "Término de búsqueda") @RequestParam(required = false) String search) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<UserDto> users = search != null && !search.isEmpty() ?
            userService.searchUsers(search, pageable) :
            userService.getAllUsers(pageable);
        
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario por ID", description = "Obtiene un usuario específico por su ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario encontrado exitosamente", 
                    content = @Content(schema = @Schema(implementation = UserDto.class))),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<UserDto> getUserById(
            @Parameter(description = "ID del usuario") @PathVariable String id) {
        UserDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/role/{role}")
    @Operation(summary = "Obtener usuarios por rol", description = "Obtiene una lista de usuarios con un rol específico")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuarios encontrados exitosamente"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<List<UserDto>> getUsersByRole(
            @Parameter(description = "Rol de usuario (ADMIN, AUTORIZADOR, SEGURIDAD)") @PathVariable UserRole role) {
        List<UserDto> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }
    
    @PostMapping
    @Operation(summary = "Crear usuario", description = "Crea un nuevo usuario en el sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Usuario creado exitosamente", 
                    content = @Content(schema = @Schema(implementation = UserDto.class))),
        @ApiResponse(responseCode = "400", description = "Datos de solicitud inválidos"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<UserDto> createUser(
            @Parameter(description = "Datos del usuario a crear") @Valid @RequestBody CreateUserRequest request) {
        UserDto createdUser = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario", description = "Actualiza un usuario existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario actualizado exitosamente", 
                    content = @Content(schema = @Schema(implementation = UserDto.class))),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @ApiResponse(responseCode = "400", description = "Datos de solicitud inválidos"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<UserDto> updateUser(
            @Parameter(description = "ID del usuario") @PathVariable String id, 
            @Parameter(description = "Datos actualizados del usuario") @Valid @RequestBody UserDto userDto) {
        UserDto updatedUser = userService.updateUser(id, userDto);
        return ResponseEntity.ok(updatedUser);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario", description = "Elimina un usuario existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<?> deleteUser(
            @Parameter(description = "ID del usuario") @PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().body("{\"message\": \"User deleted successfully!\"}");
    }
    
    @GetMapping("/stats/count-by-role/{role}")
    @Operation(summary = "Obtener conteo por rol", description = "Obtiene el número de usuarios con un rol específico")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Conteo obtenido exitosamente"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<Long> getUserCountByRole(
            @Parameter(description = "Rol de usuario (ADMIN, AUTORIZADOR, SEGURIDAD)") @PathVariable UserRole role) {
        long count = userService.getUserCountByRole(role);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats")
    @Operation(summary = "Obtener estadísticas de usuarios", description = "Obtiene estadísticas generales sobre los usuarios del sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Estadísticas obtenidas exitosamente"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<Map<String, Object>> getUserStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userService.getTotalUserCount());
        stats.put("adminCount", userService.getUserCountByRole(UserRole.ADMIN));
        stats.put("autorizadorCount", userService.getUserCountByRole(UserRole.AUTORIZADOR));
        stats.put("seguridadCount", userService.getUserCountByRole(UserRole.SEGURIDAD));
        return ResponseEntity.ok(stats);
    }
}
