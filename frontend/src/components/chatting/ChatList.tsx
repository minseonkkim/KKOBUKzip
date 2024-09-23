import { useEffect, useState } from "react";
import useDeviceStore from "../../store/useDeviceStore";
import ChatCard from "./ChatCard";
import ChatDetail from "./ChatDetail";
import { IoClose } from "react-icons/io5";
import { AiOutlineMessage } from "react-icons/ai";
import { chatsData } from "../../fixtures/chatDummy";
import { ChatListItem } from "../../types/chatting";

const dummyData = chatsData;
export default function ChatList() {
  const isMobile = useDeviceStore((state) => state.isMobile);
  const [chats, setChats] = useState<ChatListItem[]>(dummyData);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<null | number>(null);
  const [selectedChatTitle, setSelectedChatTitle] = useState<null | string>(
    null
  );

  useEffect(() => {
    const getChatData = async () => {
      console.log("채팅목록을가져오는함수");
      // setChats
    };
    getChatData();
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setSelectedChat(null); // 창을 닫을 때 선택된 채팅도 초기화
    setSelectedChatTitle(null);
  };

  const openChatDetail = (chat: ChatListItem) => {
    setSelectedChat(chat.chattingId); // 상세 채팅을 열 때 선택한 채팅의 정보를 상태로 저장
    setSelectedChatTitle(chat.otherUserNickname);
  };

  const closeChatDetail = () => {
    setSelectedChat(null); // 상세 채팅에서 돌아가려면 선택한 채팅을 null로 설정
    setSelectedChatTitle(null);
  };

  return (
    <>
      <div
        className={
          isMobile
            ? ` fixed ${
                isOpen ? "bottom-0 right-0" : "bottom-5 right-5"
              } z-[1000] bg-[#D7E7F7] ${
                isOpen ? "rounded-[10px]" : "rounded-full"
              } flex flex-col justify-between items-center transition-all duration-500 ${
                isOpen ? "h-[calc(100vh-150px)] w-full" : "h-[60px] w-[60px]"
              } animate-float`
            : ` fixed w-[380px] bottom-0 right-0 z-[1000] bg-[#D7E7F7] rounded-t-[10px] flex flex-col justify-between items-center transition-all duration-500 ${
                isOpen ? "h-[480px]" : "h-[60px]"
              } animate-float`
        }
        style={{
          boxShadow: "15px 8px 20px rgba(0, 0, 0, 0.3)",
          border: "2px solid #88B3D9",
          animation: "pulseGlow 3s infinite",
          overflow: "hidden",
        }}
      >
        {!selectedChat && (
          <div
            className={`p-[10px] flex flex-row items-center w-full cursor-pointer ${
              isMobile
                ? isOpen
                  ? "justify-between"
                  : "h-[60px] justify-center"
                : "justify-between"
            }`}
            onClick={toggleChat}
          >
            {isMobile ? (
              isOpen ? (
                <div className="font-dnf-bitbit text-[29px]">
                  <span className="text-[#6396C6]">꼬북</span>
                  <span className="text-[#43493A]">TALK</span>
                </div>
              ) : (
                <AiOutlineMessage className="w-[30px] h-[30px]" />
              )
            ) : (
              <div className="font-dnf-bitbit text-[29px]">
                <span className="text-[#6396C6]">꼬북</span>
                <span className="text-[#43493A]">TALK</span>
              </div>
            )}

            {!isOpen ? (
              !isMobile && (
                <div className="rounded-full bg-[#DE0000] w-[30px] h-[30px] flex justify-center items-center text-white font-bold text-[20px] animate-bounce">
                  1
                </div>
              )
            ) : (
              <IoClose className="text-[28px]" />
            )}
          </div>
        )}

        {isOpen && (
          <div className="w-full h-full overflow-y-auto">
            {selectedChat ? (
              // 상세 채팅
              <ChatDetail
                chattingTitle={selectedChatTitle!}
                chattingId={selectedChat}
                closeChatDetail={closeChatDetail}
                toggleChat={toggleChat}
              />
            ) : (
              // 채팅 목록
              <div className="px-[10px] w-full bg-transparent rounded-lg ">
                {chats.map((chat) => (
                  <ChatCard
                    key={chat.chattingId}
                    openChatDetail={openChatDetail}
                    chat={chat}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-5px);
                    }
                }

                @keyframes bounce {
                    0%, 100% {
                        transform: translateY(0);
                    50% {
                        transform: translateY(-10px);
                    }
                }
            `}</style>
    </>
  );
}
