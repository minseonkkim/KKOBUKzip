package com.turtlecoin.auctionservice.global.utils;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JWTUtil {
    private final RedisTemplate redisTemplate;
    private SecretKey secretKey;
    public JWTUtil(@Value("${spring.jwt.secret}") String secret, @Qualifier("redisTemplate") RedisTemplate redisTemplate) {
        secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
        this.redisTemplate = redisTemplate;
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("username", String.class);
    }
    public String getRoleFromToken(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("role", String.class);
    }
    public String getCategoryFromToken(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("category", String.class);
    }
    public Long getIdFromToken(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("id", Long.class);
    }
    public String getUuidFromToken(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("uuid", String.class);
    }
    public Boolean isTokenExpired(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration().before(new Date());
    }

    public String createToken(String category, String username, String role,Long id, String uuid, Long exp) {
        return Jwts.builder()
                .claim("category", category)
                .claim("username",username)
                .claim("role",role)
                .claim("id",id)
                .claim("uuid",uuid)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+exp))
                .signWith(secretKey)
                .compact();
    }

    // accessToken 검증 로직
    public Boolean validateAccessToken(String token) throws IOException {
        String tokens[] = token.split(" ");
        System.out.println("token : "+token);
        if(token==null||!"Bearer".equals(tokens[0])){
            System.out.println("token format is wrong");
            return false;
        }
        token = tokens[1];
        try {
            isTokenExpired(token);  // 토큰 만료 여부 확인
        } catch (ExpiredJwtException e) {
            System.out.println("token is expired");
            return false;
        }

        // 토큰이 access 토큰인지 확인
        String category = getCategoryFromToken(token);
        if (!category.equals("access")) {
            System.out.println("category is not access");
            return false;
        }

        return true;  // 토큰이 유효함
    }
    public Boolean validateRefreshToken(String token) {
        try {
            // Bearer 토큰 형식 처리
            String[] tokens = token.split(" ");
            if (tokens.length != 2 || !tokens[0].equalsIgnoreCase("Bearer")) {
                return false;  // 토큰 형식이 잘못됨
            }
            token = tokens[1];  // 실제 토큰 부분
            // Redis에서 저장된 토큰 조회
            ValueOperations<String, String> valueOps = redisTemplate.opsForValue();
            String username = getUsernameFromToken(token);  // 토큰에서 username 추출
            String storedToken = valueOps.get(username);  // username을 키로 사용하여 Redis에서 조회

            // 저장된 토큰과 비교
            return storedToken != null && storedToken.equals(token);  // 유효성 검증

        } catch (Exception e) {
            e.printStackTrace();  // 예외 발생 시 로그를 기록하거나 적절한 처리를 추가
            return false;
        }
    }

}
