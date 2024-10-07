import { useEffect } from "react";
import TmpTurtle from "../../assets/tmp_turtle_2.jpg";
import { AuctionItemDataType, AuctionListDataType } from "../../types/auction";
import AuctionStatusTag from "./AuctionStatusTag";
import { useNavigate } from "react-router-dom";

export default function AuctionTurtle({
  data,
}: {
  data?: AuctionListDataType;
}) {
  const navigate = useNavigate();

  const goToDetail = () => {
    navigate("/auction-detail/" + (data?.id ?? 1));
  };

  return (
    <div onClick={goToDetail}>
      <div className="bg-[#F8F9FA] shadow-lg transition-shadow duration-300 w-full max-w-sm h-[300px] rounded-2xl flex flex-col cursor-pointer active:scale-95 relative">
        <div className="overflow-hidden rounded-t-2xl relative">
          <img
            src={data?.firstImageUrl}
            className="w-full h-[200px] object-cover transition-transform duration-300 hover:scale-110"
            draggable="false"
            alt="turtle image"
          />
        </div>
        <div className="absolute top-4 right-4">
          <AuctionStatusTag
            progress={
              data?.auctionProgress === "BEFORE_AUCTION"
                ? "경매전"
                : data?.auctionProgress === "DURING_AUCTION"
                ? "경매중"
                : data?.auctionProgress === "NO_BID"
                ? "유찰"
                : "낙찰"
            }
          />
        </div>
        <div className="px-3 py-2">
          <div className="w-full overflow-hidden text-[20px] mb-4 text-gray-900 whitespace-nowrap text-ellipsis">
            {data?.title}
          </div>

          <div className="flex justify-between items-center">
            <div className="text-[15px] xl:text-[17px] whitespace-nowrap text-[#9A9A9A]">
              페닐슐라쿠터
            </div>
            <div className="text-[15px] text-gray-700 flex space-x-1.5">
              {data?.auctionTags?.map((tag, index) => (
                <span
                  key={index}
                  className="whitespace-nowrap bg-[#D5F0DD] text-[#065F46] px-2 py-1 rounded-full"
                >
                  {tag.tag}
                </span>
              ))}
            </div>
          </div>
          <div className="font-bold flex flex-row items-end font-stardust text-[#4B721F]">
            <div className="text-[28px] md:text-[32px]">
              {(data?.nowBid || 0).toLocaleString("ko-KR")}
            </div>
            <div className="text-[18px] md:text-[22px]">TURT</div>
            <div className="text-[28px] md:text-[32px]">↑</div>
          </div>
        </div>
      </div>
    </div>
  );
}
