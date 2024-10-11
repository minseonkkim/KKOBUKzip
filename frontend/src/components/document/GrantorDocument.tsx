import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { usePostcodeSearch } from "../../hooks/usePostcodeSearch";
import {
  AdminAssignDocumentDataType,
  AssignDocumentDataType as GrantorDocumentDataType,
  GrantorFetchData,
} from "../../types/document";
import {
  createGrantDocumentRequest,
  getDetailDocumentData,
} from "../../apis/documentApis";
import { grantDoc } from "../../utils/grantDriverObject";
import { useUserStore } from "../../store/useUserStore";
import { useWeb3Store } from "../../store/useWeb3Store";

interface ApplicantInfoContext {
  applicantName: string;
  applicantPhoneNumber: string;
  applicantAddress: string;
}

interface MyTurtleInfo {
  turtleName: string;
  turtleUuid: string;
  turtleGender: string;
}

// 양도 서류 컴포넌트
function GrantorDocument() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { applicantName, applicantPhoneNumber, applicantAddress } = useOutletContext<ApplicantInfoContext>();
  const { documentContract } = useWeb3Store();
  const { postcodeData, loadPostcodeSearch } = usePostcodeSearch();
  const addressBtnRef = useRef<HTMLButtonElement | null>(null);
  const { userInfo } = useUserStore();

  const [aquisition, setAquisition] = useState<string | null>(null);

  const [assignee, setAssignee] = useState<GrantorDocumentDataType>({
    name: "",
    phoneNumber: "",
    address: "",
  });

  const [grantor, setGrantor] = useState<GrantorDocumentDataType>({
    name: "",
    phoneNumber: "",
    address: "",
  });

  const [detailByAssignee, setDetailByAssignee] = useState<{
    turtleUUID: string;
    count: number;
    transferReason: string;
  }>({
    turtleUUID: "",
    count: 0,
    transferReason: "",
  });

  const [uuidData, setUuidData] = useState<{
    motherUUID: string;
    fatherUUID: string;
  }>({
    motherUUID: "",
    fatherUUID: "",
  });

  const [detailLocation, setDetailLocation] = useState<string>("");
  useEffect(() => {
    if (postcodeData?.jibunAddress) {
      setGrantor((prev) => ({
        ...prev,
        address: postcodeData.jibunAddress,
      }));
    }
  }, [postcodeData?.jibunAddress]);

  useEffect(() => {
    // 기존 작성된 양수 서류 데이터 불러오기
    getDetailDocumentData(state.turtleUuid, state.documentHash).then(
      (response) => {
        const data = response.data as AdminAssignDocumentDataType;
        setAssignee({
          name: data.assignee.name,
          phoneNumber: data.assignee.phoneNumber,
          address: data.assignee.address,
        });

        setDetailByAssignee({
          turtleUUID: state.turtleUuid,
          count: data.detail.count,
          transferReason: data.detail.transferReason,
        });
      }
    );
  }, [state.documentHash, state.turtleUuid]);

  useEffect(() => {
    if (documentContract === null) {
      alert("블록체인 지갑에 연결되어 있지 않습니다. 연결 완료 후 다시 접속해 주세요.");
      navigate(-1);
      return
    }

    documentContract!.methods.searchCurrentDocumentHash(state.turtleUuid).call().then((response) => {
      setAquisition(response as unknown as string);
    }).catch((error) => {
      console.error(error);
      alert("블록체인 지갑의 연결 상태를 확인해 주세요.")
      return
    })
  }, [])

  const loadUserData = () => {
    setGrantor({
      name: applicantName,
      phoneNumber: applicantPhoneNumber,
      address: applicantAddress,
    });
  };

  const changeUuidData = (
    type: "fatherUUID" | "motherUUID",
    evt:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setUuidData((prevData) => ({
      ...prevData,
      [type]: evt.target.value,
    }));
  };

  const sendGrantorDocRequest = async () => {
    // grantor status check logic
    if (!grantor.name || !grantor.phoneNumber || !grantor.address) {
      alert("양도인 정보를 모두 입력해주세요.");
      return;
    }
    
    const docs: GrantorFetchData = {
      docType: "양도신청서",
      documentHash: state.documentHash,
      turtleUUID: detailByAssignee.turtleUUID,
      applicant: userInfo!.uuid, // storage에서 가져올 것
      detail: {
        grantor: {
          ...grantor,
          address: postcodeData?.roadAddress + " / " + detailLocation,
        },
        turtleUUID: detailByAssignee.turtleUUID,
        aquisition: aquisition!,
        motherUUID: uuidData.motherUUID,
        fatherUUID: uuidData.fatherUUID,
      },
    };
    const { success } = await createGrantDocumentRequest(docs);

    if (success) {
      alert("양도 서류 등록이 완료되었습니다.");
      navigate("/mypage");
    } else {
      alert("양수 서류 등록에 실패했습니다. 다시 시도해 주세요.");
      return;
    }
  };

  const changeHandle = (
    key: keyof GrantorDocumentDataType,
    evt:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setGrantor((prev) => ({ ...prev, [key]: evt.target.value }));
  };

  const handleGuide = () => {
    grantDoc.drive();
  };

  return (
    <>
      <Helmet>
        <title>양도서류작성</title>
      </Helmet>

      <div className="flex justify-end">
        <button
          onClick={handleGuide}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          가이드 시작
        </button>
      </div>

      <div id="grantContainer">
        <div className="mb-8">
          <div className="w-full flex mb-4">
            <span className="text-xl font-semibold flex-1">양도인</span>
            <label
              htmlFor="loadUserData"
              className="cursor-pointer select-none mr-4 flex items-center gap-2"
            >
              <span>신청인 정보 불러오기</span>
              <input onClick={loadUserData} type="checkbox" id="loadUserData" />
            </label>
          </div>

          {/* 양도인 정보 */}
          <div className="space-y-2">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
              <div className="flex items-center">
                <span className="w-1/3 font-medium">성명(상호)</span>
                <input
                  type="text"
                  placeholder="성명(상호)"
                  value={grantor.name}
                  onChange={(evt) => changeHandle("name", evt)}
                  className="w-2/3 px-3 py-2 border rounded"
                />
              </div>

              <div className="flex items-center">
                <span className="w-1/3 font-medium">전화번호</span>
                <input
                  type="text"
                  placeholder="전화번호"
                  value={grantor.phoneNumber}
                  onChange={(evt) => changeHandle("phoneNumber", evt)}
                  className="w-2/3 px-3 py-2 border rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
            <div className="flex items-center">
              <label className="w-[31%] md:w-1/5 font-medium break-keep">
                인공증식 시설 소재지
              </label>

              <button
                ref={addressBtnRef}
                className="hidden md:inline w-1/12 md:w-1/12 hover:bg-gray-100 border py-2 ml-1.5 rounded"
                onClick={loadPostcodeSearch}
              >
                찾기
              </button>
              <div className="flex flex-col w-[67%] md:flex-row md:w-full space-y-1 md:space-y-0">
                <input
                  type="text"
                  className="w-full px-3 ml-2 py-2 border rounded cursor-pointer hover:bg-gray-100"
                  placeholder="기본주소"
                  readOnly
                  // onChange={(evt) => changeHandle("address", evt)}
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
          {/* 양도인 정보 끝 */}
        </div>

        {/* 양수인 정보 - 불러올 것 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">양수인</h3>
          <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-8 md:gap-y-2">
            <div className="flex">
              <span className="w-1/3 font-medium">성명</span>
              <span className="w-2/3">{assignee.name}</span>
            </div>
            <div className="flex">
              <span className="w-1/3 font-medium">전화번호</span>
              <span className="w-2/3">{assignee.phoneNumber}</span>
            </div>

            <div className="flex">
              <span className="w-1/3 font-medium">주소</span>
              <span className="w-2/3">{assignee.address}</span>
            </div>
          </div>
        </div>
        {/* 양수인 정보 끝 */}

        {/* 개체 정보 - 사전에 설정된 정보 불러올 것 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">개체 정보 작성</h3>
          <div className="grid grid-cols-1 gap-y-1 md:grid-cols-2 md:gap-x-8 md:gap-y-2">
            <div className="flex">
              <span className="w-1/3 font-medium">학명</span>
              <span className="w-2/3 px-3 py-2">Malaclemys terrapin</span>
            </div>
            <div className="flex items-center">
              <span className="w-1/3 font-medium">보통명(일반명)</span>
              <span className="w-2/3 px-3 py-2">(공란)</span>
            </div>
            <div className="flex items-center">
              <span className="w-1/3 font-medium break-keep">부속서 등급</span>
              <span className="w-2/3 px-3 py-2">II급</span>
            </div>
            <div className="flex items-center">
              <label className="w-1/3 font-medium">수량</label>
              <span className="w-2/3 px-3 py-2">{detailByAssignee.count}</span>
            </div>
            <div className="flex items-center">
              <span className="w-1/3 font-medium">형태</span>
              <span className="w-2/3 px-3 py-2">살아있는 생물</span>
            </div>
            <div className="flex items-center">
              <label className="w-1/3 font-medium">용도</label>
              <span className="w-2/3 px-3 py-2">-</span>
            </div>
            <div className="flex items-center">
              <span className="w-1/3 font-medium">양수사유</span>
              <span className="w-2/3 px-3 py-2">
                {detailByAssignee.transferReason}
              </span>
            </div>
            <div className="flex items-center">
              <label className="w-1/3 font-medium">개체식별번호</label>
              <span className="w-2/3 px-3 py-2">
                {detailByAssignee.turtleUUID}
              </span>
            </div>
          </div>
        </div>
        {/* 개체 정보 끝 */}

        {/* 구비서류 정보 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">구비서류</h3>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1 break-keep">
                수입허가증 등 양도하려는 국제적 멸종위기종의 입수 경위 및 이를
                증명하는 서류
              </label>
              <div className="w-full px-3 py-2 border rounded bg-gray-50 flex items-center">
                {aquisition}
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 break-keep">
                양도한 국제적 멸종위기종의 부모 개체의 고유번호
              </label>
              {/* <div className="w-full px-3 py-2 border rounded bg-gray-50 flex items-center mb-2">
                <span className="text-gray-500 flex-grow">부 개체 번호</span>
                <input type="file" className="hidden" id="file1" />
                <label htmlFor="file1" className="cursor-pointer flex-shrink">
                  개체 찾기
                </label>
              </div> */}
              <div>
                <select
                  className="w-full px-3 py-2 mb-2 border rounded bg-gray-50 flex items-center"
                  onChange={(evt) => changeUuidData("fatherUUID", evt)}
                  value={uuidData.fatherUUID}
                >
                  <option value="" disabled>
                    부 개체 고유번호
                  </option>
                  {state.myTurtlesUuid.map(
                    (turtle: MyTurtleInfo) =>
                      turtle.turtleGender === "MALE" && (
                        <option
                          key={turtle.turtleUuid}
                          value={turtle.turtleUuid}
                        >
                          {turtle.turtleName} /{" "}
                          {turtle.turtleGender === "MALE" ? "수컷" : "암컷"} (
                          {turtle.turtleUuid})
                        </option>
                      )
                  )}
                </select>
              </div>
              <div>
                <select
                  className="w-full px-3 py-2 mb-2 border rounded bg-gray-50 flex items-center"
                  onChange={(evt) => changeUuidData("motherUUID", evt)}
                  value={uuidData.motherUUID}
                >
                  <option value="" disabled>
                    모 개체 고유번호
                  </option>
                  {state.myTurtlesUuid.map(
                    (turtle: MyTurtleInfo) =>
                      turtle.turtleGender === "FEMALE" && (
                        <option
                          key={turtle.turtleUuid}
                          value={turtle.turtleUuid}
                        >
                          {turtle.turtleName} /{" "}
                          {turtle.turtleGender === "FEMALE" ? "암컷" : "수컷"} (
                          {turtle.turtleUuid})
                        </option>
                      )
                  )}
                </select>
              </div>
            </div>
          </div>
        </div>
        {/* 구비서류 정보 끝 */}
      </div>

      <div className="flex justify-center space-x-4">
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
