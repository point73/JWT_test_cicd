package com.example.backend.service;

import com.example.backend.entity.RefreshToken;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.repository.RefreshTokenRepository;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public void signup(Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String email = body.get("email");

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);

        // 기본 권한 USER 부여
        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("USER 권한이 존재하지 않습니다."));
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);

        // 만약 관리자가 회원가입하면서 ADMIN으로 등록하고 싶을 경우 처리 (옵션)
        if (body.containsKey("isAdmin") && Boolean.parseBoolean(body.get("isAdmin"))) {
            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseThrow(() -> new RuntimeException("ADMIN 권한이 존재하지 않습니다."));
            roles.add(adminRole);
        }

        user.setRoles(roles);
        userRepository.save(user);
    }

    public Map<String, String> login(Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(password, user.getPassword()))
            throw new RuntimeException("아이디 또는 비밀번호가 틀립니다.");

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
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
        refreshTokenRepository.findByUser(user).ifPresent(refreshTokenRepository::delete);
    }
}
