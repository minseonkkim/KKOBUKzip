import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // 소스 맵 비활성화
  },
  server: {
    hmr: {
      protocol: "ws", // 또는 'wss'를 사용할 수 있습니다.
    },
  },
});
