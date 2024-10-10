import { AdminDeathDocumentDataType } from "../../../types/document";
import CompleteDeathDocument from "../../document/complete/CompleteDeathDocument";
import CheckButonSet from "./CheckButtonSet";

function AdminDeathDocsCheck({
  onAccept,
  onDeny,
  data,
}: {
  onAccept: (turtleUUID: string, documentHash: string) => void;
  onDeny: (turtleUUID: string, documentHash: string) => void;
  data: AdminDeathDocumentDataType;
}) {
  const handleAcceptSubmit = () => {
    onAccept(data.turtleUUID, data.documentHash);
    // alert("폐사승인버튼");
  };

  const handleDenySubmit = () => {
    onDeny(data.turtleUUID, data.documentHash);
    // alert("폐사거절버튼");
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
