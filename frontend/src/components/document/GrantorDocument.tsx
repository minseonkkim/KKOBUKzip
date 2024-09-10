import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { usePostcodeSearch } from "../../hooks/usePostcodeSearch";
import { AssignDocumentDataType as GrantorDocumentDataType } from "../../types/document";
import DocImgUpload from "./DocImgUpload";

// 양도 서류 컴포넌트
function GrantorDocument() {
  const { postcodeData, loadPostcodeSearch } = usePostcodeSearch();
  const addressBtnRef = useRef<HTMLButtonElement | null>(null);
  const [aquisitionImg, setAquisitionImg] = useState<File | null>(null);

  const [grantor, setGrantor] = useState<GrantorDocumentDataType>({
    name: "",
    phoneNumber: "",
    address: "",
  });

  const [detailLocation, setDetailLocation] = useState<string>("");
  const loadUserData = () => {
    console.log("loadUserData");
  };

  const sendGrantorDocRequest = () => {
    if (!aquisitionImg) alert("서류를 확인해 주세요.");
    const formData = new FormData();

    // 기본 데이터 추가
    formData.append("docType", "양도신청서");
    formData.append("documentHash", "0x123124123123"); // 받아온 문서 hash 걊
    formData.append("turtleUUID", "sadfk3ld-3b7d-8012-9bdd-2b0182lscb6d"); // 받아온 turtle UUID 값
    formData.append("applicant", "sadfk3ld-3b7d-8012-9bdd-2b0182lscb6d"); // storage에서 긁어온 user 값

    // detail 객체 추가
    formData.append("detail[grantor][name]", grantor.name);
    formData.append("detail[grantor][phoneNumber]", grantor.phoneNumber);
    formData.append("detail[grantor][address]", "광주광역시 광산구 장신로 98");
    formData.append(
      "detail[turtleUUID]", // 받아온 해당 거북이 uuid
      "sadfk3ld-3b7d-8012-9bdd-2b0182lscb6d"
    );
    formData.append(
      "detail[motherUUID]", // 받아온 모개체 uuid
      "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
    );
    formData.append(
      "detail[fatherUUID]", // 받아온 부개체 uuid
      "sadfk3ld-3b7d-8012-9bdd-2b0182lscb6d"
    );

    formData.append("detail[aquisition]", detailLocation);

    const docs = {
      docType: "양도신청서",
      applicant: "sadfk3ld-3b7d-8012-9bdd-2b0182lscb6d",
      detail: {
        granter: {
          ...grantor,
          address: postcodeData?.roadAddress + " " + detailLocation,
        },

        // UUID 부분 데이터 들어오면 할당할 것
        turtleUUID: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        aquisition: "0x1238801732341294",
        motherUUID: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        fatherUUID: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      },
    };
    console.log(docs);
  };

  const changeHandle = (
    key: keyof GrantorDocumentDataType,
    evt:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setGrantor((prev) => ({ ...prev, [key]: evt.target.value }));
  };

  return (
    <>
      <Helmet>
        <title>양도서류작성</title>
      </Helmet>

      <div className="mb-8">
        <div className="w-full flex">
          <span className="text-xl font-semibold mb-4 flex-1">양도인</span>
          <label
            htmlFor="loadUserData"
            className="cursor-pointer select-none mr-4"
          >
            <span>신청인 정보 불러오기</span>
            <input onClick={loadUserData} type="checkbox" id="loadUserData" />
          </label>
        </div>

        {/* 양도인 정보 */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="w-1/3 font-medium">성명(상호)</span>
              <input
                onChange={(evt) => changeHandle("name", evt)}
                type="text"
                placeholder="성명(상호)"
                className="w-2/3 px-3 py-2 border rounded"
              />
            </div>

            <div className="flex items-center">
              <span className="w-1/3 font-medium">전화번호</span>
              <input
                type="number"
                placeholder="전화번호"
                onChange={(evt) => changeHandle("phoneNumber", evt)}
                className="w-2/3 px-3 py-2 border rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-medium">인공증식 시설 소재지</label>

            <button
              ref={addressBtnRef}
              className="hover:bg-gray-100 w-1/12 border py-2 ml-1.5 rounded"
              onClick={loadPostcodeSearch}
            >
              찾기
            </button>
            <input
              type="text"
              className="w-1/3 px-3 ml-2 py-2 border rounded cursor-pointer hover:bg-gray-100"
              placeholder="기본주소"
              readOnly
              onChange={(evt) => changeHandle("address", evt)}
              value={postcodeData?.roadAddress || ""}
              onClick={() => addressBtnRef.current?.click()}
            />
            <input
              type="text"
              onChange={(evt) => {
                setDetailLocation(evt.target.value);
              }}
              className="w-1/3 px-3 py-2 border rounded ml-2"
              placeholder="상세주소"
            />
          </div>
        </div>
        {/* 양도인 정보 끝 */}
      </div>

      {/* 양수인 정보 - 불러올 것 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">양수인</h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          <div className="flex">
            <span className="w-1/3 font-medium">성명</span>
            <span className="w-2/3">사전에 설정된 양수인 정보 불러올 것</span>
          </div>
          <div className="flex">
            <span className="w-1/3 font-medium">전화번호</span>
            <span className="w-2/3">010-3333-3333</span>
          </div>

          <div className="flex">
            <span className="w-1/3 font-medium">주소</span>
            <span className="w-2/3">광주광역시 하남산단6번로 107</span>
          </div>
        </div>
      </div>
      {/* 양수인 정보 끝 */}

      {/* 개체 정보 - 사전에 설정된 정보 불러올 것 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">개체 정보 작성</h3>
        <div className="grid grid-cols-2 gap-y-2">
          <div className="flex">
            <span className="w-1/3 font-medium">학명</span>
            <span className="w-2/3 px-3 py-2">Malaclemys terrapin</span>
          </div>
          <div className="flex items-center">
            <span className="w-1/3 font-medium">보통명(일반명)</span>
            <span className="w-2/3 px-3 py-2">(공란)</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-y-4">
          <div className="flex items-center">
            <span className="w-1/3 font-medium">부속서등급</span>
            <span className="w-2/3 px-3 py-2">II급</span>
          </div>
          <div className="flex items-center">
            <label className="w-1/3 font-medium">수량</label>
            <span className="w-2/3 px-3 py-2">1</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-y-4">
          <div className="flex items-center">
            <span className="w-1/3 font-medium">형태</span>
            <span className="w-2/3 px-3 py-2">살아있는 생물</span>
          </div>
          <div className="flex items-center">
            <label className="w-1/3 font-medium">용도</label>
            <span className="w-2/3 px-3 py-2">양수인 입력 값</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-y-4">
          <div className="flex items-center">
            <span className="w-1/3 font-medium">양수사유</span>
            <span className="w-2/3 px-3 py-2">양수인 입력 값</span>
          </div>
          <div className="flex items-center">
            <label className="w-1/3 font-medium">개체식별번호</label>
            <span className="w-2/3 px-3 py-2">양수인 입력 값</span>
          </div>
        </div>
      </div>
      {/* 개체 정보 끝 */}

      {/* 구비서류 정보 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">구비서류</h3>
        <div className="space-y-4">
          <p
            aria-labelledby="증명 명세서"
            className="block font-semibold pt-4 "
          >
            수입허가증 등 양도하려는 국제적 멸종위기종의 입수 경위 및 이를
            증명하는 서류
          </p>
          <DocImgUpload setImage={setAquisitionImg} />

          <div>
            <label className="block font-semibold mb-1">
              양도한 국제적 멸종위기종의 부모 개체의 고유번호
            </label>
            <div className="w-full px-3 py-2 border rounded bg-gray-50 flex items-center">
              <span className="text-gray-500 flex-grow">부 개체 번호</span>
              <input type="file" className="hidden" id="file1" />
              <label htmlFor="file1" className="cursor-pointer flex-shrink">
                개체 찾기
              </label>
            </div>

            <div className="w-full px-3 py-2 border rounded bg-gray-50 flex items-center">
              <span className="text-gray-500 flex-grow">모 개체 번호</span>
              <input type="file" className="hidden" id="file1" />
              <label htmlFor="file1" className="cursor-pointer flex-shrink">
                개체 찾기
              </label>
            </div>
          </div>
        </div>
      </div>
      {/* 구비서류 정보 끝 */}

      <div className="flex justify-end space-x-4">
        <button
          onClick={sendGrantorDocRequest}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          신청서 제출
        </button>
      </div>
    </>
  );
}

export default GrantorDocument;
