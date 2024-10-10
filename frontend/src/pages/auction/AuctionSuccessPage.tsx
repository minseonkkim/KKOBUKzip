import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use"; // Confetti의 사이즈를 윈도우 사이즈에 맞추기 위한 훅

export default function AuctionSuccessPage({
  nowBid,
  winningNickname,
}: {
  nowBid: number;
  winningNickname: string;
}) {
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
      <div className="w-[48%] h-[675px] bg-[#EAF5DD] rounded-[20px] flex flex-col justify-start items-center">
        {showConfetti && (
          <Confetti
            width={width}
            height={height}
            style={{ zIndex: 51, position: "fixed" }}
          />
        )}
        <div className="flex flex-col items-center justify-center mt-[200px]">
          <div className="font-bold text-[38px] text-center mt-[48px]">
            축하합니다.
            <br />
            {winningNickname}님께서
            <br />
            <div className="font-bold flex flex-row items-end font-stardust text-[#4B721F]">
              <div className="text-[31px] md:text-[39px]">{nowBid}</div>
              <div className="text-[27px] md:text-[29px]">TURT</div>
            </div>
            낙찰되셨습니다.
          </div>
        </div>
      </div>
    </>
  );
}
