import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import MyDocumentDataForm from "../../../components/document/MyDocumentDataForm";
import { adminBreedResultdata } from "../../../fixtures/docsDummy";

function AdminDocsDetailPage() {
  const params = useParams();
  useEffect(() => {
    // get uuid and hash from params and data fetch
    console.log(params?.turtleUUID, params?.documentHash);
  });

  return (
    <>
      <Helmet>
        <title>관리자 - 문서 상세 조회</title>
      </Helmet>

      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mb-10">
        <MyDocumentDataForm info={adminBreedResultdata.applicant} />
      </div>
    </>
  );
}

export default AdminDocsDetailPage;
