//package com.turtlecoin.apigatewayservice.filter;
//
//import com.turtlecoin.apigatewayservice.util.JWTUtil;
//import org.springframework.cloud.gateway.filter.GatewayFilter;
//import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
//import org.springframework.http.HttpStatus;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Component;
//import org.springframework.web.server.ServerWebExchange;
//import reactor.core.publisher.Mono;
//import org.springframework.security.core.Authentication;
//
//import java.io.IOException;
//import java.util.Collections;
//
//@Component
//public class AuthorizationHeaderFilter extends AbstractGatewayFilterFactory<AuthorizationHeaderFilter.Config> {
//    private final JWTUtil jwtUtil;
//    public AuthorizationHeaderFilter(JWTUtil jwtUtil) {
//        super(Config.class);  // Config 클래스를 상위 클래스에 전달
//        System.out.println("검증 시작1");
//        this.jwtUtil = jwtUtil;
//    }
//    public static class Config {
//    }
//    @Override
//    public GatewayFilter apply(AuthorizationHeaderFilter.Config config) {
//        System.out.println("검증 시작2");
//        return (exchange,chain)->{
//            // 1. 요청 헤더에서 Authorization 헤더를 가져옴
//            String authorizationHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
//
////            // 2. 헤더가 없으면 UNAUTHORIZED 응답 반환
////            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
////                return onError(exchange, "Authorization header is missing or invalid", HttpStatus.UNAUTHORIZED);
////            }
//
//            // 3. 토큰을 추출하고 검증
//            String token = authorizationHeader.replace("Bearer ", "");
//
////            // accessToken 검증 (토큰이 유효하지 않으면 UNAUTHORIZED 반환)
////            try {
////                if (!jwtUtil.validateAccessToken(token)) {
////                    return onError(exchange, "JWT token is invalid", HttpStatus.UNAUTHORIZED);
////                }
////            } catch (IOException e) {
////                return onError(exchange, "JWT token validation failed", HttpStatus.UNAUTHORIZED);
////            }
//
//            // 4. 토큰에서 사용자 정보 및 권한 추출
//            String username = jwtUtil.getUsernameFromToken(token);
//            String role = jwtUtil.getRoleFromToken(token);
//
//            // 5. 인증 정보를 설정
//            setAuthentication(username, role);
//
//            // 6. 필터 체인에 요청을 넘김
//            return chain.filter(exchange);
//        };
//    }
//
//    // 인증 정보 설정 메서드
//    private void setAuthentication(String username, String role) {
//        // GrantedAuthority로 변환
//        GrantedAuthority authority = new SimpleGrantedAuthority(role);
//
//        // UsernamePasswordAuthenticationToken 생성
//        Authentication authToken = new UsernamePasswordAuthenticationToken(username, null, Collections.singletonList(authority));
//        SecurityContextHolder.getContext().setAuthentication(authToken);
//    }
//
//    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
//        exchange.getResponse().setStatusCode(httpStatus);
//        return exchange.getResponse().setComplete();
//    }
//}
