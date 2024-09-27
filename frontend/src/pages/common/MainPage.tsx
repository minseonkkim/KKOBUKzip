import { Helmet } from "react-helmet-async";
import useDeviceStore from "../../store/useDeviceStore";
import Header from "../../components/common/Header";
import BackgroundImg from "../../assets/Side_View_Scene.gif";
import TurtleMoving from "../../assets/turtle_moving.webp";
import TurtleStop from "../../assets/turtle_stop.gif";
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


  return (
    <>
      <Helmet>
      <title>꼬북ZIP</title>
        {/* 이미지 preload */}
        <link rel="preload" href={TurtleMoving} as="image" />
        <link rel="preload" href={TurtleStop} as="image" />
        <link rel="preload" href={BackgroundImg} as="image" />
      </Helmet>
      <Header />
      <div className="relative min-h-screen bg-white overflow-hidden ">
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
            showTurtleMoving ? (
              <img
                src={TurtleStop}
                loading="lazy"
                className="w-[270px] md:w-[300px] lg:w-[380px] h-auto absolute"
                style={{ bottom: "15px", right: "10%" }}
                draggable="false"
                alt="Turtle Stop"
              />
            ) : (
              <img
                src={TurtleMoving}
                loading="lazy"
                className="w-[270px] md:w-[300px] lg:w-[380px] h-auto absolute turtle-animation"
                draggable="false"
                alt="Turtle Moving"
              />
            )
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
          10% {
            bottom: 6.5%;
            right: 21%;
            transform: scale(0.94) rotate(5deg);
          }
          20% {
            bottom: 6.5%;
            right: 21%;
            transform: scale(0.94) rotate(-5deg);
          }
          30% {
            bottom: 8%;
            right: 27%;
            transform: scale(0.9) rotate(3deg);
          }
          40% {
            bottom: 8%;
            right: 27%;
            transform: scale(0.9) rotate(-3deg);
          }
          50% {
            bottom: 10%;
            right: 33%;
            transform: scale(0.85) rotate(2deg);
          }
          60% {
            bottom: 10%;
            right: 33%;
            transform: scale(0.85) rotate(-2deg);
          }
          70% {
            bottom: 11.7%;
            right: 37%;
            transform: scale(0.78) rotate(1deg);
          }
          80% {
            bottom: 11.7%;
            right: 37%;
            transform: scale(0.78) rotate(-1deg);
          }
          90% {
            bottom: 12.3%;
            right: 38%;
            transform: scale(0.7) rotate(0deg);
          }
          100% {
            bottom: 13%;
            right: 39.3%;
            transform: scale(0.67) translate(0%, 0%) rotate(0deg);
          }
        }

        @media (max-height: 700px) {
          @keyframes moveTurtle {
            0% {
              bottom: 4.5%;
              right: 18.5%;
              transform: scale(0.97) rotate(0deg);
            }
            20% {
              bottom: 5%;
              right: 25%;
              transform: scale(0.94) rotate(2deg);
            }
            40% {
              bottom: 5.5%;
              right: 30%;
              transform: scale(0.9) rotate(-2deg);
            }
            60% {
              bottom: 6%;
              right: 35%;
              transform: scale(0.85) rotate(1deg);
            }
            80% {
              bottom: 6.3%;
              right: 37%;
              transform: scale(0.78) rotate(-1deg);
            }
            100% {
              bottom: 6.5%;
              right: 39%;
              transform: scale(0.67) rotate(0deg);
            }
          }
        }

        .blinking-text {
          animation: blink 1s 2;
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
