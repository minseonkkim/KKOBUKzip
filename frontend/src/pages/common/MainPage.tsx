import { Helmet } from "react-helmet-async";
import useDeviceStore from "../../store/useDeviceStore";
import Header from "../../components/common/Header";
import BackgroundImg from "../../assets/beach.gif";
import TurtleImg from "../../assets/output-onlinegiftools.gif";
import { useEffect, useState } from "react";

interface Turtle {
  id: number;
  name: string;
}

function MainPage() {
  const isMobile = useDeviceStore((state) => state.isMobile);

  const [currentIndex, setCurrentIndex] = useState(0);

  // 경매거북 더미 데이터 생성 (총 6개)
  const turtles: Turtle[] = Array.from({ length: 6 }, (_, index) => ({
    id: index + 1,
    name: `거북 ${index + 1}`,
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      // 3개의 div에 맞춰 최대 currentIndex가 turtles.length - 3 이하가 되도록 설정
      setCurrentIndex((prevIndex) =>
        prevIndex < turtles.length - 3 ? prevIndex + 1 : 0
      );
    }, 5000); // 5초마다 실행

    return () => {
      clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 제거
    };
  }, [turtles.length]);

  return (
    <>
      {/* <Helmet>
        <title>Main Page</title>
      </Helmet> */}
      <Header/>
      <img src={BackgroundImg} className="w-full h-full object-cover min-h-screen"/>
      <img src={TurtleImg} className="w-[380px] absolute bottom-[20px] right-[200px]"/>
      <div className="absolute top-[170px] left-0 w-full text-center flex flex-col items-center">
        <span className="font-dnf-bitbit text-[46px] text-white mb-[36px]">당신만의 거북이를 찾아보세요!</span>
        <div className="overflow-hidden w-full">
      <div className="flex justify-center text-[28px]">
        {/* 현재 currentIndex부터 시작하여 3개의 거북이를 보여줌 */}
        {turtles.slice(currentIndex, currentIndex + 3).map((turtle) => (
          <div
            key={turtle.id}
            className="bg-[rgba(255,255,255,0.8)] w-[390px] h-[250px] rounded-[20px] mx-5 flex-shrink-0 flex items-center justify-center"
          >
            {turtle.name}
          </div>
        ))}
      </div>
    </div>
    
      </div>
      <div className="absolute bottom-[130px] left-[250px] flex flex-row">
        <div className="bg-[#dfdfdf] shadow-[3px_3px_0px_#858585] rounded-[10px] px-4 py-2 flex flex-row items-center cursor-pointer font-dnf-bitbit mr-7">
            <span className="font-bold text-gray-500 text-[25px] tracking-widest">판매중인 거북이 →</span>
        </div>
        <div className="bg-[#dfdfdf] shadow-[3px_3px_0px_#858585] rounded-[10px] px-4 py-2 flex flex-row items-center cursor-pointer font-dnf-bitbit">
            <span className="font-bold text-gray-500 text-[25px] tracking-widest">경매중인 거북이 →</span>
        </div>
      </div>
    </>
  );
}

export default MainPage;
