package com.turtlecoin.mainservice.domain.chat.entity;

import java.io.Serializable;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Document
@AllArgsConstructor
@Getter
public class ChatTurtleMessage implements ChatMessage{
	@Id
	private String id;
	private String turtleName;
	private Double price;
	private String image;
}
