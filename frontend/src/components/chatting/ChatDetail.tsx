import { IoClose } from "@react-icons/all-files/io5/IoClose";
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
import { useUserStore } from "../../store/useUserStore";

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
  const { userInfo } = useUserStore();
  const [chatData, setChatData] = useState<ChatData[]>([]);

  const myNickName = "판매자";
  const chatId =
    Math.min(userInfo?.userId!, chattingId) +
    "-" +
    Math.max(userInfo?.userId!, chattingId);
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
    const { success, data } = await fetchChatMessageData(chattingId);
    console.log(data);
    if (success) {
      const chatMessages = data;
      if (Array.isArray(chatMessages)) {
        setChatData(chatMessages.reverse());
      } else {
        console.error("Expected an array, but got:", chatMessages);
      }
    }

    // if (success) {
    //   setChatData(data!.reverse());
    // }

    // 날짜별로 메시지 그룹화
    const groupedMessages: { date: string; messages: ChatData[] }[] = [];
    console.log(data!);
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
    const socketAddress = import.meta.env.VITE_SOCKET_MAIN_URL;
    const socket = new WebSocket(socketAddress);
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect(
      { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      () => {
        stompClient.current!.subscribe(
          `/sub/main/${chatId}`,
          (message) => {
            const newMessage: ChatData = JSON.parse(message.body);
            const messageDate = formatDate(newMessage.registTime);
            const lastGroup = groupedChat[groupedChat.length - 1];

            console.log("Sender:", newMessage.userId);
            console.log("NickName:", newMessage.nickname);
            console.log("Register Time:", newMessage.registTime);
            console.log("Message:", newMessage.message);
            console.log("ProfileImg:", newMessage.userProfile);

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
