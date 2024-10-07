import { UserInfo } from "./../types/user";
import axios, { AxiosError, AxiosResponse } from "axios";
import guestAxios from "./http-commons/guestAxios";
import { JoinDataType } from "../types/join";
import authAxios from "./http-commons/authAxios";
import { TransactionItemDataType } from "../types/transaction";

/*
성공 형식
{
	"status": 200,
	"message": "요청이 정상적으로 수행되었습니다"
}

실패 형식
{
	"status":401,
	"message":"비밀전호는 8자 이상 & 특수 문자를 포함해야 합니다."
}
*/
// 헬퍼 함수: API 요청 처리
const apiRequest = async <T>(
  requestFn: () => Promise<AxiosResponse<T>>
): Promise<{ success: boolean; data?: T; error?: string }> => {
  try {
    const response = await requestFn();
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage = "알 수 없는 오류가 발생했습니다.";
    if (axios.isAxiosError(error)) {
      // AxiosError 타입 확인 및 처리
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      // 일반 JavaScript Error 처리
      errorMessage = error.message;
    }
    console.error(`User API Request: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
};

// 로그인
const loginRequest = async (
  email: string,
  password: string
): Promise<{ success: boolean; data?: LoginResponseData; error?: string }> => {
  return apiRequest(() =>
    guestAxios.post<LoginResponseData>("/main/user/login", { email, password })
  );
};

// 로그아웃
const logoutRequest = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  return apiRequest(() =>
    authAxios.post(
      "/main/user/logout",
      {},
      {
        headers: {
          "Refresh-Token":
            "Bearer " + localStorage.getItem("refreshToken") || "",
        },
      }
    )
  );
};

// 회원가입
const registerRequest = async (
  data: FormData
): Promise<{
  success: boolean;
  data?: RegisterResponseData;
  error?: string;
}> => {
  return apiRequest(() =>
    guestAxios.post<RegisterResponseData>("/main/user/join", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );
};

// accessToken 유효성 확인
const checkToken = async (): Promise<{
  success: boolean;
  data?: TokenResponseData;
  error?: string;
}> => {
  return apiRequest(() => authAxios.get<TokenResponseData>("/main/jwa/access"));
};

// 이메일 인증 확인
const checkEmailRequest = async (
  email: string,
  verification: string
): Promise<{
  success: boolean;
  data?: EmailCheckResponseData;
  error?: string;
}> => {
  return apiRequest(() =>
    guestAxios.post<EmailCheckResponseData>(`/main/user/email`, {
      email,
      verification,
    })
  );
};

// 인증 이메일 발송
const createEmailRequest = async (
  email: string
): Promise<{
  success: boolean;
  data?: CreateEmailRequestResponseData;
  error?: string;
}> => {
  return apiRequest(() =>
    guestAxios.post<CreateEmailRequestResponseData>(
      `/main/user/email/request/${email}`,
      {}
    )
  );
};

interface UserState extends UserInfo {
  accessToken: string;
  refreshToken: string;
}
// 응답 데이터 타입 정의
interface LoginResponseData {
  // 로그인 성공 시 반환되는 데이터 타입을 정의합니다.
  status: number;
  message: string;
  data: {
    data: UserState;
  };
}

interface RegisterResponseData {
  // 회원가입 성공 시 반환되는 데이터 타입을 정의합니다.
  status: number;
  message: string;
}

interface TokenResponseData {
  // accessToken 유효성 확인 시 반환되는 데이터 타입을 정의합니다.
  status: number;
  message: string;
}

interface EmailCheckResponseData {
  // 이메일 인증 확인 시 반환되는 데이터 타입을 정의합니다.
  staus: number;
  message: string;
}

interface CreateEmailRequestResponseData {
  // 인증 이메일 발송 시 반환되는 데이터 타입을 정의합니다.
  staus: number;
  message: string;
}

// --------------------------
// 상단은 회원가입
// 하단은 내 정보 - 미작성
//---------------------------

// 내 거북이들 확인하기
export const getMyTurtle = async () => {
  return apiRequest(() =>
    authAxios.get("/main/user/turtle", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      timeout: 10000,
    })
  );
};

//내 경매 내역 조회
export const getMyAuction = async () => {
  return apiRequest(() =>
    authAxios.get("/auction/my", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      timeout: 10000,
    })
  );
};

// 내 거래 내역 조회
const getMyTransaction = async () => {
  return apiRequest<getMyTransactionRequestResponseData>(() =>
    authAxios.get("/main/user/transaction")
  );
};
// 내 거북이 상세 조회

interface getMyTransactionRequestResponseData {
  // 인증 이메일 발송 시 반환되는 데이터 타입을 정의합니다.
  staus: number;
  data: { transaction: TransactionItemDataType[] };
  message: string;
}

// 내 거래 내역 상세 조회

// 프로필사진 수정
interface Data {
  url: string;
}
export const patchProfileImage = async (profileImg: File) => {
  const formData = new FormData();
  formData.append("profileImage", profileImg);

  const response = await apiRequest<{
    status: number;
    data: Data;
    message: string;
  }>(() =>
    authAxios.patch("/main/user/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      timeout: 10000,
    })
  );
  return response;
};

export {
  registerRequest,
  loginRequest,
  logoutRequest,
  checkToken,
  checkEmailRequest,
  createEmailRequest,
  getMyTransaction,
};
