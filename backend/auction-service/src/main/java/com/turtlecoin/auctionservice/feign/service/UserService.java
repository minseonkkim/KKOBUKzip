package com.turtlecoin.auctionservice.feign.service;

import com.turtlecoin.auctionservice.feign.MainClient;
import com.turtlecoin.auctionservice.feign.dto.UserResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class UserService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final MainClient mainClient;

    public String getUserNicknameById(Long userId) {
        String cacheKey = "user_" + userId;
        String userNickname = (String) redisTemplate.opsForValue().get(cacheKey);
        if (userNickname == null) {
            userNickname = mainClient.getUserNicknameById(userId);
            redisTemplate.opsForValue().set(cacheKey, userNickname, 5, TimeUnit.MINUTES); // TTL 10분 설정
            System.out.println("Main-service에서 가져오기");
        }
        return userNickname;
    }
}
