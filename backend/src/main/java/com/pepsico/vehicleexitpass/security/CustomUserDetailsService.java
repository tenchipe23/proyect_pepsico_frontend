package com.pepsico.vehicleexitpass.security;

import com.pepsico.vehicleexitpass.entity.User;
import com.pepsico.vehicleexitpass.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.logging.Logger;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    private static final Logger log = Logger.getLogger(CustomUserDetailsService.class.getName());
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        try {
            User user = userRepository.findByEmailAndEstadoTrue(email)
                    .orElseThrow(() -> {
                        log.severe("User not found with email: " + email);
                        return new UsernameNotFoundException("User not found with email: " + email);
                    });
            
            log.fine("User found with email: " + email);
            return UserPrincipal.create(user);
        } catch (Exception e) {
            log.severe("Error loading user by email: " + email);
            e.printStackTrace();
            throw new UsernameNotFoundException("Error loading user with email: " + email, e);
        }
    }
    
    @Transactional
    public UserDetails loadUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
        
        return UserPrincipal.create(user);
    }
}
