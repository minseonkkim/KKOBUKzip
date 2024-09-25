import { create } from "zustand";
import { ChatListItem } from "../types/chatting";

export interface ChattingStore {
  isChattingOpen: boolean;
  selectedChat: null | number;
  selectedChatTitle: null | string;

  chatRoomList: ChatListItem[];
  toggleChat: () => void;
  openChatDetail: (id: number, nickname: string) => void;
  closeChatDetail: () => void;
  initChatRoomList: (initData: ChatListItem[]) => void;
  updateRoomList: (newChat: ChatListItem) => void;
}

// 채팅 주소 구조 -> 상대 아이디, 내 아이디를 '-' 로 연결(작은쪽이 앞에)
const useChatStore = create<ChattingStore>((set) => ({
  isChattingOpen: false,
  selectedChat: null, // 상대방 아이디가 들어감
  selectedChatTitle: null,
  chatRoomList: [],

  toggleChat: () =>
    set((state) => ({
      isChattingOpen: !state.isChattingOpen,
      selectedChat: null,
      selectedChatTitle: null,
    })),

  openChatDetail: (id: number, nickname: string) =>
    set({
      isChattingOpen: true,
      selectedChat: id,
      selectedChatTitle: nickname,
    }),

  closeChatDetail: () =>
    set({
      // isChattingOpen: true,
      selectedChat: null,
      selectedChatTitle: null,
    }),

  initChatRoomList: (initData: ChatListItem[]) =>
    set({
      chatRoomList: initData,
    }),

  updateRoomList: (newChat: ChatListItem) =>
    set((state) => {
      const updatedChats = state.chatRoomList.filter(
        (chat) => chat.otherUserId !== newChat.otherUserId
      );
      return { chatRoomList: [newChat, ...updatedChats] }; // 새 채팅을 최상단에 추가
    }),
}));

export default useChatStore;
