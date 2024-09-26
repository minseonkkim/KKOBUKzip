// src/api/guestAxios.ts
import axios from "axios";

// 아무것도 설정되지 않은 깡통 axios
// 필요 시에 적절히 변경
const BASE_URL = import.meta.env.VITE_BASE_URL;

const guestAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10초
  // 추가적인 설정이 필요할 경우 여기에 작성
});

export default guestAxios;
