package com.turtlecoin.mainservice.global.filter;


import com.turtlecoin.mainservice.domain.user.dto.CustomUserDetails;
import com.turtlecoin.mainservice.domain.user.entity.User;
import com.turtlecoin.mainservice.domain.user.repository.UserRepository;
import com.turtlecoin.mainservice.domain.user.util.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JWTFilter extends OncePerRequestFilter {
    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;
    public JWTFilter(JWTUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String accessToken = request.getHeader("Authorization");
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        String requestPath = httpServletRequest.getRequestURI();

        // /jwt/access 경로는 필터링하지 않음
        if ("/jwt/access".equals(requestPath)) {
            filterChain.doFilter(request, response);
            return;
        }
        // 토큰이 없다면 다음 필터로 넘김
        if (accessToken == null) {
            filterChain.doFilter(request, response);
            return;
        }

        // JWT 검증
        if (!jwtUtil.validateAccessToken(accessToken)) {
            return;  // 토큰이 유효하지 않으면 요청 중단
        }

        // 인증 정보를 설정
        setAuthentication(accessToken);

        // 다음 필터로 넘김
        filterChain.doFilter(request, response);
    }

    // 인증 정보 설정 로직
    private void setAuthentication(String token) {
        // username, role 값을 획득
        String username = jwtUtil.getUsernameFromToken(token);
        String role = jwtUtil.getRoleFromToken(token);

        // username으로 UserService에서 사용자 정보 조회
        User userEntity = userRepository.findByusername(username);

        // 사용자 정보를 바탕으로 CustomUserDetails 생성 & 인증 설정
        CustomUserDetails customUserDetails = new CustomUserDetails(userEntity);

        // 스프링 시큐리티의 Authentication 객체 생성
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);
    }
}
