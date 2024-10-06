import { useEffect, useState } from "react";
import useDeviceStore from "../../store/useDeviceStore";
import ChatCard from "./ChatCard";
import ChatDetail from "./ChatDetail";
import { IoClose } from "@react-icons/all-files/io5/IoClose";
import { AiOutlineMessage } from "@react-icons/all-files/ai/AiOutlineMessage";
import { chatsData } from "../../fixtures/chatDummy";
import { ChatListItem } from "../../types/chatting";
import useChatStore from "../../store/useChatStore";
import { fetchChatListData } from "../../apis/chatApi";
import { useUserStore } from "../../store/useUserStore";
import { EventSourcePolyfill } from "event-source-polyfill/src/eventsource.min.js";

const dummyData = chatsData;

export default function ChatList() {
  const isTablet = useDeviceStore((state) => state.isTablet);
  const {
    isChattingOpen,
    selectedChat,
    selectedChatTitle,
    toggleChat,
    closeChatDetail,
    openChatDetail,
    initChatRoomList,
    updateRoomList,
    chatRoomList,
  } = useChatStore();
  const { userInfo } = useUserStore();
  const isOpen = isChattingOpen;

  useEffect(() => {
    // 초기 데이터를 load하는 함수
    const getChatData = async () => {
      if (!userInfo) return;
      const fetchedChats = await fetchChatListData(userInfo.userId);
      if (fetchedChats.success) {
        initChatRoomList(fetchedChats.data?.data!);
      }
      // 유저 id로 바꿀것
    };

    // SSE 연결하는 함수
    const initializeSSE = () => {
      const SSE_URL =
        import.meta.env.VITE_SSE_MAIN_URL +
        "/" +
        userInfo?.userId +
        "?token=" +
        userInfo?.token;
      // const eventSource = new EventSource(SSE_URL);
      // EventSourcePolyfill 사용
      const eventSource = new EventSourcePolyfill(SSE_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          Accept: "text/event-stream",
        },
      });

      eventSource.onmessage = (event) => {
        const newChat: ChatListItem = JSON.parse(event.data);
        console.log("SSE가 도착한다!");
        updateRoomList(newChat);
      };

      eventSource.onerror = (error) => {
        console.error("SSE 에러 발생:", error);
        eventSource.close(); // 에러 발생 시 연결 종료
      };

      return eventSource;
    };

    // 호출부분
    const fetchDataAndInitializeSSE = async () => {
      await getChatData(); // 채팅 데이터를 가져옴
      const eventSource = initializeSSE(); // SSE 초기화

      return () => {
        eventSource.close(); // 컴포넌트 언마운트 시 연결 종료
      };
    };
    //initChatRoomList(dummyData);
    fetchDataAndInitializeSSE();
  }, []);

  return (
    <>
      <div
        className={
          isTablet
            ? ` fixed ${
                isOpen ? "inset-0" : "bottom-5 right-5"
              } z-[1000] bg-[#D7E7F7] ${
                isOpen ? "rounded-[10px]" : "rounded-full"
              } flex flex-col justify-between items-center transition-all duration-500 ${
                isOpen ? "h-[100vh] w-full" : "h-[60px] w-[60px]"
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
              isTablet
                ? isOpen
                  ? "justify-between"
                  : "h-[60px] justify-center"
                : "justify-between"
            }`}
            onClick={toggleChat}
          >
            {isTablet ? (
              isOpen ? (
                <div className="font-dnf-bitbit text-[31px]">
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
              !isTablet && (
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
                {chatRoomList.map((chat) => (
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
