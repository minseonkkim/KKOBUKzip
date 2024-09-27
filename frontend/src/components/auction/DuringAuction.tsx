import { useEffect, useRef, useState } from "react";
import MovingTurtle from "../../assets/moving_turtle.webp";
import { useSpring, animated } from "@react-spring/web";
import { CompatClient, Stomp } from "@stomp/stompjs";

interface StompFrame {
  command: string;
  headers: Record<string, string>;
  body?: string;
}

interface message {
  auctionId: number;
  userId: number;
  bidAmount: number;
}

const auctionId = 1;
function DuringAuction({ channelId }: { channelId: string }) {
  const auctionStompClient = useRef<CompatClient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      // 소켓 설정
      const socketAddress = import.meta.env.VITE_SOCKET_AUCTION_URL;
      console.log(socketAddress);
      const socket = new WebSocket(socketAddress);
      auctionStompClient.current = Stomp.over(socket);

      // 메세지 수신
      auctionStompClient.current.connect(
        {
          //  Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsInVzZXJuYW1lIjoidGVzdEB0ZXN0LmNvbSIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3MjczMjc1ODQsImV4cCI6MTcyNzMyODE4NH0.CZ0rgjiGXJmXbdkeUa-AZCCMgKLImW2Cwt5euIuUuNM`
        },
        (frame: StompFrame) => {
          console.log("Connected: " + frame);
          auctionStompClient.current!.subscribe(
            `/sub/auction/${auctionId}`,
            (message) => {
              const newMessage: message = JSON.parse(message.body);
              console.log(newMessage);
            },
            { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
          );
          console.log("메세지 송신 테스트")
        },
        (error: unknown) => {
          console.error("Connection error: ", error);
        }
      );
    };
    init();

    return () => {
      if (auctionStompClient.current) {
        auctionStompClient.current.disconnect();
      }
    };
  }, [channelId]);

  const sendBidRequest = () => {
    const data = {
      auctionId,
      userId: 2, // store에서 가져올 것
      bidAmount: 300000, // 현재입찰가
    };

    if (auctionStompClient.current && auctionStompClient.current.connected)
      auctionStompClient.current.send(
        `/pub/auction/${auctionId}/bid`,
        {
          //  Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`
        },
        JSON.stringify(data)
      );
      console.log("메세지 수신 테스트")
  };

  // ------------------여기까지 작성했음--------------

  const [bidPrice, setBidPrice] = useState(3000000); // 입찰가
  const [bidHistory, setBidHistory] = useState([
    { bidder: "민굥", price: 3400000 },
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

  const [timeLeft, setTimeLeft] = useState(30);
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

  const handleBid = () => {
    if (!auctionEnded) {
      const newPrice = bidPrice + 100000;
      setBidPrice(newPrice);
      setTimeLeft(30);
      setProgress(100); // 입찰 시 progress 값 초기화

      setBidHistory((prevHistory) => {
        const newHistory = [
          { bidder: "꼬북맘", price: newPrice },
          ...prevHistory,
        ];
        return newHistory.slice(0, 8);
      });

      setShowEmoji(true);
      emojiApi.start({
        from: { opacity: 0, transform: "translateY(50px)" },
        to: { opacity: 1, transform: "translateY(0px)" },
        onRest: () => {
          emojiApi.start({ opacity: 0, transform: "translateY(-50px)" });
        },
      });
    }
  };

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
            <img src={MovingTurtle} className="w-[57px]" draggable="false" />
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
              <div className="font-bold text-[27px]">
                현재 입찰가&nbsp;&nbsp;
              </div>
              <animated.div className="font-bold text-[39px] text-[#4B721F] font-stardust">
                {springProps.price.to(
                  (price) => `${Math.floor(price).toLocaleString()}원`
                )}
              </animated.div>
            </div>
            <button
              onClick={() => {
                handleBid();
                sendBidRequest();
              }}
              className="mt-5 cursor-pointer bg-[#4B721F] text-white py-3 px-7 rounded-[10px] active:scale-90 text-[30px] font-dnf-bitbit"
              disabled={auctionEnded}
            >
              {auctionEnded ? "낙찰 완료" : "👋🏻 입찰하기"}
            </button>

            <div className="flex flex-col w-full text-[23px] mt-[80px]">
              {bidHistory.map((bid, index) => (
                <div
                  key={index}
                  className="flex flex-row justify-between leading-9"
                >
                  <span>{bid.bidder}</span>
                  <span>{`${bid.price.toLocaleString()}원`}</span>
                </div>
              ))}
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
