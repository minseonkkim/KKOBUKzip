import { Helmet } from "react-helmet-async";
import useDeviceStore from "../../store/useDeviceStore";
import Header from "../../components/common/Header";
import BackgroundImg from "../../assets/Side_View_Scene.gif";
import TurtleMoving from "../../assets/turtle_moving.webp";
import TurtleStop from "../../assets/turtle_stop.webp";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MainPage() {
  const isMobile = useDeviceStore((state) => state.isMobile);

  const [showTurtleMoving, setShowTurtleMoving] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showTurtle, setShowTurtle] = useState(true);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    timers.push(
      setTimeout(() => setShowTurtleMoving(false), 2300),
      setTimeout(() => setShowContent(true), 0),
      setTimeout(() => setShowButtons(true), 2000)
    );

    if (isMobile) {
      timers.push(setTimeout(() => setShowContent(false), 2000));
    }

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [isMobile]);

  useEffect(() => {
    const preloadImage = new Image();
    preloadImage.src = BackgroundImg;
    preloadImage.loading = "eager";
  }, []);

  return (
    <>
      <Helmet>
        <title>꼬북ZIP</title>
        <link rel="preload" href={TurtleMoving} as="image" />
        <link rel="preload" href={TurtleStop} as="image" />
      </Helmet>
      <Header />
      <div className="relative min-h-screen bg-white overflow-hidden">
        <div className="img-box-center">
          <img
            src={BackgroundImg}
            className="absolute inset-0 w-full h-[100vh] object-cover object-center"
            loading="lazy"
            alt="Background"
            draggable="false"
          />
        </div>

        {showTurtle && (
          <img
            src={showTurtleMoving ? TurtleStop : TurtleMoving}
            loading="lazy"
            className={`w-[270px] md:w-[300px] lg:w-[380px] h-auto absolute ${
              !showTurtleMoving ? "turtle-animation" : ""
            }`}
            style={{ bottom: "15px", right: "10%" }}
            draggable="false"
            alt={showTurtleMoving ? "Turtle Stop" : "Turtle Moving"}
          />
        )}
        <div className="absolute top-[170px] w-full text-center flex flex-col items-center">
          {showContent && (
            <div className="left-0 text-center flex flex-col items-center">
              {isMobile ? (
                <div>
                  <p className="font-dnf-bitbit text-[30px] md:text-[35px] text-white blinking-text">
                    당신만의 거북이를
                  </p>
                  <p className="font-dnf-bitbit text-[30px] md:text-[35px] text-white blinking-text">
                    찾아보세요!
                  </p>
                </div>
              ) : (
                <span className="font-dnf-bitbit text-[36px] md:text-[40px] xl:text-[46px] text-white blinking-text px-[90px]">
                  당신만의 거북이를 찾아보세요!
                </span>
              )}
            </div>
          )}

          {showButtons && (
            <div
              className={`mt-5 text-center flex flex-col items-center ${
                isMobile ? "gap-4" : "gap-[1.5rem]"
              }`}
            >
              <div className="flex flex-col md:flex-row gap-4">
                <Link to="/transaction-list">
                  <div className="bg-[#dfdfdf] shadow-[3px_3px_0px_#858585] rounded-[10px] px-4 py-2 flex flex-row items-center cursor-pointer font-dnf-bitbit active:scale-95">
                    <span className="whitespace-nowrap text-gray-500 text-[21px] md:text-[25px]">
                      판매중인 거북이 →
                    </span>
                  </div>
                </Link>
                <Link to="/auction-list">
                  <div className="bg-[#dfdfdf] shadow-[3px_3px_0px_#858585] rounded-[10px] px-4 py-2 flex flex-row items-center cursor-pointer font-dnf-bitbit active:scale-95">
                    <span className="whitespace-nowrap text-gray-500 text-[21px] md:text-[25px]">
                      경매중인 거북이 →
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 소개 섹션 */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">꼬북ZIP 서비스 소개</h2>
          <p className="text-xl mb-6 leading-8">
            블록체인 기술을 이용한 <span className="font-bold">거북이 경매, 거래 및 서류 관리</span> 서비스에 오신 것을
            환영합니다. 꼬북ZIP은 사용자들에게 신뢰할 수 있는 거래 환경을 제공하며, 모든 거래와 소유권 정보는
            투명하고 안전하게 블록체인에 기록됩니다.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">거북이 경매</h3>
              <p className="text-gray-600">
                희귀한 거북이를 경매를 통해 구매하세요. 실시간 입찰 시스템을 통해 누구나 참여할 수 있으며, 모든 과정이
                블록체인에 기록됩니다.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">거북이 거래</h3>
              <p className="text-gray-600">
                원하는 거북이를 직접 구매하고 판매할 수 있습니다. 거래의 신뢰성을 보장하기 위해, 모든 거래 정보는
                안전하게 블록체인에 저장됩니다.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">서류 관리</h3>
              <p className="text-gray-600">
                거북이의 소유권, 건강 기록 및 기타 서류를 디지털화하여 관리하세요. 블록체인 기술을 통해 중요한 정보가
                안전하게 보호됩니다.
              </p>
            </div>
          </div>
          <Link
            to="/learn-more"
            className="inline-block mt-8 bg-blue-500 text-white py-2 px-6 rounded-full shadow-md hover:bg-blue-600 transition duration-300"
          >
            더 알아보기 →
          </Link>
        </div>
      </section>

      <style>{`
        .turtle-animation {
          animation: moveTurtle 3s forwards ease-in-out;
        }

        @keyframes moveTurtle {
          0% {
            bottom: 4.5%;
            right: 18.5%;
            transform: scale(0.97) rotate(0deg);
          }
          100% {
            bottom: 13%;
            right: 39.3%;
            transform: scale(0.67) rotate(0deg);
          }
        }

        .blinking-text {
          animation: blink 1s 2;
        }

        @keyframes blink {
          0% {
            opacity: 1;
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
