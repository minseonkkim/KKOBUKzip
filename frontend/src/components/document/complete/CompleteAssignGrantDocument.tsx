import { AdminAssignDocumentDataType } from "../../../types/document";
import MyDocumentDataForm from "../MyDocumentDataForm";

// 완성된 문서 파일
// 나의 거북이에서 조회할거를 생각하고 분리하여 작성
function CompleteAssignGrantDocument({
  data,
}: {
  data: AdminAssignDocumentDataType | null;
}) {
  if (data === null) {
    return (
      <div className="text-center py-8">
        <p className="text-xl font-semibold">양도/양수 문서가 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col text-xs">
        <span><strong>Doc No |</strong>&nbsp;&nbsp;{data!.documentHash}</span>
        <span><strong>turtle_id |</strong>&nbsp;&nbsp;{data!.turtleUUID}</span>
      </div>
      <h2 className="text-3xl font-bold my-6 text-center">양도·양수 확인서</h2>
      <div className="my-6 h-0.5 border-b" />
      <MyDocumentDataForm info={data!.applicant} />

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">양수자 정보</h3>
        <div className="grid grid-cols-1 gap-x-8 gap-y-1 md:grid-cols-2 md:gap-y-2">
          <div className="flex items-center">
            <span className="w-1/3 font-medium">성명</span>
            <span className="w-2/3 px-3 py-2">{data?.applicant.name}</span>
          </div>
          <div className="flex items-center">
            <span className="w-1/3 font-medium">전화번호</span>
            <span className="w-2/3 px-3 py-2">{data?.applicant.phonenumber}</span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="w-1/6 font-medium">주소</span>
          <span className="py-2">{data?.applicant?.address.replace(" / ", " ")}</span>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">양도자 정보</h3>
        <div className="grid grid-cols-1 gap-x-8 gap-y-1 md:grid-cols-2 md:gap-y-2">
          <div className="flex items-center">
            <span className="w-1/3 font-medium">성명</span>
            <span className="w-2/3 px-3 py-2">{data?.grantor?.name}</span>
          </div>
          <div className="flex items-center">
            <span className="w-1/3 font-medium">전화번호</span>
            <span className="w-2/3 px-3 py-2">{data?.grantor?.phoneNumber}</span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="w-1/6 font-medium">주소</span>
          <span className="py-2">{data?.grantor?.address.replace(" / ", " ")}</span>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">상세정보</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <label className="w-1/4 font-medium">개체 학명</label>
            <span className="w-3/4 px-3 py-2">
              {data!.detail.scientificName}
            </span>
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-medium">부속서등급</label>
            <span className="w-3/4 px-3 py-2">II</span>
          </div>

          <div className="flex items-center">
            <label className="w-1/4 font-medium">수량</label>
            <span className="w-3/4 px-3 py-2">{data!.detail.count}</span>
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-medium">양수 사유</label>
            <span className="w-3/4 px-3 py-2">
              {data!.detail.transferReason}
            </span>
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-medium">입수 경위</label>
            <span className="w-3/4 px-3 py-2 break-all">0x{data!.detail.aquisition}</span>
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-medium">모 개체</label>
            <span className="w-3/4 px-3 py-2">
              {data!.detail.motherUUID}
            </span>
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-medium">부 개체</label>
            <span className="w-3/4 px-3 py-2">
              {data!.detail.fatherUUID}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompleteAssignGrantDocument;
