export interface ChatListItem {
  chattingId: number;
  otherUserId: number;
  otherUserNickname: string;
  otherUserProfileImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface ChatData {
  userId: number;
  nickname: string;
  message: string;
  registTime: string;
  userProfile: string;
}

export interface ChatResponse {
  status: string;
  data: ChatData[];
  message: string;
}
