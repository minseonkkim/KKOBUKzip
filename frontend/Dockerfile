#베이스 이미지 설정
FROM node:latest AS build
#작업 디렉토리 설정
WORKDIR /frontend/
#의존성 설치
COPY package*.json ./
RUN npm install
#앱 소스 복사
COPY . .

ENV VITE_BASE_URL=https://j11c107.p.ssafy.io
# ENV VITE_SSE_MAIN_URL=https://j11c107.p.ssafy.io
# ENV VITE_SSE_AUCTION_URL=https://j11c107.p.ssafy.io
ENV VITE_SOCKET_MAIN_URL=https://j11c107.p.ssafy.io/main/ws
ENV VITE_SOCKET_AUCTION_URL=https://j11c107.p.ssafy.io/auction/ws

#포트번호
EXPOSE 3000
#빌드
RUN npm run build
#서버 실행
CMD ["npm","start"]
