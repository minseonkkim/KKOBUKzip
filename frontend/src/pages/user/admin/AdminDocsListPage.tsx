import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllDocumentDataForAdmin } from "../../../apis/documentApis";
import { AdminDocsListDataType } from "../../../types/document";

function AdminDocsListPage() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<AdminDocsListDataType[]>([]);

  // 네트워크 붙이고 더미 치울것
  useEffect(() => {
    const getData = async () => {
      const { success, data, error } = await getAllDocumentDataForAdmin();
      console.log(success && data, error);
      if (success && data?.length! > 0) {
        setDocuments(data!);
      } else {
        alert(data?.length === 0 ? "데이터가 없습니다!" : error);
      }
    };
    getData();
  }, []);
  return (
    <>
      <Helmet>
        <title>관리자 - 문서 목록 조회</title>
      </Helmet>

      <div className="max-w-screen-md mx-auto p-4 h-[100vh] flex flex-col">
        <h1 className="text-2xl font-bold mb-4">서류 신청 목록</h1>
        <div className="grid gap-4 grid-cols-1 overflow-y-auto">
          {documents.length === 0 && (
            <div className="text-center text-gray-500">
              신청중인 문서가 없습니다.
            </div>
          )}
          {documents.map((doc, index) => (
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
