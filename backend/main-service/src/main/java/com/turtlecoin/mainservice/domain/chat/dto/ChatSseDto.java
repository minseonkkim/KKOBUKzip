package com.turtlecoin.mainservice.domain.chat.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class ChatSseDto {
	private String nickname;
	private String message;
	private String date;
}
