import { IoClose } from "@react-icons/all-files/io5/IoClose";
import TmpProfileImg from "../../assets/tmp_profile.gif";
import { ChatData, TextChat, ChatResponse } from "../../types/chatting";
import { useEffect, useRef, useState } from "react";
import OtherChatItem from "./OtherChatItem";
import MyChatItem from "./MyChatItem";
import ChatDayDivider from "./ChatDayDivider";
import { CompatClient, Stomp } from "@stomp/stompjs";
import formatDate from "../../utils/formatDate";
import {
  fetchChatMessageData,
  fetchChatMessageDataFromTx,
} from "../../apis/chatApi";
import SystemMessageItem from "./SystemMessageItem";
import { useUserStore } from "../../store/useUserStore";
import useChatStore from "../../store/useChatStore";

interface ChatDetailProps {
  closeChatDetail: () => void;
  otherUserId: number;
  transactionId: number | null;
  toggleChat: () => void;
  chattingTitle: string;
  openedFromTransaction: boolean;
}

// 확인해야 할 사항
// 0. user의 nickname 가져오기
// 1. 채팅 get fetch -
// 2. socket connet
// 3. sockent send, sub
// 4. sockent disconnet
// 5. 컴포넌트 이동 시에 소켓 확인

interface SystemMessageType {
  title: string;
  price: number;
  image: string;
}

