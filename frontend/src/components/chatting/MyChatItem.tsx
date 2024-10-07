function MyChatItem({ message, time }: { message: string; time: string }) {
  // 초과된 밀리초 부분을 자르고 Date 객체 생성
  const date = new Date(time);

  // 시간만 추출 (HH:MM:SS 형식)
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return (
    <>
      <div className="flex flex-row-reverse my-2 items-end">
        <div className="p-2.5 bg-white rounded-[10px] w-fit max-w-[230px] text-[18px] lg:text-[16px]">
          {message}
        </div>
        <span className="text-[12px] mr-1 text-gray-400">
          {hours}:{minutes}
        </span>
      </div>
    </>
  );
}

export default MyChatItem;
