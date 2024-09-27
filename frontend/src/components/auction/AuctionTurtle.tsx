import TmpTurtle from "../../assets/tmp_turtle_2.jpg";
import { AuctionItemDataType } from "../../types/auction";
import AuctionStatusTag from "./AuctionStatusTag";
import { useNavigate } from "react-router-dom";

export default function AuctionTurtle({
  data,
}: {
  data?: AuctionItemDataType;
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
            src={TmpTurtle}
            className="w-full h-[200px] object-cover transition-transform duration-300 hover:scale-110"
            draggable="false"
            alt="turtle image"
          />
        </div>
        <div className="absolute top-4 right-4">
          <AuctionStatusTag progress={"경매중"} />
        </div>
        <div className="px-3 py-1">
          <div className="flex justify-between items-center my-2">
            <h3 className="text-[16px] xl:text-[17px] font-semibold whitespace-nowrap">
              페닐슐라쿠터
            </h3>
            <div className="text-[15px] text-gray-700 flex space-x-1.5">
              <span className="whitespace-nowrap bg-[#D5F0DD] text-[#065F46] px-2 py-1 rounded-full">
                #태그
              </span>
            </div>
          </div>
          {/* 가격, 시간 라이브러리 쓰기 */}
          <div className="flex flex-col">
            <div className="whitespace-nowrap font-extrabold text-3xl text-[#4B721F] mt-1 font-stardust">
              3,000,000원↑
            </div>
          </div>
          <div className="text-[18px] text-[#BA0606]">10초 뒤 가격 상승</div>
        </div>
      </div>
    </div>
  );
}
