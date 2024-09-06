import { useCallback, useEffect, useState } from "react";
// import { Helmet } from "react-helmet-async";
import BreedDocument from "../../components/document/BreedDocument";
type TabName = "인공증식" | "양도" | "양수" | "폐사/질병"; // 필요한 탭 이름들을 여기에 추가

function DocumentFormPage() {
  const [activeTab, setActiveTab] = useState<TabName>("인공증식"); // 추후에 동적 할당

  // 주소 찾기 스크립트 + 로드
  const loadDaumPostcodeScript = useCallback(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    loadDaumPostcodeScript();
  }, [loadDaumPostcodeScript]);

  return (
    <>
      {/* <Helmet>
        <title>문서폼페이지</title>
      </Helmet> */}

      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">서류 등록</h2>

        {/* 상단 선택 탭 */}
        <div className="mb-6 flex justify-center border-b">
          <div className="flex">
            {["인공증식", "양도", "양수", "폐사/질병"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 font-bold"
                    : ""
                }`}
                onClick={() => setActiveTab(tab as TabName)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        {/* 선택 탭 끝 */}

        {/* 신청인 정보 -데이터 연동되면 할당할 것 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">신청인 정보</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex">
              <span className="w-1/3 font-medium">성명</span>
              <span className="w-2/3">김씨피</span>
            </div>
            <div className="flex">
              <span className="w-1/3 font-medium">국적</span>
              <span className="w-2/3">내국인</span>
            </div>
            <div className="flex">
              <span className="w-1/3 font-medium">전화번호</span>
              <span className="w-2/3">010-3333-3333</span>
            </div>
            <div className="flex">
              <span className="w-1/3 font-medium">생년월일</span>
              <span className="w-2/3">2024-01-02</span>
            </div>
            <div className="flex">
              <span className="w-1/3 font-medium">이메일</span>
              <span className="w-2/3">ssafy@ssafy.com</span>
            </div>
            <div className="flex">
              <span className="w-1/3 font-medium">주소</span>
              <span className="w-2/3">광주광역시 하남산단6번로 107</span>
            </div>
          </div>
        </div>
        {/* 신청인 정보 끝*/}
        {activeTab === "인공증식" && <BreedDocument />}
      </div>
    </>
  );
}

export default DocumentFormPage;
