import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use"; // Confetti의 사이즈를 윈도우 사이즈에 맞추기 위한 훅
import Header from "../../components/common/Header";
import TmpTurtleImg from "../../assets/tmp_turtle.jpg";

export default function AuctionSuccessPage() {
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    // 페이지에 들어올 때 confetti를 보여줌
    setShowConfetti(true);

    // 5초 후 confetti를 종료
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000); // 5초 동안 confetti를 터뜨림

    return () => clearTimeout(timer); // 타이머 클리어
  }, []);

  return (
    <>
      <Header />
      <div>
        {showConfetti && (
          <Confetti
            width={width}
            height={height}
            style={{ zIndex: 51, position: "fixed" }}
          />
        )}
        <div className="flex flex-col items-center justify-center mt-[200px]">
          <img
            src={TmpTurtleImg}
            className="rounded-[20px] w-[570px] h-[400px] object-cover"
            draggable="false"
            alt="turtle image"
          />
          <div className="font-bold text-[38px] text-center mt-[48px]">
            축하합니다.
            <br />
            <span className="text-[#4B721F]">3,000,000 TURT</span>에
            낙찰되셨습니다.
          </div>
        </div>
      </div>
    </>
  );
}