export default function ChatDetail({
  chattingTitle,
  otherUserId,
  transactionId,
  closeChatDetail,
  toggleChat,
  openedFromTransaction,
}: ChatDetailProps) {
  const [inputValue, setInputValue] = useState("");
  const stompClient = useRef<CompatClient | null>(null);
  const [groupedChat, setGroupedChat] = useState<
    { date: string; messages: (ChatData | SystemMessageType)[] }[]
  >([]);
  const { userInfo } = useUserStore();
  const [chatData, setChatData] = useState<ChatData[]>([]);
  const recentChattingTime = useChatStore((state) => state.recentChattingTime);
  const setRecentChattingTime = useChatStore(
    (state) => state.setRecentChattingTime
  );

  const chatId =
    Math.min(userInfo?.userId!, otherUserId) +
    "-" +
    Math.max(userInfo?.userId!, otherUserId);
  useEffect(() => {
    const getChatData = async () => {
      await initData();
      console.log("otherUserId", chatId);
    };
    getChatData();
    connect();

    return () => disconnect();
  }, [otherUserId]);

  // 데이터 초기화 및 전처리
  const initData = async () => {
    let success: boolean;
    let data: ChatData[] | undefined;

    if (openedFromTransaction && transactionId) {
      ({ success, data } = await fetchChatMessageDataFromTx(transactionId));
    } else {
      ({ success, data } = await fetchChatMessageData(otherUserId));
    }
    if (success) {
      const chatMessages = data;
      if (Array.isArray(chatMessages)) {
        setChatData(chatMessages.reverse());
      } else {
        console.error("Expected an array, but got:", chatMessages);
      }
    }

    // 날짜별로 메시지 그룹화
    const groupedMessages: { date: string; messages: ChatData[] }[] = [];
    if (data != undefined) {
      data.forEach((message) => {
        const lastGroup = groupedMessages[groupedMessages.length - 1];
        const messageDate = formatDate(message.registTime);

        if (!lastGroup || lastGroup.date !== messageDate) {
          groupedMessages.push({ date: messageDate, messages: [message] });
        } else {
          lastGroup.messages.push(message);
        }
      });
    }
    console.log("groupedMessages", groupedMessages);
    setGroupedChat(groupedMessages);
    if (groupedMessages) {
      setRecentChattingTime(groupedMessages[groupedMessages.length - 1].date);
      console.log(groupedMessages[groupedMessages.length - 1].date);
      console.log(recentChattingTime);
    }
    // }
  };

  // 웹소켓 연결 설정
  const connect = () => {
    const socketAddress = import.meta.env.VITE_SOCKET_MAIN_URL;
    const socket = new WebSocket(socketAddress);
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect(
      { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      () => {
        stompClient.current!.subscribe(
          `/sub/main/${chatId}`,
          (message) => {
            const newMessage: TextChat = JSON.parse(message.body);
            const messageDate = formatDate(newMessage.registTime);
            //const lastGroup = groupedChatRef.current[groupedChat.length - 1];
            const lastGroup = useChatStore.getState().recentChattingTime;

            console.log("Sender:", newMessage.userId);
            console.log("NickName:", newMessage.nickname);
            console.log("Register Time:", newMessage.registTime);
            console.log("Message:", newMessage.message);
            console.log("ProfileImg:", newMessage.userProfile);
            console.log(lastGroup);
            // 날짜별로 분류
            if (!lastGroup || lastGroup !== messageDate) {
              setGroupedChat((prevMessages) => [
                ...prevMessages,
                { date: messageDate, messages: [newMessage] },
              ]);
            } else {
              setGroupedChat((prevMessages) => {
                const updatedGroups = [...prevMessages];
                updatedGroups[updatedGroups.length - 1].messages.push(
                  newMessage
                );
                return updatedGroups;
              });
            }

            setRecentChattingTime(messageDate);
          },
          { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        );
      },
      (error: unknown) => {}
    );
  };

  // 웹소켓 연결 해제
  const disconnect = () => {
    if (stompClient.current) {
      stompClient.current.disconnect();
      setRecentChattingTime(null);
    }
  };

  useEffect(() => {}, []);

  const sendMessage = () => {
    if (inputValue.trim() !== "" && stompClient.current) {
      const message = {
        userId: userInfo?.userId,
        message: inputValue,
        // 뭘보내야할까요...
        // 이거 2개만 보내시면 됩니다.. 시간같은건 백에서 체크할게요
      };
      stompClient.current?.send(
        `/pub/main/${chatId}`,
        { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        JSON.stringify(message)
      );
      setInputValue("");
    }
    // 메세지 보내기
    console.log("메세지 보내기");
  };

  return (
    <>
      <div className="text-black bg-gray-100 rounded-[10px] flex flex-col justify-between w-full">
        <div className="overflow-y-auto">
          <div className="text-[#43493A] p-[10px] flex flex-row justify-between items-center text-[29px] font-dnf-bitbit absolute bg-gray-100 w-full">
            <span className="cursor-pointer" onClick={closeChatDetail}>
              &lt;&nbsp;{chattingTitle}
            </span>
            {/* toggleChat을 사용하여 창을 닫음 */}
            <IoClose
              className="text-[28px] cursor-pointer"
              onClick={toggleChat}
            />
          </div>
          <div className="p-[10px] mt-[49px] mb-[42px] flex flex-col">
            {groupedChat.map((group, index) => (
              <div key={index}>
                {/* 날짜 */}

                <ChatDayDivider date={group.date} />

                {group.messages.map((message, index) => {
                  if ("title" in message) {
                    // 시스템 메시지 처리
                    return (
                      <div className="flex items-center justify-center my-2">
                        <SystemMessageItem
                          key={index}
                          title={message.title}
                          price={message.price}
                          image={message.image}
                        />
                      </div>
                    );
                  } else if (userInfo?.userId === message.userId) {
                    // 보낸 메시지 처리
                    return (
                      <MyChatItem
                        key={index}
                        message={message.message}
                        time={message.registTime}
                      />
                    );
                  } else {
                    // 받은 메시지 처리
                    return (
                      <OtherChatItem
                        key={index}
                        message={message.message}
                        time={message.registTime}
                        profileImg={message.userProfile}
                      />
                    );
                  }
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto absolute bottom-0 w-full">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="메시지를 입력하세요..."
            className="w-full p-2 border rounded-lg"
          />
        </div>
      </div>

      <style>{`
* {
    -ms-overflow-style: none; 
    scrollbar-width: none; 
}
*::-webkit-scrollbar {
    display: none; 
}
`}</style>
    </>
  );
}
