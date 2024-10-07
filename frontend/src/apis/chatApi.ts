import { ChatData, ChatListItem, ChatResponse } from "../types/chatting";
import authAxios from "./http-commons/authAxios";

const path = "/main/chatting";

// 채팅창에서 채팅 디테일 조회
export const fetchChatMessageData = async (memberId: number) => {
  try {
    const response = await authAxios<ChatResponse>(
      `${path}/detail?id=${memberId}&type=user`
    );
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) {
      console.log(error.message);
      message = error.message;
    }
    console.error("Chat LIST API Error : " + message);
    return {
      success: false,
      message: message,
    };
  }
};

// 거래내역에서 채팅창 이동
export const fetchChatMessageDataFromTx = async (memberId: number) => {
  try {
    const response = await authAxios<ChatResponse>(
      `${path}/detail?id=${memberId}&type=transaction`
    );
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) {
      console.log(error.message);
      message = error.message;
    }
    console.error("Chat LIST API Error : " + message);
    return {
      success: false,
      message: message,
    };
  }
};

// 채팅 목록
export const fetchChatListData = async (memberId: number) => {
  try {
    const response = await authAxios<{ data: ChatListItem[] }>(
      `${path}/${memberId}`
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
    console.error("Chat Detail API Error : " + message);
    return {
      success: false,
      message: message,
    };
  }
};
