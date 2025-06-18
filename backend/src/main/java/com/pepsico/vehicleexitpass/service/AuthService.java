package com.pepsico.vehicleexitpass.service;

import com.pepsico.vehicleexitpass.dto.LoginRequest;
import com.pepsico.vehicleexitpass.dto.LoginResponse;
import com.pepsico.vehicleexitpass.entity.User;
import com.pepsico.vehicleexitpass.repository.UserRepository;
import com.pepsico.vehicleexitpass.security.JwtUtils;
import com.pepsico.vehicleexitpass.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    public LoginResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
<<<<<<< HEAD
        UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList());
            
        return new LoginResponse(
            jwt,
            userDetails.getId(),
            userDetails.getUsername(),
            userDetails.getEmail(),
            roles
        );
=======
        User user = userRepository.findByEmailAndEstadoTrue(loginRequest.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return new LoginResponse(jwt, user.getId(), user.getNombreCompleto(), user.getEmail(), user.getRol());
>>>>>>> 06a5d025459bc02eb04ef0e954262d8207c0757d
    }
}
