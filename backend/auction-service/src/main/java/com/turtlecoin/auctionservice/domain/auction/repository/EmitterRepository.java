package com.turtlecoin.auctionservice.domain.auction.repository;

import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class EmitterRepository {
    // SSE는 어짜피 메모리에서 관리하기 때문에 Map써서 관리한다.
    private final Map<Long, List<SseEmitter>> emitters = new ConcurrentHashMap<>();

    public void save(Long id, SseEmitter emitter) {
        if(!emitters.containsKey(id)) {
            emitters.put(id, new ArrayList<>());
        }
        emitters.get(id).add(emitter);
    }

    public List<SseEmitter> get(Long id) {

        return emitters.get(id);
    }

    public void deleteById(Long id) {
        emitters.remove(id);
    }
}
