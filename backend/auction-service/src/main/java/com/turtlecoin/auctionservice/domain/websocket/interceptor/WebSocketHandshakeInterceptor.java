package com.turtlecoin.auctionservice.domain.websocket.interceptor;

import com.turtlecoin.auctionservice.feign.MainClient;
import com.turtlecoin.auctionservice.feign.dto.UserResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketHandshakeInterceptor implements HandshakeInterceptor {

    private final MainClient mainClient;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        // 예를 들어, 유저의 ID를 쿼리 파라미터에서 가져온다고 가정
        String userId = request.getURI().getQuery().split("=")[1];  // 실제로는 더 안전한 방법 필요
        System.out.println("userID: "+userId);
        // FeignClient를 사용해 메인 서비스에서 nickname 가져오기
        // redis에서 가져올때랑, 아닐때랑 구분해서 시간 설정해줘야함,,
        UserResponseDTO user = mainClient.getUserById(Long.parseLong(userId));
        String nickname = user.getNickname();
        System.out.println("user :"+user);
        System.out.println("nickname :"+nickname);

        if (user != null) {
            attributes.put("nickname", user.getNickname());  // 세션에 nickname 저장
            log.info("유저 nickname 캐싱: {}", user.getNickname());
        } else {
            log.warn("유저 정보를 찾을 수 없습니다.");
        }

        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
        // 핸드셰이크 이후 처리
    }
}