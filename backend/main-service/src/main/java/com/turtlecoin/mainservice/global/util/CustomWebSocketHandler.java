package com.turtlecoin.mainservice.global.util;

import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class CustomWebSocketHandler extends TextWebSocketHandler {
	private final SimpUserRegistry simpUserRegistry;

	public CustomWebSocketHandler(SimpUserRegistry simpUserRegistry) {
		this.simpUserRegistry = simpUserRegistry;
	}

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		// 사용자가 연결되었을 때
		super.afterConnectionEstablished(session);
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		// 사용자가 연결을 끊었을 때
		super.afterConnectionClosed(session, status);
	}

	public boolean isUserConnected(String userId) {
		return simpUserRegistry.getUsers().stream()
			.anyMatch(user -> user.getName().equals(userId));
	}
}
