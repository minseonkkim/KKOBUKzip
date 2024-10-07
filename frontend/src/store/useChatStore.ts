import { create } from "zustand";
import { ChatListItem } from "../types/chatting";

export interface ChattingStore {
  isChattingOpen: boolean;
  selectedChat: null | number;
  selectedChatTitle: null | string;
  openedFromTransaction: boolean;
  totalUnreadCount: number;
  recentChattingTime: string | null;

  chatRoomList: ChatListItem[];
  toggleChat: () => void;
  openChatDetail: (id: number, nickname: string) => void;
  openChatDetailFromTransaction: (id: number, nickname: string) => void;
  closeChatDetail: () => void;
  initChatRoomList: (initData: ChatListItem[]) => void;
  updateRoomList: (newChat: ChatListItem) => void;
  addTotalUnreadCount: (count: number) => void;
  subTotalUnreadCount: (count: number) => void;
  setRecentChattingTime: (time: string) => void;
}

// 채팅 주소 구조 -> 상대 아이디, 내 아이디를 '-' 로 연결(작은쪽이 앞에)
const useChatStore = create<ChattingStore>((set) => ({
  isChattingOpen: false,
  selectedChat: null, // 상대방 아이디가 들어감
  selectedChatTitle: null,
  openedFromTransaction: false,
  chatRoomList: [],
  totalUnreadCount: 0,
  recentChattingTime: "blank",

  toggleChat: () =>
    set((state) => ({
      isChattingOpen: !state.isChattingOpen,
      selectedChat: null,
      selectedChatTitle: null,
    })),

  // openChatDetail: (id: number, nickname: string) =>
  //   set((state) => ({
  //     isChattingOpen: true,
  //     selectedChat: id,
  //     selectedChatTitle: nickname,
  //     totalUnreadCount: state.totalUnreadCount, // totalUnreadCount 감소
  //   })),

  openChatDetail: (id: number, nickname: string) =>
    set((state) => {
      // chatRoomList에서 otherUserId가 id인 항목을 찾음
      const chatRoom = state.chatRoomList.find(
        (room) => room.otherUserId === id
      );

      // 해당 항목이 존재하는 경우
      if (chatRoom) {
        const unreadCount = chatRoom.unreadCount; // unreadCount 가져옴

        // chatRoomList에서 unreadCount를 0으로 설정
        const updatedChatRoomList = state.chatRoomList.map((room) =>
          room.otherUserId === id ? { ...room, unreadCount: 0 } : room
        );

        return {
          isChattingOpen: true,
          selectedChat: id,
          selectedChatTitle: nickname,
          totalUnreadCount: state.totalUnreadCount - unreadCount, // totalUnreadCount에서 unreadCount를 뺌
          chatRoomList: updatedChatRoomList, // 업데이트된 chatRoomList 설정
        };
      }

      // 만약 해당 chatRoom을 찾지 못했다면, 상태만 업데이트
      return {
        isChattingOpen: true,
        selectedChat: id,
        selectedChatTitle: nickname,
      };
    }),

  openChatDetailFromTransaction: (id: number, nickname: string) =>
    set((state) => {
      // chatRoomList에서 otherUserId가 id인 항목을 찾음
      const chatRoom = state.chatRoomList.find(
        (room) => room.otherUserId === id
      );

      // 해당 항목이 존재하는 경우
      if (chatRoom) {
        const unreadCount = chatRoom.unreadCount; // unreadCount 가져옴

        // chatRoomList에서 unreadCount를 0으로 설정
        const updatedChatRoomList = state.chatRoomList.map((room) =>
          room.otherUserId === id ? { ...room, unreadCount: 0 } : room
        );

        return {
          isChattingOpen: true,
          selectedChat: id,
          selectedChatTitle: nickname,
          totalUnreadCount: state.totalUnreadCount - unreadCount, // totalUnreadCount에서 unreadCount를 뺌
          chatRoomList: updatedChatRoomList, // 업데이트된 chatRoomList 설정
        };
      }

      // 만약 해당 chatRoom을 찾지 못했다면, 상태만 업데이트
      return {
        isChattingOpen: true,
        selectedChat: id,
        selectedChatTitle: nickname,
        openedFromTransaction: true,
      };
    }),

  closeChatDetail: () =>
    set({
      // isChattingOpen: true,
      selectedChat: null,
      selectedChatTitle: null,
      openedFromTransaction: false,
    }),

  // initChatRoomList: (initData: ChatListItem[]) =>
  //   set((state) => ({
  //     chatRoomList: initData,
  //   })),

  initChatRoomList: (initData: ChatListItem[]) => {
    let unreadCount = 0;
    initData.forEach((item) => {
      unreadCount += item.unreadCount;
    });

    set({
      chatRoomList: initData,
      totalUnreadCount: unreadCount,
    });
  },

  updateRoomList: (newChat: ChatListItem) =>
    set((state) => {
      const updatedChats = state.chatRoomList.filter(
        (chat) => chat.otherUserId !== newChat.otherUserId
      );
      return { chatRoomList: [newChat, ...updatedChats] }; // 새 채팅을 최상단에 추가
    }),

  addTotalUnreadCount: (count: number) => {
    set((state) => ({
      totalUnreadCount: state.totalUnreadCount + count,
    }));
  },

  subTotalUnreadCount: (count: number) => {
    set((state) => ({
      totalUnreadCount: state.totalUnreadCount - count,
    }));
  },

  setRecentChattingTime: (time: string) => {
    set({
      recentChattingTime: time,
    });
    console.log(time);
  },
}));

export default useChatStore;
