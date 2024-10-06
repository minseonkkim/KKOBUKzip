package com.turtlecoin.mainservice.domain.chat.dto;

import com.turtlecoin.mainservice.domain.chat.entity.ChatTurtleMessage;

import lombok.Data;
import lombok.Getter;

@Data
public class ChatTurtleResponseDto implements ChatResponseDto {
	private String title;
	private Double price;
	private String image;

	public ChatTurtleResponseDto(ChatTurtleMessage chatTurtleMessage) {
		this.title = chatTurtleMessage.getTitle();
		this.price = chatTurtleMessage.getPrice();
		this.image = chatTurtleMessage.getImage();
	}
}
