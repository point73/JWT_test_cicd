package com.example.backend.controller;

import com.example.backend.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public void signup(@RequestBody Map<String, String> body) {
        authService.signup(body);
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> body, HttpServletResponse response) {
        Map<String, String> tokens = authService.login(body);
        String refreshToken = tokens.get("refreshToken");

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false) // 운영 시 true
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .sameSite("Strict")
                .build();

        response.addHeader("Set-Cookie", cookie.toString());

        return Map.of("accessToken", tokens.get("accessToken"));
    }

    @PostMapping("/logout")
    public void logout(@AuthenticationPrincipal UserDetails userDetails, HttpServletResponse response) {
        String username = userDetails.getUsername();
        authService.logout(username);

        // refreshToken 쿠키 삭제
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)  // 운영시 true // 쿠키전송허용 (false -> http,https) / (true -> https)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }

}
