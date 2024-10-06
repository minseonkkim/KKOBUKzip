import useDeviceStore from "../../store/useDeviceStore";
import TmpProfileImg from "../../assets/tmp_profile.gif";
import { ChatListItem } from "../../types/chatting";
import formatDate from "../../utils/formatDate";

interface ChatCardProps {
  openChatDetail: (id: number, nickname: string) => void;
  chat: ChatListItem;
}
export default function ChatCard({ openChatDetail, chat }: ChatCardProps) {
  const isTablet = useDeviceStore((state) => state.isTablet);

  // console.log(openChatDetail, chat);
  return (
    <div
      className="w-full text-black bg-white rounded-[10px] py-2 lg:my-3 my-4 mx-1 cursor-pointer"
      onClick={() => openChatDetail(chat.otherUserId, chat.otherUserNickname)}
    >
      <div className="flex flex-row justify-between items-center w-full">
        <img
          src={chat?.otherUserProfileImage}
          loading="lazy"
          decoding="async"
          className="rounded-full w-[60px] h-[60px] lg:w-[52px] lg:h-[52px] mx-2"
          draggable="false"
          alt="profile image"
        />
        <div className="flex flex-col justify-between w-full pr-3">
          <div className="flex flex-row justify-between mb-1">
            <div className="text-[17px] lg:text-[16px]">
              {chat.otherUserNickname}
            </div>
            <div className="font-bold text-[15px] text-gray-300">
              {formatDate(chat.lastMessageTime)}
            </div>
          </div>

          <div className="flex flex-row justify-between">
            <div
              className={`text-[19px] md:text-[18px] truncate ${
                isTablet ? "w-[calc(100vw-140px)]" : "w-[240px]"
              }`}
            >
              {chat.lastMessage}
            </div>
            <div className="rounded-full bg-[#DE0000] w-[24px] h-[24px] lg:w-[22px] lg:h-[22px] flex justify-center items-center text-white font-bold text-[15px]">
              1
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
