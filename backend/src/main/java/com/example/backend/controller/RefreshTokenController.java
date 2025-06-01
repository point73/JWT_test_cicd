package com.example.backend.controller;

import com.example.backend.service.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class RefreshTokenController {

    @Autowired
    private RefreshTokenService refreshTokenService;

    @PostMapping("/refresh-token")
    public Map<String, String> refreshToken(@CookieValue("refreshToken") String refreshToken) {
        String newAccessToken = refreshTokenService.refreshAccessToken(refreshToken);
        return Map.of("accessToken", newAccessToken);
    }

}
