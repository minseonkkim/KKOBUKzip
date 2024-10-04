import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), 
     viteCompression({
      // 압축 알고리즘 지정, 기본적으로는 'gzip'을 사용
      algorithm: "gzip",
      // 압축된 파일의 확장자를 '.gz'로 설정
      ext: ".gz",
    }),
  ],
  build: {
    sourcemap: false, // 소스 맵 비활성화
    minify: true,
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: {
      protocol: "ws", // 또는 'wss'를 사용할 수 있습니다.
    },
  },
});
