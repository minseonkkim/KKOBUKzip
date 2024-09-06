import { useCallback, useEffect, useState } from "react";
// import { Helmet } from "react-helmet-async";
import BreedDocument from "../../components/document/BreedDocument";
import GrantorDocument from "../../components/document/GrantorDocument";
import AssigneeDocument from "../../components/document/AssigneeDocument";
import MyDocumentDataForm from "../../components/document/MyDocumentDataForm";
import { useLocation } from "react-router-dom";
type TabName = "인공증식" | "양도" | "양수" | "폐사/질병" | ""; // 필요한 탭 이름들을 여기에 추가

// 각 컴포넌트의 구비서류 부분 정비할것!!!

function DocumentFormPage() {
  const [activeTab, setActiveTab] = useState<TabName>(""); // 추후에 동적 할당
  const [tabNameList, setTabNameList] = useState<TabName[]>([]);
  const location = useLocation();

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

  useEffect(() => {
    switch (location.pathname) {
      case "/doc-form/transfer-acquisition":
        setTabNameList(["양도", "양수"]);
        break;
      case "/doc-form/breed-death":
        setTabNameList(["인공증식", "폐사/질병"]);
        break;
      // default:
      // break;
    }
  }, []);

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mb-10">
        <h2 className="text-2xl font-bold mb-6 text-center">서류 등록</h2>

        {/* 상단 선택 탭 */}
        <div className="mb-6 flex justify-center border-b">
          <div className="flex">
            {tabNameList.map((tab) => (
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
        <MyDocumentDataForm />
        {/* 신청인 정보 끝*/}

        {activeTab === "인공증식" && <BreedDocument />}
        {activeTab === "양도" && <GrantorDocument />}
        {activeTab === "양수" && <AssigneeDocument />}
      </div>
    </>
  );
}

export default DocumentFormPage;
