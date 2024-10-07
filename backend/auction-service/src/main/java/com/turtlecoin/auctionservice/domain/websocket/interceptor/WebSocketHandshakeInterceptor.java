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
        // 쿼리에서 토큰 추출
        String query = request.getURI().getQuery();
        String token = extractTokenFromQuery(query);

        log.info("Token from query: {}", token);

        if (token == null || !jwtUtil.validateAccessToken(token)) {
            log.warn("JWT 토큰이 유효하지 않습니다.");
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }

        Long userId = jwtUtil.getIdFromToken(token);
//        String nickname = jwtUtil.getUsernameFromToken(token);

//        log.info("nickname: {}", nickname);
        log.info("userId: {}", userId);

        UserResponseDTO user = mainClient.getUserById(userId);
        if (user != null) {
            String nickname = user.getNickname();
            attributes.put("nickname", nickname);
            log.info("유저 nickname 캐싱: {}", nickname);
        } else {
            log.warn("유저 정보를 찾을 수 없습니다.");
        }

        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
//        // URI에서 경매 ID와 userId 추출
//        String uri = request.getURI().toString();
//        log.info("uri: {}", uri);
//        String query = request.getURI().getQuery();
//        String auctionId = extractAuctionId(query);
////        Long userId = extractUserId(query);  // 사용자 ID 추출 로직 추가
//
//        // Redis에서 경매 남은 시간 가져오기
//        Long remainingTime = redisTemplate.getExpire(AUCTION_END_KEY_PREFIX + auctionId, TimeUnit.MILLISECONDS);
//
//        if (remainingTime != null && remainingTime > 0) {
//            // 추출한 경매 ID와 남은 시간, 사용자 ID로 남은 시간을 전송
//
////            messagingService.sendRemainingTimeToUser(userId, auctionId, remainingTime);
//        }
    }

    private String extractAuctionId(String query) {
        if (query == null) {
            throw new IllegalArgumentException("쿼리 문자열이 비어 있습니다.");
        }
        log.info("query: {}", query);
        String[] queryParams = query.split("&");
        for (String param : queryParams) {
            if (param.startsWith("auctionId=")) {
                String[] auctionParam = param.split("=");
                if (auctionParam.length == 2) {
                    return auctionParam[1];
                } else {
                    throw new IllegalArgumentException("경매 ID가 올바르지 않습니다.");
                }
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

    private String extractTokenFromQuery(String query) {
        if (query == null) {
            return null;
        }

        String[] queryParams = query.split("&");
        for (String param : queryParams) {
            if (param.startsWith("token=")) {
                return param.split("=")[1];
            }
        }
        return null;
    }
}