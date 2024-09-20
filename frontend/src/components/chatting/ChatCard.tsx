import useDeviceStore from "../../store/useDeviceStore";
import TmpProfileImg from "../../assets/tmp_profile.gif";
import { ChatListItem } from "../../types/chatting";

interface ChatCardProps {
  openChatDetail: (chat: ChatListItem) => void;
  chat: ChatListItem;
}
export default function ChatCard({ openChatDetail, chat }: ChatCardProps) {
  const isMobile = useDeviceStore((state) => state.isMobile);

  return (
    <div
      className="text-black bg-white rounded-[10px] px-2.5 py-2 flex flex-row justify-between items-center my-3 mx-1 cursor-pointer"
      onClick={() => openChatDetail(chat)}
    >
      <div className="flex flex-row">
        <img
          src={TmpProfileImg}
          className="rounded-full w-[52px] h-[52px] mr-3"
          draggable="false"
        />
        <div className="flex flex-col justify-between">
          <div className="flex flex-row justify-between mb-1">
            <div className="text-[16px]">{chat.otherUserNickname}</div>
            <div className="font-bold text-[15px] text-gray-300">
              24년 9월 9일
              {chat.lastMessageTime}
            </div>
          </div>

          <div className="flex flex-row justify-between">
            <div
              className={`text-[18px] truncate ${
                isMobile ? "w-[calc(100vw-140px)]" : "w-[240px]"
              }`}
            >
              {chat.lastMessage}
            </div>
            <div className="rounded-full bg-[#DE0000] w-[20px] h-[20px] flex justify-center items-center text-white font-bold text-[16px]">
              1
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
