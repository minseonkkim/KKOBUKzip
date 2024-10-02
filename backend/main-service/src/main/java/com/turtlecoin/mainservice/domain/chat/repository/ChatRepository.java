package com.turtlecoin.mainservice.domain.chat.repository;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.turtlecoin.mainservice.domain.chat.entity.Chat;

@Repository
public interface ChatRepository extends MongoRepository<Chat, ObjectId>, CustomChatRepository {
	// Optional<Chat> findBySmallUserAndBigUser(Long smallUser, Long bigUser);
}
