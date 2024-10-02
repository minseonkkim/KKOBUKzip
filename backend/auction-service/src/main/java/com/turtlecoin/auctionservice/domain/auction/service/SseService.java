package com.turtlecoin.auctionservice.domain.auction.service;

import com.turtlecoin.auctionservice.domain.auction.repository.EmitterRepository;
import com.turtlecoin.auctionservice.domain.global.internal.EmitterMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SseService {
    private static final Long DEFAULT_TIMEOUT = 60L * 1000 * 60;
    private final EmitterRepository emitterRepository;

    public SseEmitter subscribe(Long auctionId) {
        SseEmitter emitter = createEmitter(auctionId);
        sendToClient(auctionId, "EventStream Created. [auctionId=" + auctionId + "]");
        return emitter;
    }

    public void notify(Long auctionId, Object event) {
        sendToClient(auctionId, event);
    }

    private void sendToClient(Long id, Object data) {
        // id 에 연결된 모든 SSE에게 메세지 전송
        List<EmitterMapper> mappers = emitterRepository.get(id);
        for(EmitterMapper mapper : mappers) {
            SseEmitter emitter = mapper.getEmitter();
            if (emitter != null) {
                try {
                    emitter.send(SseEmitter.event().id(String.valueOf(id)).name("sse").data(data.toString()));
                }
                catch (Exception e) {
                    new Thread(() -> {
                        emitterRepository.deleteByIdAndUUID(id, mapper.getUuid());
                        emitter.completeWithError(e);
                    }).start();
                }
            }
        }
    }

    private SseEmitter createEmitter(Long id) {
        SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);
        String uuid =  emitterRepository.save(id, emitter);

        // SSE 종료
        emitter.onCompletion(() -> emitterRepository.deleteByIdAndUUID(id, uuid));
        emitter.onTimeout(() -> emitterRepository.deleteByIdAndUUID(id, uuid));
        emitter.onError((e) -> emitterRepository.deleteByIdAndUUID(id, uuid));

        return emitter;
    }
}

