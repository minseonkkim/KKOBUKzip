package com.turtlecoin.mainservice.domain.chat.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class ChatTextResponseDto implements ChatResponseDto{
	private Long userId;
	private String nickname;
	private String message;
	private String registTime;
	private String userProfile;
}
