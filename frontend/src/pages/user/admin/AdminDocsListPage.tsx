import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { getAllDocumentDataForAdmin } from "../../../apis/documentApis";
import { AdminDocsListDataType } from "../../../types/document";
import Header from "../../../components/common/Header";
import { GrPowerReset } from "@react-icons/all-files/gr/GrPowerReset";

function AdminDocsListPage() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<AdminDocsListDataType[]>([]);

  const fetchDocuments = useCallback(async () => {
    const { success, data, error, message } = await getAllDocumentDataForAdmin();
    console.log(success && data, error);  

    if (success && data!.length > 0) {
      setDocuments(data!);
    }else{
      alert(message)
      navigate(-1)
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return (
    <>
      <Helmet>
        <title>관리자 - 문서 목록 조회</title>
      </Helmet>
      <Header />

      <div className="max-w-screen-md mx-auto mt-[100px] p-4 h-[100vh] flex flex-col">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold mb-4">서류 신청 목록</h1>
          <div
            onClick={fetchDocuments}
            className="flex justify-center items-center border-[2px] border-[#DADADA] rounded-[360px] w-[38px] md:w-[42px] h-[38px] md:h-[42px] cursor-pointer font-bold hover:text-[#4B721F] hover:border-[#4B721F]"
          >
            <GrPowerReset className="text-[18px] md:text-[20px] " />
          </div>
        </div>
        <div className="grid gap-4 grid-cols-1 overflow-y-auto">
          {documents.length === 0 && (
            <div className="text-center mt-10 text-gray-500">
              승인 처리 대기 중인 문서가 없습니다.
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
