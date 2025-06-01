package com.example.backend.controller;

import com.example.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class RoleController {

    private final AdminService adminService;

    // 전체 유저 목록 조회 (관리자만 가능)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // 권한 부여 (관리자만 가능)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/assign-role")
    public ResponseEntity<?> assignRole(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String roleName = request.get("role");
        adminService.assignRole(username, roleName);
        return ResponseEntity.ok("권한 부여 완료");
    }

    // 권한 제거 (관리자만 가능)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/remove-role")
    public ResponseEntity<?> removeRole(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String roleName = request.get("role");
        adminService.removeRole(username, roleName);
        return ResponseEntity.ok("권한 제거 완료");
    }
}
