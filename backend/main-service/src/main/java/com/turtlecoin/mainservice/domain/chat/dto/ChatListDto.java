package com.turtlecoin.mainservice.domain.chat.dto;

import org.bson.types.ObjectId;
import org.joda.time.DateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class ChatListDto {
	String chattingId;
	Long otherUserId;
	String otherUserNickname;
	String otherUserProfileImage;
	String lastMessage;
	String lastMessageTime;
	Integer unreadCount;
}
