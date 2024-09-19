package com.turtlecoin.mainservice.domain.user.service;

import com.turtlecoin.mainservice.domain.user.util.JWTUtil;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class JWTService {
    private final JWTUtil jwtUtil;
    private final RedisTemplate<String,String> redisTemplate;
    @Autowired
    JWTService(JWTUtil jwtUtil, RedisTemplate<String, String> redisTemplate) {
        this.jwtUtil = jwtUtil;
        this.redisTemplate = redisTemplate;
    }

    // accessToken 재발급 요청
    public ResponseEntity<?> refreshTokenRotate(String refreshToken){
        //refreshToken 유효성 확인
        if(refreshToken == null) {
            return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);
        }

        // Check token format
        String[] parts = refreshToken.split(" ");
        if (parts.length == 2 && "Bearer".equals(parts[0])) {
            refreshToken = parts[1];
        }else{
            return new ResponseEntity<>("Invalid token format", HttpStatus.BAD_REQUEST);
        }

        // Check Token expired
        try {
            jwtUtil.isTokenExpired(refreshToken);
        } catch (ExpiredJwtException e) {
            return new ResponseEntity<>("refresh token expired", HttpStatus.UNAUTHORIZED);
        }

        // Redis에서 refresh token 조회
        ValueOperations<String, String> valueOps = redisTemplate.opsForValue();
        String storedToken = valueOps.get(jwtUtil.getUsernameFromToken(refreshToken)); // Key 패턴에 맞게 수정

        if (storedToken == null || !storedToken.equals(refreshToken)) {
            return new ResponseEntity<>("Invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        String username = jwtUtil.getUsernameFromToken(refreshToken);
        String role = jwtUtil.getRoleFromToken(refreshToken);

        //make new JWT
        String newAccess = jwtUtil.createToken("access",username,role,600000L);
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("status",200);
        responseBody.put("message","요청이 정상적으로 처리되었습니다.");

        Map<String, String> data = new HashMap<>();
        data.put("accessToken", newAccess);
        responseBody.put("data", data);

        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }
}
