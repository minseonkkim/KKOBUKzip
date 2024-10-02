import { AdminBreedDocumentDataType } from "../../../types/document";
import MyDocumentDataForm from "../MyDocumentDataForm";

// 완성된 문서 파일
// 나의 거북이에서 조회할거를 생각하고 분리하여 작성
function CompleteBreedDocument({ data }: { data: AdminBreedDocumentDataType }) {
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
            </span>
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-medium">부 개체</label>
            <span className="w-3/4 px-3 py-2">
              {data.detail.fatherAquisition} <br />
            </span>
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-medium">인공증식시설</label>
            <span className="w-3/4 px-3 py-2">
              {data.detail.locationSpecification}
            </span>
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-medium">인공증식방법</label>
            <span className="w-3/4 px-3 py-2">
              {data.detail.multiplicationMethod}
            </span>
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-medium">보호시설</label>
            <span className="w-3/4 px-3 py-2">
              {data.detail.shelterSpecification}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompleteBreedDocument;
