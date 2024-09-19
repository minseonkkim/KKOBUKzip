import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { DeathDocumentDataType, DeathFetchData } from "../../types/document";
import { createDeathDocumentRequest } from "../../apis/documentApis";
import DocImgUpload from "./DocImgUpload";

function DeathDocument() {
  const [data, setData] = useState<DeathDocumentDataType>({
    turtleUUID: "", // 동적으로 할당할 것
    shelter: "",
    count: 1,
    deathReason: "",
    plan: "",
    registerDate: "",
  });

  const [deathImage, setDeathImage] = useState<File | null>(null);
  const [diagnosis, setDiagnosis] = useState<File | null>(null);

  const changeHandle = (
    type: keyof DeathDocumentDataType,
    evt:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setData({ ...data, [type]: evt.target.value });
  };

  const sendDeathDocRequest = async () => {
    // the data check for validate input
    if (data.shelter === "" || data.deathReason === "" || data.plan === "") {
      alert("모든 항목을 입력해주세요.");
      return;
    }
    if (!deathImage || !diagnosis) {
      alert("사진을 업로드해주세요");
      return;
    }
    const deathData = {
      docType: "폐사질병서류",
      applicant: "d271c7d8-3f7b-4d4e-8a9e-d60f896b84cb", // storage에서 읽어올것
      detail: {
        ...data,
        registerDate: new Date().toISOString().substring(0, 10),
      },

      // deathImage: "--사진--",
      // diagnosis: "--사진--",
    };
    const formData = new FormData();
    formData.append("deathImage", deathImage);
    formData.append("multiplicationMethod", diagnosis);
    formData.append("data", JSON.stringify(deathData));
    const { success } = await createDeathDocumentRequest(formData);

    if (success) {
      alert("성공");
    } else {
      alert("실패");
    }
  };
  return (
    <>
      <Helmet>
        <title>폐사/질병서류작성</title>
      </Helmet>

      {/* 사육장소 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">사육장소</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <label className="w-1/4 font-medium">사육장소</label>
            <input
              type="text"
              className="w-3/4 px-3 py-2 border rounded"
              placeholder="사육장소"
              onChange={(evt) => changeHandle("shelter", evt)}
            />
          </div>
        </div>
      </div>

      {/* 생물정보 작성 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">허가 정보</h3>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="w-1/3 font-medium">학명</span>
              <span className="w-2/3 px-3 py-2">Malaclemys terrapin</span>
            </div>
            <div className="flex items-center">
              <span className="w-1/3 font-medium">보통명(일반명)</span>
              <span className="w-2/3 px-3 py-2 ">(공란)</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="w-1/3 font-medium">부속서등급</span>
              <span className="w-2/3 px-3 py-2">II급</span>
            </div>
            <div className="flex items-center">
              <label className="w-1/3 font-medium">수량</label>
              <span className="w-2/3 px-3 py-2">1</span>
            </div>

            <div className="flex items-center ">
              <span className="w-1/3 font-medium">폐사/질병사유</span>
              <input
                type="text"
                onChange={(evt) => changeHandle("deathReason", evt)}
                value={data.deathReason || ""}
                className="w-2/3 px-3 py-2 border rounded"
                placeholder="폐사/질병사유"
              />
            </div>
            <div className="flex items-center">
              <label className="w-1/3 font-medium">처리계획</label>
              <input
                type="text"
                onChange={(evt) => changeHandle("plan", evt)}
                value={data.plan || ""}
                className="w-2/3 px-3 py-2 border rounded"
                placeholder="처리계획"
              />
            </div>
          </div>
        </div>
      </div>
      {/* 생물정보 끝 */}

      {/* 구비서류 정보 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">구비서류</h3>
        <div className="space-y-4">
          <div>
            <p
              aria-labelledby="보호시설 명세서"
              className="block font-semibold pt-4 "
            >
              폐사를 증명할 수 있는 사진{" "}
            </p>
            <DocImgUpload id="setDeathImage" setImage={setDeathImage} />

            {/* <label className="block font-semibold mb-1">
              폐사를 증명할 수 있는 사진
            </label>
            <div className="w-full px-3 py-2 border rounded bg-gray-50 flex items-center">
              <span className="text-gray-500 flex-grow">선택된 파일 없음</span>
              <input type="file" className="hidden" id="file1" />
              <label htmlFor="file1" className="cursor-pointer flex-shrink">
                파일 선택
              </label>
            </div> */}
          </div>

          <div>
            <p
              aria-labelledby="보호시설 명세서"
              className="block font-semibold pt-4 "
            >
              폐사를 증명할 수 있는 사진{" "}
            </p>
            <DocImgUpload id="setDiagnosis" setImage={setDiagnosis} />

            {/* 
            <label className="block font-semibold mb-1">수의사 진단서</label>
            <div className="w-full px-3 py-2 border rounded bg-gray-50 flex items-center">
              <span className="text-gray-500 flex-grow">선택된 파일 없음</span>
              <input type="file" className="hidden" id="file1" />
              <label htmlFor="file1" className="cursor-pointer flex-shrink">
                파일 선택
              </label>
            </div> */}
          </div>
        </div>
      </div>
      {/* 구비서류 정보 끝 */}

      <div className="flex justify-end space-x-4">
        <button
          onClick={sendDeathDocRequest}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          신청서 제출
        </button>
      </div>
    </>
  );
}

export default DeathDocument;
