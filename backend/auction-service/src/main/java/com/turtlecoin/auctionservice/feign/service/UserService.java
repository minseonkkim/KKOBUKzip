package com.turtlecoin.auctionservice.feign.service;

import com.turtlecoin.auctionservice.feign.MainClient;
import com.turtlecoin.auctionservice.feign.dto.UserResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final MainClient mainClient;

    public String getUserNicknameById(Long userId) {
        String cacheKey = "user_" + userId;
        String userNickname = (String) redisTemplate.opsForValue().get(cacheKey);
        if (userNickname == null) {
            // 정보가 없으면 main-service에서, 있으면 캐시에서.
            // 어떻게 가져오느냐에 따라서 시간 설정을 다르게 해줄 필요가 있음
            userNickname = mainClient.getUserNicknameById(userId);
            redisTemplate.opsForValue().set(cacheKey, userNickname, 5, TimeUnit.MINUTES); // TTL 5분 설정
            log.info("Main-service에서 가져오기");
            return userNickname;
        }
        log.info("Redis에서 가져오기");
        return userNickname;
    }
}
