package com.example.backend.service;

import com.example.backend.entity.RefreshToken;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.repository.RefreshTokenRepository;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private RefreshTokenRepository refreshTokenRepository;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private BCryptPasswordEncoder passwordEncoder;

    public void signup(Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String email = body.get("email");

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        Role userRole = roleRepository.findByName("USER").orElseThrow();
        user.setRoles(Set.of(userRole));

        userRepository.save(user);
    }

    public Map<String, String> login(Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        User user = userRepository.findByUsername(username).orElseThrow();

        if (!passwordEncoder.matches(password, user.getPassword()))
            throw new RuntimeException("Invalid credentials");

        List<String> roles = user.getRoles().stream().map(Role::getName).toList();
        String accessToken = jwtUtil.generateAccessToken(username, roles);
        String refreshToken = jwtUtil.generateRefreshToken(username);

        saveRefreshToken(user, refreshToken);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        return tokens;
    }

    private void saveRefreshToken(User user, String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByUser(user).orElse(new RefreshToken());
        refreshToken.setUser(user);
        refreshToken.setToken(token);
        refreshToken.setExpiryDate(jwtUtil.getRefreshExpiryDate());
        refreshTokenRepository.save(refreshToken);
    }

    public void logout(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        refreshTokenRepository.findByUser(user).ifPresent(refreshTokenRepository::delete);
    }

}
