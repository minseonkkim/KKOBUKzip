package com.turtlecoin.mainservice.domain.chat.repository;

import com.turtlecoin.mainservice.domain.chat.dto.ChatRequestDto;
import com.turtlecoin.mainservice.domain.chat.entity.ChatMessage;

public interface CustomChatRepository {

	void insertBySmallUserAndBigUser(Long smallUserId, Long bigUserId, ChatMessage chatMessage);
}
