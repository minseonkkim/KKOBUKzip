import { AdminDeathDocumentDataType } from "../../../types/document";
import MyDocumentDataForm from "../../document/MyDocumentDataForm";

function AdminDeathDocsCheck({ data }: { data: AdminDeathDocumentDataType }) {
  return (
    <>
      <div className="flex text-xs justify-between">
        <span>Doc No. {data.documentHash}</span>
        <span>turtle_id:{data.turtleUUID}</span>
      </div>
      <h2 className="text-3xl font-bold my-6 text-center">폐사·질병신고서</h2>
      <div className="my-6 h-0.5 border-b " />

      <MyDocumentDataForm info={data?.applicant} />
    </>
  );
}

export default AdminDeathDocsCheck;
