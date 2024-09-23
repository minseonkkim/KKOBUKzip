package com.turtlecoin.auctionservice.global.config;

import feign.RequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {
    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            // JWT 또는 다른 인증 토큰을 헤더에 추가
            requestTemplate.header("Authorization", "Bearer " + "your-jwt-token");
        };
    }
}
