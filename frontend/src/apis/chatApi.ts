import { ChatData, ChatListItem } from "../types/chatting";
import authAxios from "./http-commons/authAxios";

const path = "/main/chatting";

// 채팅 전체 데이터
export const fetchChatMessageData = async (
  memberId: number,
  chattingId: number
) => {
  try {
    const response = await authAxios<ChatData[]>(
      `${path}/${memberId}/${chattingId}`
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) {
      console.log(error.message);
      message = error.message;
    }
    return {
      success: false,
      message: message,
    };
  }
};

// 채팅 목록
export const fetchChatListData = async (memberId: number) => {
  try {
    const response = await authAxios<ChatListItem[]>(`${path}/${memberId}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) {
      console.log(error.message);
      message = error.message;
    }
    return {
      success: false,
      message: message,
    };
  }
};
