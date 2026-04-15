package com.funstack.backend.service;

import com.funstack.backend.dto.AuthRequest;
import com.funstack.backend.dto.AuthResponse;
import com.funstack.backend.model.User;
import com.funstack.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return new AuthResponse(false, "Username already exists", null, null);
        }

        User user = new User();
        user.setUsername(request.getUsername());
        // Simple plain text password for college project as requested
        user.setPassword(request.getPassword());

        User savedUser = userRepository.save(user);
        return new AuthResponse(true, "Registration successful", savedUser.getId(), savedUser.getUsername());
    }

    public AuthResponse login(AuthRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(request.getPassword())) {
                return new AuthResponse(true, "Login successful", user.getId(), user.getUsername());
            }
        }
        return new AuthResponse(false, "Invalid username or password", null, null);
    }
}
