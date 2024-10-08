import { Helmet } from "react-helmet-async";
import Header from "../../components/common/Header";
import { useCallback, useEffect, useState } from "react";
import MyTurtle from "../../components/user/MyTurtle";
import TransactionHistory from "../../components/user/TransactionHistory";
import { TransactionItemDataType } from "../../types/transaction";
import NoImage from "../../assets/no_image.webp";
import { FaRandom } from "@react-icons/all-files/fa/FaRandom";

import {
  getMyTransaction,
  getMyTurtle,
  getMyAuction,
  patchProfileImage,
} from "../../apis/userApi";
import { useUserStore } from "../../store/useUserStore";
import { TurtleDataType } from "../../types/turtle";
import { useNavigate } from "react-router-dom";
import AuctionHistory from "../../components/user/AuctionHistory";

interface AuctionItemType {
  buyerId: number | null;
  buyerUuid: string | null;
  createDate: string | null;
  images: string;
  price: number | null;
  progress: string;
  scientificName: string | null;
  sellerAddress: string;
  sellerId: number;
  sellerName: string;
  sellerUuid: string | null;
  tags: string[];
  title: string;
  transactionId: number | null;
  turtleId: number | null;
  turtleUuid: string;
  weight: number;
}

function MyPage() {
  const navigate = useNavigate();
  const [turtleData, setTurtleData] = useState<TurtleDataType[]>([]);
  const [selectedMenu, setSelectedMenu] = useState(1); // 0은 거래 내역, 1은 나의 거북이
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [myTransactions, setMyTransactions] = useState<
    TransactionItemDataType[]
  >([]);
  const [myAuctions, setMyAuctions] = useState<AuctionItemType[]>([]);

  const { userInfo } = useUserStore();
  const [profileImage, setProfileImage] = useState(userInfo?.profileImage);
  const [myTurtlesUuid, setMyTurtlesUuid] = useState<
    { turtleName: string; turtleUuid: string; turtleGender: string }[]
  >([]);

  // const userTransactions = useMemo(() => myTransactions, [myTransactions]);
  // const userTurtles = useMemo(() => turtleData, [turtleData]);

  const openCustomModal = useCallback(() => setIsCustomModalOpen(true), []);
  const closeCustomModal = useCallback(() => setIsCustomModalOpen(false), []);

  const handleCustomOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (e.target === e.currentTarget) {
        closeCustomModal();
      }
    },
    [closeCustomModal]
  );

  useEffect(() => {
    const init = async () => {
      try {
        const [transactionResponse, turtleResponse, auctionResponse] =
          await Promise.all([
            getMyTransaction(),
            getMyTurtle(),
            getMyAuction(),
          ]);

        if (transactionResponse.success) {
          console.log(
            "거래내역 목록",
            transactionResponse.data!.data.transaction
          );
          setMyTransactions(transactionResponse.data!.data.transaction);
        }
        if (auctionResponse.success) {
          console.log("경매내역 목록", auctionResponse.data!.data.data);
          setMyAuctions(auctionResponse.data.data.data);
        }
        if (turtleResponse.success) {
          setTurtleData(turtleResponse.data.data.data.data);
          console.log("거북이 목록", turtleResponse.data.data.data.data);
        }
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const makemMTurtlesUuidArray = () => {
      const uuidArray = turtleData.map((turtle) => {
        console.log(turtle);
        return {
          turtleName: turtle.name,
          turtleUuid: turtle.turtleUuid,
          turtleGender: turtle.gender,
        };
      });
      setMyTurtlesUuid(uuidArray);
    };
    makemMTurtlesUuidArray();
  }, [turtleData]);

  // const handleCustomOverlayClick = (
  //   e: React.MouseEvent<HTMLDivElement, MouseEvent>
  // ) => {
  //   if (e.target === e.currentTarget) {
  //     closeCustomModal();
  //   }
  // };

  const getRandomProfileImage = () => {
    const randomIndex = Math.floor(Math.random() * 14) + 1;
    // const randomIndex = Math.floor(Math.random() * profileImages.length);
    const selectedImagePath = `custom_profile/profile${randomIndex}.gif`; // public 폴더는 경로에서 제외
    setProfileImage(selectedImagePath);
    // setProfileImage(profileImages[randomIndex]);
  };

  const changeProfileImage = async () => {
    if (!profileImage) {
      console.error("Profile image is not defined");
      return;
    }
    const response = await fetch(profileImage);
    const blob = await response.blob();
    const imageName = profileImage.split("/").pop() || "default.gif";
    // blob의 MIME 타입을 명시적으로 image/gif로 변환
    const gifBlob = blob.slice(0, blob.size, "image/gif");
    const file = new File([gifBlob], imageName, { type: "image/gif" });
    try {
      const result = await patchProfileImage(file);
      const newProfileImageUrl = result.data?.data.url;

      if (newProfileImageUrl) {
        useUserStore.getState().setProfileImage(newProfileImageUrl);
        // 모달 닫기
        closeCustomModal();
        console.log("프로필사진 업데이트 완료:", newProfileImageUrl);
      } else {
        console.error("No valid profile image URL found in response:", result);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const goToBreedDocPage = () => {
    navigate("/doc-form/breed", { state: myTurtlesUuid });
  };

  return (
    <>
      <Helmet>
        <title>마이페이지</title>
      </Helmet>
      <Header />
      <main className="flex flex-col h-[100vh] overflow-hidden px-4 lg:px-[250px] pt-[78px]">
        <div className="flex flex-row justify-between items-center mt-0 lg:mt-[20px] px-[23px] py-[18px] bg-gradient-to-r from-[#e7f6d1] via-[#d5e5bd] to-[#e7f6d1] rounded-[20px]">
          <div className="w-1/2">
            <div className="font-dnf-bitbit text-[#4B721F] text-[24px] md:text-[27px] mt-1 mb-2 md:mb-5">
              내 정보
            </div>
            <div className="lg:text-[19px] text-[17px] space-y-1">
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
        <div className="w-full flex lg:flex-row flex-col justify-between items-center">
          <div className="lg:w-auto w-full mt-[25px] text-[21px] lg:text-[23px] flex flex-row cursor-pointer mb-[10px] font-stardust">
            <div
              className={`w-1/2 lg:w-[150px] h-[42px] border-b-[4px] text-center ${
                selectedMenu === 1 && "border-[#4B721F] font-bold"
              }`}
              onClick={() => setSelectedMenu(1)}
            >
              나의 거북이
            </div>
            <div
              className={`w-1/2 lg:w-[150px] h-[42px] border-b-[4px] text-center ${
                selectedMenu === 0 && "border-[#4B721F] font-bold"
              }`}
              onClick={() => setSelectedMenu(0)}
            >
              거래 내역
            </div>
          </div>
          {selectedMenu === 1 && (
            <button
              className="text-[20px] rounded-[10px] bg-[#F5E0E4] h-[37px] px-3 border-2 border-dotted border-[#353535]"
              onClick={goToBreedDocPage}
            >
              인공증식 등록
            </button>
          )}
        </div>
        <div className="overflow-y-auto flex-1 mb-4">
          {/* 거래내역 */}
          {selectedMenu === 0 && (
  <>
    {myTransactions.length == 0 && myAuctions.length == 0 ? (
      <div className="w-full flex justify-center items-center flex-col bg-[#f7f7f7] rounded-[20px] px-5 py-28">
        <img
          src={NoImage}
          alt="turtle image"
          className="w-[200px] mb-7"
          draggable="false"
        />
        <div className="text-[25px] font-bold text-center font-stardust">
          거래 내역이 없어요.
        </div>
      </div>
      
    ) : (
      <>
       <div className="flex flex-col space-y-4">
        {myAuctions.map((item) => (
          <AuctionHistory
            key={item.transactionId}
            turtleId={item.turtleId}
            turtleUuid={item.turtleUuid}
            transactionId={item.transactionId}
            sellerId={item.sellerId}
            sellerUuid={item.sellerUuid}
            sellerName={item.sellerName}
            sellerAddress={item.sellerAddress}
            tags={item.tags}
            price={item.price}
            images={item.images}
            progress={item.progress}
          />
        ))}
      </div>
      <div className="flex flex-col space-y-4 mb-4">
        {myTransactions.map((item) => (
          <TransactionHistory
            key={item.transactionId}
            auctionFlag={item.auctionFlag}
            documentHash={item.documentHash!}
            turtleId={item.turtleId}
            turtleUuid={item.turtleUuid}
            transactionId={item.transactionId}
            sellerId={item.sellerId}
            sellerUuid={item.sellerUuid}
            sellerName={item.sellerName}
            sellerAddress={item.sellerAddress}
            transactionTag={item.transactionTag}
            amount={item.price}
            transactionImage={item.transactionImage}
            progress={item.progress}
            myTurtlesUuid={myTurtlesUuid}
          />
        ))}
      </div>
     
      </>
        )}
      </>
    )}

          {/* 나의 거북이 */}
          {selectedMenu === 1 &&
            (turtleData.length !== 0 ? (
              // 나의 거북이가 있을 경우
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
                {turtleData.map((turtle) => (
                  <MyTurtle
                    key={turtle.id}
                    turtleId={turtle.id}
                    turtleUuid={turtle.turtleUuid}
                    name={turtle.name}
                    scientificName={turtle.scientificName}
                    gender={turtle.gender}
                    weight={turtle.weight}
                    birth={turtle.birth}
                    imageAddress={turtle.imageAddress!}
                  />
                ))}
              </div>
            ) : (
              <div className="w-full flex justify-center items-center flex-col bg-[#f7f7f7] rounded-[20px] px-5 py-28">
                <img
                  src={NoImage}
                  alt="turtle image"
                  className="w-[200px] mb-7"
                  draggable="false"
                />
                <div className="text-[25px] font-bold text-center font-stardust">
                  나의 거북이가 없어요.
                </div>
              </div>
            ))}
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
              <button
                className="rounded-[5px] px-3 py-1 bg-[#4B721F] text-white"
                onClick={changeProfileImage}
              >
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
