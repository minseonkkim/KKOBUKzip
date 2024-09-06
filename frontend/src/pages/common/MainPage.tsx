import { Helmet } from "react-helmet-async";
import useDeviceStore from "../../store/useDeviceStore";
import Header from "../../components/common/Header";
import BackgroundImg from "../../assets/Side_View_Scene.gif";
import TurtleMoving from "../../assets/turtle_moving.gif";
import TurtleStop from "../../assets/turtle_stop.gif";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MainPage() {
  const isMobile = useDeviceStore((state) => state.isMobile);

  // 거북이 상태: 움직이는 거북이(TurtleMoving)를 보여줄지, 멈춘 거북이(TurtleStop)를 보여줄지 관리
  const [showTurtleMoving, setShowTurtleMoving] = useState(true);

  // 일정 시간이 지나면 TurtleMoving을 숨기고 TurtleStop을 보여줌
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTurtleMoving(false); // TurtleMoving을 멈추고 TurtleStop으로 전환
    }, 2300); // 5초 후에 전환

    return () => clearTimeout(timer); // 컴포넌트가 사라질 때 타이머 해제
  }, []);

  return (
    <>
      <Helmet>
        <title>Main Page</title>
      </Helmet>
      <Header />
      <img src={BackgroundImg} className="w-full h-full object-cover min-h-screen" draggable="false" />

      {/* 거북이 애니메이션 */}
      {showTurtleMoving ? (
        <img 
          src={TurtleStop} 
          className="w-[380px] absolute" 
          style={{ bottom: '15px', right: '200px' }} 
          draggable="false" 
        />
      ) : (
        <img 
          src={TurtleMoving} 
          className="w-[380px] absolute turtle-animation" 
          draggable="false" 
        />
      )}

      <div className="absolute top-[160px] left-0 w-full text-center flex flex-col items-center">
        <span className="font-dnf-bitbit text-[46px] text-white mb-[25px]">당신만의 거북이를 찾아보세요!</span>
        <div className="flex flex-row">
        <Link to="/transaction-list">
          <div className="bg-[#dfdfdf] shadow-[3px_3px_0px_#858585] rounded-[10px] px-4 py-2 flex flex-row items-center cursor-pointer font-dnf-bitbit active:scale-95 mr-7">
            <span className="font-bold text-gray-500 text-[25px] tracking-widest">판매중인 거북이 →</span>
          </div>
        </Link>
        <Link to="/auction-list">
          <div className="bg-[#dfdfdf] shadow-[3px_3px_0px_#858585] rounded-[10px] px-4 py-2 flex flex-row items-center cursor-pointer font-dnf-bitbit active:scale-95">
            <span className="font-bold text-gray-500 text-[25px] tracking-widest">경매중인 거북이 →</span>
          </div>
        </Link>
      </div>
      </div>

      <style>{`
        .turtle-animation {
          animation: moveTurtle 5s forwards ease-in-out;
        }

        @keyframes moveTurtle {
          0% {
            bottom: 15px;
            right: 200px;
            transform: scale(1);
          }
          100% {
            bottom: 22%;
            right: 46%;
            transform: scale(0.5) translate(50%, 50%);
          }
        }
      `}</style>
    </>
  );
}

export default MainPage;
