package com.turtlecoin.mainservice.domain.user.filter;


import com.turtlecoin.mainservice.domain.user.util.JWTUtil;
import com.turtlecoin.mainservice.domain.user.util.ResponseUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;
import java.util.concurrent.TimeUnit;

public class LoginFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final RedisTemplate<String,String> redisTemplate;

    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil, RedisTemplate<String,String> redisTemplate) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil=jwtUtil;
        this.redisTemplate =redisTemplate;
    }
    @Override
    public Authentication attemptAuthentication(HttpServletRequest req, HttpServletResponse res) throws AuthenticationException {
        //클라이언트 요청에서 username, password 추출
        String username = obtainUsername(req);
        String password = obtainPassword(req);

        //스프링 시큐리티에서 username과 password를 검증하기 위해서는 token에 담아야 함 .
        UsernamePasswordAuthenticationToken autoToken = new UsernamePasswordAuthenticationToken(username, password,null);

        //token에 담은 검증을 위한 AuthenticationManager로 전달
        return authenticationManager.authenticate(autoToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException, ServletException {
        String username = authentication.getName();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        String access = jwtUtil.createToken("access",username,role,600000L);
        String refresh = jwtUtil.createToken("refresh",username,role,86400000L);

        // Redis에 refresh token 저장 (유저명, 토큰, 만료시간을 함께 저장)
        redisTemplate.opsForValue().set(username, refresh, 86400000L, TimeUnit.SECONDS);
        response.setStatus(HttpStatus.OK.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // 응답을 위한 JSON 데이터를 구성
        String jsonResponse = String.format("{\"status\": 200, \"message\": \"요청이 정상적으로 수행되었습니다.\", \"data\": {\"accessToken\": \"%s\", \"refreshToken\": \"%s\", \"role\": \"%s\"}}", access, refresh, role);

        // 응답 본문에 JSON 데이터 작성
        response.getWriter().write(jsonResponse);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        ResponseUtil.sendResponse(response,401,"로그인에 실패하였습니다.");
    }
}

