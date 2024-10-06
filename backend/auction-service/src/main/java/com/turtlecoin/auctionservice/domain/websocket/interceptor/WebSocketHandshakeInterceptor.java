package com.turtlecoin.auctionservice.domain.websocket.interceptor;

import com.turtlecoin.auctionservice.feign.MainClient;
import com.turtlecoin.auctionservice.feign.dto.UserResponseDTO;
import com.turtlecoin.auctionservice.global.utils.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketHandshakeInterceptor implements HandshakeInterceptor {

    private final JWTUtil jwtUtil;
    private final MainClient mainClient;
    private final RedisTemplate redisTemplate;
    private static final String AUCTION_END_KEY_PREFIX = "auction_end_";

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        // JWT 토큰 검증 추가
        String authHeader = request.getHeaders().getFirst("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("Authorization 헤더가 없습니다.");
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.validateAccessToken(token)) {
            log.warn("JWT 토큰이 유효하지 않습니다.");
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }

        // JWT에서 사용자 정보 추출
        Long userId = jwtUtil.getIdFromToken(token);
        String nickname = jwtUtil.getUsernameFromToken(token);

        // 메인 서비스에서 추가 사용자 정보 가져오기
        UserResponseDTO user = mainClient.getUserById(userId);
        if (user != null) {
            attributes.put("nickname", nickname);  // WebSocket 세션에 사용자 닉네임 저장
            log.info("유저 nickname 캐싱: {}", nickname);
        } else {
            log.warn("유저 정보를 찾을 수 없습니다.");
        }

        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
        // URI에서 경매 ID와 userId 추출
        String query = request.getURI().getQuery();
        String auctionId = extractAuctionId(query);
        Long userId = extractUserId(query);  // 사용자 ID 추출 로직 추가

        // Redis에서 경매 남은 시간 가져오기
        Long remainingTime = redisTemplate.getExpire(AUCTION_END_KEY_PREFIX + auctionId, TimeUnit.MILLISECONDS);

        if (remainingTime != null && remainingTime > 0) {
            // 추출한 경매 ID와 남은 시간, 사용자 ID로 남은 시간을 전송

//            messagingService.sendRemainingTimeToUser(userId, auctionId, remainingTime);
        }
    }

    private String extractAuctionId(String query) {
        // 실제로 URI 쿼리에서 안전하게 auctionId를 추출하는 로직 필요
        // 예시: "auctionId=1234"에서 1234 추출
        String[] queryParams = query.split("&");
        for (String param : queryParams) {
            if (param.startsWith("auctionId=")) {
                return param.split("=")[1];
            }
        }
        throw new IllegalArgumentException("경매 ID를 찾을 수 없습니다.");
    }

    private Long extractUserId(String query) {
        // URI 쿼리에서 안전하게 userId 추출
        String[] queryParams = query.split("&");
        for (String param : queryParams) {
            if (param.startsWith("userId=")) {
                return Long.parseLong(param.split("=")[1]);
            }
        }
        throw new IllegalArgumentException("사용자 ID를 찾을 수 없습니다.");
    }
}