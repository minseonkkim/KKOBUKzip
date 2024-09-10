import { useRef, useState } from "react";
import { usePostcodeSearch } from "../../hooks/usePostcodeSearch";
import { Helmet } from "react-helmet-async";
import { BreedDocumentDataType } from "../../types/document";
import DocImgUpload from "./DocImgUpload";

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
  const [shelterImg, setShelterImg] = useState<File | null>(null);
  const [locationImg, setLocationImg] = useState<File | null>(null);
  const [multiplicationImg, setMultiplicationImg] = useState<File | null>(null);

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
    if (!locationImg) {
      alert("시설 명세를 확인해주세요");
      return;
    }
    if (!multiplicationImg) {
      alert("증식 명세를 확인해주세요");
      return;
    }
    if (!shelterImg) {
      alert("보호시설 명세를 확인해주세요");
      return;
    }
    console.log(data.location);
    const formData = new FormData();
    formData.append("locationSpecification", locationImg);
    formData.append("multiplicationMethod", multiplicationImg);
    formData.append("shelterSpecification", shelterImg);
    // 신청인 정보는 applicant에서 넘어가기에 작성 안 해도 됨
    // 마더빠더 UUID 검증할것
    const breedData = {
      docType: "인공증식증명서",
      applicant: "d271c7d8-3f7b-4d4e-8a9e-d60f896b84cb", // storage에서 긁어올 것
      detail: {
        ...data,
        location: postcodeData?.roadAddress + " " + detailLocation,
      },
    };
    formData.append("data", JSON.stringify(breedData));
    // 데이터 보낼때 multipart로 적당히 던질것
    console.log(breedData);
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
              className="hover:bg-gray-200 w-1/12 border py-2 ml-1.5 rounded"
              onClick={loadPostcodeSearch}
            >
              찾기
            </button>
            <input
              type="text"
              className="w-1/3 px-3 ml-2 py-2 border rounded cursor-pointer"
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

          <p className="block font-semibold pt-4 ">인공증식 시설의 명세서</p>
          <DocImgUpload setImage={setShelterImg} />

          <p className="block font-semibold pt-4 ">인공증식의 방법 </p>
          <DocImgUpload setImage={setMultiplicationImg} />

          <p className="block font-semibold pt-4 ">보호시설 명세서 </p>
          <DocImgUpload setImage={setLocationImg} />

          {/* <div>
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
          </div> */}
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
