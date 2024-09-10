import { AdminDeathDocumentDataType } from "../../../types/document";
import MyDocumentDataForm from "../../document/MyDocumentDataForm";

function AdminDeathDocsCheck({ data }: { data: AdminDeathDocumentDataType }) {
  const handleAcceptSubmit = () => {
    alert("승인버튼");
  };

  const handleDenySubmit = () => {
    alert("거절버튼");
  };
  return (
    <>
      <div className="flex text-xs justify-between">
        <span>Doc No. {data.documentHash}</span>
        <span>turtle_id:{data.turtleUUID}</span>
      </div>
      <h2 className="text-3xl font-bold my-6 text-center">폐사·질병신고서</h2>
      <div className="my-6 h-0.5 border-b " />

      <MyDocumentDataForm info={data?.applicant} />
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">상세정보</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <label className="w-1/4 font-medium">개체 학명</label>
            <span className="w-3/4 px-3 py-2">
              {data.detail.scientificName}
            </span>
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-medium">부속서등급</label>
            <span className="w-3/4 px-3 py-2">II</span>
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-medium">사육장소</label>
            <span className="w-3/4 px-3 py-2">{data.detail.shelter}</span>
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-medium">폐사질병사유</label>
            <span className="w-3/4 px-3 py-2">{data.detail.deathReason}</span>
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-medium">처리계획</label>
            <span className="w-3/4 px-3 py-2">{data.detail.plan}</span>
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-medium">수의사진단서</label>
            <span className="w-3/4 px-3 py-2">{data.detail.diagnosis}</span>
          </div>

          <div className="flex items-center">
            <label className="w-1/4 font-medium">폐사증명사진</label>
            <span className="w-3/4 px-3 py-2">{data.detail.deathImage}</span>
          </div>
        </div>
      </div>

      <div className="space-x-3 text-right">
        <button
          type="button"
          onClick={handleDenySubmit}
          className="w-36 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2"
        >
          승인거부
        </button>

        <button
          type="button"
          onClick={handleAcceptSubmit}
          className="w-36 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          승인
        </button>
      </div>
    </>
  );
}

export default AdminDeathDocsCheck;
