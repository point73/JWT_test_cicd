package com.example.backend.service;

import com.example.backend.entity.RefreshToken;
import com.example.backend.entity.User;
import com.example.backend.repository.RefreshTokenRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RefreshTokenService {

    @Autowired private RefreshTokenRepository refreshTokenRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private JwtUtil jwtUtil;

    public String refreshAccessToken(String refreshTokenStr) {
        String username = jwtUtil.extractUsername(refreshTokenStr);
        User user = userRepository.findByUsername(username).orElseThrow();
        RefreshToken refreshToken = refreshTokenRepository.findByUser(user).orElseThrow();

        if (!refreshToken.getToken().equals(refreshTokenStr))
            throw new RuntimeException("Invalid refresh token");

        if (refreshToken.getExpiryDate().before(new java.util.Date()))
            throw new RuntimeException("Refresh token expired");

        var roles = user.getRoles().stream().map(r -> r.getName()).toList();
        return jwtUtil.generateAccessToken(username, roles);
    }
}
