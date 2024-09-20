import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TmpTurtleImg from "../../assets/tmp_turtle.jpg";
import TmpTurtleImg2 from "../../assets/tmp_turtle_2.jpg";
import TmpTurtleImg3 from "../../assets/tmp_turtle_3.jpg";
import { IoClose } from "react-icons/io5";

export default function MyTurtle() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const goToAuctionRegister = () => {
    navigate("/auction-register");
  };

  const goToTransactionRegister = () => {
    navigate("/transaction-register");
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      <div className="w-[23.5%] h-[373px] border-[2px] rounded-[20px] my-[13px] p-[15px] bg-[#f8f8f8]">
        <div className="flex flex-row justify-between items-center mb-3">
          <div className="text-[20px]">꼬북이</div>
          <div className="font-bold text-gray-400">24.09.01</div>
        </div>
        <img
          src={TmpTurtleImg}
          className="rounded-[10px] w-full h-[190px] object-cover"
          draggable="false"
        />
        <div className="flex flex-row justify-between mt-4 text-[18px]">
          <button
            onClick={openModal}
            className="w-[48%] h-[38px] bg-[#D8F1D5] rounded-[10px] hover:bg-[#CAEAC6]"
          >
            상세 정보
          </button>
          <button className="w-[48%] h-[38px] bg-[#D8F1D5] rounded-[10px] hover:bg-[#CAEAC6]">
            서류 조회
          </button>
        </div>
        <div className="flex flex-row justify-between mt-3 text-[18px]">
          <button
            onClick={goToTransactionRegister}
            className="w-[48%] h-[38px] bg-[#D8F1D5] rounded-[10px] hover:bg-[#CAEAC6]"
          >
            판매 등록
          </button>
          <button
            onClick={goToAuctionRegister}
            className="w-[48%] h-[38px] bg-[#D8F1D5] rounded-[10px] hover:bg-[#CAEAC6]"
          >
            경매 등록
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100000]"
          onClick={handleOverlayClick} 
        >
          <div className="bg-white p-6 rounded-[10px] shadow-lg w-[500px]">
            <div className="flex flex-row justify-between">
                <h2 className="text-[22px] font-bold mb-4 font-stardust">상세 정보</h2>
                <IoClose className="text-[30px] cursor-pointer" onClick={closeModal} />
            </div>
            
            <div className="flex flex-row w-full space-x-5">
                <div className="w-1/2 h-[180px] overflow-hidden">
                    <img src={TmpTurtleImg} className="object-cover rounded-[10px] w-full h-[180px]"/>
                </div>
                <div className="w-1/2 text-[19px] flex flex-col space-y-2">
                    <div>이름: 김거북</div>
                    <div>종: 페닐슐라쿠터</div>
                    <div>성별 : 암컷</div>
                    <div>생년월일 : 24년 8월 30일</div>
                </div>
            </div>

            <div className="flex flex-row mt-7">
                <div className="flex flex-col space-y-2 w-1/2 text-[19px]">
                    <div>부개체 : 저거북</div>
                    <img src={TmpTurtleImg2} className="object-cover rounded-[10px] w-full h-[180px]"/>
                </div>
                <div className="flex flex-col space-y-2 w-1/2 text-[19px]">
                    <div>모개체 : 이거북</div>
                    <img src={TmpTurtleImg3} className="object-cover rounded-[10px] w-full h-[180px]"/>
                </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
