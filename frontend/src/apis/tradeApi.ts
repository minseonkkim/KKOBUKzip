import axios, { AxiosResponse } from "axios";
import { AuctionItemDataType } from "../types/auction";
import authAxios from "./http-commons/authAxios";
import guestAxios from "./http-commons/guestAxios";
import {
  TransactionItemDataType,
  TransactionItemDetailType,
} from "../types/transaction";
import { AuctionResponseDummuy } from "../fixtures/auctionDummy";

interface AuctionResponseData<T> {
  success: true;
  status: number;
  data: T;
}

interface ErrorResponse {
  success: false;
  status: number;
  message: string;
}

/**
 * API 요청을 수행하고 일관된 응답 형식을 반환하는 헬퍼 함수입니다.
 *
 * @param requestFunction - API 요청을 수행하는 함수
 * @param params - 요청에 필요한 파라미터
 * @returns 성공 시 데이터, 실패 시 에러 응답
 */
const apiRequest = async <T>(
  requestFn: () => Promise<AxiosResponse<T>>
): Promise<AuctionResponseData<T> | ErrorResponse> => {
  try {
    const response = await requestFn();
    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error: unknown) {
    let errorMessage = "알 수 없는 오류가 발생했습니다.";
    let statusCode = 500; // internal server error
    if (axios.isAxiosError(error)) {
      // AxiosError 타입 확인 및 처리
      errorMessage = error.response?.data?.msg || error.message;
      error.response?.status;
    } else if (error instanceof Error) {
      // 일반 JavaScript Error 처리
      errorMessage = error.message;
    }
    console.error(`Trade API Request: ${statusCode} - ${errorMessage}`);
    return {
      success: false,
      status: statusCode,
      message: errorMessage,
    };
  }
};

interface AuctionListData {
  status: number;
  cnt: number;
  auctions: AuctionItemDataType[];
  total_pages: number;
}

/**
 * 주어진 필터를 기반으로 경매 데이터 목록을 가져옵니다.
 *
 * @param gender - 경매 항목의 성별.
 * @param minWeight - 항목의 크기 범위를 'AbetweenB' 형식으로 지정합니다 (예: '2between5').
 * @param maxWeight - 항목의 크기 범위를 'AbetweenB' 형식으로 지정합니다 (예: '2between5').
 * @param minPrice - 항목의 가격 범위를 'AbetweenB' 형식으로 지정합니다 (예: '100between500').
 * @param maxPrice - 항목의 가격 범위를 'AbetweenB' 형식으로 지정합니다 (예: '100between500').
 * @param progress - 경매 진행 상태입니다. 선택지는 다음과 같습니다:
 *   1: 경매 시작 전,
 *   2: 경매 진행 중,
 *   3: 유찰,
 *   4: 낙찰.
 * @param page - 페이지 번호로, 기본값은 1입니다.
 * @returns 경매 데이터 응답을 포함하는 프라미스를 반환합니다.
 *
 * 모든 필터의 default는 전체 & 페이지 넘버는 1번
 * @example
 * const auctionData = await getAuctionDatas('w', '2between5', '100between500', '2', 1);
 */
export const getAuctionDatas = async ({
  page,
  gender,
  minWeight,
  maxWeight,
  maxPrice,
  minPrice,
  progress,
}: {
  page?: number;
  gender?: string;
  minWeight?: string;
  maxWeight?: string;
  minPrice?: string;
  maxPrice?: string;
  progress?: number;
}) => {
  // query setting
  const pageQuery = page ? `page=${page}` : "page=0";
  const genderQuery = gender ? `&gender=${gender}` : "";
  const sizeQuery =
    minWeight || maxWeight
      ? `&size=${minWeight ? minWeight : "0"}between${
          maxWeight ? maxWeight : "999999999999"
        }`
      : "";
  const priceQuery =
    minPrice || maxPrice
      ? `&price=${minPrice ? minPrice : "0"}between${
          maxPrice ? maxPrice : "999999999999"
        }`
      : "";
  const progressQuery = progress ? `&progress=${progress}` : "";

  const query =
    pageQuery + genderQuery + sizeQuery + priceQuery + progressQuery;
  // request
  const response = await apiRequest<AuctionListData>(() =>
    guestAxios.get(`/auction?${query}`)
  );
  return response;
};

// 경매 단일 상품 조회 search dummy
export const getAuctionDetailItemData = async (auctionID: number) => {
  const response = (await apiRequest)<{
    data: { auction: AuctionItemDataType };
  }>(() => guestAxios.get(`/auction/${auctionID}`));
  // return response;

  return {
    success: true,
    data: { data: AuctionResponseDummuy.data },
  };
};

// 경매 등록
export const addAuctionItem = async (auctionData: FormData) => {
  const response = await apiRequest<{ status: number; message: string }>(() =>
    authAxios.post("/auction", auctionData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      timeout: 10000,
    })
  );
  return response;
};

export interface TransactionListData {
  status: number;
  message: string;
  data: {
    current_page: number;
    total_pages: number;
    cnt: number;
    transactions: TransactionItemDataType[];
  };
}

// 거래 목록 조회
export const getTransactionData = async ({
  page,
  gender,
  minWeight,
  maxWeight,
  maxPrice,
  minPrice,
  progress,
}: {
  page?: number;
  gender?: string;
  minWeight?: string;
  maxWeight?: string;
  minPrice?: string;
  maxPrice?: string;
  progress?: number;
}) => {
  const pageQuery = page ? `page=${page}` : "page=0";
  const genderQuery = gender ? `&gender=${gender}` : "";
  const sizeQuery =
    minWeight || maxWeight
      ? `&size=${minWeight ? minWeight : "0"}between${
          maxWeight ? maxWeight : "999999999999"
        }`
      : "";
  const priceQuery =
    minPrice || maxPrice
      ? `&price=${minPrice ? minPrice : "0"}between${
          maxPrice ? maxPrice : "999999999999"
        }`
      : "";
  const progressQuery = progress ? `&progress=${progress}` : "";

  const query =
    pageQuery + genderQuery + sizeQuery + priceQuery + progressQuery;

  const response = await apiRequest<{ data: TransactionListData }>(() =>
    guestAxios.get(`/main/transaction/?${query}`)
  );
  return response;
};

interface TransactionItemDetailData {
  status: number;
  message: string;
  data: { turtle: TransactionItemDetailType };
}
// 거래 단일항목 상세조회
export const getTransactionDetailItemData = (transactionId: string) => {
  return apiRequest<TransactionItemDetailData>(() =>
    guestAxios.get(`/main/transaction/${transactionId}`)
  );
};
