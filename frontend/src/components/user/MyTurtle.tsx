import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TmpTurtleImg2 from "../../assets/tmp_turtle_2.jpg";
import TmpTurtleImg3 from "../../assets/tmp_turtle_3.jpg";
import { IoClose } from "@react-icons/all-files/io5/IoClose";
import { IoMdDocument } from "@react-icons/all-files/io/IoMdDocument";
import { FaSearch } from "@react-icons/all-files/fa/FaSearch";
import CompleteBreedDocument from "../document/complete/CompleteBreedDocument";
import {
  AdminAssignDocumentDataType,
  AdminBreedDocumentDataType,
  AdminDeathDocumentDataType,
} from "../../types/document";
import CompleteAssignGrantDocument from "../document/complete/CompleteAssignGrantDocument";
import CompleteDeathDocument from "../document/complete/CompleteDeathDocument";
import formatDate from "../../utils/formatDate";
import Web3 from "web3";
import { useWeb3Store } from "../../store/useWeb3Store";
import Alert from "../common/Alert";
import { getDetailDocumentData } from "../../apis/documentApis";
import NoTurtleImg from "../../assets/NoTurtleImg.webp";

interface MyTurtleProps {
  isDead: boolean;
  turtleId: number;
  turtleUuid: string;
  name: string;
  scientificName: string;
  gender: string;
  weight: number;
  birth: string;
  imageAddress: string;
  fatherName: string;
  motherName: string;
  motherImageAddress?: string;
  fatherImageAddress?: string;
}

