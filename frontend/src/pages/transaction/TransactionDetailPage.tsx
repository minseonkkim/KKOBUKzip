import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, Suspense, lazy } from "react";
import useChatStore from "../../store/useChatStore";
import { useEscrowStore } from "../../store/useEscrowStore";
import { getTransactionDetailItemData } from "../../apis/tradeApi";
import { TransactionItemDetailType } from "../../types/transaction";
import formatDate from "../../utils/formatDate";
import { useUserStore } from "../../store/useUserStore";
import tmpProfileImg from "../../assets/tmp_profile.gif";
import { FaAngleLeft } from "@react-icons/all-files/fa/FaAngleLeft";
import { FaAngleRight } from "@react-icons/all-files/fa/FaAngleRight";

// Lazy load components
const Header = lazy(() => import("../../components/common/Header"));
const TransactionDetailSkeleton = lazy(
  () =>
    import("../../components/skeleton/transaciton/TransactionDetailSkeleton")
);

function TransactionDetailPage() {
  const [transactionData, setTransactionData] =
    useState<null | TransactionItemDetailType>(null);
  const { createTransaction } = useEscrowStore();
  const { openChatDetail } = useChatStore();
  const navigate = useNavigate();
  const params = useParams();
  const { isLogin, userInfo } = useUserStore();

  const goBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  useEffect(() => {
    const getTransactionDetailData = async () => {
      const id = params.id;
      if (id) {
        const result = await getTransactionDetailItemData(id);
        if (result.success) {
          setTransactionData(result.data.data.turtle);
        }
      } else {
        navigate(-1);
      }
    };

    getTransactionDetailData();
  }, [params.id, navigate]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (transactionData) {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % transactionData.transactionImage.length
      );
    }
  };

  const handlePrev = () => {
    if (transactionData) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0
          ? transactionData.transactionImage.length - 1
          : prevIndex - 1
      );
    }
  };

  const handleDeposit = async () => {
    // await createTransaction(isAuction, transactionId, sellerAddress, amount);
    alert(
      "결제가 완료되었습니다. 마이페이지로 이동하여 서류 작성을 진행해 주세요!"
    );
  };

  const openChat = () => {
    if (isLogin && userInfo && transactionData) {
      openChatDetail(userInfo.userId, transactionData.sellerName);
    } else {
      alert("로그인해주세요!");
    }
  };

  return (
    <>
      <Helmet>
        <title>판매중인 거북이</title>
      </Helmet>

      <Suspense fallback={<TransactionDetailSkeleton />}>
        <Header />
      </Suspense>

      <div className="px-4 lg:px-[250px] mt-[85px]">
        <div className="cursor-pointer whitespace-nowrap text-[28px] md:text-[33px] text-gray-900 font-dnf-bitbit pt-0 lg:pt-[18px] pb-[13px]">
          <span onClick={goBack}>&lt;&nbsp;판매중인 거북이</span>
        </div>
        <div className="h-full md:h-[675px] flex flex-col md:flex-row justify-between mt-[10px]">
          {transactionData ? (
            <>
              <div className="flex flex-col w-full md:w-[48%] rounded-[20px] relative">
                <div className="relative w-full flex-grow md:flex-1 h-[240px] md:h-auto rounded-[20px] overflow-hidden">
                  <img
                    src={transactionData.transactionImage[currentIndex]}
                    className="w-full h-[380px] object-cover rounded-[20px]"
                    alt="Turtle"
                    draggable="false"
                  />

                  <FaAngleLeft onClick={handlePrev} className="cursor-pointer absolute left-1 top-1/2 transform -translate-y-1/2 text-white/50 text-[80px] p-2 font-bold"/>
                  <FaAngleRight onClick={handleNext} className="cursor-pointer absolute right-1 top-1/2 transform -translate-y-1/2 text-white/50 text-[80px] p-2 font-bold"/>


                  <div className="absolute bottom-3 right-3 bg-black/60 text-white px-4 py-2 rounded-[20px]">
                    {currentIndex + 1} /{" "}
                    {transactionData.transactionImage.length}
                  </div>
                </div>
                <div className="text-[23px] mt-[13px]">
                  {transactionData.title}
                </div>
                <div className="flex flex-row justify-between lg:justify-start xl:justify-between items-center mt-[10px] mb-[10px]">
                  <div className="text-[#9A9A9A] text-[18px]">
                    {transactionData.scientificName} |{" "}
                    {formatDate(transactionData.createDate ?? "")} |{" "}
                    {transactionData.weight}kg
                  </div>
                  <div className="flex flex-row space-x-2">
                    {transactionData.transactionTag.map((tag, index) => (
                      <span
                        key={index}
                        className="whitespace-nowrap px-2 py-1 rounded-full text-[16px] bg-[#D5F0DD] text-[#065F46]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-[17px] leading-7 border-[2px] rounded-[10px] p-2 line-clamp">
                  {transactionData.content}
                </div>
                <div className="mt-[20px] mb-[3px] text-[#737373] font-bold">
                  판매자 정보
                </div>
                <div className="bg-[#F2F2F2] h-[60px] rounded-[10px] flex flex-row justify-between items-center px-2 py-1">
                  <div className="flex flex-row items-center">
                    <img
                      src={tmpProfileImg}
                      className="rounded-full w-[43px] h-[43px] mr-3"
                      draggable="false"
                      alt="profile image"
                    />
                    <span className="text-[20px]">
                      {transactionData.sellerName ?? "loading..."}
                    </span>
                  </div>
                  <div
                    onClick={openChat}
                    className="cursor-pointer bg-[#7CBBF9] h-fit flex justify-center items-center rounded-[10px] font-bold px-3 py-2 text-white"
                  >
                    채팅하기
                  </div>
                </div>
              </div>

              <div className="my-5 mb-10 md:my-0 md:mb-0 w-full md:w-[48%] h-[130px] md:h-[675px] bg-[#EAF5DD] rounded-[20px] flex flex-col justify-start items-center">
                <div className="w-full px-[20px] md:px-[40px] h-full flex justify-center items-center mt-3 md:mt-0">
                  <div className="w-full flex flex-row md:flex-col justify-between items-center mb-4">
                    <div className="whitespace-nowrap flex flex-row md:flex-col xl:flex-row items-center">
                      <div className="font-bold text-[20px] md:text-[25px]">
                        판매가&nbsp;&nbsp;
                      </div>
                      <div className="font-bold flex flex-row items-end font-stardust text-[#4B721F]">
                      <div className="text-[31px] md:text-[39px]">
                        {Math.floor(8000000).toLocaleString()} 
                      </div>
                      <div className="text-[27px] md:text-[29px]">TURT</div>
                      </div>
                    </div>

                    {transactionData.progress === "COMPLETED" && (
                      <button className="whitespace-nowrap mt-0 md:mt-5 cursor-not-allowed bg-gray-600 text-white py-2 px-4 md:py-3 md:px-7 rounded-[10px] active:scale-90 text-[23px] md:text-[30px] font-dnf-bitbit">
                        판매완료
                      </button>
                    )}
                    {transactionData.progress === "SAIL" && (
                      <button
                        className="whitespace-nowrap mt-0 md:mt-5 cursor-pointer bg-[#4B721F] text-white py-2 px-4 md:py-3 md:px-7 rounded-[10px] active:scale-90 text-[23px] md:text-[30px] font-dnf-bitbit"
                        onClick={handleDeposit}
                      >
                        구매하기
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <TransactionDetailSkeleton />
          )}
        </div>
      </div>
    </>
  );
}

export default TransactionDetailPage;
