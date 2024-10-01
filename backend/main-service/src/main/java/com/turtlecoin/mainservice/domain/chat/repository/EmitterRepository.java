package com.turtlecoin.mainservice.domain.chat.repository;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Repository
public class EmitterRepository {
	private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

	public void save(Long id, SseEmitter emitter) {
		emitters.put(id, emitter);
	}

	public SseEmitter get(Long id) {
		return emitters.get(id);
	}

	public void deleteById(Long id) {
		emitters.remove(id);
	}
}
