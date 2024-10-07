package com.turtlecoin.mainservice.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.turtlecoin.mainservice.domain.user.util.JWTUtil;
import com.turtlecoin.mainservice.global.interceptor.CustomChannelInterceptor;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
	private final JWTUtil jwtUtil;
	private final CustomChannelInterceptor customChannelInterceptor;

	@Override
	public void configureMessageBroker(MessageBrokerRegistry config) {
		config.enableSimpleBroker("/sub"); //메세지 받을 때 경로
		config.setApplicationDestinationPrefixes("/pub", "/sub"); //메세지 보낼 때 경로
	}
	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/ws/main") //우리의 endpoint
			.setAllowedOrigins("*");
		//System.out.println("registry: "+registry);
		//                .addInterceptors(handshakeInterceptor); // 핸드셰이크 인터셉터 추가
	}
	@Override
	public void configureClientInboundChannel(ChannelRegistration registration) {
		// STOMP 연결 시 Interceptor 적용
		registration.interceptors(customChannelInterceptor);
	}
}