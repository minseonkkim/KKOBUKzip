export interface ChatListItem {
  chattingId: string;
  otherUserId: number;
  otherUserNickname: string;
  otherUserProfileImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export type ChatData = TurtleChat | TextChat;

export interface TurtleChat {
  registTime: string;
  title: string;
  price: number;
  image: string;
}

export interface TextChat {
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
