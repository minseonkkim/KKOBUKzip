import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TmpTurtleImg from "../../assets/tmp_turtle.jpg";
import TmpTurtleImg2 from "../../assets/tmp_turtle_2.jpg";
import TmpTurtleImg3 from "../../assets/tmp_turtle_3.jpg";
import { IoClose } from "react-icons/io5";
// import BreedDocument from "../document/BreedDocument";
import CompleteBreedDocument from "../document/complete/CompleteBreedDocument";
import { AdminAssignDocumentDataType, AdminBreedDocumentDataType, AdminDeathDocumentDataType } from "../../types/document";
import CompleteAssignGrantDocument from "../document/complete/CompleteAssignGrantDocument";
import CompleteDeathDocument from "../document/complete/CompleteDeathDocument";

// 더미데이터
const exampleData: AdminBreedDocumentDataType = {
  docType: "인공증식증명서", 
  documentHash: "ABC123XYZ", 
  turtleUUID: "TURTLE-001", 
  applicant: {
    name: "민선",
    foreignFlag: true,
    phonenumber: "010-0000-0000",
    birth: "2001-08-02",
    email: "sds@ssafy.com",
    address: "under the sea",
  },
  detail: {
    scientificName: "Malaclemys terrapin",
    area: "50 square meters",
    count: 5,
    purpose: "연구",
    registerDate: "2024-09-20",
    motherUUID: "MOTHER-UUID-001",
    motherAquisition: "Wild captured in 2018",
    fatherUUID: "FATHER-UUID-001",
    fatherAquisition: "Bred in captivity in 2019",
    locationSpecification:
      "Artificial breeding facility located at the coastal area, equipped with saltwater tanks.",
    multiplicationMethod: "Egg incubation with temperature control", 
    shelterSpecification: "Includes UVB lighting and heat lamps", 
  },
};

const exampleData2: AdminAssignDocumentDataType = {
  docType: "양도양수확인서",
  documentHash: "DEF456UVW",
  turtleUUID: "TURTLE-002",
  applicant: {
    name: "민선",
    foreignFlag: true,
    phonenumber: "010-0000-0000",
    birth: "2001-08-02",
    email: "sds@ssafy.com",
    address: "under the sea",
  },
  assignee: {
    name: "Michael Johnson",
    address: "789 Coastal Road, Bay Area",
    phoneNumber: "010-1111-2222",
  },
  grantor: {
    name: "Sarah Lee",
    address: "321 Marine Drive, Coral City",
    phoneNumber: "010-3333-4444",
  },
  detail: {
    scientificName: "Malaclemys terrapin",
    count: 2,
    registerDate: "2024-09-20",
    transferReason: "For research purposes",
    aquisition: "Purchased from a licensed breeder in 2023",
    motherUUID: "MOTHER-UUID-002",
    motherAquisition: "Acquired from a conservation program in 2019",
    fatherUUID: "FATHER-UUID-002",
    fatherAquisition: "Bred in a certified facility in 2020",
  },
};


const exampleData3: AdminDeathDocumentDataType = {
  docType: "폐사질병서류", 
  documentHash: "GHI789JKL", 
  turtleUUID: "TURTLE-003", 
  applicant: {
    name: "민선",
    foreignFlag: true,
    phonenumber: "010-0000-0000",
    birth: "2001-08-02",
    email: "sds@ssafy.com",
    address: "under the sea",
  },
  detail: {
    scientificName: "Malaclemys terrapin",
    shelter: "Aquatic Facility, Room 3",
    count: 1,
    registerDate: "2024-09-20",
    deathReason: "Bacterial infection", 
    plan: "Disposal through authorized biological waste disposal service", 
    deathImage: "image_url_of_deceased_turtle.jpg", 
    diagnosis: "Veterinarian's diagnosis confirming infection", 
  },
};



