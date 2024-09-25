package com.turtlecoin.mainservice.domain.user.service;

import com.turtlecoin.mainservice.domain.user.dto.LoginUserDto;
import com.turtlecoin.mainservice.domain.user.entity.User;
import com.turtlecoin.mainservice.domain.user.repository.UserRepository;
import com.turtlecoin.mainservice.domain.user.util.JWTUtil;
import com.turtlecoin.mainservice.global.response.ResponseVO;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class JWTService {
    private final JWTUtil jwtUtil;
    private final RedisTemplate<String,String> redisTemplate;
    private final UserRepository userRepository;

    @Autowired
    JWTService(JWTUtil jwtUtil, RedisTemplate<String, String> redisTemplate,UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.redisTemplate = redisTemplate;
        this.userRepository = userRepository;
    }

    public ResponseEntity<?> loginService(LoginUserDto loginUserDto) {
        Optional<User> user = Optional.ofNullable(userRepository.findByemail(loginUserDto.getEmail()));
        if (user.isEmpty() || !user.get().getPassword().equals(loginUserDto.getPassword())) {
            return new ResponseEntity<>(ResponseVO.failure("400", "아이디 또는 비밀번호가 일치하지 않습니다."), HttpStatus.UNAUTHORIZED);
        }


        try{
            // 인증 성공 시 JWT 토큰 생성 및 Redis 저장
            String email = user.get().getEmail(); // "username"을 "email"로 변경;
            String role = user.get().getRole().toString();

            // Access token과 Refresh token 생성
            String access = jwtUtil.createToken("access", email, role, 600000L);
            String refresh = jwtUtil.createToken("refresh", email, role, 86400000L);

            // Redis에 refresh token 저장 (email, 토큰, 만료시간을 함께 저장)
            redisTemplate.opsForValue().set(email, refresh, 86400000L, TimeUnit.SECONDS);

            // 응답 데이터 준비
            Map<String, String> data = new HashMap<>();
            data.put("accessToken", access);
            data.put("refreshToken", refresh);
            data.put("role", role);

            ResponseVO<Map<String, String>> responseVO = ResponseVO.success("로그인 성공", data);
            return new ResponseEntity<>(responseVO, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(ResponseVO.failure("500","서버 에러 발생"),HttpStatus.INTERNAL_SERVER_ERROR);
        }



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
