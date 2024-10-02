package com.turtlecoin.mainservice.domain.chat.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatRequestDto {
	private Long userId;
	private String message;
}
