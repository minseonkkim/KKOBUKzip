import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../../components/common/Header";
import { useNavigate } from "react-router-dom";
import TmpTurtleImg from "../../assets/tmp_turtle.jpg";
import TmpTurtleImg2 from "../../assets/tmp_turtle_2.jpg";
import tmpProfileImg from "../../assets/tmp_profile.gif";
import { useSpring, animated } from "@react-spring/web";
import MovingTurtle from "../../assets/moving_turtle.gif";

function AuctionDetailPage() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const images = [TmpTurtleImg2, TmpTurtleImg];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const [bidPrice, setBidPrice] = useState(3000000);

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
  const [progress, setProgress] = useState(100);

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
        const newHistory = [{ bidder: "꼬북맘", price: newPrice }, ...prevHistory];
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
      <Helmet>
        <title>경매중인 거북이</title>
      </Helmet>
      <Header />
      <div className="px-[250px] mt-[85px]">
        <div className="cursor-pointer text-[33px] text-gray-900 font-dnf-bitbit pt-[40px] pb-[13px]">
          <span onClick={goBack}>&lt;&nbsp;경매중인 거북이</span>
        </div>
        <div className="flex flex-row justify-between mt-[10px]">
          <div className="w-[48%] h-[360px] rounded-[20px] relative">
            <img
              src={images[currentIndex]}
              className="w-full h-full object-cover rounded-[20px]"
              alt="Turtle"
              draggable="false"
            />
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white text-[27px] p-2 rounded-full font-bold"
            >
              &lt;
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white text-[27px] p-2 rounded-full font-bold"
            >
              &gt;
            </button>
            <div className="absolute bottom-3 right-3 bg-gray-700 text-white px-4 py-2 rounded-[20px]">
              {currentIndex + 1} / {images.length}
            </div>
            <div className="flex flex-row justify-between items-center mt-[15px] mb-[10px]">
              <div className="text-[23px]">페닐슐라쿠터</div>
              <div className="text-[16px] text-gray-700">
                <span className="bg-[#D5F0DD] text-[#065F46] px-2 py-1 rounded-full">
                  #태그
                </span>
              </div>
            </div>
            <div className="text-[17px] leading-7 border-[2px] rounded-[10px] p-2 line-clamp">
              이 붉은귀거북은 활발하고 건강한 상태로, 밝고 선명한 붉은색 귀 무늬가
              특징입니다. 현재까지 특별한 질병 없이 건강하게 자라왔으며, 균형
              잡힌 사료와 신선한 채소로 영양 관리가 잘 되어 있습니다. 특히
              수영을 좋아하며, 물속에서의 활동이 활발해 관찰하는 재미가 큽니다.
              이 거북이는 비교적 온순한 성격을 가지고 있어 손을 자주 타지는
              않지만, 스트레스를 주지 않는 선에서 손길을 허용하는 편입니다.
              호기심이 많아 주변 환경에 대한 관심을 보이는 등, 관상용으로도
              매력적인 개체입니다.
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
                />
                <span className="text-[20px]">꼬북맘</span>
              </div>
              <div className="cursor-pointer bg-[#7CBBF9] h-fit flex justify-center items-center rounded-[10px] font-bold px-3 py-2 text-white">
                채팅하기
              </div>
            </div>
          </div>
          {/* 경매중 */}
          <div className="w-[48%] h-[675px] bg-[#EAF5DD] rounded-[20px] flex flex-col justify-start items-center">
            <div className="w-full bg-[#EAEAEA] rounded-full h-[10px] relative">

              <animated.div
                className="bg-[#4B721F] h-[10px] rounded-full"
                style={{ width: progressSpring.progress.to(val => `${val}%`) }}
              ></animated.div>


              <animated.div
                className="absolute -top-8"
                style={turtlePositionSpring}
              >
                <img src={MovingTurtle} className="w-[57px]" draggable="false"/>
              </animated.div>
            </div>
            <div className="w-full mb-3">
              <div className="text-center text-[33px] text-right font-bold m-3">
                {`${timeLeft}`}
              </div>
            </div>
            <div className="w-full px-[40px]">
              <div className="flex flex-col justify-center items-center mb-4">
                <div className="flex flex-row items-center">
                  <div className="font-bold text-[27px]">현재 입찰가&nbsp;&nbsp;</div>
                  <animated.div className="font-bold text-[37px] text-[#4B721F]">
                    {springProps.price.to((price) =>
                      `${Math.floor(price).toLocaleString()}원`
                    )}
                  </animated.div>
                </div>
                <button
                  onClick={handleBid}
                  className="mt-5 cursor-pointer bg-[#4B721F] text-white py-3 px-7 rounded-[10px] active:scale-90 text-[30px] font-dnf-bitbit"
                  disabled={auctionEnded}
                >
                  {auctionEnded ? "낙찰 완료" : "👋🏻 입찰하기"}
                </button>

                <div className="flex flex-col w-full text-[23px] mt-[80px]">
                  {bidHistory.map((bid, index) => (
                    <div key={index} className="flex flex-row justify-between leading-9">
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
          {/* 경매전 */}
          {/* <div className="w-[48%] h-[675px] bg-[#F2F2F2] rounded-[20px] flex flex-col justify-center items-center">
              <div className="text-[#5E5E5E] font-bold text-[23px]">24년 09월 30일 14:30:00 경매 시작</div>
              <div className="flex flex-row items-center mt-[15px]">
                  <div className="font-bold text-[27px]">최소 입찰가&nbsp;&nbsp;</div>
                  <div className="font-bold text-[37px] text-[#4B721F]">
                    3,000,000원
                  </div>
                </div>
          </div> */}
        </div>
      </div>
    </>
  );
}

export default AuctionDetailPage;
