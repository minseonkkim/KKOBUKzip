import { AdminDeathDocumentDataType } from "../../../types/document";
import CompleteDeathDocument from "../../document/complete/CompleteDeathDocument";
import CheckButonSet from "./CheckButtonSet";

function AdminDeathDocsCheck({ data }: { data: AdminDeathDocumentDataType }) {
  const handleAcceptSubmit = () => {
    alert("폐사승인버튼");
  };

  const handleDenySubmit = () => {
    alert("폐사거절버튼");
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mb-10">
      <CompleteDeathDocument data={data} />
      <CheckButonSet
        handleAcceptSubmit={handleAcceptSubmit}
        handleDenySubmit={handleDenySubmit}
      />
    </div>
  );
}

export default AdminDeathDocsCheck;
