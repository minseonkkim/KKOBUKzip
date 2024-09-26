package com.turtlecoin.mainservice.domain.chat.entity;

import java.io.Serializable;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Document
@AllArgsConstructor
@Getter
@Builder
public class ChatTurtleMessage implements ChatMessage{
	@Id
	private ObjectId id;
	private String title;
	private Double price;
	private String image;
}
