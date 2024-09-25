package com.turtlecoin.mainservice.domain.chat.repository;

import java.util.List;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import com.turtlecoin.mainservice.domain.chat.entity.Chat;
import com.turtlecoin.mainservice.domain.chat.entity.ChatMessage;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CustomChatRepositoryImpl implements CustomChatRepository {
	private final MongoTemplate mongoTemplate;

	@Override
	public void insertBySmallUserAndBigUser(Long smallUserId, Long bigUserId, ChatMessage chatMessage) {
		Query query = new Query(Criteria.where("smallUser").is(smallUserId).and("bigUser").is(bigUserId));
		Update update = new Update().push("messages").atPosition(0).value(chatMessage);
		mongoTemplate.upsert(query, update, Chat.class);
	}

	@Override
	public Chat getChat(Long smallUserId, Long bigUserId){
		Query query = new Query(Criteria.where("smallUser").is(smallUserId).and("bigUser").is(bigUserId));
		Chat result = mongoTemplate.findOne(query, Chat.class);
		return result;
	}

	@Override
	public List<ChatMessage> getChatByPage(Long smallUserId, Long bigUserId, int page, int size){
		Query query = new Query(Criteria.where("smallUser").is(smallUserId).and("bigUser").is(bigUserId));
		query.fields().slice("messages", page*size, size);
		Chat result = mongoTemplate.findOne(query, Chat.class);
		return result != null ? result.getMessages() : null;
	}

}
