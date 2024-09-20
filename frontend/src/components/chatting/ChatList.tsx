import { useState } from "react";
import useDeviceStore from "../../store/useDeviceStore";
import ChatCard from "./ChatCard";
import ChatDetail from "./ChatDetail";
import { IoClose } from "react-icons/io5";
import { AiOutlineMessage } from "react-icons/ai";


interface Chat{
    name: string;
    message: string;
}

export default function ChatList() {
    const isMobile = useDeviceStore((state) => state.isMobile);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState<null | Chat>(null);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setSelectedChat(null);  // 창을 닫을 때 선택된 채팅도 초기화
    };
    
    const openChatDetail = (chat: Chat) => {
        setSelectedChat(chat); // 상세 채팅을 열 때 선택한 채팅의 정보를 상태로 저장
    };

    const closeChatDetail = () => {
        setSelectedChat(null); // 상세 채팅에서 돌아가려면 선택한 채팅을 null로 설정
    };

    return (
        <>
            <div
                className={ isMobile ? 
                    `cursor-pointer fixed ${isOpen ? 'bottom-0 right-0' : 'bottom-5 right-5'} z-[1000] bg-[#D7E7F7] ${isOpen ? 'rounded-[10px]' : 'rounded-full'} flex flex-col justify-between items-center transition-all duration-500 ${isOpen ? 'h-[calc(100vh-80px)] w-full' : 'h-[60px] w-[60px]'} animate-float`
                    : `cursor-pointer fixed w-[380px] bottom-0 right-0 z-[1000] bg-[#D7E7F7] rounded-[10px] flex flex-col justify-between items-center transition-all duration-500 ${isOpen ? 'h-[480px]' : 'h-[60px]'} animate-float`}
                style={{
                    boxShadow: '15px 8px 20px rgba(0, 0, 0, 0.3)',
                    border: '2px solid #88B3D9',
                    animation: 'pulseGlow 3s infinite',
                    overflow: 'hidden',
                }}
            >
                {!selectedChat && (
                    <div className={`p-[10px] flex flex-row items-center w-full ${isMobile ? (isOpen ? 'justify-between' : 'h-[60px] justify-center') : 'justify-between'}`} onClick={toggleChat}>
                        {isMobile ? ( isOpen ? (
                            <div className="font-dnf-bitbit text-[29px]">
                                <span className="text-[#6396C6]">꼬북</span>
                                <span className="text-[#43493A]">TALK</span>
                            </div>
                        ) : <AiOutlineMessage className="w-[30px] h-[30px]" />) : (
                            <div className="font-dnf-bitbit text-[29px]">
                                <span className="text-[#6396C6]">꼬북</span>
                                <span className="text-[#43493A]">TALK</span>
                            </div>
                        ) }
                        
                        {!isOpen ? 
                            !isMobile && <div className="rounded-full bg-[#DE0000] w-[30px] h-[30px] flex justify-center items-center text-white font-bold text-[20px] animate-bounce">
                                1
                            </div> : 
                            <IoClose className="text-[28px]"/>
                        }
                    </div>
                )}

                {isOpen && (
                    <div className="w-full h-full">
                        {selectedChat ? (
                            // 상세 채팅
                            <ChatDetail chat={selectedChat} closeChatDetail={closeChatDetail} toggleChat={toggleChat} />
                        ) : (
                            // 채팅 목록
                            <div className="px-[10px] w-full bg-transparent rounded-lg overflow-y-auto">
                                <ChatCard openChatDetail={openChatDetail} chat={{ name: '꼬북맘', message: '팔겠습니다. 계좌번호 0000로 입금해주세요' }} />
                                <ChatCard openChatDetail={openChatDetail} chat={{ name: '꼬북아빠', message: '구매하겠습니다.' }} />
                                <ChatCard openChatDetail={openChatDetail} chat={{ name: '꼬북이', message: '대화 참여!' }} />
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
