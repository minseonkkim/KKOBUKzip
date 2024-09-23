import { ChatData } from "../types/chatting";
import authAxios from "./http-commons/authAxios";

/**
 * /api/main/chatting/{memberId}/{chattingId}
 */
export const fetchChatMessageData = async (
  memberId: number,
  chattingId: number
) => {
  try {
    const response = await authAxios<ChatData[]>(
      `main/chatting/${memberId}/${chattingId}`
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
