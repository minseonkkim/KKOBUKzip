package com.turtlecoin.mainservice.domain.chat.repository;

import java.util.List;

import com.turtlecoin.mainservice.domain.chat.dto.ChatRequestDto;
import com.turtlecoin.mainservice.domain.chat.entity.Chat;
import com.turtlecoin.mainservice.domain.chat.entity.ChatMessage;

public interface CustomChatRepository {

	void insertBySmallUserAndBigUser(Long smallUserId, Long bigUserId, ChatMessage chatMessage);

	Chat getChat(Long smallUserId, Long bigUserId);

	List<ChatMessage> getChatByPage(Long smallUserId, Long bigUserId, int page, int size);
}
