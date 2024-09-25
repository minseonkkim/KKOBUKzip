import { create } from "zustand";
import { ChatListItem } from "../types/chatting";

interface ChattingStore {
  isChattingOpen: boolean;
  selectedChat: null | number;
  selectedChatTitle: null | string;
  toggleChat: () => void;
  openChatDetail: (chat: ChatListItem) => void;
  closeChatDetail: () => void;
}

const useChatStore = create<ChattingStore>((set) => ({
  isChattingOpen: false,
  selectedChat: null,
  selectedChatTitle: null,

  toggleChat: () =>
    set((state) => ({
      isChattingOpen: !state.isChattingOpen,
      selectedChat: null,
      selectedChatTitle: null,
    })),

  openChatDetail: (chat: ChatListItem) =>
    set({
      isChattingOpen: true,
      selectedChat: chat.chattingId,
      selectedChatTitle: chat.otherUserNickname,
    }),
  closeChatDetail: () =>
    set({
      isChattingOpen: false,
      selectedChat: null,
      selectedChatTitle: null,
    }),
}));

export default useChatStore;
