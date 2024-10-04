package com.turtlecoin.mainservice.domain.chat.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.turtlecoin.mainservice.domain.chat.dto.ChatListDto;
import com.turtlecoin.mainservice.domain.chat.dto.ChatResponseDto;
import com.turtlecoin.mainservice.domain.chat.dto.ChatTextResponseDto;
import com.turtlecoin.mainservice.domain.chat.dto.ChatTurtleResponseDto;
import com.turtlecoin.mainservice.domain.chat.entity.Chat;
import com.turtlecoin.mainservice.domain.chat.entity.ChatMessage;
import com.turtlecoin.mainservice.domain.chat.entity.ChatTextMessage;
import com.turtlecoin.mainservice.domain.chat.entity.ChatTurtleMessage;
import com.turtlecoin.mainservice.domain.chat.repository.ChatRepository;
import com.turtlecoin.mainservice.domain.transaction.entity.Transaction;
import com.turtlecoin.mainservice.domain.transaction.service.TransactionService;
import com.turtlecoin.mainservice.domain.user.dto.UserResponseDTO;
import com.turtlecoin.mainservice.domain.user.repository.UserRepository;
import com.turtlecoin.mainservice.domain.user.service.UserService;
import com.turtlecoin.mainservice.domain.transaction.exception.TransactionNotFoundException;
import com.turtlecoin.mainservice.global.exception.InvalidChattingException;
import com.turtlecoin.mainservice.global.exception.ChatNotFoundException;
import com.turtlecoin.mainservice.global.scheduler.CustomWebSocketHandler;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {
	private final ChatRepository chatRepository;
	private final UserService userService;
	private final TransactionService transactionService;
	private final UserRepository userRepository;
	private final SseService sseService;
	private final CustomWebSocketHandler customWebSocketHandler;

	public ObjectId createChat(Long smallUserId, Long bigUserId) throws Exception{
		// 호출 해보면서 없는 아이디인지 확인
		UserResponseDTO smallUser = userService.getByUserId(smallUserId);
		UserResponseDTO bigUser = userService.getByUserId(bigUserId);

		Chat chat = Chat.builder()
			.participants(Arrays.asList(smallUserId, bigUserId))
			.recentMessage(ChatTextMessage.builder().text(null).sender(null).registTime(null).build())
			.messages(new ArrayList<>())
			.unreadCount(Arrays.asList(0, 0))
			.build();

		chatRepository.save(chat);

		return chat.getId();
	}

	public ChatTextMessage addChatTextMessage(Long smallUserId, Long bigUserId, Long sender, String message) {
		ChatTextMessage chatTextMessage = ChatTextMessage.builder()
			.id(new ObjectId())
			.sender(sender)
			.text(message)
			.registTime(LocalDateTime.now().toString())
			.build();
		chatRepository.insertByParticipant(smallUserId, bigUserId, chatTextMessage);
		chatRepository.updateRecentChatting(smallUserId, bigUserId, chatTextMessage);

		Long opponentUserId = smallUserId.equals(sender) ? bigUserId : smallUserId;

		// 상대방이 현재 방에 접속중이 아니라면
		if(!customWebSocketHandler.isUserConnected("" + opponentUserId)){
			UserResponseDTO user = userService.getByUserId(opponentUserId);

			ChatTextResponseDto chatTextResponseDto = ChatTextResponseDto.builder()
				.userId(chatTextMessage.getSender())
				.nickname(user.getNickname() != null ? user.getNickname() : "알수없음")
				.message(chatTextMessage.getText())
				.registTime(chatTextMessage.getRegistTime())
				.userProfile(user.getProfileImage() != null ? user.getProfileImage() : "")
				.build();

			// 안읽은 횟수를 증가시켜주고
			chatRepository.addUnreadCount(smallUserId, bigUserId, opponentUserId);
			// SSE 메세지를 보내줘야 함
			sseService.notify(opponentUserId, chatTextResponseDto);
		}

		return chatTextMessage;
	}

	public void addChatTurtleMessage(Long smallUserId, Long bigUserId, String title, Double price, String image) throws Exception{
		ChatTurtleMessage chatTurtleMessage = ChatTurtleMessage.builder()
			.id(new ObjectId())
			.title(title)
			.price(price)
			.image(image)
			.build();
		chatRepository.insertByParticipant(smallUserId, bigUserId, chatTurtleMessage);
	}

	// 채팅 리스트에서 넘어와서 채팅 목록을 조회하는 경우
	public List<ChatResponseDto> getChatDetailList(Long userId, Long opponentId, Long loginId, Pageable pageable) throws Exception {
		// 더 작은 쪽이 왼쪽 매개변수로 들어가게 해야 함
		Long left = Math.min(opponentId, userId);
		Long right = Math.max(opponentId, userId);

		List<ChatMessage> list = chatRepository.getChatByPage(left, right, loginId, pageable.getPageNumber(), pageable.getPageSize());
		if(list == null){
			throw new ChatNotFoundException("채팅을 찾을 수 없습니다.");
		}

		return chatRepository.getChatByPage(left, right,  loginId, pageable.getPageNumber(), pageable.getPageSize())
			.stream().map((chatMessage) ->{
				if(chatMessage instanceof ChatTextMessage) {
					UserResponseDTO userResponseDTO = userService.getByUserId(((ChatTextMessage)chatMessage).getSender());
					String image = userService.getProfileImageByUserId(((ChatTextMessage)chatMessage).getSender());

					return ChatTextResponseDto.builder()
						.userId(((ChatTextMessage)chatMessage).getSender())
						.message(((ChatTextMessage)chatMessage).getText())
						.registTime(((ChatTextMessage)chatMessage).getRegistTime())
						.userProfile(image)
						.nickname(userResponseDTO == null ? null : userResponseDTO.getNickname())
						.build();
				}
				else{
					return new ChatTurtleResponseDto((ChatTurtleMessage) chatMessage);
				}
			})
			.collect(Collectors.toList());
	}

	// 거래에서 넘어오는 경우
	public List<ChatResponseDto> getChatListFromTransaction(Long userId, Long transactionId, Long loginId, Pageable pageable) throws Exception {
		Transaction transaction = transactionService.findTransactionById(transactionId);
		if(transaction == null){
			throw new TransactionNotFoundException("거래를 찾을 수 없습니다.");
		}

		Long opponentId = transaction.getTurtle().getUser().getId();
		// 더 작은 쪽이 왼쪽 매개변수로 들어가게 해야 함
		Long left = Math.min(opponentId, userId);
		Long right = Math.max(opponentId, userId);

		Chat chat = chatRepository.getChat(left, right);
		if(chat == null){
			createChat(left, right);
		}
		addChatTurtleMessage(left, right, transaction.getTitle(), transaction.getPrice(), transaction.getTransactionPhotos().get(0).getImageAddress());

		List<ChatMessage> list = chatRepository.getChatByPage(left, right, loginId, pageable.getPageNumber(), pageable.getPageSize());
		if(list == null){
			throw new ChatNotFoundException("채팅을 찾을 수 없습니다.");
		}

		return chatRepository.getChatByPage(left, right, loginId, pageable.getPageNumber(), pageable.getPageSize())
			.stream().map((chatMessage) ->{
				if(chatMessage instanceof ChatTextMessage) {
					UserResponseDTO userResponseDTO = userService.getByUserId(((ChatTextMessage)chatMessage).getSender());
					String image = userService.getProfileImageByUserId(((ChatTextMessage)chatMessage).getSender());

					return ChatTextResponseDto.builder()
						.userId(((ChatTextMessage)chatMessage).getSender())
						.message(((ChatTextMessage)chatMessage).getText())
						.registTime(((ChatTextMessage)chatMessage).getRegistTime())
						.userProfile(image)
						.nickname(userResponseDTO == null ? null : userResponseDTO.getNickname())
						.build();
				}
				else{
					return new ChatTurtleResponseDto((ChatTurtleMessage) chatMessage);
				}
			})
			.collect(Collectors.toList());
	}

	public List<ChatListDto> listChattingRoomList(Long userId, Pageable pageable) throws Exception {
		List<Chat> chatList = chatRepository.findRecentChatsByUser(userId, pageable.getPageNumber(), pageable.getPageNumber());

		return chatList.stream().map((chat) -> {
			Long left; Long right;
			Long otherUserId; Integer myUnreadCount; ChatTextMessage chatTextMessage;

			try{
				left = chat.getParticipants().get(0); right = chat.getParticipants().get(1);
				otherUserId = left == userId ? right : left;
				myUnreadCount = left == userId ? chat.getUnreadCount().get(0) : chat.getUnreadCount().get(1);
				chatTextMessage = chat.getRecentMessage();
			}
			catch(Exception e){
				throw new InvalidChattingException("저장된 채팅 데이터에 문제가 있습니다.");
			}

			UserResponseDTO userResponseDTO = userService.getByUserId(otherUserId);

			return ChatListDto.builder()
				.chattingId(chat.getId().toHexString())
				.otherUserId(otherUserId)
				.otherUserNickname(userResponseDTO.getNickname())
				.otherUserProfileImage(userResponseDTO.getProfileImage())
				.lastMessage(chatTextMessage.getText())
				.lastMessageTime(chatTextMessage.getRegistTime())
				.unreadCount(myUnreadCount)
				.build();
		}).toList();
	}
}
