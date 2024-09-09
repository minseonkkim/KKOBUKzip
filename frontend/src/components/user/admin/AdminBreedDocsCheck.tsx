import { AdminBreedDocumentDataType } from "../../../types/document";
import MyDocumentDataForm from "../../document/MyDocumentDataForm";

function AdminBreedDocsCheck({ data }: { data: AdminBreedDocumentDataType }) {
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
      <h2 className="text-3xl font-bold my-6 text-center">인공증식증명서</h2>
      <div className="my-6 h-0.5 border-b " />

      <MyDocumentDataForm info={data?.applicant} />
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">상세정보</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <label className="w-1/4 font-medium">개체 학명</label>
            <span className="w-3/4 px-3 py-2">
              {data.detail.scientificName}
            </span>
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-medium">시설면적</label>
            <span className="w-3/4 px-3 py-2">{data.detail.area}</span>
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-medium">수량</label>
            <span className="w-3/4 px-3 py-2">{data.detail.count}</span>
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-medium">목적 및 용도</label>
            <span className="w-3/4 px-3 py-2">{data.detail.purpose}</span>
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-medium">모 개체</label>
            <span className="w-3/4 px-3 py-2">
              {data.detail.motherAquisition} <br />
              여기엔 무슨 정보가 나타나야 하는 것인가
            </span>
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-medium">부 개체</label>
            <span className="w-3/4 px-3 py-2">
              {data.detail.fatherAquisition} <br />
              여기엔 무슨 ~~ 2222
            </span>
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-medium">인공증식시설</label>
            <span className="w-3/4 px-3 py-2">
              {data.detail.locationSpecification}
              하단에 이미지
            </span>
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-medium">인공증식방법</label>
            <span className="w-3/4 px-3 py-2">
              {data.detail.multiplicationMethod}이미지위치
            </span>
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-medium">보호시설</label>
            <span className="w-3/4 px-3 py-2">
              {data.detail.shelterSpecification}이미지위치
            </span>
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

export default AdminBreedDocsCheck;
