import { FormEventHandler, useRef, useState } from "react";
import { usePostcodeSearch } from "../../hooks/usePostcodeSearch";
import { Helmet } from "react-helmet-async";
import { BreedDocumentDataType, BreedFetchData } from "../../types/document";
import DocImgUpload from "./DocImgUpload";
import { createBreedDocumentRequest } from "../../apis/documentApis";
import { breedDoc } from "../../utils/breedDriverObject";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";

// 특이사항
// 신청인 정보 동적으로 할당할 것(아마 store에서)

interface MyTurtleInfo {
  turtleName: string,
  turtleUuid: string,
  turtleGender: string
}

function BreedDocument() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { userInfo } = useUserStore();
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
    name: "",
    birth: null,
    weight: 0,
    gender: "MALE",
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

  const sendBreedDocRequest = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!locationImg) {
      alert("시설 명세 파일을 확인해주세요");
      return;
    }
    if (!multiplicationImg) {
      alert("증식 명세 파일을 확인해주세요");
      return;
    }
    if (!shelterImg) {
      alert("보호시설 명세 파일을 확인해주세요");
      return;
    }
    // area, birth, weight data check and alert message
    if (!data.area) {
      alert("시설면적을 입력해주세요");
      return;
    }
    if (!data.birth) {
      alert("생년월일을 입력해주세요");
      return;
    }
    if (!data.weight) {
      alert("무게를 입력해주세요");
      return;
    }

    const formData = new FormData();

    formData.append("locationSpecification", locationImg);
    formData.append("multiplicationMethod", multiplicationImg);
    formData.append("shelterSpecification", shelterImg);

    const breedData = {
      docType: "인공증식증명서",
      applicant: userInfo!.uuid,
      detail: {
        ...data,
        weight: Number(data.weight),
        motherUUID: data.motherUUID,
        fatherUUID: data.fatherUUID,
        location: postcodeData?.roadAddress + " / " + detailLocation,
        registerDate: new Date().toISOString().substring(0, 10),
      },
    };
    const blob = new Blob([JSON.stringify(breedData)], {
      type: "application/json",
    });
    console.log(JSON.stringify(breedData));
    // formData.append("data", JSON.stringify(breedData));
    formData.append("data", blob);
    // 데이터 보낼때 multipart로 적당히 던질것
    console.log(breedData);

    const result = await createBreedDocumentRequest(formData);
    if (result.success) {
      alert("인공증식 서류가 성공적으로 등록되었습니다. 승인이 완료될 때까지 대기해 주세요.");
      navigate("/mypage");
    } else {
      alert(result.message);
    }
  };

  const handleGuide = () => {
    breedDoc.drive();
  };

  return (
    <>
      <Helmet>
        <title>인공증식서류작성</title>
      </Helmet>
      
      <div className="flex justify-end">
        <button
          onClick={handleGuide}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          가이드 시작
        </button>
      </div>

      {/* 허가 정보 */}
      <form id="breedContainer" onSubmit={sendBreedDocRequest}>
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
                <span className="w-1/3 font-medium break-keep">
                  부속서 등급
                </span>
                <span className="w-2/3 px-3 py-2">II급</span>
              </div>
              <div className="flex items-center">
                <label className="w-1/3 font-medium">수량</label>
                <span className="w-2/3 px-3 py-2">1</span>
              </div>
            </div>
            <div className="flex items-center">
              <label htmlFor="area" className="w-1/4 font-medium">
                시설면적
              </label>
              <input
                id="area"
                type="text"
                className="w-3/4 px-3 py-2 border rounded"
                placeholder="가로x세로x높이"
                onChange={(evt) => changeHandle("area", evt)}
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="purpose" className="w-1/4 font-medium break-keep">
                인공증식의 목적/용도
              </label>
              <select
                id="purpose"
                onChange={(evt) => changeHandle("purpose", evt)}
                className="cursor-pointer font-medium bg-gray-50 border border-gray text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="연구">연구</option>
                <option value="학술">학술</option>
                <option value="애완">애완</option>
                <option value="상업">상업</option>
              </select>
            </div>

            <div className="flex items-center">
              <label
                htmlFor="location"
                className="w-1/4 font-medium break-keep"
              >
                인공증식 시설 소재지
              </label>

              <button
                aria-label="find location"
                type="button"
                ref={addressBtnRef}
                className="hidden md:inline hover:bg-gray-100 w-1/12 border py-2 ml-1.5 rounded"
                onClick={loadPostcodeSearch}
              >
                찾기
              </button>
              <div className="flex flex-col w-[67%] md:flex-row md:w-full space-y-1 md:space-y-0">
                <input
                  id="location"
                  type="text"
                  className="w-full px-3 ml-2 py-2 border rounded cursor-pointer hover:bg-gray-100"
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
                  className="w-full px-3 py-2 border rounded ml-2"
                  placeholder="상세주소"
                />
              </div>
            </div>
          </div>
        </div>
        {/* 허가 정보 끝 */}

        {/* 개체 정보 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">개체 정보</h3>
          <div className="grid space-y-2 md:space-y-2 md:grid-cols-2 md:gap-x-4">
            <div className="flex items-center">
              <label htmlFor="name" className="w-1/4 font-medium">
                별명
              </label>
              <input
                id="name"
                type="text"
                className="w-3/4 px-3 py-2 border rounded"
                placeholder="별명"
                onChange={(evt) => changeHandle("name", evt)}
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="birth" className="w-1/4 font-medium">
                출생일
              </label>
              <input
                id="birth"
                type="date"
                className="w-3/4 px-3 py-2 border rounded"
                onChange={(evt) => changeHandle("birth", evt)}
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="gender" className="w-1/4 font-medium">
                성별
              </label>
              <select
                id="gender"
                onChange={(evt) => changeHandle("gender", evt)}
                className="cursor-pointer font-medium bg-gray-50 border border-gray text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="MALE">수컷</option>
                <option value="FEMALE">암컷</option>
                <option value="NONE">미분류</option>
              </select>
            </div>
            <div className="flex items-center">
              <label htmlFor="weight" className="w-1/4 font-medium">
                무게
              </label>
              <input
                id="weight"
                type="number"
                className="w-3/5 px-3 py-2 border rounded"
                min="0"
                placeholder="무게"
                onChange={(evt) => changeHandle("weight", evt)}
              />
              <div className="inline-block ml-2 w-14">g(그램)</div>
            </div>
          </div>
        </div>

        {/* 구비서류 정보 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">구비 서류</h3>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">
                인공증식하려는 국제적 멸종위기종 부모 개체의 고유번호
              </label>
              <div>
                <select
                  className="w-full px-3 py-2 mb-2 border rounded bg-gray-50 flex items-center"
                  onChange={(evt) => changeHandle("fatherUUID", evt)}
                  value={data.fatherUUID}
                >
                  <option value="" disabled>부 개체 고유번호</option>
                  {state.map((turtle: MyTurtleInfo) => (
                    turtle.turtleGender === "MALE" && <option key={turtle.turtleUuid} value={turtle.turtleUuid}>
                      {turtle.turtleName} / {turtle.turtleGender === "MALE" ? "수컷" : "암컷"} ({turtle.turtleUuid})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  className="w-full px-3 py-2 mb-2 border rounded bg-gray-50 flex items-center"
                  onChange={(evt) => changeHandle("motherUUID", evt)}
                  value={data.motherUUID}
                >
                  <option value="" disabled>모 개체 고유번호</option>
                  {state.map((turtle: MyTurtleInfo) => (
                    turtle.turtleGender === "FEMALE" && <option key={turtle.turtleUuid} value={turtle.turtleUuid}>
                      {turtle.turtleName} / {turtle.turtleGender === "FEMALE" ? "암컷" : "수컷"} ({turtle.turtleUuid})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <p
                aria-labelledby="증식시설 명세서"
                className="block font-semibold pt-4 "
              >
                인공증식 시설의 명세서
              </p>
              <DocImgUpload id="setShelterImg" setImage={setShelterImg} />
            </div>

            <div>
              <p
                aria-labelledby="인공증식 명세서"
                className="block font-semibold pt-4 "
              >
                인공증식의 방법{" "}
              </p>
              <DocImgUpload
                id="setMultiplicationImg"
                setImage={setMultiplicationImg}
              />
            </div>

            <div>
              <p
                aria-labelledby="보호시설 명세서"
                className="block font-semibold pt-4 "
              >
                보호시설 명세서{" "}
              </p>
              <DocImgUpload id="setLocationImg" setImage={setLocationImg} />
            </div>
          </div>
        </div>
        {/* 구비서류 정보 끝 */}

        <div className="flex justify-center space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            신청서 제출
          </button>
        </div>
      </form>
    </>
  );
}

export default BreedDocument;
