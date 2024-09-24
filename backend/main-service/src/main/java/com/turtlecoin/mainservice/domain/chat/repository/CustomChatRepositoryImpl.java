package com.turtlecoin.mainservice.domain.chat.repository;

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
		Query query = new Query(Criteria.where("smallUser").is(smallUserId).and("bigUserId").is(bigUserId));
		Update update = new Update().push("messages").atPosition(0).value(chatMessage);
		mongoTemplate.upsert(query, update, Chat.class);
	}

	// @Override
	// public List<ChatbotChatting> getChattingsByPage(Long memberId, int page, int size){
	// 	Query query = new Query(Criteria.where("memberId").is(memberId));
	// 	query.fields().slice("chattings", page*size, size);
	// 	ChattingDocument result = mongoTemplate.findOne(query, ChattingDocument.class);
	// 	return result != null ? result.getChattings() : null;
	// }

}
