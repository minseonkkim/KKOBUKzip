package com.turtlecoin.mainservice.domain.chat.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import com.turtlecoin.mainservice.domain.chat.entity.Chat;
import com.turtlecoin.mainservice.domain.chat.entity.ChatMessage;
import com.turtlecoin.mainservice.domain.chat.entity.ChatTextMessage;

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
	public void updateRecentChatting(Long smallUserId, Long bigUserId, ChatTextMessage chatMessage) {
		Query query = new Query(Criteria.where("smallUser").is(smallUserId).and("bigUser").is(bigUserId));
		Update update = new Update()
			.set("recentMessage.message", chatMessage.getText())
			.set("recentMessage.sender", chatMessage.getSender())
			.set("recentMessage.timestamp", chatMessage.getRegistTime());
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

	@Override
	public List<Chat> findRecentChatsByUser(Long userId, int page, int size) {
		Query query = new Query();
		query.addCriteria(Criteria.where("participants").is(userId));

		query.with(Sort.by(Sort.Direction.DESC, "recentMessage.registTime"));
		int skip = (page - 1) * size;
		query.skip(skip);
		query.limit(size);

		// 쿼리 실행
		return mongoTemplate.find(query, Chat.class);
	}

}
