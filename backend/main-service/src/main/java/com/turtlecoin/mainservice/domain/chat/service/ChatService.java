package com.turtlecoin.mainservice.domain.chat.service;

import java.util.ArrayList;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.boot.actuate.info.GitInfoContributor;
import org.springframework.cloud.loadbalancer.core.LoadBalancerServiceInstanceCookieTransformer;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Service;

import com.turtlecoin.mainservice.domain.chat.entity.Chat;
import com.turtlecoin.mainservice.domain.chat.repository.ChatRepository;
import com.turtlecoin.mainservice.domain.user.dto.UserResponseDTO;
import com.turtlecoin.mainservice.domain.user.entity.User;
import com.turtlecoin.mainservice.domain.user.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {
	private final ChatRepository chatRepository;
	private final UserService userService;
	private final MongoTemplate mongoTemplate;

	public ObjectId createChat(Long smallUserId, Long bigUserId) throws Exception{
		// 호출 해보면서 없는 아이디인지 확인
		UserResponseDTO smallUser = userService.getByUserId(smallUserId);
		UserResponseDTO bigUser = userService.getByUserId(bigUserId);

		Chat chat = Chat.builder()
			.smallUser(smallUserId)
			.bigUser(bigUserId)
			.recentTime(null)
			.messages(new ArrayList<>())
			.build();

		chatRepository.save(chat);

		return chat.getId();
	}

	public boolean isChatExists(Long smallUserId, Long bigUserId) {
		Optional<Chat> chatOptional = chatRepository.findBySmallUserAndBigUser(smallUserId, bigUserId);
		return chatOptional.isPresent();
	}

	public void addChatMessage(Long smallUserId, Long bigUserId, Long sender, String message) throws Exception{
		//chatRepository.insertBySmallUserAndBigUser(smallUserId, bigUserId, message);
	}
}
