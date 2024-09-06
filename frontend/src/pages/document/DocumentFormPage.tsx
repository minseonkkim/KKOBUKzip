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

        {activeTab === "인공증식" && <BreedDocument />}
      </div>
    </>
  );
}

export default DocumentFormPage;
