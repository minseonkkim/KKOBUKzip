package com.turtlecoin.mainservice.domain.user.controller;


import com.turtlecoin.mainservice.domain.user.service.JWTService;
import com.turtlecoin.mainservice.domain.user.util.JWTUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/main/jwt")

public class JWTController {
    private final JWTService jwtService;
    private final JWTUtil jwtUtil;
    public JWTController(JWTService jwtService, JWTUtil jwtUtil) {
        this.jwtService = jwtService;
        this.jwtUtil = jwtUtil;
    }
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestHeader("Refresh-Token") String refreshToken) {
        return jwtService.refreshTokenRotate(refreshToken);
    }

    @GetMapping("/access")
    public ResponseEntity<?> access(@RequestHeader(value="Authorization", required = false) String accessToken) throws IOException {
        Map<String, Object> responseBody = new HashMap<>();
        if(jwtUtil.validateAccessToken(accessToken)){
            responseBody.put("status",200);
            responseBody.put("message","유효한 토큰입니다.");
            return new ResponseEntity<>(responseBody, HttpStatus.OK);
        }else{
            responseBody.put("status",401);
            responseBody.put("message","토큰 재발급이 필요합니다.");
            return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
        }
    }
}
