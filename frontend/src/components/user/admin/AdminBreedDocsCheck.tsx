import { AdminBreedDocumentDataType } from "../../../types/document";
import CompleteBreedDocument from "../../document/complete/CompleteBreedDocument";
import CheckButonSet from "./CheckButtonSet";

function AdminBreedDocsCheck({
  data,
  onAccept,
  onDeny,
}: {
  data: AdminBreedDocumentDataType;
  onAccept: (turtleUUID: string, documentHash: string) => void;
  onDeny: (turtleUUID: string, documentHash: string) => void;
}) {
  const handleAcceptSubmit = () => {
    onAccept(data.turtleUUID, data.documentHash);
    alert("증식승인버튼");
  };

  const handleDenySubmit = () => {
    onDeny(data.turtleUUID, data.documentHash);
    alert("증식거절버튼");
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mb-10">
      <CompleteBreedDocument data={data} />

      <CheckButonSet
        handleAcceptSubmit={handleAcceptSubmit}
        handleDenySubmit={handleDenySubmit}
      />
    </div>
  );
}

export default AdminBreedDocsCheck;
