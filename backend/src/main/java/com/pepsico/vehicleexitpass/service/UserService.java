package com.pepsico.vehicleexitpass.service;

import com.pepsico.vehicleexitpass.dto.CreateUserRequest;
import com.pepsico.vehicleexitpass.dto.UserDto;
import com.pepsico.vehicleexitpass.entity.User;
import com.pepsico.vehicleexitpass.entity.UserRole;
import com.pepsico.vehicleexitpass.exception.ResourceNotFoundException;
import com.pepsico.vehicleexitpass.mapper.UserMapper;
import com.pepsico.vehicleexitpass.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public List<UserDto> getAllUsers() {
        return userRepository.findByEstadoTrue().stream()
            .map(userMapper::toDto)
            .collect(Collectors.toList());
    }
    
    public Page<UserDto> getAllUsers(Pageable pageable) {
        return userRepository.findByEstadoTrue(pageable)
            .map(userMapper::toDto);
    }
    
    public Page<UserDto> searchUsers(String search, Pageable pageable) {
        return userRepository.findEstadoTrueUsersWithSearch(search, pageable)
            .map(userMapper::toDto);
    }
    
    public UserDto getUserById(String id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return userMapper.toDto(user);
    }
    
    public UserDto createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        
        User user = new User();
        user.setNombre(request.getName());
        user.setApellido(request.getName()); // Assuming we need to split the name or get it from another field
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRol(request.getRole());
        user.setEstado(true);
        
        User savedUser = userRepository.save(user);
        return userMapper.toDto(savedUser);
    }
    
    public UserDto updateUser(String id, UserDto userDto) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        // Check if email is being changed and if it's already in use
        if (!user.getEmail().equals(userDto.getEmail()) && 
            userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        
        user.setNombre(userDto.getName());
        user.setApellido(userDto.getName()); // Assuming we need to split the name or get it from another field
        user.setEmail(userDto.getEmail());
        user.setRol(userDto.getRole());
        user.setEstado(userDto.getActive());
        User updatedUser = userRepository.save(user);
        return userMapper.toDto(updatedUser);
    }
    
    public void deleteUser(String id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        // Soft delete
        user.setEstado(false);
        userRepository.save(user);
    }
    
    public List<UserDto> getUsersByRole(UserRole rol) {
        return userRepository.findByRolAndEstadoTrue(rol).stream()
            .map(userMapper::toDto)
            .collect(Collectors.toList());
    }
    
    public long getUserCountByRole(UserRole rol) {
        return userRepository.countByRolAndEstadoTrue(rol);
    }
}
