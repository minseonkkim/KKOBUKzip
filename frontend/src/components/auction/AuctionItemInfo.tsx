import { useState } from "react";
import { AuctionItemDataType } from "../../types/auction";

function AuctionItemInfo({ itemData }: { itemData: AuctionItemDataType }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % itemData.images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? itemData.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
      <div className="w-[48%] h-[360px] rounded-[20px] relative">
        <img
          src={itemData.images[currentIndex]}
          className="w-full h-full object-cover rounded-[20px]"
          alt="Turtle"
          draggable="false"
        />
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white text-[27px] p-2 rounded-full font-bold"
        >
          &lt;
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white text-[27px] p-2 rounded-full font-bold"
        >
          &gt;
        </button>
        <div className="absolute bottom-3 right-3 bg-gray-700 text-white px-4 py-2 rounded-[20px]">
          {currentIndex + 1} / {itemData.images.length}
        </div>
        <div className="flex flex-row justify-between items-center mt-[15px] mb-[7px]">
          <div className="text-[23px]">{itemData.title}</div>
          <div className="flex flex-row space-x-2">
            {itemData.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded-full text-[18px] bg-[#D5F0DD] text-[#065F46]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <div className="mb-[13px] text-[#9A9A9A] text-[17px]">
          {/* {itemData.turtleInfo.} */} | {itemData.turtleInfo.weight}
          24년 8월 10일생 | 8kg
        </div>
        <div className="text-[17px] leading-7 border-[2px] rounded-[10px] p-2 line-clamp">
          {itemData.content}
        </div>
        <div className="mt-[20px] mb-[3px] text-[#737373] font-bold">
          판매자 정보
        </div>
        <div className="bg-[#F2F2F2] h-[60px] rounded-[10px] flex flex-row justify-between items-center px-2 py-1">
          <div className="flex flex-row items-center">
            <img
              //   src={tmpProfileImg}
              // 데이터에 판매자 프사가 없음...
              className="rounded-full w-[43px] h-[43px] mr-3"
              draggable="false"
            />
            <span className="text-[20px]">꼬북맘</span>
          </div>
          <div className="cursor-pointer bg-[#7CBBF9] h-fit flex justify-center items-center rounded-[10px] font-bold px-3 py-2 text-white">
            채팅하기
          </div>
        </div>
      </div>
    </>
  );
}

export default AuctionItemInfo;
