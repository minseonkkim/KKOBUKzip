package com.turtlecoin.mainservice.domain.chat.controller;

import java.security.Principal;
import java.util.StringTokenizer;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import com.turtlecoin.mainservice.domain.chat.dto.ChatListDto;
import com.turtlecoin.mainservice.domain.chat.dto.ChatRequestDto;
import com.turtlecoin.mainservice.domain.chat.dto.ChatTextResponseDto;
import com.turtlecoin.mainservice.domain.chat.entity.ChatTextMessage;
import com.turtlecoin.mainservice.domain.chat.service.ChatService;
import com.turtlecoin.mainservice.domain.chat.service.SseService;
import com.turtlecoin.mainservice.domain.user.dto.UserResponseDTO;
import com.turtlecoin.mainservice.domain.user.service.UserService;
import com.turtlecoin.mainservice.domain.user.util.JWTUtil;
import com.turtlecoin.mainservice.global.response.ResponseVO;
import com.turtlecoin.mainservice.global.util.WebSocketUtil;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class MessageController {
	private final ChatService chatService;
	private final SimpMessagingTemplate messagingTemplate;
	private final UserService userService;
	private final SseService sseService;
	private final WebSocketUtil webSocketUtil;
	private final JWTUtil jwtUtil;
	private final RedisTemplate<String, String> redisTemplate;

	@SubscribeMapping("/main/{chattingId}")  // 특정 방에 대한 구독 처리
	public void handleSubscribe(SimpMessageHeaderAccessor headerAccessor, @DestinationVariable String chattingId) {
		// 세션에서 사용자 ID 가져오기
		Principal principal = headerAccessor.getUser();
		if (principal != null) {
			String userId = principal.getName();  // CustomPrincipal에서 userId 가져오기

			// 유저가 구독한 주소 저장 (예: DB 또는 메모리)
			redisTemplate.opsForHash().put("userId:" + userId, "room", chattingId);
			// TTL(만료 시간) 설정
			redisTemplate.expire("user:" + userId, 60, TimeUnit.MINUTES);
		}
	}

	// (/pub/main/{chattingID})
	@MessageMapping("/main/{chattingId}")
	public void sendMessage(@DestinationVariable String chattingId, ChatRequestDto chatRequestDto, @Header("Authorization") String token) {
		Long userId = chatRequestDto.getUserId();
		String message = chatRequestDto.getMessage();

		StringTokenizer st = new StringTokenizer(chattingId, "-");
		Long smallUserId = Long.parseLong(st.nextToken());
		Long bigUserId = Long.parseLong(st.nextToken());

		ChatTextMessage chatTextMessage = null;
		UserResponseDTO me = null;
		String image = null;
		try {
			// 내 유저 정보를 확인
			me = userService.getByUserId(smallUserId.equals(userId) ? smallUserId : bigUserId);
			Long jwtUserId = jwtUtil.getIdFromToken(token.substring(7));
			// jwt인증이 안되면 에러
			if(!jwtUserId.equals(userId)) {
				messagingTemplate.convertAndSend("/sub/main/" + chattingId,
					ResponseVO.failure("401", "인증 정보가 유효하지 않습니다."));
				return;
			}


			image = userService.getProfileImageByUserId(userId);
			// DB에 데이터 저장하기
			chatTextMessage = chatService.addChatTextMessage(smallUserId, bigUserId, userId, message);

		} catch (Exception e) {
			// 에러 발생 시 에러 메시지를 클라이언트로 전송
			messagingTemplate.convertAndSend("/sub/main/" + chattingId,
				ResponseVO.failure("500", "데이터 저장 중 오류가 발생했습니다."));
			return;
		}

		try{
			// 저장한 값을 전송한다.
			ChatTextResponseDto chatTextResponseDto = ChatTextResponseDto.builder()
				.userId(chatTextMessage.getSender())
				.message(chatTextMessage.getText())
				.registTime(chatTextMessage.getRegistTime())
				.userProfile(image)
				.nickname(me == null ? null : me.getNickname())
				.build();
			messagingTemplate.convertAndSend("/sub/main/" + chattingId, chatTextResponseDto);


			Long opponentUserId = smallUserId.equals(userId) ? bigUserId : smallUserId;
			String roomId = (String) redisTemplate.opsForHash().get("userId:" + opponentUserId, "room");
			// 상대방이 현재 방에 접속중이 아니면
			if(!webSocketUtil.isUserConnected("" + opponentUserId) || !chattingId.equals(roomId)){
				UserResponseDTO user = userService.getByUserId(opponentUserId);
				// 안읽은 횟수를 증가시켜주고
				chatService.addUnreadCount(smallUserId, bigUserId, opponentUserId);
			}
			// SSE 메세지를 보내줘야 함
			ChatListDto chatListDto = chatService.chattingRoomList(smallUserId, bigUserId, opponentUserId);
			sseService.notify(opponentUserId, chatListDto);
			ChatListDto myChatListDto = chatService.chattingRoomList(smallUserId, bigUserId, userId);
			sseService.notify(userId, myChatListDto);
		} catch (Exception e){
			e.printStackTrace();
			messagingTemplate.convertAndSend("/sub/main/" + chattingId,
				ResponseVO.failure("500", "전송 중 오류가 발생했습니다."));
			return;
		}
	}

}