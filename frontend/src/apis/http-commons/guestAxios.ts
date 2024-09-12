// src/api/guestAxios.ts
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const guestAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10초
  // 추가적인 설정이 필요할 경우 여기에 작성
});

export default guestAxios;
