package com.pepsico.vehicleexitpass.security;

import com.pepsico.vehicleexitpass.entity.User;
import com.pepsico.vehicleexitpass.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmailAndEstadoTrue(email)
<<<<<<< HEAD
            .orElseThrow(() -> new UsernameNotFoundException("User Not Found with email: " + email));

=======
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        
>>>>>>> 06a5d025459bc02eb04ef0e954262d8207c0757d
        return UserPrincipal.create(user);
    }
    
    @Transactional
    public UserDetails loadUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
        
        return UserPrincipal.create(user);
    }
}
