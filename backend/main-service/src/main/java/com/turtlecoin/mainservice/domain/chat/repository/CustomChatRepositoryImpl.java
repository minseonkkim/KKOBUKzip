package com.turtlecoin.mainservice.domain.chat.repository;

import java.util.Arrays;
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
	public void insertByParticipant(Long smallUserId, Long bigUserId, ChatMessage chatMessage) {
		Query query = new Query(Criteria.where("participants").is(Arrays.asList(smallUserId, bigUserId)));
		Update update = new Update().push("messages").atPosition(0).value(chatMessage);
		mongoTemplate.upsert(query, update, Chat.class);
	}

	@Override
	public void updateRecentChatting(Long smallUserId, Long bigUserId, ChatTextMessage chatMessage) {
		Query query = new Query(Criteria.where("participants").is(Arrays.asList(smallUserId, bigUserId)));
		Update update = new Update()
			.set("recentMessage._id", chatMessage.getId())
			.set("recentMessage.text", chatMessage.getText())
			.set("recentMessage.sender", chatMessage.getSender())
			.set("recentMessage.registTime", chatMessage.getRegistTime());
		mongoTemplate.upsert(query, update, Chat.class);
	}

	@Override
	public Chat getChat(Long smallUserId, Long bigUserId){
		Query query = new Query(Criteria.where("participants").is(Arrays.asList(smallUserId, bigUserId)));
		Chat result = mongoTemplate.findOne(query, Chat.class);
		return result;
	}

	@Override
	public List<ChatMessage> getChatByPage(Long smallUserId, Long bigUserId, Long loginId, int page, int size){
		Query query = new Query(Criteria.where("participants").all(Arrays.asList(smallUserId, bigUserId)));
		query.fields().slice("messages", page*size, size);
		Chat result = mongoTemplate.findOne(query, Chat.class);

		if (result != null) {
			if (result.getParticipants().get(0).equals(loginId)) {
				Update update = new Update();
				update.set("unreadCount.0", 0);
				mongoTemplate.updateFirst(query, update, Chat.class);
			}
			else if (result.getParticipants().get(1).equals(loginId)) {
				Update update = new Update();
				update.set("unreadCount.1", 0);
				mongoTemplate.updateFirst(query, update, Chat.class);
			}
		}

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

	@Override
	public void addUnreadCount(Long smallUserId, Long bigUserId, Long opponentUserId) {
		Query query = new Query(Criteria.where("participants").is(Arrays.asList(smallUserId, bigUserId)));
		Chat result = mongoTemplate.findOne(query, Chat.class);

		if (result != null) {
			if (result.getParticipants().get(0).equals(opponentUserId)) {
				Update update = new Update();
				update.set("unreadCount.0", result.getUnreadCount().get(0) + 1);
				mongoTemplate.updateFirst(query, update, Chat.class);
			}
			// 4. userValue가 participant 배열의 1번째와 일치하면 unreadCount[1]을 0으로 설정
			else if (result.getParticipants().get(1).equals(opponentUserId)) {
				Update update = new Update();
				update.set("unreadCount.1", result.getUnreadCount().get(1) + 1);
				mongoTemplate.updateFirst(query, update, Chat.class);
			}
		}
	}
}
