import { Helmet } from "react-helmet-async";
import Header from "../../components/common/Header";
import TmpTurtleImg from "../../assets/tmp_turtle.jpg";
import TmpTurtleImg2 from "../../assets/tmp_turtle_2.jpg";
import tmpProfileImg from "../../assets/tmp_profile.gif";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useChatStore from "../../store/useChatStore";

function TransactionDetailPage() {
  const { openChatDetail } = useChatStore();
  const navigate = useNavigate();
  const userNickname = "ASdf";
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

  return (
    <>
      <Helmet>
        <title>판매중인 거북이</title>
      </Helmet>

      <Header />
      <div className="px-4 lg:px-[250px] mt-[85px]">
        <div className="cursor-pointer whitespace-nowrap text-[28px] md:text-[33px] text-gray-900 font-dnf-bitbit pt-0 lg:pt-[40px] pb-[13px]">
          <span onClick={goBack}>&lt;&nbsp;판매중인 거북이</span>
        </div>
        <div className="h-full md:h-[675px] flex flex-col md:flex-row justify-between mt-[10px]">
          <div className="flex flex-col w-full md:w-[48%] rounded-[20px] relative">

            {/* Ensure this div takes available space using flex properties */}
            <div className="relative w-full flex-grow md:flex-1 h-[240px] md:h-auto rounded-[20px] overflow-hidden">
              <img
                src={images[currentIndex]}
                className="w-full h-full object-cover rounded-[20px]"
                alt="Turtle"
                draggable="false"
              />
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-[27px] p-2 rounded-full font-bold"
              >
                &lt;
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-[27px] p-2 rounded-full font-bold"
              >
                &gt;
              </button>
              <div className="absolute bottom-3 right-3 bg-black/60 text-white px-4 py-2 rounded-[20px]">
                {currentIndex + 1} / {images.length}
              </div>
            </div>
            <div className="text-[23px] mt-[13px]">거북이 팔아용</div>
            <div className="flex flex-row justify-between lg:justify-start xl:justify-between items-center mt-[5px] mb-[10px]">
              <div className="text-[#9A9A9A] text-[17px]">
                페닐슐라쿠터 | 24년 8월 10일생 | 8kg
              </div>
              <div className="flex flex-row space-x-2">
                <span
                  className="whitespace-nowrap px-2 py-1 rounded-full cursor-pointer text-[16px] bg-[#D5F0DD] text-[#065F46]"
                >
                  #암컷
                </span>
                <span
                  className="whitespace-nowrap px-2 py-1 rounded-full cursor-pointer text-[16px] bg-[#D5F0DD] text-[#065F46]"
                >
                  #베이비
                </span>
              </div>
            </div>
            <div className="text-[17px] leading-7 border-[2px] rounded-[10px] p-2 line-clamp">
              이 붉은귀거북은 활발하고 건강한 상태로, 밝고 선명한 붉은색 귀
              무늬가 특징입니다. 현재까지 특별한 질병 없이 건강하게 자라왔으며,
              균형 잡힌 사료와 신선한 채소로 영양 관리가 잘 되어 있습니다. 특히
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
              <div
                onClick={() => openChatDetail(1, "꼬북맘")}
                className="cursor-pointer bg-[#7CBBF9] h-fit flex justify-center items-center rounded-[10px] font-bold px-3 py-2 text-white"
              >
                채팅하기
              </div>
            </div>
          </div>

          <div className="my-5 mb-10 md:my-0 md:mb-0 w-full md:w-[48%] h-[130px] md:h-[675px] bg-[#EAF5DD] rounded-[20px] flex flex-col justify-start items-center">
            <div className="w-full px-[20px] md:px-[40px] w-full h-full flex justify-center items-center mt-3 md:mt-0">
              <div className="w-full flex flex-row md:flex-col justify-between items-center mb-4">
                <div className="whitespace-nowrap flex flex-row md:flex-col xl:flex-row items-center">
                  <div className="font-bold text-[20px] md:text-[27px]">판매가&nbsp;&nbsp;</div>
                  <div className="font-bold text-[31px] md:text-[39px] text-[#4B721F] font-stardust">
                    {Math.floor(8000000).toLocaleString()}원
                  </div>
                </div>
                <button
                  className="whitespace-nowrap mt-0 md:mt-5 cursor-pointer bg-[#4B721F] text-white py-2 px-4 md:py-3 md:px-7 rounded-[10px] active:scale-90 text-[23px] md:text-[30px] font-dnf-bitbit"
                >
                  구매하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TransactionDetailPage;
