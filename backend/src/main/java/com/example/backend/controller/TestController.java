package com.example.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/user/hello")
    public String userHello() {
        return "안녕하세요 유저님!";
    }

    @GetMapping("/admin/hello")
    public String adminHello() {
        return "안녕하세요 관리자님!";
    }
}
