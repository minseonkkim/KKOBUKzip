package com.turtlecoin.apigatewayservice.filter;

import com.turtlecoin.apigatewayservice.util.JWTUtil;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class AuthorizationHeaderFilter extends AbstractGatewayFilterFactory<AuthorizationHeaderFilter.Config> {
    private final JWTUtil jwtUtil;
    public AuthorizationHeaderFilter(JWTUtil jwtUtil) {
        super(Config.class);  // Config 클래스를 상위 클래스에 전달
        System.out.println("검증 시작1");
        this.jwtUtil = jwtUtil;
    }
    public static class Config {
    }
    @Override
    public GatewayFilter apply(AuthorizationHeaderFilter.Config config) {
        System.out.println("검증 시작2");
        return (exchange,chain)->{
            // 1. 요청 헤더에서 Authorization 헤더를 가져옴
            String authorizationHeader = exchange.getRequest().getHeaders().getFirst("Authorization");

//            // 2. 헤더가 없으면 UNAUTHORIZED 응답 반환
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return onError(exchange, "Authorization header is missing or invalid", HttpStatus.UNAUTHORIZED);
            }

            // 3. 토큰을 추출하고 검증
            String token = authorizationHeader.replace("Bearer ", "");

//            // accessToken 검증 (토큰이 유효하지 않으면 UNAUTHORIZED 반환)
            try {
                if (!jwtUtil.validateAccessToken(token)) {
                    return onError(exchange, "JWT token is invalid", HttpStatus.UNAUTHORIZED);
                }
            } catch (IOException e) {
                return onError(exchange, "JWT token validation failed", HttpStatus.UNAUTHORIZED);
            }

            // 4. 토큰에서 사용자 정보 및 권한 추출
            String username = jwtUtil.getUsernameFromToken(token);
            String role = jwtUtil.getRoleFromToken(token);


            // 6. 필터 체인에 요청을 넘김
            return chain.filter(exchange);
        };
    }


    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        exchange.getResponse().setStatusCode(httpStatus);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

        // JSON 응답 바디 생성
        String jsonResponse = String.format("{\"status\": %d, \"message\": \"%s\"}", httpStatus.value(), err);

        // 응답 바디에 JSON 쓰기
        byte[] bytes = jsonResponse.getBytes(StandardCharsets.UTF_8);
        return exchange.getResponse().writeWith(Mono.just(exchange.getResponse().bufferFactory().wrap(bytes)));
    }
}
