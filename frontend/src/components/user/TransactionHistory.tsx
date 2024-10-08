import { useNavigate } from "react-router-dom";
import BabyTurtleImg from "../../assets/babyturtle.webp";
import { IoCheckmark } from "@react-icons/all-files/io5/IoCheckmark";
import { useEscrowStore } from "../../store/useEscrowStore";
import { useWeb3Store } from "../../store/useWeb3Store";
import { useUserStore } from "../../store/useUserStore";
import useChatStore from "../../store/useChatStore";
import NoTurtleImg from "../../assets/NoTurtleImg.webp"

interface TransactionHistoryProps {
  auctionFlag: boolean;
  turtleId: number;
  turtleUuid: string;
  transactionId: number;
  sellerId: number;
  sellerUuid: string;
  sellerName: string;
  sellerAddress: string;
  transactionTag: string[];
  transactionImage: string[];
  amount: number;
  progress: string;
}

export default function TransactionHistory(props: TransactionHistoryProps | Partial<TransactionHistoryProps>) {
  const navigate = useNavigate();
  const { isLogin, userInfo } = useUserStore();
  const { openChatDetail } = useChatStore();
  const { createTransaction, releaseFunds } = useEscrowStore();
  const { account } = useWeb3Store();

  const handleDeposit = async () => {
    if (account && props.transactionId !== undefined && props.sellerAddress && props.amount !== undefined) {
      const isFinish = await createTransaction(props.transactionId, props.sellerAddress, ~~props.amount, props.turtleUuid!, userInfo!.uuid, props.sellerUuid!);
      if (isFinish) {
        alert("거래 대금 송금이 완료되었습니다. 서류 작성을 진행해 주세요.");
      } else {
        alert("거래 대금 송금이 실패했습니다. 다시 시도해 주세요.");
      }
    } else {
      console.error("Missing required props for createTransaction");
    }
  };

  const startPaperwork = () => {
    if (userInfo?.userId === props.sellerId) {
      navigate("/doc-form/grant", {
        state: { turtleId: props.turtleId, transactionId: props.transactionId },
      });
      console.log("Navigate to seller paperwork page");
    } else {
      navigate("/doc-form/assign", {
        state: { turtleId: props.turtleId, transactionId: props.transactionId },
      });
      console.log("Navigate to buyer paperwork page");
    }
  };

  const finalizeTransaction = async () => {
    if (props.transactionId !== undefined) {
      const isFinish = await releaseFunds(props.transactionId);
      if (isFinish) {
        alert("구매가 확정되어 거래가 완료되었습니다.");
      } else {
        alert("구매 확정에 실패했습니다. 다시 시도해 주세요.");
      }
    } else {
      console.error("TransactionId is undefined");
    }
  };

  const openChat = () => {
    if (isLogin && userInfo) {
      if (props.sellerName) {
        openChatDetail(userInfo.userId, props.sellerName);
      } else {
        alert("존재하지 않는 유저입니다");
      }
    } else {
      alert("로그인해주세요!");
    }
  };

  return (
    <>
      <div className="w-full border-[2px] rounded-[20px] p-[15px] bg-[#f8f8f8] flex flex-col justify-between md:flex-row lg:flex-col xl:flex-row">
        <div className="flex flex-row">
          <img src={props.transactionImage ? props.transactionImage[0] : NoTurtleImg} loading="lazy" className="w-[130px] lg:w-[200px] h-[130px] lg:h-[150px] rounded-[10px] object-cover" draggable="false" alt="turtle image" />
          <div className="flex flex-col justify-between w-[300px] ml-[15px]">
            <div>
              {/* <div>{props.sellerName}</div> */}

              <div className="mb-1 whitespace-nowrap flex flex-row items-end font-bold font-stardust text-[#4B721F]">
                <div className="text-[27px] md:text-[29px]">{props.amount?.toLocaleString("ko-KR")}</div>
                <div className="text-[20px] md:text-[21px]">TURT</div>
              </div>
              <div className="text-[15px] text-gray-700 flex flex-wrap space-x-1">
                {props.transactionTag
                  ?.concat("#거래")
                  .map((tag, index) => (
                    <span
                      key={index}
                      className={`whitespace-nowrap px-2 py-1 my-0.5 rounded-full ${
                        tag === "#경매"
                          ? "bg-[#FDE68A] text-[#B45309]"  // 경매 태그에 대한 스타일
                          : tag === "#거래"
                          ? "bg-[#BFDBFE] text-[#1D4ED8]"  // 거래 태그에 대한 스타일
                          : "bg-[#D5F0DD] text-[#065F46]"  // 일반 태그에 대한 스타일
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
              </div>

            </div>
            <div className="flex flex-row">
              <button onClick={openChat} className="mr-3 whitespace-nowrap text-[18px] font-bold w-auto px-3 h-10 bg-[#D7E7F7] rounded-[10px] hover:bg-[#C9DBED]">
                채팅하기
              </button>
              {/* 아래 버튼은 거래 진행 상황에 따라 on/off하기! */}
              <div className="text-[18px] font-bold">
                {/* 경매 거래인 경우에만 활성화 해당(입금 대기 상태일 때) */}
                {(userInfo?.userId !== props.sellerId) && (props.progress === "SAIL") && (
                  <button className="whitespace-nowrap w-auto px-3 h-10 bg-[#E5E4FF] rounded-[10px] hover:bg-[#D6D5F0]" onClick={handleDeposit}>
                    입금하기
                  </button>
                )}
                {/* 예약 단계에 활성화 */}
                {props.progress === "REVIEW_DOCUMENT" && (
                  <button className="whitespace-nowrap w-auto px-3 h-10 bg-[#E5E4FF] rounded-[10px] hover:bg-[#D6D5F0]" onClick={startPaperwork}>
                    {userInfo!.userId !== props.sellerId ? "양수" : "양도"} 서류 작성
                  </button>
                )}
                {/* 서류 검토 */}
                {(userInfo?.userId !== props.sellerId) && (props.progress === "APPROVED_DOCUMENT") && (
                  <button className="whitespace-nowrap w-auto px-3 h-10 bg-[#E5E4FF] rounded-[10px] hover:bg-[#D6D5F0]" onClick={finalizeTransaction}>
                    구매 확정
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div>
         
                    
          {/* 판매 */}
          <div className="w-[360px] h-[104px] relative mt-[18px]">
            <div className="w-[290px] h-[0px] left-[24px] top-[68px] absolute border-[1.4px] border-gray-400"></div>

            <div className={`left-0 top-0 absolute text-center text-black text-[16px] ${props.progress == "SAIL" ? 'font-bold' : ''}`}>판매중</div>
            {props.progress == "SAIL" ?
              <img className="w-[54px] left-0 top-[40px] absolute origin-top-left" src={BabyTurtleImg} draggable="false"/>
            : <><div className="w-[30px] h-[30px] left-[8px] top-[53px] absolute bg-[#e7f6d1] rounded-full border border-black" />
            <div className="w-[14px] h-[14px] left-[10px] top-[54px] absolute">
              <IoCheckmark className="text-[28px]" />
            </div></>
            }

            <div className={`left-[92px] top-0 absolute text-center text-black text-[16px] ${props.progress == "REVIEW_DOCUMENT" ? 'font-bold' : ''}`}>서류검토</div>
            {props.progress == "REVIEW_DOCUMENT" ? 
            <img className="w-[54px] left-[97px] top-[41px] absolute origin-top-left" src={BabyTurtleImg} draggable="false" />
            : (props.progress == "SAIL" ? <div className="w-[20px] h-[20px] left-[112px] top-[59px] absolute bg-[#aeaeae] rounded-full border border-black" /> : 
             <><div className="w-[30px] h-[30px] left-[106px] top-[53px] absolute bg-[#e7f6d1] rounded-full border border-black" />
                  <div className="w-[14px] h-[14px] left-[108px] top-[54px] absolute"><IoCheckmark className="text-[28px]"/></div></>
            )}
         

            <div className={`left-[188px] top-0 absolute text-center text-black text-[16px] ${props.progress == "APPROVED_DOCUMENT" ? 'font-bold' : ''}`}>서류승인</div>
            {props.progress == "APPROVED_DOCUMENT" ?
            <img className="w-[54px] left-[192px] top-[40px] absolute origin-top-left" src={BabyTurtleImg} draggable="false"/> :
             (props.progress == "COMPLETED" ?<><div className="w-[30px] h-[30px] left-[202px] top-[53px] absolute bg-[#e7f6d1] rounded-full border border-black" />
            <div className="w-[14px] h-[14px] left-[204px] top-[54px] absolute">
              <IoCheckmark className="text-[28px]" />
            </div></> : <div className="w-[20px] h-[20px] left-[207px] top-[59px] absolute bg-[#aeaeae] rounded-full border border-black" />)}
           

            <div className={`left-[280px] top-0 absolute text-center text-black text-[16px] ${props.progress == "COMPLETED" ? 'font-bold' : ''}`}>거래완료</div>
            {props.progress == "COMPLETED" ?  <img className="w-[54px] left-[284px] top-[40px] absolute origin-top-left" src={BabyTurtleImg} draggable="false"/>: <div className="w-[20px] h-[20px] left-[298px] top-[59px] absolute bg-[#aeaeae] rounded-full border border-black" />}
          </div>
        </div>
      </div>
    </>
  );
}
