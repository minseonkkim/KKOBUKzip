package com.turtlecoin.mainservice.domain.chat.controller;

import java.util.StringTokenizer;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.turtlecoin.mainservice.domain.chat.dto.ChatRequestDto;
import com.turtlecoin.mainservice.domain.chat.repository.ChatRepository;
import com.turtlecoin.mainservice.domain.chat.service.ChatService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class MessageController {
	private final ChatService chatService;

	@MessageMapping("/main/ws")
	@SendTo("/topic/chat/{roomId}")  // roomId로 구독
	public void connect(
		@Header("chattingId") String chattingId,
		@Header("type") String type) {

		StringTokenizer st = new StringTokenizer(chattingId, "-");
		Long smallUserId = Long.valueOf(st.nextToken());
		Long bigUserId = Long.valueOf(st.nextToken());

		// 채팅 DB가 없으면 새로 생성하기
		try{
			if(chatService.isChatExists(smallUserId, bigUserId)){
				return;
			}
			else{
				chatService.createChat(smallUserId, bigUserId);
			}
		}
		catch(Exception e){
			//e.printStackTrace();
		}
	}

	@MessageMapping("/chat/{chattingId}") // 클라이언트가 이 경로로 메시지를 전송합니다.
	@SendTo("/chatting/{chattingId}") // 클라이언트가 이 주제를 구독할 때 메시지를 전송합니다.
	public ChatRequestDto sendMessage(@DestinationVariable String chattingId, ChatRequestDto message) {
		// 메시지를 DB에 저장하는 로직을 추가할 수 있습니다.
		// 예: chatService.saveMessage(message);
		return message; // 구독자에게 메시지 전송
	}
}