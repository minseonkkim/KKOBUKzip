package com.turtlecoin.mainservice.domain.chat.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Document(collection = "chat")
@Getter
@Builder
@AllArgsConstructor
public class Chat {
	@Id
	public ObjectId id;
	public Long smallUser;
	public Long bigUser;
	public LocalDateTime recentTime;
	public List<ChatMessage> messages;
}

