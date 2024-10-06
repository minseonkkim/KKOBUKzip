function OtherChatItem({
  message,
  time,
  profileImg,
}: {
  message: string;
  time: string;
  profileImg: string;
}) {
  // 초과된 밀리초 부분을 자르고 Date 객체 생성
  const date = new Date(time);

  // 시간만 추출 (HH:MM:SS 형식)
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return (
    <>
      <div className="flex flex-row my-2 items-end">
        <img
          src={profileImg}
          className="rounded-full w-[45px] h-[45px] lg:w-[40px] lg:h-[40px] mr-2"
          draggable="false"
          alt="profile image"
        />
        <div className="p-2.5 bg-white rounded-[10px] w-fit max-w-[230px] break-words mr-1 text-[18px] lg:text-[16px]">
          {message}
        </div>
        <span className="text-[12px] mr-1 text-gray-400">
          {hours}:{minutes}
        </span>
      </div>
    </>
  );
}

export default OtherChatItem;
