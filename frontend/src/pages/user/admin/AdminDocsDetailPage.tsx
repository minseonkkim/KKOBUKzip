import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import MyDocumentDataForm from "../../../components/document/MyDocumentDataForm";
import {
  adminBreedResultdata,
  adminAssignGrantData,
  adminDeathData,
} from "../../../fixtures/docsDummy";
import { docType } from "../../../types/document";

function AdminDocsDetailPage() {
  const params = useParams();
  const [layout, setLayout] = useState<docType | null>(null);

  useEffect(() => {
    // get uuid and hash from params and data fetch
    console.log(params?.turtleUUID, params?.documentHash);
    // 여기서 대충 data fetch해서, data의 docType에 따라 swtich case
    const data = adminBreedResultdata;

    switch (data.docType) {
      case "인공증식증명서":
        setLayout("인공증식증명서");
        break;
      case "양수신고서":
        setLayout("양수신고서");
        break;
      case "양도신고서":
        setLayout("양도신고서");
        break;
      case "폐사질병신고서":
        setLayout("폐사질병신고서");
        break;
      default:
        setLayout(null);
        break;
    }
  });

  return (
    <>
      <Helmet>
        <title>관리자 - 문서 상세 조회</title>
      </Helmet>

      {/* 테스트 드라이버 */}
      <button onClick={() => setLayout("인공증식증명서")}>증식</button>
      <button onClick={() => setLayout("양도신고서")}>양수양도</button>
      <button onClick={() => setLayout("양수신고서")}>양수양도</button>
      <button onClick={() => setLayout("폐사질병신고서")}>폐사질병</button>
      {/* 테스트 드라이버 끝 */}
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mb-10">
        <MyDocumentDataForm info={adminBreedResultdata?.applicant} />
        {layout === "인공증식증명서" && <></>}
        {/* 양수& 양도는 같은 양식을 사용함. */}
        {layout === "양도신고서" && <></>}
        {layout === "양수신고서" && <></>}
        {layout === "폐사질병신고서" && <></>}
      </div>
    </>
  );
}

export default AdminDocsDetailPage;
