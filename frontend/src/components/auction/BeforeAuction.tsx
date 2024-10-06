import { useEffect } from "react";

function BeforeAuction({
  startTime,
  minBid,
  changeAuctionStatus,
}: {
  startTime: Date;
  minBid: number;
  changeAuctionStatus: () => void;
}) {
  useEffect(() => {
    const SSE_URL = import.meta.env.VITE_SSE_AUCTION_URL;
    const eventSource = new EventSource(SSE_URL);
    // 여기에서 SSE 연결하기
    eventSource.onmessage = (event) => {
      console.log(event.data);
      changeAuctionStatus();
    };

    // 컴포넌트 언마운트 시 연결 종료
    return () => {
      eventSource.close();
    };
  }, []);

  const date = new Date(startTime);

  const year = String(date.getFullYear()).slice(-2); // 마지막 두 자리
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 1부터 시작
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0"); // 초 추가

  const formattedDate = `${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds}`;
  return (
    <>
      {/* 경매전 */}
      <div className="my-5 mb-10 md:my-0 md:mb-0 h-[130px] md:h-[675px] w-full md:w-[48%] bg-[#F2F2F2] rounded-[20px] flex flex-col justify-center items-center">
        <div className="text-[#5E5E5E] font-bold text-[19px] md:text-[23px] text-center mx-5">
          {/* 24년 09월 30일 14:30:00 경매 시작 */}
          {formattedDate} 경매 시작
        </div>
        <div className="flex flex-row items-center mt-[15px] whitespace-nowrap mx-2">
          <div className="font-bold text-[20px] md:text-[25px]">
            최소 입찰가&nbsp;&nbsp;
          </div>
          <div className="font-bold flex flex-row items-end font-stardust text-[#4B721F]">
            <div className="text-[31px] md:text-[39px]">
              {minBid.toLocaleString("ko-KR")}
            </div>
            <div className="text-[27px] md:text-[29px]">TURT</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BeforeAuction;
