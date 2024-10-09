import { useEffect, useRef, useState } from "react";
import MovingTurtle from "../../assets/moving_turtle.webp";
import { useSpring, animated } from "@react-spring/web";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { useUserStore } from "../../store/useUserStore";

interface StompFrame {
  command: string;
  headers: Record<string, string>;
  body?: string;
}

interface DefaultType {
  bidAmount: number;
  nextBid: number;
  remainingTime: number;
}

interface JoinData {
  Join: DefaultType;
}

interface BidData {
  Bid: {
    bidRecord: MessageType;
  };
}

interface EndData {
  End: {
    bidAmount: number;
  };
}

interface WsResponseType {
  status: string;
  data: {
    data: BidData | JoinData | EndData;
  };
  message: string;
}

interface MessageType extends DefaultType {
  auctionId: string;
  userId: string;
  nickname: string;
}

function DuringAuction({
  channelId,
  minBid,
  // 남은시간, 현재 입찰가 추가
  // 남은시간이 -2이면 경매시간이 아니라는 뜻
  initTime,
  initialBid,
  changeAuctionStatusToComplete,
}: {
  channelId: string;
  minBid: number;
  initTime: number;
  initialBid: number;
  changeAuctionStatusToComplete: (
    state: "NO_BID" | "SUCCESSFUL_BID",
    winningBid?: number
  ) => void;
}) {
  const auctionStompClient = useRef<CompatClient | null>(null);

  const auctionId = Number(channelId);
  const [loading, setLoading] = useState(true);
  // const [isBidStarted, setIsBidStarted] = useState(false);
  const [nowBid, setNowBid] = useState(initialBid);
  const [nextBid, setNextBid] = useState(minBid);
  const { userInfo } = useUserStore();

  const [remainingTime, setRemainingTime] = useState(initTime);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      // WebSocket 주소에 token과 auctionId를 쿼리 파라미터로 추가
      const socketAddress = `${
        import.meta.env.VITE_SOCKET_AUCTION_URL
      }?token=${token}&auctionId=${auctionId}`;
      const socket = new WebSocket(socketAddress);

      auctionStompClient.current = Stomp.over(socket);

      auctionStompClient.current.connect(
        {
          // Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`
        },
        (frame: StompFrame) => {
          console.log("Connected: " + frame);
          console.log("userID : ", userInfo!.userId);
          auctionStompClient.current!.subscribe(
            `/user/queue/auction/${auctionId}/init`,
            // 초기 데이터 수신 처리
            (message) => {
              const newMessage: WsResponseType = JSON.parse(message.body);
              handleAuctionMessage(newMessage);
              console.log("Received init message at auction:", newMessage);
            }
          );

          auctionStompClient.current!.subscribe(
            `/sub/auction/${auctionId}`,
            (message) => {
              const newMessage: WsResponseType = JSON.parse(message.body);
              console.log("Received message while auction:", newMessage);
              handleAuctionMessage(newMessage);
            }
          );

          auctionStompClient.current!.send(
            `/pub/auction/${auctionId}/init`,
            {},
            JSON.stringify({})
          );
          console.log("빈값으로 보내기");
        },
        (error: unknown) => {
          console.error("Connection error: ", error);
        }
      );
      setLoading(false);
    };
    init();

    return () => {
      if (auctionStompClient.current) {
        auctionStompClient.current.disconnect();
      }
    };
  }, [channelId]);

  // Meesage 타입 분기 함수 (Join, Bid, End)
  const handleAuctionMessage = (newMessage: WsResponseType) => {
    if ("Bid" in newMessage.data) {
      const bidData = newMessage.data as BidData;

      const updatedTime = ~~(bidData.Bid.bidRecord.remainingTime / 1000);

      setBidPrice(bidData.Bid.bidRecord.nextBid);
      console.log("remainingTime : ", bidData.Bid.bidRecord.remainingTime);
      setRemainingTime(updatedTime);
      setNextBid(bidData.Bid.bidRecord.nextBid);

      //추가한 내용
      setTimeLeft(updatedTime);

      setBidHistory((prev) => {
        const newHistory = [
          ...prev,
          {
            bidder: bidData.Bid.bidRecord.nickname,
            price: Number(bidData.Bid.bidRecord.bidAmount),
          },
        ];
        return newHistory.slice(0, 8);
      });
    } else if ("Join" in newMessage.data) {
      const joinData = newMessage.data as JoinData;
      console.log("Join event: ", joinData.Join);
      setRemainingTime(joinData.Join.remainingTime);
      setNextBid(joinData.Join.nextBid);

      // Join 이벤트 처리
      if (joinData.Join.bidAmount === 0) {
        setBidPrice(joinData.Join.nextBid);
      } else {
        setBidPrice(joinData.Join.bidAmount);
      }
    } else if ("End" in newMessage.data) {
      const endData = newMessage.data as EndData;
      if (newMessage.status === "205") {
        changeAuctionStatusToComplete("NO_BID");
      } else {
        changeAuctionStatusToComplete("SUCCESSFUL_BID", endData.End.bidAmount);
      }

      console.log("Auction Ended, final bid amount:", endData.End.bidAmount);
      // End 이벤트 처리
      // set 관련 로직을 추가할 수 있음
    }
  };

  // 입찰 요청 보내기
  const sendBidRequest = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const data = {
        auctionId,
        userId: userInfo?.userId,
        nickname: userInfo?.nickname, // 추가
        bidAmount: bidPrice,
        nextBid: nextBid, // 추가
        remainingTime: remainingTime,
      };

      if (auctionStompClient.current && auctionStompClient.current.connected)
        auctionStompClient.current.send(
          `/pub/auction/${auctionId}/bid`,
          {
            //  Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`
          },
          JSON.stringify(data)
        );
      console.log("메세지BidRequest 테스트", data);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  };

  const [bidPrice, setBidPrice] = useState(nowBid); // 입찰가
  const [bidHistory, setBidHistory] = useState<
    { bidder: string; price: number }[]
  >([
    // { bidder: "민굥", price: 3400000 },
  ]);

  const [springProps, api] = useSpring(() => ({
    price: bidPrice,
    config: { duration: 1000 },
  }));
  const [showEmoji, setShowEmoji] = useState(false);
  const [emojiSpring, emojiApi] = useSpring(() => ({
    from: { opacity: 0, transform: "translateY(50px)" },
    to: { opacity: 0, transform: "translateY(50px)" },
  }));

  const [timeLeft, setTimeLeft] = useState(~~(remainingTime / 1000)); // 남은시간으로 변경
  const [auctionEnded, setAuctionEnded] = useState(false);

  // **Progress bar 애니메이션 설정**
  const [, setProgress] = useState(100);

  // 애니메이션으로 부드럽게 진행되는 프로그레스 바
  const progressSpring = useSpring({
    progress: (timeLeft / 30) * 100, // 프로그레스 상태를 애니메이션으로
    config: { tension: 120, friction: 14 }, // 부드러운 애니메이션 설정
  });

  // **거북이 위치 애니메이션 설정**
  const turtlePositionSpring = useSpring({
    left: progressSpring.progress.to((val) => {
      const newPosition = Math.max(val - 9.2, 0.2); // Ensure left is not less than 10
      return `${newPosition}%`;
    }),
    config: { tension: 120, friction: 14 },
  });

  useEffect(() => {
    // 30초 동안 지속적으로 감소하는 애니메이션
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          const newTime = prevTime - 1;
          return newTime;
        } else {
          clearInterval(timer);
          setAuctionEnded(true);
          return 0;
        }
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    // 프로그레스 값을 실시간으로 업데이트하여 자연스러운 진행 표시
    setProgress((100 * timeLeft) / 30);
  }, [timeLeft]);
  // ------------------여기까지 작성했음--------------

  useEffect(() => {
    api.start({ price: bidPrice });
  }, [bidPrice, api]);

  return (
    <>
      {/* 경매중 */}
      <div className="w-[48%] h-[675px] bg-[#EAF5DD] rounded-[20px] flex flex-col justify-start items-center">
        <div className="w-full bg-[#EAEAEA] rounded-full h-[10px] relative">
          <animated.div
            className="bg-[#4B721F] h-[10px] rounded-full"
            style={{
              width: progressSpring.progress.to((val) => `${val}%`),
            }}
          ></animated.div>

          <animated.div
            className="absolute -top-8"
            style={turtlePositionSpring}
          >
            <img
              src={MovingTurtle}
              className="w-[57px]"
              draggable="false"
              alt="turtle image"
            />
          </animated.div>
        </div>
        <div className="w-full mb-3">
          <div className="text-right text-[33px] font-bold m-3">
            {`${timeLeft}`}
          </div>
        </div>
        <div className="w-full px-[40px]">
          <div className="flex flex-col justify-center items-center mb-4">
            <div className="flex flex-row items-center">
              <div className="font-bold text-[20px] md:text-[25px]">
                {minBid === bidPrice ? "최소 입찰가" : "현재 입찰가"}
                &nbsp;&nbsp;
              </div>
              <div className="font-bold flex flex-row items-end font-stardust text-[#4B721F]">
                <animated.div className="text-[31px] md:text-[39px]">
                  {springProps.price.to(
                    (price) => `${Math.floor(price).toLocaleString()}`
                  )}
                </animated.div>
                <div className="text-[27px] md:text-[29px]">TURT</div>
              </div>
            </div>
            <button
              onClick={() => {
                // handleBid();
                sendBidRequest();
              }}
              className="mt-4 cursor-pointer bg-[#4B721F] text-white py-3 px-7 rounded-[10px] active:scale-90 text-[30px] font-dnf-bitbit"
              disabled={auctionEnded}
            >
              {loading ? (
                <div className="w-9 h-8 mx-16 my-2 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : auctionEnded ? (
                "낙찰 완료"
              ) : (
                "👋🏻 입찰하기"
              )}
            </button>
            <div>다음입찰가:{nextBid}</div>

            <div>
              {bidHistory.map((el, index) => {
                return (
                  <div key={index}>
                    {index === 0 ? (
                      <span style={{ fontSize: "1.5em", fontWeight: "bold" }}>
                        {el.bidder} : {el.price}
                      </span>
                    ) : (
                      <span>
                        {el.bidder} : {el.price}
                      </span>
                    )}
                    <br />
                  </div>
                );
              })}
            </div>
            {showEmoji && (
              <animated.div
                style={emojiSpring}
                className="mt-3 text-[60px] absolute bottom-40"
              >
                👋🏻
              </animated.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default DuringAuction;
