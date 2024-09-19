import { Helmet } from "react-helmet-async";
import Header from "../../components/common/Header";
import TmpProfileImg from "../../assets/tmp_profile.gif";
import { useState } from "react";
import TransactionHistory from "../../components/user/TransactionHistory";
import MyTurtle from "../../components/user/MyTurtle";
import NoImage from "../../assets/no_image.png";

function MyPage() {
  const [selectedMenu, setSelectedMenu] = useState(0);  // 0은 거래 내역, 1은 나의 거북이

  return (
    <>
      <Helmet>
        <title>마이페이지</title>
      </Helmet>
      <Header />
      <div className="px-[250px] mt-[85px]">
        <div className="flex flex-row justify-between mt-[120px] px-[30px] py-[20px] h-[215px] bg-gradient-to-r from-[#e7f6d1] via-[#d5e5bd] to-[#e7f6d1] rounded-[20px]">
          <div>
            <div className="font-dnf-bitbit text-[#4B721F] text-[27px] mt-1 mb-5">내 정보</div>
            <div className="text-[22px]">
              <div>닉네임: 꼬북맘</div>
              <div>주소: 바다</div>
              <div>연락처: 000-0000-0000</div>
            </div>
          </div>
          <div className="rounded-full w-[170px] h-[170px] overflow-hidden bg-[#4B721F] flex justify-center items-center">
            <img src={TmpProfileImg} className="rounded-full object-cover w-[162px] h-[162px]" draggable="false"/>
          </div>
        </div>

        <div className="mt-[25px] text-[23px] flex flex-row cursor-pointer mb-[10px]">
          <div
            className={`w-[125px] h-[42px] border-b-[4px] text-center ${
              selectedMenu === 0 && "border-[#4B721F] font-bold"
            }`}
            onClick={() => setSelectedMenu(0)}
          >
            거래 내역
          </div>
          <div
            className={`w-[125px] h-[42px] border-b-[4px] text-center ${
              selectedMenu === 1 && "border-[#4B721F] font-bold"
            }`}
            onClick={() => setSelectedMenu(1)}
          >
            나의 거북이
          </div>
        </div>

        {/* 거래내역 */}
        {selectedMenu === 0 && 

        // 거래 내역이 있을 경우
        // <div className="flex flex-col mb-[20px]">
        //   <TransactionHistory/>
        //   <TransactionHistory/>
        //   <TransactionHistory/>
        // </div>

        // 거래내역이 없을 경우
      <div className="w-full flex justify-center items-center flex-col bg-[#f7f7f7] rounded-[20px] px-5 py-20">
        <img src={NoImage} className="w-[200px] mb-7"/>
        <div className="text-[25px] font-bold text-center">거래 내역이 없어요.</div>
      </div>
        }

        {/* 나의 거북이 */}
        {selectedMenu === 1 && 

        // 나의 거북이가 있을 경우
      //   <div className="flex flex-row flex-wrap mb-[20px] gap-[2%]">
          
      //   <MyTurtle />
      //   <MyTurtle />
      //   <MyTurtle />
      //   <MyTurtle />
      // </div>

      // 나의 거북이가 없을 경우
      <div className="w-full flex justify-center items-center flex-col bg-[#f7f7f7] rounded-[20px] px-5 py-20">
        <img src={NoImage} className="w-[200px] mb-7"/>
        <div className="text-[25px] font-bold text-center">나의 거북이가 없어요.</div>
      </div>
      
      }
      </div>
    </>
  );
}

export default MyPage;
