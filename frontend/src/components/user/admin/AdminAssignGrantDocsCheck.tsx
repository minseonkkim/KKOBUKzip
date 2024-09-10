import { AdminAssignDocumentDataType } from "../../../types/document";
import CompleteAssignGrantDocument from "../../document/complete/CompleteAssignGrantDocument";
import CheckButonSet from "./CheckButtonSet";

function AdminAssignGrantDocsCheck({
  data,
}: {
  data: AdminAssignDocumentDataType;
}) {
  const handleAcceptSubmit = () => {
    alert("양수양도승인버튼");
  };

  const handleDenySubmit = () => {
    alert("양수양도거절버튼");
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mb-10">
      <CompleteAssignGrantDocument data={data} />

      <CheckButonSet
        handleAcceptSubmit={handleAcceptSubmit}
        handleDenySubmit={handleDenySubmit}
      />
    </div>
  );
}

export default AdminAssignGrantDocsCheck;
