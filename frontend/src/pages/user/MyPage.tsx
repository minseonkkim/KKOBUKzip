import { Helmet } from "react-helmet-async";
import Header from "../../components/common/Header";
// import TmpProfileImg from "../../assets/tmp_profile.gif";
import { useEffect, useState } from "react";
import MyTurtle from "../../components/user/MyTurtle";
import TransactionHistory from "../../components/user/TransactionHistory";
// import NoImage from "../../assets/no_image.webp";
import { FaRandom } from "@react-icons/all-files/fa/FaRandom";
import CustomProfile1 from "../../../public/custom_profile/profile1.gif";
import CustomProfile2 from "../../../public/custom_profile/profile2.gif";
import CustomProfile3 from "../../../public/custom_profile/profile3.gif";
import CustomProfile4 from "../../../public/custom_profile/profile4.gif";
import CustomProfile5 from "../../../public/custom_profile/profile5.gif";
import CustomProfile6 from "../../../public/custom_profile/profile6.gif";
import CustomProfile7 from "../../../public/custom_profile/profile7.gif";
import CustomProfile8 from "../../../public/custom_profile/profile8.gif";
import CustomProfile9 from "../../../public/custom_profile/profile9.gif";
import CustomProfile10 from "../../../public/custom_profile/profile10.gif";
import CustomProfile11 from "../../../public/custom_profile/profile11.gif";
import CustomProfile12 from "../../../public/custom_profile/profile12.gif";
import CustomProfile13 from "../../../public/custom_profile/profile13.gif";
import CustomProfile14 from "../../../public/custom_profile/profile14.gif";

import { EscrowDummy } from "../../fixtures/escrowDummy";
import { getMyTransaction } from "../../apis/userApi";
import { useUserStore } from "../../store/useUserStore";

