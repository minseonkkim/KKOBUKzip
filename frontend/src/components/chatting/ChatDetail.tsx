import { IoClose } from "react-icons/io5";
import TmpProfileImg from "../../assets/tmp_profile.gif";
import { ChatListItem, ChatData } from "../../types/chatting";
import { useEffect, useState } from "react";

interface ChatDetailProps {
  closeChatDetail: () => void; // 함수에서 인자가 없기 때문에 () => void
  chattingId: number; // chat의 타입을 지정 (name과 message를 가지는 객체)
  toggleChat: () => void; // toggleChat 함수의 타입 추가
}

const data: ChatData[] = [
  {
    userId: 1,
    nickname: "구매자",
    message: "거북이 키우고 싶어요",
    registTime: "DateTime",
    userProfile: "http://turtlephoto",
  },
  {
    userId: 3,
    nickname: "판매자",
    message: "거북거북",
    registTime: "DateTime",
    userProfile: "http://turtlephoto22",
  },
  {
    userId: 1,
    nickname: "구매자",
    message: "구북이 키우고싶어요",
    registTime: "DateTime",
    userProfile: "http://turtlephoto",
  },
  {
    userId: 3,
    nickname: "판매자",
    message: "입금해주세요",
    registTime: "DateTime",
    userProfile: "http://turtlephoto22",
  },
];

export default function ChatDetail({
  chattingId,
  closeChatDetail,
  toggleChat,
}: ChatDetailProps) {
  const [chat, setChat] = useState<ChatData[]>(data);
  useEffect(() => {
    const getChatData = async () => {
      console.log("chattingId", chattingId);
    };
    getChatData();
  }, []);
  return (
    <>
      <div className="text-black bg-gray-100 rounded-[10px] flex flex-col justify-between w-full h-full">
        <div>
          <div className="text-[#43493A] p-[10px] flex flex-row justify-between items-center text-[29px] font-dnf-bitbit">
            <span onClick={closeChatDetail}>&lt;&nbsp;{chat[0].message}</span>
            {/* toggleChat을 사용하여 창을 닫음 */}
            <IoClose className="text-[28px]" onClick={toggleChat} />
          </div>
          <div className="p-[10px] flex flex-col-reverse">
            {/* 받은 메세지 */}
            <div className="flex flex-row my-2 items-end">
              <img
                src={TmpProfileImg}
                className="rounded-full w-[40px] h-[40px] mr-2"
                draggable="false"
              />
              <div className="p-2.5 bg-white rounded-[10px] w-fit max-w-[230px] break-words mr-1">
                {chat[0].message}
              </div>
              <span className="text-[12px] mr-1 text-gray-400">09:38</span>
            </div>
            {/* 보낸 메세지 */}
            <div className="flex flex-row-reverse my-2 items-end">
              <div className="p-2.5 bg-white rounded-[10px] w-fit max-w-[230px]">
                거북이 사요~~ 거북이 귀여워용.
              </div>
              <span className="text-[12px] mr-1 text-gray-400">09:30</span>
            </div>
            {/* 날짜 */}
            <div className="flex flex-row justify-between items-center">
              <div className="w-full bg-gray-400 h-[2px]"></div>
              <span className="w-[300px] text-center text-gray-600">
                24년 9월 9일
              </span>
              <div className="w-full bg-gray-400 h-[2px]"></div>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <input
            type="text"
            placeholder="메시지를 입력하세요..."
            className="w-full p-2 border rounded-lg"
          />
        </div>
      </div>
    </>
  );
}
