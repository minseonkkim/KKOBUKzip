package com.turtlecoin.apigatewayservice.util;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JWTUtil {
    private final SecretKey secretKey;
    public JWTUtil(@Value("${spring.jwt.secret}") String secret) {
        secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
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
    public Boolean isTokenExpired(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration().before(new Date());
    }

    public String createToken(String category, String username, String role,Long exp) {
        return Jwts.builder()
                .claim("category", category)
                .claim("username",username)
                .claim("role",role)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+exp))
                .signWith(secretKey)
                .compact();
    }

    // accessToken 검증 로직
    public Boolean validateAccessToken(String token) throws IOException {
        String tokens[] = token.split(" ");
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
}