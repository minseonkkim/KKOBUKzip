package com.turtlecoin.mainservice.domain.chat.service;

import java.util.concurrent.CompletableFuture;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.turtlecoin.mainservice.domain.chat.repository.EmitterRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SseService {
	private static final Long DEFAULT_TIMEOUT = 60L * 1000 * 60;
	private final EmitterRepository emitterRepository;

	public SseEmitter subscribe(Long userId) {
		SseEmitter emitter = createEmitter(userId);
		return emitter;
	}

	public void notify(Long userId, Object event) {
		sendToClient(userId, event);
	}

	private void sendToClient(Long id, Object data) {
		SseEmitter emitter = emitterRepository.get(id);
		if (emitter != null) {
			CompletableFuture.runAsync(() -> {
				try {
					emitter.send(SseEmitter.event().id(String.valueOf(id)).name("sse").data(data));
				} catch (Exception e) {
					emitter.completeWithError(e);
					emitterRepository.deleteById(id);
				}
			});
		}
	}

	private SseEmitter createEmitter(Long id) {
		SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);
		emitterRepository.save(id, emitter);

		// SSE 종료
		emitter.onCompletion(() -> emitterRepository.deleteById(id));
		emitter.onTimeout(() -> emitterRepository.deleteById(id));
		emitter.onError((e) -> emitterRepository.deleteById(id));

		return emitter;
	}
}
