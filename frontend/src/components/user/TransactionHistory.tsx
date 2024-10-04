// import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TmpTurtleImg from "../../assets/tmp_turtle.jpg";
import BabyTurtleImg from "../../assets/babyturtle.webp";
import { IoCheckmark } from "@react-icons/all-files/io5/IoCheckmark";
import { useEscrowStore } from "../../store/useEscrowStore";
import { useWeb3Store } from "../../store/useWeb3Store";
import { useUserStore } from "../../store/useUserStore";
import useChatStore from "../../store/useChatStore";

interface TransactionHistoryProps {
  isAuction: boolean;
  turtleId: number;
  transactionId: number;
  buyerId: number;
  sellerId: number;
  sellerName: string;
  sellerAddress: string;
  transactionTag: string[];
  amount: number;
  transactionImage: string;
}

export default function TransactionHistory(
  props: TransactionHistoryProps | Partial<TransactionHistoryProps>
) {
  const navigate = useNavigate();
  const { isLogin, userInfo } = useUserStore();
  const { openChatDetail } = useChatStore();
  const { createTransaction, releaseFunds } = useEscrowStore();
  const { account } = useWeb3Store();
  // const [transactionState, setTransactionState] = useState<number | null>(null);

  // useEffect(() => {
  //     const fetchTransactionDetails = async () => {
  //         if (props.transactionId) {
  //             await getTransactionDetails(props.isAuction!, props.transactionId);
  //             const details = useEscrowStore.getState().transactionDetails;
  //             if (details) {
  //                 setTransactionState(details.state);
  //             }
  //         }
  //     };

  //     fetchTransactionDetails();
  // }, [props.isAuction, props.transactionId, getTransactionDetails]);

  const handleDeposit = async () => {
    if (
      account &&
      props.transactionId !== undefined &&
      props.sellerAddress &&
      props.amount !== undefined
    ) {
      const isFinish = await createTransaction(
        props.transactionId,
        props.sellerAddress,
        props.amount,
        String(props.turtleId),
        String(props.buyerId),
        String(props.sellerId)
      );
      if (isFinish) {
        alert("거래 대금 송금이 완료되었습니다. 서류 작성을 진행해 주세요.");
      } else {
        alert("거래 대금 송금해 실패했습니다. 다시 시도해 주세요.");
      }
    } else {
      console.error("Missing required props for createTransaction");
    }
  };

  const startPaperwork = () => {
    // 서류 페이지로 넘어가는 로직
    // 여기에 구매자(양수인), 판매자(양도인) 여부에 따라 네비게이트하는 로직 구체화
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
      {props.isAuction ? (
        // 경매
        <div></div>
      ) : (
        // 판매
        <div className="w-full border-[2px] rounded-[20px] p-[15px] bg-[#f8f8f8] flex flex-col md:flex-row lg:flex-col xl:flex-row">
          <div className="flex flex-row">
            <img
              src={props.transactionImage}
              className="w-[130px] lg:w-[200px] h-[130px] lg:h-[150px] rounded-[10px] object-cover"
              draggable="false"
              alt="turtle image"
            />
            <div className="flex flex-col justify-between w-[460px] ml-[20px]">
              <div>
                {/* <div>{props.sellerName}</div> */}

                <div className="mb-1 whitespace-nowrap font-extrabold text-[25px] text-[#4B721F] font-stardust">
                  {props.amount?.toLocaleString("ko-KR")}TURT
                </div>
                <div className="text-[15px] text-gray-700 flex flex-wrap space-x-1.5">
                  {props.transactionTag?.map((tag, index) => (
                    <span
                      key={index}
                      className="whitespace-nowrap bg-[#D5F0DD] text-[#065F46] px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-row space-x-3">
                {/* 아래 버튼은 거래 진행 상황에 따라 on/off하기! */}
                <div className="text-[18px] font-bold">
                  {/* 경매 거래인 경우에만 활성화 해당(입금 대기 상태일 때) */}
                  <button
                    className="whitespace-nowrap w-auto px-3 h-10 bg-[#E5E4FF] rounded-[10px] hover:bg-[#D6D5F0]"
                    onClick={handleDeposit}
                  >
                    입금하기
                  </button>
                  {/* 예약 단계에 활성화 */}
                  <button
                    className="whitespace-nowrap w-auto px-3 h-10 bg-[#E5E4FF] rounded-[10px] hover:bg-[#D6D5F0] hidden"
                    onClick={startPaperwork}
                  >
                    서류 작성
                  </button>
                  {/* 서류 검토 */}
                  <button
                    className="whitespace-nowrap w-auto px-3 h-10 bg-[#E5E4FF] rounded-[10px] hover:bg-[#D6D5F0] hidden"
                    onClick={finalizeTransaction}
                  >
                    구매 확정
                  </button>
                </div>
                <button
                  onClick={openChat}
                  className="whitespace-nowrap text-[18px] font-bold w-auto px-3 h-10 bg-[#D7E7F7] rounded-[10px] hover:bg-[#C9DBED]"
                >
                  채팅하기
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className="w-[360px] h-[104px] relative mt-[18px]">
              <div className="w-[290px] h-[0px] left-[24px] top-[68px] absolute border-[1.4px] border-gray-400"></div>

              <div className="left-0 top-0 absolute text-center text-black text-[16px]">
                입금대기
              </div>
              {/* 입금대기-완료 */}
              <div className="w-[30px] h-[30px] left-[8px] top-[53px] absolute bg-[#e7f6d1] rounded-full border border-black" />
              <div className="w-[14px] h-[14px] left-[10px] top-[54px] absolute">
                <IoCheckmark className="text-[28px]" />
              </div>
              {/* 입금대기-진행중 */}
              {/* <img className="w-[68px] left-[7px] top-[40px] absolute origin-top-left" src={BabyTurtleImg} draggable="false"/> */}
              {/* 입금대기-전 */}
              {/* <div className="w-[23px] h-[23px] left-[19px] top-[61px] absolute bg-[#aeaeae] rounded-full border border-black" /> */}

              <div className="left-[78px] top-0 absolute text-center text-black text-[16px]">
                예약
              </div>
              {/* 예약-완료 */}
              <div className="w-[30px] h-[30px] left-[77px] top-[53px] absolute bg-[#e7f6d1] rounded-full border border-black" />
              <div className="w-[14px] h-[14px] left-[79px] top-[54px] absolute">
                <IoCheckmark className="text-[28px]" />
              </div>
              {/* 예약-진행중 */}
              {/* <img className="w-[68px] left-[137px] top-[40px] absolute origin-top-left" src={BabyTurtleImg} draggable="false"/> */}
              {/* 예약-전 */}
              {/* <div className="w-[23px] h-[23px] left-[155px] top-[61px] absolute bg-[#aeaeae] rounded-full border border-black" /> */}

              <div className="left-[130px] top-0 absolute text-center text-black text-[16px] font-bold">
                서류검토
              </div>
              {/* 서류검토-완료 */}
              {/* <div className="w-[37px] h-[37px] left-[308px] top-[53px] absolute bg-[#e7f6d1] rounded-full border border-black" />
                <div className="w-[25px] h-[29px] left-[314px] top-[57px] absolute"><IoCheckmark className="text-[28px]"/></div> */}
              {/* 서류검토-진행중 */}
              <img
                className="w-[54px] left-[137px] top-[41px] absolute origin-top-left"
                src={BabyTurtleImg}
                draggable="false"
              />
              {/* 서류검토-전 */}
              {/* <div className="w-[23px] h-[23px] left-[317px] top-[61px] absolute bg-[#aeaeae] rounded-full border border-black" /> */}

              <div className="left-[206px] top-0 absolute text-center text-black text-[16px]">
                서류승인
              </div>
              {/* 서류검토-완료 */}
              <div className="w-[30px] h-[30px] left-[220px] top-[53px] absolute bg-[#e7f6d1] rounded-full border border-black" />
              <div className="w-[14px] h-[14px] left-[222px] top-[54px] absolute">
                <IoCheckmark className="text-[28px]" />
              </div>
              {/* 서류검토-진행중 */}
              {/* <img className="w-[68px] left-[297px] top-[40px] absolute origin-top-left" src={BabyTurtleImg} draggable="false"/> */}
              {/* 서류검토-전 */}
              {/* <div className="w-[23px] h-[23px] left-[317px] top-[61px] absolute bg-[#aeaeae] rounded-full border border-black" /> */}

              <div className="left-[280px] top-0 absolute text-center text-black text-[16px]">
                거래완료
              </div>
              {/* 거래완료-완료 */}
              {/* <div className="w-[37px] h-[37px] left-[457px] top-[53px] absolute bg-[#e7f6d1] rounded-full border border-black" />
                <div className="w-[25px] h-[29px] left-[463px] top-[57px] absolute"><IoCheckmark className="text-[28px]"/></div> */}
              {/* 거래완료-진행중 */}
              {/* <img className="w-[68px] left-[447px] top-[40px] absolute origin-top-left" src={BabyTurtleImg} draggable="false"/> */}
              {/* 거래완료-전 */}
              <div className="w-[20px] h-[20px] left-[298px] top-[59px] absolute bg-[#aeaeae] rounded-full border border-black" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
