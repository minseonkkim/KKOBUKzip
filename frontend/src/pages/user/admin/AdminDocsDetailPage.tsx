import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import {
  adminBreedResultdata,
  adminAssignGrantData,
  adminDeathData,
} from "../../../fixtures/docsDummy";
import { docType } from "../../../types/document";

// 더미데이터
import AdminBreedDocsCheck from "../../../components/user/admin/AdminBreedDocsCheck";
import AdminAssignGrantDocsCheck from "../../../components/user/admin/AdminAssignGrantDocsCheck";
import AdminDeathDocsCheck from "../../../components/user/admin/AdminDeathDocsCheck";

let fetchedData = adminBreedResultdata;

function AdminDocsDetailPage() {
  const params = useParams();
  const [layout, setLayout] = useState<docType | null>(null);

  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    // get uuid and hash from params and data fetch
    console.log(params?.turtleUUID, params?.documentHash);
    // 여기서 대충 data fetch해서, data의 docType에 따라 swtich
    if (
      ["인공증식증명서", "양수신고서", "양도신고서", "폐사질병신고서"].includes(
        fetchedData.docType
      )
    ) {
      setData(fetchedData);
      setLayout(fetchedData.docType);
    } else {
      setLayout(null);
    }
  }, [layout]);

  return (
    <>
      <Helmet>
        <title>관리자 - 문서 상세 조회</title>
      </Helmet>
      {/* 테스트 드라이버 */}
      <div className="space-x-3 text-center">
        <button
          onClick={() => {
            setLayout("인공증식증명서");
            fetchedData = adminBreedResultdata as unknown as any;
          }}
        >
          증식
        </button>
        <button
          onClick={() => {
            setLayout("양수신고서");
            fetchedData = adminAssignGrantData as unknown as any;
          }}
        >
          양수
        </button>
        <button
          onClick={() => {
            setLayout("양도신고서");
            fetchedData = adminAssignGrantData as unknown as any;
          }}
        >
          양도
        </button>
        <button
          onClick={() => {
            setLayout("폐사질병신고서");
            fetchedData = adminDeathData as unknown as any;
          }}
        >
          폐사
        </button>
      </div>
      {/* 테스트 드라이버 끝 */}

      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mb-10">
        {layout === "인공증식증명서" && <AdminBreedDocsCheck data={data} />}
        {/* 양수&양도는 같은 양식을 사용함. */}
        {(layout === "양도신고서" || layout === "양수신고서") && (
          <AdminAssignGrantDocsCheck data={data} />
        )}
        {layout === "폐사질병신고서" && <AdminDeathDocsCheck data={data} />}
      </div>
    </>
  );
}

export default AdminDocsDetailPage;
