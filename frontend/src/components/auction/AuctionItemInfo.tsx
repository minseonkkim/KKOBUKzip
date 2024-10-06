import { useState } from "react";
import { AuctionItemDataType } from "../../types/auction";
// import useChatStore from "../../store/useChatStore";

function AuctionItemInfo({ itemData }: { itemData: AuctionItemDataType }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // const { openChatDetail } = useChatStore();

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % itemData.auctionPhotos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? itemData.auctionPhotos.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
      <article className="flex flex-col w-full md:w-[48%] rounded-[20px] relative">
        <figure>
          <div className="relative w-full flex-grow md:flex-1 h-[240px] md:h-auto rounded-[20px] overflow-hidden">
            <img
              src={itemData.auctionPhotos[currentIndex]}
              className="w-full h-[380px] object-cover rounded-[20px]"
              alt="Turtle"
              draggable="false"
            />
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-[27px] p-2 rounded-full font-bold"
            >
              &lt;
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-[27px] p-2 rounded-full font-bold"
            >
              &gt;
            </button>
            <div className="absolute bottom-3 right-3 bg-black/60 text-white px-4 py-2 rounded-[20px]">
              {currentIndex + 1} / {itemData.auctionPhotos.length}
            </div>
          </div>
        </figure>

        <div className="text-[23px] mt-[13px]">{itemData.title}</div>

        <div className="flex flex-row justify-between lg:justify-start xl:justify-between items-center mt-[5px] mb-[10px]">
          <div className="text-[#9A9A9A] text-[17px]">
            {/* {itemData.turtleInfo.} */} | {itemData.weight}kg
            {/* 24년 8월 10일생 | 8kg */}
          </div>
          <div className="flex flex-row space-x-2">
            {itemData.auctionTags.map((tag, index) => (
              <span
                key={index}
                className="whitespace-nowrap px-2 py-1 rounded-full text-[18px] bg-[#D5F0DD] text-[#065F46]"
              >
                #{tag}
              </span>
            ))}
          </div>
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
              alt="profile image"
            />
            <span className="text-[20px]">꼬북맘</span>
          </div>
          {/* <div
            onClick={() => openChatDetail(itemData.sellerId, "꼬북맘")}
            className="cursor-pointer bg-[#7CBBF9] h-fit flex justify-center items-center rounded-[10px] font-bold px-3 py-2 text-white"
          >
            채팅하기
          </div> */}
        </div>
      </article>
    </>
  );
}

export default AuctionItemInfo;