export default function MyTurtle() {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState(0);  // 0은 인공증식, 1은 양도양수, 2는 폐사

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

  const goToAuctionRegister = () => {
    navigate("/auction-register");
  };

  const goToTransactionRegister = () => {
    navigate("/transaction-register");
  };

  const openDetailModal = () => {
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  const handleDetailOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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

  const handleDocumentOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      closeDocumentModal();
    }
  };

  return (
    <>
      <div className="border-[2px] rounded-[20px] p-2 md:p-[15px] bg-[#f8f8f8]">
        <div className="flex flex-row justify-between items-center mb-3">
          <div className="text-[18px] md:text-[20px]">꼬북이</div>
          <div className="font-bold text-gray-400">24.09.01</div>
        </div>
        <img
          src={TmpTurtleImg}
          className="rounded-[10px] w-full lg:h-[190px] md:h-[170px] h-[130px] object-cover"
          draggable="false"
        />
        <div className="flex flex-row justify-between mt-4 lg:text-[17px] text-[16px]">
          <button
            onClick={openDetailModal}
            className="w-[48%] h-[33px] md:h-[37px] bg-[#D8F1D5] rounded-[10px] hover:bg-[#CAEAC6]"
          >
            상세 정보
          </button>
          <button className="w-[48%] h-[33px] md:h-[37px] bg-[#D8F1D5] rounded-[10px] hover:bg-[#CAEAC6]"
            onClick={openDocumentModal}>
            서류 조회
          </button>
        </div>
        <div className="flex flex-row justify-between mt-3 lg:text-[17px] text-[16px]">
          {/* 판매 등록 했을 경우 버튼 비활성화 */}
          <button
            onClick={goToTransactionRegister}
            className="w-[48%] h-[33px] md:h-[37px] bg-[#D8F1D5] rounded-[10px] hover:bg-[#CAEAC6]"
          >
            판매 등록
          </button>
          {/* 경매 등록 했을 경우 버튼 비활성화 */}
          <button
            onClick={goToAuctionRegister}
            className="w-[48%] h-[33px] md:h-[37px] bg-[#D8F1D5] rounded-[10px] hover:bg-[#CAEAC6]"
          >
            경매 등록
          </button>
        </div>
      </div>

      {isDetailModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100000]"
          onClick={handleDetailOverlayClick} 
        >
          <div className="bg-white p-6 rounded-[10px] shadow-lg md:w-[620px] w-[380px]">
            <div className="flex flex-row justify-between">
                <h2 className="text-[22px] font-bold mb-4 font-stardust">상세 정보</h2>
                <IoClose className="text-[30px] cursor-pointer" onClick={closeDetailModal} />
            </div>
            
            <div className="flex flex-row w-full space-x-5">
                <div className="w-1/2 h-[180px] overflow-hidden">
                    <img src={TmpTurtleImg} className="object-cover rounded-[10px] w-full h-[155px] md:h-[180px]" draggable="false"/>
                </div>
                <div className="w-1/2 md:text-[19px] text-[17px] flex flex-col space-y-2">
                    <div>이름: 김거북</div>
                    <div>종: 페닐슐라쿠터</div>
                    <div>성별 : 암컷</div>
                    <div>생년월일 : 24년 8월 30일</div>
                </div>
            </div>

            <div className="flex flex-row mt-1 md:mt-7">
                <div className="flex flex-col space-y-2 w-1/2 text-[19px]">
                    <div>부개체 : 저거북</div>
                    <img src={TmpTurtleImg2} className="object-cover rounded-[10px] w-full h-[155px] md:h-[180px]" draggable="false"/>
                </div>
                <div className="flex flex-col space-y-2 w-1/2 text-[19px]">
                    <div>모개체 : 이거북</div>
                    <img src={TmpTurtleImg3} className="object-cover rounded-[10px] w-full h-[155px] md:h-[180px]" draggable="false"/>
                </div>
            </div>
          </div>
        </div>
      )}

      {isDocumentModalOpen && 
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100000]"
        onClick={handleDocumentOverlayClick} >
            <div className="bg-white p-6 rounded-[10px] shadow-lg md:w-[620px] w-[380px]">
                <div className="flex flex-row justify-between">
                    <h2 className="text-[22px] font-bold mb-4 font-stardust">서류 조회</h2>
                    <IoClose className="text-[30px] cursor-pointer" onClick={closeDocumentModal} />
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
                {selectedMenu === 0 &&
                <div className="md:h-[540px] h-[390px] overflow-y-auto md:p-12 p-3">
                    <CompleteBreedDocument data={exampleData}/>
                </div>}

                {/* 양도양수 */}
                {selectedMenu === 1 &&
                <div className="md:h-[540px] h-[390px] overflow-y-auto md:p-12 p-3">
                    <CompleteAssignGrantDocument data={exampleData2}/>
                </div>}

                {/* 폐사 */}
                {selectedMenu === 2 &&
                <div className="md:h-[540px] h-[390px] overflow-y-auto md:p-12 p-3">
                    <CompleteDeathDocument data={exampleData3}/>
                </div>}

            </div>
            
      </div>}
    </>
  );
}