function MyTurtle({
  turtleId,
  turtleUuid,
  name,
  scientificName,
  gender,
  weight,
  birth,
  imageAddress,
  isDead,
  fatherName,
  motherName,
  motherImageAddress,
  fatherImageAddress,
}: MyTurtleProps) {
  const navigate = useNavigate();
  const { documentContract } = useWeb3Store();
  const [selectedMenu, setSelectedMenu] = useState(0); // 0은 인공증식, 1은 양도양수, 2는 폐사

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

  const [isAgreeAlertOpen, setIsAgreeAlertOpen] = useState(false);
  const [isDisagreeAlertOpen, setIsDisagreeAlertOpen] = useState(false);
  const [errorAlertOpen, setErrorAlertOpen] = useState(false);

  const openAgreeAlert = () => setIsAgreeAlertOpen(true);
  const closeAgreeAlert = () => setIsAgreeAlertOpen(false);

  const openDisagreeAlert = () => setIsDisagreeAlertOpen(true);
  const closeDisagreeAlert = () => setIsDisagreeAlertOpen(false);

  const openErrorAlert = () => setErrorAlertOpen(true);
  const closeErrorAlert = () => setErrorAlertOpen(false);

  const [breedDocumentData, setBreedDocumentData] =
    useState<AdminBreedDocumentDataType | null>(null);
  const [transferDocumentData, setTransferDocumentData] =
    useState<AdminAssignDocumentDataType | null>(null);
  const [deathDocumentData, setDeathDocumentData] =
    useState<AdminDeathDocumentDataType | null>(null);

  useEffect(() => {
    async function fetchData() {
      const breedDoc: [boolean, string] = await documentContract!.methods
        .searchCurrentMultiplicationDocumentHash(turtleUuid)
        .call();
      const transferDoc: [boolean, string] = await documentContract!.methods
        .searchCurrentTransferredDocumentHash(turtleUuid)
        .call();
      const deathDoc: [boolean, string] = await documentContract!.methods
        .searchCurrentDeathDocumentHash(turtleUuid)
        .call();

      if (breedDoc[0]) {
        const { message, success, data, error } = await getDetailDocumentData(
          turtleUuid,
          breedDoc[1].slice(2)
        );
        if (success) {
          setBreedDocumentData(data! as AdminBreedDocumentDataType);
        } else {
          console.error("breedDocData : ", error, message);
        }
      }

      if (transferDoc[0]) {
        const { message, success, data, error } = await getDetailDocumentData(
          turtleUuid,
          transferDoc[1].slice(2)
        );
        if (success) {
          setTransferDocumentData(data! as AdminAssignDocumentDataType);
        } else {
          console.error("transferDocData : ", error, message);
        }
      }

      if (deathDoc[0]) {
        const { message, success, data, error } = await getDetailDocumentData(
          turtleUuid,
          transferDoc[1].slice(2)
        );
        if (success) {
          setDeathDocumentData(data! as AdminDeathDocumentDataType);
        } else {
          console.error("deathDocData : ", error, message);
        }
      }
    }

    fetchData();
  }, [documentContract, turtleUuid]);

  const goToAuctionRegister = () => {
    navigate("/auction-register", {
      state: {
        turtleId: turtleId,
        name: name,
        scientificName: scientificName,
        gender: gender,
        weight: weight,
        birth: birth,
        imageAddress: imageAddress,
      },
    });
  };

  const goToTransactionRegister = () => {
    navigate("/transaction-register", {
      state: {
        turtleId: turtleId,
        name: name,
        scientificName: scientificName,
        gender: gender,
        weight: weight,
        birth: birth,
        imageAddress: imageAddress,
      },
    });
  };

  const openDetailModal = () => {
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  const handleDetailOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      closeDetailModal();
    }
  };

  const openDocumentModal = () => {
    setIsDocumentModalOpen(true);
  };

  const closeDocumentModal = () => {
    setIsDocumentModalOpen(false);
  };

  const handleDocumentOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      closeDocumentModal();
    }
  };

  const goToDeathDocumentaion = () => {
    navigate("/doc-form/death", { state: { turtleId, turtleUuid } });
  };

  const handleTurtleDataVerification = async () => {
    console.log(`${birth}${weight}${gender}`);
    const turtleHash = Web3.utils.sha3(`${birth}${weight}${gender}`);

    try {
      const result = await documentContract!.methods
        .turtleValid(turtleUuid, turtleHash)
        .call();
      if (result) {
        openAgreeAlert();
      } else {
        openDisagreeAlert();
      }
    } catch (error) {
      console.log("에러 : ", error);
      openErrorAlert();
    }
  };

  return (
    <>
      <div className="border-[2px] rounded-[20px] p-2 md:p-[15px] bg-[#f8f8f8]">
        <div className="flex flex-row justify-between items-center mb-3">
          <div
            className={`text-[18px] md:text-[20px] ${
              isDead ? "text-gray-400" : ""
            }`}
          >
            {name}
          </div>
          <div className="flex flex-row items-center space-x-2">
            <FaSearch
              onClick={openDetailModal}
              className="size-5 text-[#adb5bd] hover:text-[#495057] cursor-pointer"
            />
            <IoMdDocument
              onClick={openDocumentModal}
              className="size-6 text-[#adb5bd] hover:text-[#495057] cursor-pointer"
            />
          </div>
        </div>
        <img
          src={imageAddress == null ? NoTurtleImg : imageAddress}
          className="rounded-[10px] w-full lg:h-[160px] md:h-[170px] h-[130px] object-cover"
          draggable="false"
          alt="turtle image"
        />
        {isDead ? (
          <div className="lg:text-[17px] my-3 text-[16px] h-[66px] md:h-[76px] flex justify-center items-center">
            폐사한 개체입니다.
          </div>
        ) : (
          <>
            <div className="flex flex-row justify-between mt-3 lg:text-[17px] text-[16px]">
              {/* 판매 등록 했을 경우 버튼 비활성화 */}
              <button
                onClick={goToTransactionRegister}
                className="w-[48%] h-[33px] md:h-[38px] bg-[#D8F1D5] rounded-[10px] hover:bg-[#CAEAC6]"
              >
                판매 등록
              </button>
              {/* 경매 등록 했을 경우 버튼 비활성화 */}
              <button
                onClick={goToAuctionRegister}
                className="w-[48%] h-[33px] md:h-[38px] bg-[#D8F1D5] rounded-[10px] hover:bg-[#CAEAC6]"
              >
                경매 등록
              </button>
            </div>
            <div className="flex flex-row justify-between mt-3 lg:text-[17px] text-[16px]">
              <button
                className="w-[48%] h-[33px] md:h-[38px] bg-[#D8F1D5] rounded-[10px] hover:bg-[#CAEAC6]"
                onClick={goToDeathDocumentaion}
              >
                질병·폐사 등록
              </button>
              <button
                className="w-[48%] h-[33px] md:h-[38px] bg-[#D8F1D5] rounded-[10px] hover:bg-[#CAEAC6]"
                onClick={handleTurtleDataVerification}
              >
                정보 검증
              </button>
            </div>
          </>
        )}
      </div>

      <Alert
        isOpen={isAgreeAlertOpen}
        message="블록체인 네트워크의 해시 정보와 일치합니다."
        onClose={closeAgreeAlert}
      />
      <Alert
        isOpen={isDisagreeAlertOpen}
        message="블록체인 네트워크의 해시 정보와 일치하지 않습니다. 관리자에게 문의 부탁드립니다."
        onClose={closeDisagreeAlert}
      />
      <Alert
        isOpen={errorAlertOpen}
        message="블록체인 네트워크와 통신 중 오류가 발생했습니다. 다시 시도해 주세요."
        onClose={closeErrorAlert}
      />

      {isDetailModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100000]"
          onClick={handleDetailOverlayClick}
        >
          <div className="bg-white p-6 rounded-[10px] shadow-lg md:w-[570px] w-[380px]">
            <div className="flex flex-row justify-between">
              <h2 className="text-[22px] font-bold mb-4 font-stardust">
                상세 정보
              </h2>
              <IoClose
                className="text-[30px] cursor-pointer"
                onClick={closeDetailModal}
              />
            </div>

            <div className="flex flex-row w-full space-x-5">
              <div className="w-1/2 h-[180px] overflow-hidden">
                <img
                  src={imageAddress == null ? NoTurtleImg : imageAddress}
                  className="object-cover rounded-[10px] w-full h-[155px] md:h-[180px]"
                  draggable="false"
                  alt="turtle image"
                />
              </div>
              <div className="w-1/2 md:text-[19px] text-[17px] flex flex-col space-y-2">
                <div>이름: {name}</div>
                <div>종: {scientificName}</div>
                <div>성별 : {gender == "MALE" ? "수컷" : "암컷"}</div>
                <div>생년월일 : {formatDate(birth)}</div>
              </div>
            </div>

            <div className="flex flex-row mt-1 md:mt-7">
              <div className="flex flex-col space-y-2 w-1/2 text-[19px]">
                <div>부개체 : {fatherName}</div>
                <img
                  src={fatherImageAddress ?? NoTurtleImg}
                  className="object-cover rounded-[10px] w-full h-[155px] md:h-[180px]"
                  draggable="false"
                  alt="father turtle image"
                />
              </div>
              <div className="flex flex-col space-y-2 w-1/2 text-[19px]">
                <div>모개체 : {motherName}</div>
                <img
                  src={motherImageAddress ?? NoTurtleImg}
                  className="object-cover rounded-[10px] w-full h-[155px] md:h-[180px]"
                  draggable="false"
                  alt="mother turtle image"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {isDocumentModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100000]"
          onClick={handleDocumentOverlayClick}
        >
          <div className="bg-white p-6 rounded-[10px] shadow-lg md:w-[800px] w-[380px]">
            <div className="flex flex-row justify-between">
              <h2 className="text-[22px] font-bold mb-4 font-stardust">
                서류 조회
              </h2>
              <IoClose
                className="text-[30px] cursor-pointer"
                onClick={closeDocumentModal}
              />
            </div>
            <div className="md:mt-[25px] mt-2 text-[20px] flex flex-row cursor-pointer mb-[10px] font-stardust">
              <div
                className={`w-1/3 h-[42px] border-b-[4px] text-center ${
                  selectedMenu === 0 && "border-[#4B721F] font-bold"
                }`}
                onClick={() => setSelectedMenu(0)}
              >
                인공증식
              </div>
              <div
                className={`w-1/3 h-[42px] border-b-[4px] text-center ${
                  selectedMenu === 1 && "border-[#4B721F] font-bold"
                }`}
                onClick={() => setSelectedMenu(1)}
              >
                양도·양수
              </div>
              <div
                className={`w-1/3 h-[42px] border-b-[4px] text-center ${
                  selectedMenu === 2 && "border-[#4B721F] font-bold"
                }`}
                onClick={() => setSelectedMenu(2)}
              >
                폐사
              </div>
            </div>

            {/* 인공증식 */}
            {selectedMenu === 0 && (
              <div className="md:h-[560px] h-[390px] overflow-y-auto md:p-12 p-3">
                <CompleteBreedDocument data={breedDocumentData} />
              </div>
            )}

            {/* 양도양수 */}
            {selectedMenu === 1 && (
              <div className="md:h-[560px] h-[390px] overflow-y-auto md:p-12 p-3">
                <CompleteAssignGrantDocument data={transferDocumentData} />
              </div>
            )}

            {/* 폐사 */}
            {selectedMenu === 2 && (
              <div className="md:h-[560px] h-[390px] overflow-y-auto md:p-12 p-3">
                <CompleteDeathDocument data={deathDocumentData} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default MyTurtle;