function MyPage() {
  const [selectedMenu, setSelectedMenu] = useState(0); // 0은 거래 내역, 1은 나의 거북이
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(CustomProfile1);
  const { userInfo } = useUserStore();
  const { transactionId, sellerName, sellerId, transactionTag, turtleId, sellerAddress, price } =
    EscrowDummy.data.data.transactions[0];

  useEffect(() => {
    const init = async () => {
      (await getMyTransaction()).data?.data.transaction;
    };
    init();
  }, []);

  const profileImages = [
    CustomProfile1,
    CustomProfile2,
    CustomProfile3,
    CustomProfile4,
    CustomProfile5,
    CustomProfile6,
    CustomProfile7,
    CustomProfile8,
    CustomProfile9,
    CustomProfile10,
    CustomProfile11,
    CustomProfile12,
    CustomProfile13,
    CustomProfile14,
  ];

  const openCustomModal = () => {
    setIsCustomModalOpen(true);
  };

  const closeCustomModal = () => {
    setIsCustomModalOpen(false);
  };

  const handleCustomOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      closeCustomModal();
    }
  };

  const getRandomProfileImage = () => {
    const randomNumber = Math.floor(Math.random() * profileImages.length);
    setProfileImage(profileImages[randomNumber]);
  };

  return (
    <>
      <Helmet>
        <title>마이페이지</title>
      </Helmet>
      <Header />
      <main className="flex flex-col h-[100vh] overflow-hidden px-4 lg:px-[250px] pt-[78px]">
        <div className="flex flex-row justify-between items-center mt-0 lg:mt-[30px] px-[23px] py-[18px] bg-gradient-to-r from-[#e7f6d1] via-[#d5e5bd] to-[#e7f6d1] rounded-[20px]">
          <div className="w-1/2">
            <div className="font-dnf-bitbit text-[#4B721F] text-[24px] md:text-[27px] mt-1 mb-2 md:mb-5">
              내 정보
            </div>
            <div className="lg:text-[20px] text-[17px] space-y-1">
              <div>닉네임: {userInfo?.nickname}</div>
              <div>주소: {userInfo?.address}</div>
              <div>연락처: {userInfo?.phoneNumber}</div>
            </div>
          </div>
          <div
            className="relative rounded-full w-[140px] h-[140px] lg:w-[160px] lg:h-[160px] overflow-hidden bg-[#4B721F] flex justify-center items-center group"
            onClick={openCustomModal}
          >
            <img
              src={userInfo?.profileImage}
              className="rounded-full object-cover w-[132px] h-[132px] lg:w-[145px] lg:h-[145px] transition-all duration-300 group-hover:brightness-50"
              draggable="false"
              alt="profile image"
            />
            <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm font-semibold rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              캐릭터 수정
            </button>
          </div>
        </div>

        <div className="mt-[25px] text-[21px] lg:text-[23px] flex flex-row cursor-pointer mb-[10px] font-stardust">
          <div
            className={`w-1/2 lg:w-[130px] h-[42px] border-b-[4px] text-center ${
              selectedMenu === 0 && "border-[#4B721F] font-bold"
            }`}
            onClick={() => setSelectedMenu(0)}
          >
            거래 내역
          </div>
          <div
            className={`w-1/2 lg:w-[130px] h-[42px] border-b-[4px] text-center ${
              selectedMenu === 1 && "border-[#4B721F] font-bold"
            }`}
            onClick={() => setSelectedMenu(1)}
          >
            나의 거북이
          </div>
        </div>
        <div className="overflow-y-auto flex-1 mb-4">
          {/* 거래내역 */}
          {selectedMenu === 0 && (
            // 거래 내역이 있을 경우
            <div className="flex flex-col space-y-3">
              <TransactionHistory
                isAuction={false}
                turtleId={turtleId}
                transactionId={transactionId}
                sellerId={sellerId}
                transactionTag={transactionTag}
                sellerName={sellerName}
                sellerAddress={sellerAddress}
                amount={price}
              />
              <TransactionHistory
                isAuction={false}
                turtleId={turtleId}
                transactionId={transactionId}
                sellerId={sellerId}
                transactionTag={transactionTag}
                sellerName={sellerName}
                sellerAddress={sellerAddress}
                amount={price}
              />
              <TransactionHistory
                isAuction={false}
                turtleId={turtleId}
                transactionId={transactionId}
                sellerId={sellerId}
                transactionTag={transactionTag}
                sellerName={sellerName}
                sellerAddress={sellerAddress}
                amount={price}
              />
            </div>

            // 거래내역이 없을 경우
            // <div className="w-full flex justify-center items-center flex-col bg-[#f7f7f7] rounded-[20px] px-5 py-20">
            //   <img src={NoImage} className="w-[200px] mb-7" draggable="false" />
            //   <div className="text-[25px] font-bold text-center font-stardust">거래 내역이 없어요.</div>
            // </div>
          )}

          {/* 나의 거북이 */}
          {selectedMenu === 1 && (
            // 나의 거북이가 있을 경우
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              <MyTurtle />
              <MyTurtle />
              <MyTurtle />
              <MyTurtle />
            </div>
          )}
        </div>
      </main>

      {isCustomModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100000]"
          onClick={handleCustomOverlayClick}
        >
          <div className="bg-white p-6 rounded-[10px] shadow-lg w-[280px] flex justify-center items-center">
            <div className="flex flex-col space-y-[20px]">
              <img
                src={profileImage}
                className="rounded-full object-cover w-[162px] h-[162px] transition-all duration-300 group-hover:brightness-50"
                draggable="false"
                alt="profile image"
              />
              <div
                className="rounded-[5px] border-[1px] border-[#B8B8B8] text-[#B8B8B8] cursor-pointer p-1 flex justify-center items-center"
                onClick={getRandomProfileImage}
              >
                <div className="flex flex-row items-center">
                  <FaRandom className="mr-1" />
                  랜덤 뽑기
                </div>
              </div>

              <button className="rounded-[5px] px-3 py-1 bg-[#4B721F] text-white">
                수정하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MyPage;
