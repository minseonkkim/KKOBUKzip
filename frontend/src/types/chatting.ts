export interface ChatListItem {
  chattingId: number;
  otherUserId: number;
  otherUserNickname: string;
  otherUserProfileImage: string;
  lastMessage: string;
  lastMessageTime: string;
  isOpened: boolean;
  chatCnt: number;
}

export interface ChatData {
  userId: number;
  nickname: string;
  message: string;
  registTime: string;
  userProfile: string;
}
