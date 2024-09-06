import { Helmet } from "react-helmet-async";
import useDeviceStore from "../../store/useDeviceStore";
import Header from "../../components/common/Header";
import BackgroundImg from "../../assets/Side_View_Scene.gif";
import TurtleMoving from "../../assets/turtle_moving.png";
import TurtleStop from "../../assets/turtle_stop.gif";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MainPage() {
  const isMobile = useDeviceStore((state) => state.isMobile);

  const [showTurtleMoving, setShowTurtleMoving] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showButtons, setShowButtons] = useState(false); // 버튼을 제어할 새로운 상태

  useEffect(() => {
    const turtleTimer = setTimeout(() => {
      setShowTurtleMoving(false);
    }, 2300);

    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 5100);

    const buttonTimer = setTimeout(() => {
      setShowButtons(true); // 텍스트가 깜빡인 후 버튼 표시
    }, 7100); // 텍스트 깜빡임 애니메이션 시간(2초)을 더해 딜레이 설정

    return () => {
      clearTimeout(turtleTimer);
      clearTimeout(contentTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>꼬북ZIP</title>
      </Helmet>
      <Header />
      <img
        src={BackgroundImg}
        className="w-full h-full object-cover min-h-screen"
        draggable="false"
      />

      {showTurtleMoving ? (
        <img
          src={TurtleStop}
          className="w-[380px] absolute"
          style={{ bottom: "15px", right: "200px" }}
          draggable="false"
        />
      ) : (
        <img
          src={TurtleMoving}
          className="w-[380px] absolute turtle-animation"
          draggable="false"
        />
      )}

      {showContent && (
        <div className="absolute top-[160px] left-0 w-full text-center flex flex-col items-center">
          <span className="font-dnf-bitbit text-[46px] text-white mb-[25px] blinking-text">
            당신만의 거북이를 찾아보세요!
          </span>
        </div>
      )}

      {showButtons && (
        <div className="absolute top-[230px] left-0 w-full text-center flex flex-col items-center mt-5">
          <div className="flex flex-row">
            <Link to="/transaction-list">
              <div className="bg-[#dfdfdf] shadow-[3px_3px_0px_#858585] rounded-[10px] px-4 py-2 flex flex-row items-center cursor-pointer font-dnf-bitbit active:scale-95 mr-6">
                <span className="text-gray-500 text-[25px]">판매중인 거북이 →</span>
              </div>
            </Link>
            <Link to="/auction-list">
              <div className="bg-[#dfdfdf] shadow-[3px_3px_0px_#858585] rounded-[10px] px-4 py-2 flex flex-row items-center cursor-pointer font-dnf-bitbit active:scale-95">
                <span className="text-gray-500 text-[25px]">경매중인 거북이 →</span>
              </div>
            </Link>
          </div>
        </div>
      )}

<style>{`
  .turtle-animation {
    animation: moveTurtle 3s forwards ease-in-out;
  }

  @keyframes moveTurtle {
    0% {
      bottom: 4.5%;
      right: 18.5%;
      transform: scale(0.97) rotate(0deg); /* 초기 상태 */
    }
    10% {
      bottom: 6.5%;
      right: 21%;
      transform: scale(0.94) rotate(5deg); /* 오른쪽으로 살짝 기울기 */
    }
    20% {
      bottom: 6.5%;
      right: 21%;
      transform: scale(0.94) rotate(-5deg); /* 왼쪽으로 살짝 기울기 */
    }
    30% {
      bottom: 8%;
      right: 27%;
      transform: scale(0.9) rotate(3deg); /* 다시 오른쪽 */
    }
    40% {
      bottom: 8%;
      right: 27%;
      transform: scale(0.9) rotate(-3deg); /* 다시 왼쪽 */
    }
    50% {
      bottom: 10%;
      right: 33%;
      transform: scale(0.85) rotate(2deg); /* 중간에서 오른쪽 */
    }
    60% {
      bottom: 10%;
      right: 33%;
      transform: scale(0.85) rotate(-2deg); /* 중간에서 왼쪽 */
    }
    70% {
      bottom: 12%;
      right: 37%;
      transform: scale(0.78) rotate(1deg); /* 오른쪽 */
    }
    80% {
      bottom: 12%;
      right: 37%;
      transform: scale(0.78) rotate(-1deg); /* 왼쪽 */
    }
    90% {
      bottom: 13%;
      right: 38%;
      transform: scale(0.7) rotate(0deg); /* 거의 멈추는 위치 */
    }
    100% {
      bottom: 13.5%;
      right: 40%;
      transform: scale(0.67) translate(0%, 0%) rotate(0deg); /* 최종 위치 */
    }
  }


  .blinking-text {
    animation: blink 1s 2; /* 2번만 깜빡이게 설정 */
  }

  @keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`}</style>

    </>
  );
}

export default MainPage;
