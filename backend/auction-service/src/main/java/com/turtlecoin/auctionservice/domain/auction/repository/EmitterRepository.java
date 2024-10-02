package com.turtlecoin.auctionservice.domain.auction.repository;

import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import com.turtlecoin.auctionservice.domain.global.internal.EmitterMapper;

import lombok.AllArgsConstructor;

@Repository
public class EmitterRepository {
    // SSE는 어짜피 메모리에서 관리하기 때문에 Map써서 관리한다.
    private final Map<Long, List<EmitterMapper>> emitters = new ConcurrentHashMap<>();

    public String save(Long id, SseEmitter emitter) {
        if(!emitters.containsKey(id)) {
            // 조회 성능상 링크드 리스트가 나을듯
            emitters.put(id, new LinkedList<>());
        }
        String uuid = UUID.randomUUID().toString();
        emitters.get(id).add(new EmitterMapper(uuid, emitter));
        return uuid;
    }

    public List<EmitterMapper> get(Long id) {
        return emitters.get(id);
    }

    public void deleteByIdAndUUID(Long id, String uuid) {
        List<EmitterMapper> mappers = emitters.get(id);
        for(EmitterMapper mapper : mappers) {
            if(mapper.getUuid().equals(uuid)) {
                mappers.remove(mapper);
                return;
            }
        }
    }
}
