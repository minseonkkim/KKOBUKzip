package com.turtlecoin.mainservice.domain.chat.repository;

import java.util.List;

import com.turtlecoin.mainservice.domain.chat.entity.Chat;
import com.turtlecoin.mainservice.domain.chat.entity.ChatMessage;
import com.turtlecoin.mainservice.domain.chat.entity.ChatTextMessage;

public interface CustomChatRepository {

	void insertByParticipant(Long smallUserId, Long bigUserId, ChatMessage chatMessage);

	void updateRecentChatting(Long smallUserId, Long bigUserId, ChatTextMessage chatMessage);

	Chat getChat(Long smallUserId, Long bigUserId);

	List<ChatMessage> getChatByPage(Long smallUserId, Long bigUserId, Long loginId, int page, int size);

	List<Chat> findRecentChatsByUser(Long userId, int page, int size);

	void addUnreadCount(Long smallUserId, Long bigUserId, Long opponentUserId);
}
