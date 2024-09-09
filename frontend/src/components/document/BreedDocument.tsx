import { useRef, useState } from "react";
import { usePostcodeSearch } from "../../hooks/usePostcodeSearch";
import { Helmet } from "react-helmet-async";
import { BreedDocumentDataType, BreedFetchData } from "../../types/document";

// 특이사항
// 신청인 정보 동적으로 할당할 것(아마 store에서)
// 구비서류부터 안했음

function BreedDocument() {
  const { postcodeData, loadPostcodeSearch } = usePostcodeSearch();
  const addressBtnRef = useRef<HTMLButtonElement | null>(null);

  const [data, setData] = useState<BreedDocumentDataType>({
    scientificName: "Malaclemys terrapin", // fixed
    area: "",
    count: 1, // fixed
    purpose: "연구",
    registerDate: null,
    location: "",
    motherUUID: "",
    fatherUUID: "",
  });
  const [detailLocation, setDetailLocation] = useState("");

  const changeHandle = (
    type: keyof BreedDocumentDataType,
    evt:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setData((prevData) => ({
      ...prevData,
      [type]: evt.target.value,
    }));
  };

  const sendBreedDocRequest = () => {
    const docs: BreedFetchData = {
      // 신청인 정보는 applicant에서 넘어가기에 작성 안 해도 됨
      data: {
        docType: "인공증식증명서",
        applicant: "d271c7d8-3f7b-4d4e-8a9e-d60f896b84cb", // storage에서 긁어올 것
        detail: { ...data, location: data.location + " " + detailLocation },
        // detail: {
        //   scientificName: "Malaclemys terrapin",
        //   area: "150X60X80",
        //   count: 1,
        //   purpose: "연구",
        //   registerDate: "2024-08-20",
        //   motherUUID: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", // 로직 완성되면 불러울 것
        //   fatherUUID: "sadfk3ld-3b7d-8012-9bdd-2b0182lscb6d", // 로직 완성되면 불러올 것
        // },
      },
      locationSpecification: "--사진--", // 안했음
      multiplicationMethod: "--사진--", // 안했음
      shelterSpecification: "--사진--", // 안했음
    };
    console.log(docs);
  };

  return (
    <>
      <Helmet>
        <title>인공증식서류작성</title>
      </Helmet>

      {/* 허가 정보 */}
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
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-medium">시설면적</label>
            <input
              type="text"
              className="w-3/4 px-3 py-2 border rounded"
              placeholder="가로x세로x높이"
              onChange={(evt) => changeHandle("area", evt)}
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-medium">인공증식의 목적/용도</label>
            <select
              onChange={(evt) => changeHandle("purpose", evt)}
              className="font-medium bg-gray-50 border border-gray text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="연구">연구</option>
              <option value="학술">학술</option>
              <option value="애완">애완</option>
              <option value="상업">상업</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="w-1/4 font-medium">인공증식 시설 소재지</label>

            <button
              ref={addressBtnRef}
              className="w-1/12"
              onClick={loadPostcodeSearch}
            >
              찾기
            </button>
            <input
              type="text"
              className="w-1/3 px-3 ml-2 py-2 border rounded"
              placeholder="기본주소"
              readOnly
              onChange={(evt) => changeHandle("location", evt)}
              value={postcodeData?.roadAddress || ""}
              onClick={() => addressBtnRef.current?.click()}
            />
            <input
              type="text"
              onChange={(evt) => {
                setDetailLocation(evt.target.value);
              }}
              className="w-1/3 px-3 ml-2 py-2 border rounded"
              placeholder="상세주소"
            />
          </div>
        </div>
      </div>
      {/* 허가 정보 끝 */}

      {/* 구비서류 정보 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">구비서류</h3>
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">
              인공증식하려는 국제적 멸종위기종의 부모 개체의 고유번호
            </label>
            <div className="w-full px-3 py-2 border rounded bg-gray-50 flex items-center">
              <span className="text-gray-500 flex-grow">부 개체 고유번호</span>
              <input type="file" className="hidden" id="file1" />
              <label htmlFor="file1" className="cursor-pointer flex-shrink">
                개체 찾기
              </label>
            </div>
            <div className="w-full px-3 py-2 border rounded bg-gray-50 flex items-center">
              <span className="text-gray-500 flex-grow">모 개체 고유번호</span>
              <input type="file" className="hidden" id="file1" />
              <label htmlFor="file1" className="cursor-pointer flex-shrink">
                개체 찾기
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">
              인공증식 시설의 명세서
            </label>
            <div className="w-full px-3 py-2 border rounded bg-gray-50 flex items-center">
              <span className="text-gray-500 flex-grow">선택된 파일 없음</span>
              <input type="file" className="hidden" id="file1" />
              <label htmlFor="file1" className="cursor-pointer flex-shrink">
                파일 선택
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">인공증식의 방법</label>
            <div className="w-full px-3 py-2 border rounded bg-gray-50 flex items-center">
              <span className="text-gray-500 flex-grow">선택된 파일 없음</span>
              <input type="file" className="hidden" id="file1" />
              <label htmlFor="file1" className="cursor-pointer flex-shrink">
                파일 선택
              </label>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">보호시설 명세서</label>
            <div className="w-full px-3 py-2 border rounded bg-gray-50 flex items-center">
              <span className="text-gray-500 flex-grow">선택된 파일 없음</span>
              <input type="file" className="hidden" id="file1" />
              <label htmlFor="file1" className="cursor-pointer flex-shrink">
                파일 선택
              </label>
            </div>
          </div>
        </div>
      </div>
      {/* 구비서류 정보 끝 */}

      <div className="flex justify-end space-x-4">
        <button
          onClick={sendBreedDocRequest}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          신청서 제출
        </button>
      </div>
    </>
  );
}

export default BreedDocument;
