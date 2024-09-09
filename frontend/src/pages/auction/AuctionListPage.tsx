import { Helmet } from "react-helmet-async";
import Header from "../../components/common/Header";
import { IoIosArrowDown } from "react-icons/io";
import { GrPowerReset } from "react-icons/gr";
import { FaCheck } from "react-icons/fa6";
import { useState } from "react";
import AuctionTurtle from "../../components/auction/AuctionTurtle";

function AuctionListPage() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      <Helmet>
        <title>경매중인 거북이</title>
      </Helmet>
      <Header/>
      <div className="px-[230px] mt-[85px]">
        <div className="text-[33px] text-gray-900 font-dnf-bitbit pt-[40px] pb-[13px]">경매중인 거북이</div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row mb-[10px]">
            <div className="flex flex-row items-center border-[2px] border-[#C6C6C6] rounded-[360px] px-3 py-2 w-[50px] cursor-pointer mr-2 ">
              <GrPowerReset className="text-[23px]"/>
            </div>
            <div className="flex flex-row items-center border-[2px] border-[#C6C6C6] rounded-[15px] px-3 py-2 w-[90px] cursor-pointer mr-2 ">
              <IoIosArrowDown className="mr-2 text-[20px]"/>
              <span className="text-[19px]">성별</span>
            </div>
            <div className="flex flex-row items-center border-[2px] border-[#C6C6C6] rounded-[15px] px-3 py-2 w-[90px] cursor-pointer mr-2">
              <IoIosArrowDown className="mr-2 text-[20px]"/>
              <span className="text-[19px]">크기</span>
            </div>
            <div className="flex flex-row items-center border-[2px] border-[#C6C6C6] rounded-[15px] px-3 py-2 w-[90px] cursor-pointer">
              <IoIosArrowDown className="mr-2 text-[20px]"/>
              <span className="text-[19px]">가격</span>
            </div>
          </div>
          <div className="text-[23px] font-bold flex flex-row items-center">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="hidden"
                checked={isChecked}
              />
              <div
                className={`w-7 h-7 border-2 border-gray-500 rounded-[5px] p-1 cursor-pointer flex justify-center items-center ${
                  isChecked ? 'bg-[#FFD9D9]' : 'bg-[#fff]'
                }`}
                onClick={handleCheckboxChange}
              >
                {isChecked && <FaCheck />}
              </div>
              <span>경매중인 거북이만 보기</span>
            </label>
          </div>
        </div>
        <div className="flex flex-row flex-wrap justify-between mb-[30px]">
          <AuctionTurtle/>
          <AuctionTurtle/>
          <AuctionTurtle/>
          <AuctionTurtle/>
          <AuctionTurtle/>
          <AuctionTurtle/>
        </div>
      </div>
    </>
  );
}

export default AuctionListPage;
