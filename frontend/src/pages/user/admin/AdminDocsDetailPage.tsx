import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useParams } from "react-router-dom";
import {
  adminBreedResultdata,
  adminAssignGrantData,
  adminDeathData,
} from "../../../fixtures/docsDummy";
import {
  AdminAssignDocumentDataType,
  AdminBreedDocumentDataType,
  AdminDeathDocumentDataType,
} from "../../../types/document";

// 더미데이터
import AdminBreedDocsCheck from "../../../components/user/admin/AdminBreedDocsCheck";
import AdminAssignGrantDocsCheck from "../../../components/user/admin/AdminAssignGrantDocsCheck";
import AdminDeathDocsCheck from "../../../components/user/admin/AdminDeathDocsCheck";
import {
  approveDocumentRequest,
  getDetailDocumentData,
} from "../../../apis/documentApis";
// const fetchedData = {
//   인공증식증명서: adminBreedResultdata as AdminBreedDocumentDataType,
//   양도양수확인서: adminAssignGrantData as AdminAssignDocumentDataType,
//   폐사질병신고서: adminDeathData as AdminDeathDocumentDataType,
// };
// 더미데이터 끝
type AdminDocType = "인공증식증명서" | "양도양수확인서" | "폐사질병신고서";
type dataType =
  | AdminBreedDocumentDataType
  | AdminAssignDocumentDataType
  | AdminDeathDocumentDataType;

function AdminDocsDetailPage() {
  const params = useParams();
  const location = useLocation();
  const [layout, setLayout] = useState<AdminDocType | null>(null);

  const [data, setData] = useState<dataType | null>(null);

  useEffect(() => {
    // get uuid and hash from params and data fetch
    // console.log(params?.turtleUUID, params?.documentHash);
    const documentType: AdminDocType = location.state?.documentType ?? null;

    const getData = async () => {
      if (!params?.turtleUUID || !params?.documentHash) {
        return false;
      }
      // 여기서 대충 data fetch해서, data의 docType에 따라 swtich and data set
      const { success, data, message, error } = await getDetailDocumentData(
        params?.turtleUUID,
        params?.documentHash
      );
      if (!success || !data) {
        // console.error(message, error);
        return false;
      }
      setData(data);
      console.log(data);
      // return;
      if (
        ["인공증식증명서", "양도양수확인서", "폐사질병신고서"].includes(
          documentType
        )
      ) {
        setData(data);
        setLayout(documentType);
        return true;
      } else {
        setData(null);
        setLayout(null);
        return false;
      }

      // 실패했을 시에 실패 알림 추가할 것
    };
    getData();
    // 네트워크 붙이고 dummy 정리할 것
    // search keyword : dummy
    // if (
    //   ["인공증식증명서", "양도양수확인서", "폐사질병신고서"].includes(
    //     documentType
    //   )
    // ) {
    //   setData(fetchedData[documentType]);
    //   setLayout(documentType);
    // }
  }, []);

  const handleAcceptSubmit = (turtleUUID: string, documentHash: string) => {
    approveDocumentRequest(turtleUUID, documentHash, true);
  };
  const handleDenySubmit = (turtleUUID: string, documentHash: string) => {
    approveDocumentRequest(turtleUUID, documentHash, false);
  };
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
            setData(adminBreedResultdata);
          }}
        >
          증식
        </button>
        <button
          onClick={() => {
            setLayout("양도양수확인서");
            setData(adminAssignGrantData);
          }}
        >
          양수
        </button>

        <button
          onClick={() => {
            setLayout("폐사질병신고서");
            setData(adminDeathData);
          }}
        >
          폐사
        </button>
      </div>
      {/* 테스트 드라이버 끝 */}

      <>
        {layout === "인공증식증명서" && (
          <AdminBreedDocsCheck
            onAccept={handleAcceptSubmit}
            onDeny={handleDenySubmit}
            data={data as AdminBreedDocumentDataType}
          />
        )}

        {/* 양수&양도는 같은 양식을 사용함. */}
        {layout === "양도양수확인서" && (
          <AdminAssignGrantDocsCheck
            onAccept={handleAcceptSubmit}
            onDeny={handleDenySubmit}
            data={data as AdminAssignDocumentDataType}
          />
        )}
        {layout === "폐사질병신고서" && (
          <AdminDeathDocsCheck
            onAccept={handleAcceptSubmit}
            onDeny={handleDenySubmit}
            data={data as AdminDeathDocumentDataType}
          />
        )}
      </>
    </>
  );
}

export default AdminDocsDetailPage;
