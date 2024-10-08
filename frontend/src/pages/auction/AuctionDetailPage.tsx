import { useState, useEffect, useLayoutEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../../components/common/Header";
import { useNavigate, useParams } from "react-router-dom";
import { AuctionItemDataType } from "../../types/auction";
import { getAuctionDetailItemData } from "../../apis/tradeApi";
import AuctionItemInfo from "../../components/auction/AuctionItemInfo";
import BeforeAuction from "../../components/auction/BeforeAuction";
import DuringAuction from "../../components/auction/DuringAuction";
import AuctionItemInfoSkeleton from "../../components/skeleton/auction/AuctionItemInfoSkeleton";
import SuccessfulBid from "../../components/auction/SuccessfulBid";
import NoBid from "../../components/auction/NoBid";

// flow
// 1. 경매 시작 전 -> SSE 연결, get으로 가져옴
// 2. 경매 시작 -> SSE로 알림, WS로 교체
// 3. 경매 종료 -> WS 종료
// 소켓 통신
// 보유한 금액, 내가 누구인가
// 최고 입찰자 아이디, 금액

// 이 페이지는 타입이 3개.
// 1. 경매 전
// 2. 경매 진행 중
// 3. 경매 후
type AuctionType =
  | "BEFORE_AUCTION"
  | "DURING_AUCTION"
  | "NO_BID"
  | "SUCCESSFUL_BID"
  | null; // 1: 경매전 2: 경매중, 3: 유찰, 4: 낙찰, 5: 로딩중

function AuctionDetailPage() {
  const [auctionStatus, setAuctionStatus] = useState<AuctionType>(null); // 경매 상태, 13은 false, 2는 true
  const [auctionItemData, setAuctionItemData] =
    useState<AuctionItemDataType | null>(null);
  const params = useParams();
  const auctionId = params.auctionId;
  const [isValidId, setIsValidId] = useState(true);

  useLayoutEffect(() => {
    // 처음 옥션 데이터 로딩하는 부분

    const getData = async () => {
      const auctionId = Number(params.auctionId);
      if (isNaN(auctionId) || !Number.isInteger(auctionId)) {
        setIsValidId(false);
        return; // 이후 코드를 실행하지 않도록 합니다.
      }
      const response = await getAuctionDetailItemData(auctionId);
      if (response.success) {
        console.log(response);
        setAuctionStatus(response.data.data.auction.progress);
        setAuctionItemData(response.data.data.auction);
      } else {
        // 요청 실패 혹은 없는 거북이면 되돌아감
        goBack();
      }
    };

    getData();
  }, [auctionId]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isValidId) {
      navigate("/");
    }
  }, [isValidId, navigate]);

  const goBack = useCallback(() => {
    navigate(-1); // 이전 페이지로 이동
  }, [navigate]);

  // 옥션 전-> 옥션 진행
  const changeAuctionStatus = useCallback(() => {
    setAuctionItemData((prev) => {
      if (prev) {
        return { ...prev, remainingTime: 30000 };
      }
      return prev;
    })
    setAuctionStatus("DURING_AUCTION");
  }, []);

  const changeAuctionStatusToComplete = useCallback(
    (state: "NO_BID" | "SUCCESSFUL_BID") => {
      setAuctionStatus(state);
    },
    []
  );

  return (
    <>
      <Helmet>
        <title>경매중인 거북이</title>
      </Helmet>
      <Header />
      <main className="px-4 lg:px-[250px] mt-[78px]">
        {/* 테스트 드라이버 */}
        <div className="grid grid-cols-4">
          <button
            className="bg-slate-200"
            onClick={() => setAuctionStatus("BEFORE_AUCTION")}
          >
            BEFORE_AUCTION
          </button>
          <button
            className="bg-slate-200"
            onClick={() => setAuctionStatus("DURING_AUCTION")}
          >
            DURING_AUCTION
          </button>
          <button
            className="bg-slate-200"
            onClick={() => setAuctionStatus("NO_BID")}
          >
            NO_BID
          </button>
          <button
            className="bg-slate-200"
            onClick={() => setAuctionStatus("SUCCESSFUL_BID")}
          >
            SUCCESSFUL_BID
          </button>
        </div>
        {/* 테스트 드라이버 끝 */}

        <div className="whitespace-nowrap text-[28px] md:text-[33px] text-gray-900 font-dnf-bitbit pt-0 lg:pt-[18px] pb-[13px]">
          <span className="cursor-pointer" onClick={goBack}>
            &lt;&nbsp;경매중인 거북이
          </span>
        </div>
        <div className="h-full md:h-[675px] flex flex-col md:flex-row justify-between mt-[10px]">
          {/* 좌측 거북이 정보 */}
          {auctionStatus === null ? (
            // 스켈레톤 애니메이션
            <AuctionItemInfoSkeleton />
          ) : (
            <AuctionItemInfo itemData={auctionItemData!} />
          )}

          {/* 경매 상태별 컴포넌트 */}
          {auctionStatus === "BEFORE_AUCTION" && (
            <BeforeAuction
              changeAuctionStatus={changeAuctionStatus}
              startTime={auctionItemData!.startTime}
              minBid={auctionItemData!.minBid}
              auctionId={Number(auctionId)}
            />
          )}
          {auctionStatus === "DURING_AUCTION" && auctionItemData!.nowBid !== null && (
            <DuringAuction
              minBid={auctionItemData!.minBid}
              channelId={String(auctionItemData?.id)}
              initialBid={auctionItemData!.nowBid}
              initTime={auctionItemData!.remainingTime}
            />
          )}
          {auctionStatus === "NO_BID" || <NoBid />}
          {auctionStatus === "SUCCESSFUL_BID" && auctionItemData!.nowBid !== null && (
            <SuccessfulBid nowBid={auctionItemData!.nowBid} />
          )}
        </div>
      </main>
    </>
  );
}

export default AuctionDetailPage;
