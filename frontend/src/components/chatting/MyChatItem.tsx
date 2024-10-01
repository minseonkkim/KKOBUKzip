function MyChatItem({ message }: { message: string }) {
  return (
    <>
      <div className="flex flex-row-reverse my-2 items-end">
        <div className="p-2.5 bg-white rounded-[10px] w-fit max-w-[230px] text-[18px] lg:text-[16px]">
          {message}
        </div>
        <span className="text-[12px] mr-1 text-gray-400">09:30</span>
      </div>
    </>
  );
}

export default MyChatItem;
