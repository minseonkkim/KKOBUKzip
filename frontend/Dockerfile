#베이스 이미지 설정
FROM node:latest AS build
#작업 디렉토리 설정
WORKDIR /frontend/
#의존성 설치
COPY package*.json ./
RUN npm install
#앱 소스 복사
COPY . .
#포트번호
EXPOSE 3000
#빌드
RUN npm run build
#서버 실행
CMD ["npm","start"]
