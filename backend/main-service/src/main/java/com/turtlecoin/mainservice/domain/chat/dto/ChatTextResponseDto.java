package com.turtlecoin.mainservice.domain.chat.dto;

import java.time.LocalDateTime;

import com.turtlecoin.mainservice.domain.chat.entity.ChatTextMessage;

import lombok.Data;

@Data
public class ChatTextResponseDto implements ChatResponseDto{
	private Long sender;
	private LocalDateTime registerTime;
	private String text;

	public ChatTextResponseDto(ChatTextMessage chatTextMessage) {
		this.sender = chatTextMessage.getSender();
		this.registerTime = chatTextMessage.getRegisterTime();
		this.text = chatTextMessage.getText();
	}
}
