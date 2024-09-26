import { IoClose } from "react-icons/io5";
import TmpProfileImg from "../../assets/tmp_profile.gif";
import { ChatData } from "../../types/chatting";
import { useEffect, useRef, useState } from "react";
import OtherChatItem from "./OtherChatItem";
import MyChatItem from "./MyChatItem";
import ChatDayDivider from "./ChatDayDivider";
import { CompatClient, Stomp } from "@stomp/stompjs";
import formatDate from "../../utils/formatDate";
import { fetchChatMessageData } from "../../apis/chatApi";
import SystemMessageItem from "./SystemMessageItem";

interface ChatDetailProps {
  closeChatDetail: () => void;
  chattingId: number;
  toggleChat: () => void;
  chattingTitle: string;
}

// 확인해야 할 사항
// 0. user의 nickname 가져오기
// 1. 채팅 get fetch -> init Data에서 dummy 제거하기
// 2. socket connet
// 3. sockent send, sub
// 4. sockent disconnet
// 5. 컴포넌트 이동 시에 소켓 확인

const data: ChatData[] = [
  {
    userId: 1,
    nickname: "구매자",
    message: "거북이 키우고 싶어요",
    registTime: "2024-09-09T10:15:30",

    userProfile: TmpProfileImg,
  },
  {
    userId: 3,
    nickname: "판매자",
    message: "거북거북",
    registTime: "2024-09-10T10:15:30",
    userProfile: TmpProfileImg,
  },
  {
    userId: 1,
    nickname: "구매자",
    message: "구북이 키우고싶어요",
    registTime: "2024-09-13T10:15:30",
    userProfile: TmpProfileImg,
  },
  {
    userId: 3,
    nickname: "판매자",
    message: "입금해주세요1",
    registTime: "2024-09-15T10:15:30",
    userProfile: TmpProfileImg,
  },
  {
    userId: 3,
    nickname: "판매자",
    message: "입금해주세요2",
    registTime: "2024-09-22T10:15:30",
    userProfile: TmpProfileImg,
  },
  {
    userId: 3,
    nickname: "판매자",
    message: "입금해주세요3",
    registTime: "2024-09-22T10:15:30",
    userProfile: TmpProfileImg,
  },
  {
    userId: 3,
    nickname: "판매자",
    message: "입금해주세요4",
    registTime: "2024-09-22T10:15:30",
    userProfile: TmpProfileImg,
  },
  {
    userId: 3,
    nickname: "판매자",
    message: "입금해주세요5",
    registTime: "2024-09-23T10:15:30",
    userProfile: TmpProfileImg,
  },
];

interface SystemMessageType {
  title: string;
  price: number;
  image: string;
}

export default function ChatDetail({
  chattingTitle,
  chattingId,
  closeChatDetail,
  toggleChat,
}: ChatDetailProps) {
  const [inputValue, setInputValue] = useState("");
  const stompClient = useRef<CompatClient | null>(null);
  const [groupedChat, setGroupedChat] = useState<
    { date: string; messages: (ChatData | SystemMessageType)[] }[]
  >([]);

  const myNickName = "판매자";
  const chatId = Math.min(1, chattingId) + "-" + Math.max(1, chattingId);
  useEffect(() => {
    const getChatData = async () => {
      await initData();
      console.log("chattingId", chatId);
    };
    getChatData();
    connect();

    return () => disconnect();
  }, [chattingId]);

  // 데이터 초기화 및 전처리
  const initData = async () => {
    // const { success, data } = await fetchChatMessageData(1, chattingId);
    // if (success) {

    // 날짜별로 메시지 그룹화
    const groupedMessages: { date: string; messages: ChatData[] }[] = [];
    data!.forEach((message) => {
      const messageDate = formatDate(message.registTime);

      const lastGroup = groupedMessages[groupedMessages.length - 1];

      if (!lastGroup || lastGroup.date !== messageDate) {
        groupedMessages.push({ date: messageDate, messages: [message] });
      } else {
        lastGroup.messages.push(message);
      }
    });
    console.log("groupedMessages", groupedMessages);
    setGroupedChat(groupedMessages);
    // }
  };

  // 웹소켓 연결 설정
  const connect = () => {
    const socketAddress = "ws://localhost:8080/api/main/ws";
    // const socketAddress = import.meta.env.VITE_SOCKET_URL
    const socket = new WebSocket(socketAddress);
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect(
      { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      () => {
        stompClient.current!.subscribe(
          `/${chatId}`,
          (message) => {
            const newMessage: ChatData = JSON.parse(message.body);
            const messageDate = formatDate(newMessage.registTime);
            const lastGroup = groupedChat[groupedChat.length - 1];

            // 날짜별로 분류
            if (!lastGroup || lastGroup.date !== messageDate) {
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
    }
  };

  useEffect(() => {}, []);

  const sendMessage = () => {
    if (inputValue.trim() !== "" && stompClient.current) {
      const message = {
        userId: 1,
        message: inputValue,
        // 뭘보내야할까요...
      };
      stompClient.current?.send(
        "/웹소켓메세지주소",
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
        <div>
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
                      <SystemMessageItem
                        key={index}
                        title={message.title}
                        price={message.price}
                        image={message.image}
                      />
                    );
                  } else if (myNickName === message.nickname) {
                    // 보낸 메시지 처리
                    return <MyChatItem key={index} message={message.message} />;
                  } else {
                    // 받은 메시지 처리
                    return (
                      <OtherChatItem
                        key={index}
                        message={message.message}
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
