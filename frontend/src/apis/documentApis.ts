import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import guestAxios from "./http-commons/guestAxios";
import authAxios from "./http-commons/authAxios";
import {
  AdminAssignDocumentDataType,
  AdminBreedDocumentDataType,
  AdminDeathDocumentDataType,
  AdminDocsListDataType,
  AssigneeFetchData,
  GrantorFetchData,
} from "../types/document";

interface ApiResponse<T> {
  success: boolean;
  data?: T | null;
  message: string;
  error?: number;
}

/**
 * 문서 공통 API 요청 헬퍼 함수
 * @param requestFn - 요청을 수행하는 콜백 함수
 * @returns - ApiResponse 객체
 */
export const apiHelper = async <T>(
  requestFn: () => Promise<
    // response 객체 타입
    AxiosResponse<{
      data: T;
      status: string | number;
      message?: string;
      error?: string;
    }>
  >
): Promise<ApiResponse<T>> => {
  try {
    const response = await requestFn();
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Success",
    };
  } catch (error: unknown) {
    // 오류 메시지 추출
    let errorMessage = "Unknown error";
    let errorCode = 0;
    if (error instanceof AxiosError) {
      errorMessage = error.response?.data.message || error.message;
      errorCode = ~~error?.code!;
    }
    console.error(`Document API Request: ${errorCode} - ${errorMessage}`);
    return {
      success: false,
      message: errorMessage,
      error: errorCode,
    };
  }
};

const path = "/main/document";
// 관리자의 서류 목록 전체 조회
export const getAllDocumentDataForAdmin = async () => {
  const response = await apiHelper<AdminDocsListDataType[]>(() =>
    authAxios.get(path + "/list")
  );
  return response;
};

// 서류 단일항목 조회
export const getDetailDocumentData = async (
  turtleUUID: string,
  documentHash: string
) => {
  const response = await apiHelper<
    | AdminBreedDocumentDataType
    | AdminAssignDocumentDataType
    | AdminDeathDocumentDataType
  >(() => authAxios.get(path + `/${turtleUUID}/${documentHash}`));
  return response;
};

// 관리자 서류 승인
// true or false
export const approveDocumentRequest = async (
  turtleUUID: string,
  documentHash: string,
  approval: boolean
) => {
  const response = await apiHelper<boolean>(() =>
    authAxios.post(path + `/approve`, {
      turtleUUID,
      documentHash,
      approval,
    })
  );
  return response;
};

// 인공증식서류 등록
export const createBreedDocumentRequest = async (data: FormData) => {
  // 필요하다면 이 함수 오기 직전에 폼데이터 유효성 검증(역할분리)
  // for (let [key, value] of data.entries()) {
  //   console.log("key : ", key, value);
  // }
  const response = await apiHelper<boolean>(() =>
    authAxios.post(path + `/register/breed`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        // Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      timeout: 10000,
    })
  );
  return response;
};

// assign(양수) 서류 등록
export const createAssignDocumentRequest = async (data: AssigneeFetchData) => {
  const response = await apiHelper<boolean>(() =>
    authAxios.post(path + `/register/assign`, { data })
  );
  return response;
};

// grant(양도) 서류 등록
export const createGrantDocumentRequest = async (data: GrantorFetchData) => {
  const response = await apiHelper<boolean>(() =>
    authAxios.post(path + `/register/grant`, { data })
  );
  return response;
};

// death(폐사) 서류 등록
export const createDeathDocumentRequest = async (data: FormData) => {
  // 필요하다면 이 함수 오기 직전에 폼데이터 유효성 검증(역할분리)
  // for (let [key, value] of data.entries()) {
  //   console.log("key : ", key, value);
  // }
  const response = await apiHelper<boolean>(() =>
    authAxios.post(path + `/register/death`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      timeout: 10000,
    })
  );
  return response;
};
