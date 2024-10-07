package com.turtlecoin.mainservice.global.util;

import java.security.Principal;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Component;
import org.springframework.messaging.simp.user.SimpUser;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class WebSocketUtil {
	private final SimpUserRegistry simpUserRegistry;
	private final RedisTemplate<String ,String> redisTemplate;

	// 특정 유저 연결 확인
	public boolean isUserConnected(String userId) {
		SimpUser user = simpUserRegistry.getUser(userId);
		return user != null;
	}

	// 현재 접속 중인 모든 유저 반환
	public List<String> getConnectedUsers() {
		return simpUserRegistry.getUsers().stream()
			.map(SimpUser::getName)
			.collect(Collectors.toList());
	}

	// 웹소켓 종료를 반응해서 로직 수행
	@EventListener
	public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
		StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

		// 세션에서 사용자 ID 가져오기
		Principal principal = headerAccessor.getUser();
		if (principal != null) {
			String userId = principal.getName();  // CustomPrincipal에서 userId 가져오기

			// 유저가 구독한 주소 삭제
			redisTemplate.opsForHash().delete("userId:" + userId, "room");

			// TTL(만료 시간)도 삭제
			redisTemplate.delete("user:" + userId);
			// System.out.println(userId);
		}
	}
}
