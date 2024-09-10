import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { generateRandomData } from "../../../fixtures/docsDummy";
import { useEffect } from "react";

// 테스트용 더미 데이터
const dummyData = generateRandomData(100);

function AdminDocsListPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // 데이터 fetch
  }, []);
  return (
    <>
      <Helmet>
        <title>관리자 - 문서 목록 조회</title>
      </Helmet>

      <div className="max-w-screen-md mx-auto p-4 h-[100vh] flex flex-col">
        <h1 className="text-2xl font-bold mb-4">서류 신청 목록</h1>
        <div className="grid gap-4 grid-cols-1 overflow-y-auto">
          {dummyData.map((doc, index) => (
            <div
              key={index}
              onClick={() => {
                navigate(`/admin/${doc.turtleUUID}/${doc.documentHash}`, {
                  state: {
                    documentType: doc.docType,
                  },
                });
              }}
              className="border cursor-pointer rounded-lg px-6 py-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0"
            >
              <div className="flex flex-col">
                <p className="font-semibold">{doc.docType}</p>
                <div className="space-x-3">
                  <span>{doc.scientificName}</span>
                  <span className="text-gray-600">{doc.name}</span>
                  <span className="text-gray-600">{doc.email}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-gray-500">{doc.registerDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default AdminDocsListPage;
