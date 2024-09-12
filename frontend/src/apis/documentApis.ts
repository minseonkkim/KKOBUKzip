import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import guestAxios from "./http-commons/guestAxios";
import authAxios from "./http-commons/authAxios";
import { AdminDocsListDataType, BreedFetchData } from "../types/document";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * 공통 API 요청 헬퍼 함수
 * @param requestFn - 요청을 수행하는 콜백 함수
 * @returns - ApiResponse 객체
 */
export const apiHelper = async <T>(
  requestFn: () => Promise<AxiosResponse<{ data: T }>>
): Promise<ApiResponse<T>> => {
  try {
    const response = await requestFn();
    console.log(response.data);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: unknown) {
    // 오류 메시지 추출
    let errorMessage = "Unknown error";
    if (error instanceof AxiosError) {
      errorMessage = error.response?.data?.message || error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

const path = "/document";
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
  const response = await apiHelper<AdminDocsListDataType>(() =>
    authAxios.get(path + `/detail/${turtleUUID}/${documentHash}`)
  );
  return response;
};

// 관리자 서류 승인
// true or false
export const approveDocument = async (
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
