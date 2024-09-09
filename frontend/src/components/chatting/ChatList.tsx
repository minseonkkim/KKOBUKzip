import { useState } from 'react';
import { IoClose } from "react-icons/io5";
import ChatCard from './ChatCard';

export default function ChatList() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div
                className={`cursor-pointer fixed w-[370px] p-[10px] bottom-0 right-0 z-1000 bg-[#D7E7F7] rounded-[10px] flex flex-col justify-between items-center transition-all duration-500 ${isOpen ? 'h-[450px]' : 'h-[60px]'} animate-float`}
                style={{
                    boxShadow: '15px 8px 20px rgba(0, 0, 0, 0.3)',
                    border: '2px solid #88B3D9',
                    animation: 'pulseGlow 3s infinite',
                    overflow: 'hidden', 
                }}
            >
                <div className="flex flex-row justify-between items-center w-full" onClick={toggleChat}>
                    <div className="font-dnf-bitbit text-[29px]">
                        <span className="text-[#6396C6]">꼬북</span>
                        <span className="text-[#43493A]">TALK</span>
                    </div>
                    {!isOpen ? 
                    <div className="rounded-full bg-[#DE0000] w-[30px] h-[30px] flex justify-center items-center text-white font-bold text-[20px] animate-bounce">
                        1
                    </div> : 
                    <IoClose className="text-[28px]"/>
                    }
                    
                </div>

                {isOpen && (
                    <div className="w-full bg-transparent rounded-lg h-[380px] overflow-y-auto">
                        <ChatCard/>
                        <ChatCard/>
                        <ChatCard/>
                        <ChatCard/>
                        <ChatCard/>
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
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
            `}</style>
        </>
    );
}
