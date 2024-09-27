import formatDate from "../../utils/formatDate";

function ChatDayDivider({ date }: { date: string }) {
  return (
    <>
      <div className="flex flex-row justify-between items-center my-4">
        <div className="w-full bg-gray-200 h-[2px]"></div>
        <span className="w-[300px] text-center text-gray-400 text-[16px] lg:text-[15px]">{date}</span>
        <div className="w-full bg-gray-200 h-[2px]"></div>
      </div>
    </>
  );
}

export default ChatDayDivider;
