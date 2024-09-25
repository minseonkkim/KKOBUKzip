import axios, { AxiosResponse } from "axios";
import { AuctionItemDataType } from "../types/auction";
import authAxios from "./http-commons/authAxios";
import guestAxios from "./http-commons/guestAxios";
import { TransactionItemDataType } from "../types/transaction";
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
    console.error(errorMessage);
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
 * @param gender - 경매 항목의 성별. 'w'는 암컷, 'm'은 수컷입니다.
 * @param sizeStart - 항목의 크기 범위를 'AbetweenB' 형식으로 지정합니다 (예: '2between5').
 * @param sizeEnd - 항목의 크기 범위를 'AbetweenB' 형식으로 지정합니다 (예: '2between5').
 * @param priceStar - 항목의 가격 범위를 'AbetweenB' 형식으로 지정합니다 (예: '100between500').
 * @param priceEnd - 항목의 가격 범위를 'AbetweenB' 형식으로 지정합니다 (예: '100between500').
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
  sizeStart,
  sizeEnd,
  priceEnd,
  priceStart,
  progress,
}: {
  page?: number;
  gender?: string;
  sizeStart?: number;
  sizeEnd?: number;
  priceStart?: number;
  priceEnd?: number;
  progress?: number;
}) => {
  // query setting
  const pageQuery = page ? `page=${page}` : "page=1";
  const genderQuery = gender ? `&gender=${gender}` : "";
  const sizeQuery =
    sizeStart && sizeEnd ? `&size=${sizeStart}between${sizeEnd}` : "";
  const priceQuery =
    priceStart && priceEnd ? `&price=${priceStart}between${priceEnd}` : "";
  const progressQuery = progress ? `&progress=${progress}` : "";

  const query =
    pageQuery + genderQuery + sizeQuery + priceQuery + progressQuery;

  // request
  const response = await apiRequest<AuctionListData>(() =>
    guestAxios.get(`/auction?${query}`)
  );
  return response;
};

// 경매 단일 상품 조회
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

// 거래 데이터 조회

export const getTransactionData = async ({
  page,
  gender,
  sizeStart,
  sizeEnd,
  priceEnd,
  priceStart,
  progress,
}: {
  page?: number;
  gender?: string;
  sizeStart?: number;
  sizeEnd?: number;
  priceStart?: number;
  priceEnd?: number;
  progress?: number;
}) => {
  const pageQuery = page ? `page=${page}` : "page=1";
  const genderQuery = gender ? `&gender=${gender}` : "";
  const sizeQuery =
    sizeStart && sizeEnd ? `&size=${sizeStart}between${sizeEnd}` : "";
  const priceQuery =
    priceStart && priceEnd ? `&price=${priceStart}between${priceEnd}` : "";
  const progressQuery = progress ? `&progress=${progress}` : "";

  const query =
    pageQuery + genderQuery + sizeQuery + priceQuery + progressQuery;

  const response = await apiRequest<{
    status: number;
    cnt: number;
    transactions: TransactionItemDataType[];
    total_pages: number;
  }>(() => guestAxios.get(`/transaction?${query}`));
  return response;
};
