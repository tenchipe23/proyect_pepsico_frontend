package com.pepsico.vehicleexitpass.service;

import com.pepsico.vehicleexitpass.dto.LoginRequest;
import com.pepsico.vehicleexitpass.dto.LoginResponse;
import com.pepsico.vehicleexitpass.entity.User;
import com.pepsico.vehicleexitpass.repository.UserRepository;
import com.pepsico.vehicleexitpass.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

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
        
        User user = userRepository.findByEmailAndEstadoTrue(loginRequest.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return new LoginResponse(jwt, user.getId(), user.getNombreCompleto(), user.getEmail(), user.getRol());
    }
}
