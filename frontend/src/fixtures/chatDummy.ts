interface Chat {
  chattingId: number;
  otherUserId: number;
  otherUserNickname: string;
  otherUserProfileImage: string;
  lastMessage: string;
  lastMessageTime: string;
  isOpened: boolean;
  chatCnt: number;
}

export const chatsData: Chat[] = [
  {
    chattingId: 3,
    otherUserId: 2,
    otherUserNickname: "거북삼",
    otherUserProfileImage: "http:///api/image/profile-12345",
    lastMessage: "안녕하세요 거북이 사요",
    lastMessageTime: "2024-09-08",
    isOpened: true,
    chatCnt: 0,
  },
  {
    chattingId: 4,
    otherUserId: 1,
    otherUserNickname: "거북이키우고싶다",
    otherUserProfileImage: "http:///api/image/profile-123456",
    lastMessage: "안녕하세요 거북이 키우는거 어렵나요",
    lastMessageTime: "2024-09-08",
    isOpened: false,
    chatCnt: 5,
  },
  {
    chattingId: 5,
    otherUserId: 1,
    otherUserNickname: "꼬북맘",
    otherUserProfileImage: "http:///api/image/profile-123456",
    lastMessage: "팔겠습니다. 계좌번호 0000로 입금해주세요",
    lastMessageTime: "2024-09-08",
    isOpened: false,
    chatCnt: 5,
  },
  {
    chattingId: 6,
    otherUserId: 1,
    otherUserNickname: "꼬북아빠",
    otherUserProfileImage: "http:///api/image/profile-123456",
    lastMessage: "구매하겠습니다.",
    lastMessageTime: "2024-09-08",
    isOpened: false,
    chatCnt: 5,
  },
  {
    chattingId: 7,
    otherUserId: 1,
    otherUserNickname: "꼬북이",
    otherUserProfileImage: "http:///api/image/profile-123456",
    lastMessage: "대화 참여!",
    lastMessageTime: "2024-09-08",
    isOpened: false,
    chatCnt: 5,
  },
];
