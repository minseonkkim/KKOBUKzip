import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// const BASE_URL = import.meta.env.VITE_BASE_URL;
const BASE_URL =
  "https://7529ce6e-dc11-40ce-bb94-9812611cbeb3.mock.pstmn.io/api/main";
const REFRESH_URL = BASE_URL + "/jwt/refresh";

const authAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10초
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/*
1. 요청 인터셉터에서 만료시간을 1차적으로 걸러줌
2. 그럼에도 토큰 만료 혹은 에러라면 응답 인터셉터에서 2차적으로 재발송

3. 한 후에 기존의 요청을 다시 전송
*/
// 요청 인터셉터

authAxios.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    const expiresAt = localStorage.getItem("expiresAt");

    if (token && expiresAt && Date.now() > parseInt(expiresAt)) {
      // 만료된 토큰인 경우 리프레시를 시도합니다.
      try {
        const newToken = await refreshToken();
        config.headers["Authorization"] = `Bearer ${newToken}`;
      } catch (error) {
        // 리프레시 토큰 에러 처리
        console.error("Error refreshing token:", error);
        return Promise.reject(error);
      }
    } else if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 응답 인터셉터
authAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        authAxios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newToken}`;
        return authAxios(originalRequest); // 원래의 요청을 새로운 토큰으로 재전송
      } catch (refreshError) {
        // 리프레시 토큰 실패 처리
        console.error("Failed to refresh token:", refreshError);
        // 로그아웃 처리나 리다이렉트 등 추가적인 처리를 여기에 구현
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// 토큰 재발행 함수
const refreshToken = async (): Promise<string> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(REFRESH_URL, { refreshToken });
    const { accessToken, expiresIn } = response.data;

    // 새로운 토큰과 만료 시간을 로컬 스토리지에 저장
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem(
      "expiresAt",
      (Date.now() + expiresIn * 1000).toString()
    );

    return accessToken;
  } catch (error) {
    console.error("Refresh token error:", error);
    throw error; // 에러를 던져서 응답 인터셉터가 처리할 수 있도록 합니다.
  }
};

export default authAxios;
