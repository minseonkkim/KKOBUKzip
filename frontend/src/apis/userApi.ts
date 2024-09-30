import axios, { AxiosError, AxiosResponse } from "axios";
import guestAxios from "./http-commons/guestAxios";
import { JoinDataType } from "../types/join";
import authAxios from "./http-commons/authAxios";

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
const logout = async (): Promise<{ success: boolean; error?: string }> => {
  return apiRequest(() => authAxios.post("/main/user/logout"));
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

// 응답 데이터 타입 정의
interface LoginResponseData {
  // 로그인 성공 시 반환되는 데이터 타입을 정의합니다.
  status: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    role: string; // 유저는 user 관리자는 admin
    userId: number;
    email: string;
    address: string;
    phoneNumber: string;
    nickname: string;
    profileImage: string;
  };
}

interface RegisterResponseData {
  // 회원가입 성공 시 반환되는 데이터 타입을 정의합니다.
  // 예시로 작성한 것이므로 실제 API 문서에 따라 수정해주세요.
  userId: string;
}

interface TokenResponseData {
  // accessToken 유효성 확인 시 반환되는 데이터 타입을 정의합니다.
  // 예시로 작성한 것이므로 실제 API 문서에 따라 수정해주세요.
  isValid: boolean;
}

interface EmailCheckResponseData {
  // 이메일 인증 확인 시 반환되는 데이터 타입을 정의합니다.
  // 예시로 작성한 것이므로 실제 API 문서에 따라 수정해주세요.
  emailVerified: boolean;
}

interface CreateEmailRequestResponseData {
  // 인증 이메일 발송 시 반환되는 데이터 타입을 정의합니다.
  // 예시로 작성한 것이므로 실제 API 문서에 따라 수정해주세요.
  message: string;
}

// --------------------------
// 상단은 회원가입
// 하단은 내 정보 - 미작성
//---------------------------

// 내 거북이들 확인하기

// 내 거북이 상세 조회

// 내 거래 내역 조회

// 내 거래 내역 상세 조회

export {
  registerRequest,
  loginRequest,
  logout,
  checkToken,
  checkEmailRequest,
  createEmailRequest,
};
