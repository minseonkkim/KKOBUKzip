package com.turtlecoin.auctionservice.domain.websocket.config;


import com.turtlecoin.auctionservice.domain.websocket.interceptor.WebSocketHandshakeInterceptor;
import com.turtlecoin.auctionservice.feign.MainClient;
import com.turtlecoin.auctionservice.global.utils.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.*;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JWTUtil jwtUtil;
    private final MainClient mainClient;
    private final RedisTemplate redisTemplate;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/sub", "/queue"); // 메세지 받을 때 경로
        config.setApplicationDestinationPrefixes("/pub"); // 메세지 보낼 때 경로
        config.setUserDestinationPrefix("/user"); // user로 사용자 경로 구분

    }
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws/auction")
                .setAllowedOrigins("*")
                .setHandshakeHandler(new DefaultHandshakeHandler() {
                    @Override
                    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
                        return (Principal) attributes.get("principal");
                    }
                })
                .addInterceptors(new WebSocketHandshakeInterceptor(jwtUtil, mainClient, redisTemplate));
    }
    @Override
    public void configureClientInboundChannel(org.springframework.messaging.simp.config.ChannelRegistration registration) {
//        registration.interceptors(jwtChannelInterceptor); // STOMP 메시지 인터셉터 추가
    }

}
