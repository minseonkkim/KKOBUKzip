![image]()

# 1. 꼬북집 KKOBUKZIP 소개

> "희귀거래 생애주기를 관리하는 블록체인 웹 서비스"

대부분의 거북이는 희귀동물 대상으로 양육시 반드시 ‘**CITES’**라는 서류로 환경부에 신고가 필요합니다.

하지만 현재 이 과정이 너무 번거로워 양도, 양수 시 서류 진행시 원활히 이뤄지지 않고 결국 양도 받는 거북이가 불법 개체가 되는 경우가 빈번히 발생합니다.

합법적인 희귀동물을 키우고 싶은 개인, 희귀동물 개체 관리를 원활하게 할 수 있는 정부를 위해 해당 서비스를 기획하게 되었습니다.

> **인공증식, 양도/양수, 폐사까지 희귀 동물의 생애를 관리하고 안전한 거래를 돕는 플랫폼**

- 인공증식, 양도/양수, 폐사 서류 등록 및 승인
- 서류 검토, 승인을 동반한 1:1 거래
- 현재 많이 이뤄지는 거래 방식인 경매 기능

## 📅 개발 기간

**24.08.19 ~ 24.10.11** (8주)

(SSAFY 특화 프로젝트 - 블록체인 트랙)

## 👨‍💻 팀원

| 김여준                       | 김영빈                                                          | 신민경                                        |
| ---------------------------- | --------------------------------------------------------------- | --------------------------------------------- |
| 팀장                         | 팀원                                                            | 팀원                                          |
| BE                           | BE                                                              | BE                                            |
| - 인프라<br>- 경매 기능 구현 | - 블록체인 서류 구현<br>- 웹 소켓 채팅 구현 <br>- SSE 알림 구현 | - 인프라<br>- 유저 관리 <br> - 거래 기능 구현 |

| 한세훈 | 서규범 | 김민선 |
| ------ | ------ | ------ |
| 팀원   | 팀원   | 팀원   |
| FE     | FE     | FE     |
|        |        |        |

## 📃 문서

### **[💻 Notion]()**

# 2. 🔍 개발 환경

## 2-1. 환경 설정

### 👨‍💻 **Frontend**

    - Vite
    - React
    - TypeScript

### 👨‍💻 **Backend**

    - Spring Boot
    - Spring Security
    - Spring Cloud
    - Spring Batch
    - RabbitMQ

### 👨‍💻 **BlockChain**

    - Ethereum
    - Solidity
    - Truffle

### 👨‍💻 **DB**

    - MySQL
    - Redis
    - MongoDB

### 👨‍💻 **CI/CD**

    - AWS EC2
    - Jenkins
    - Docker
    - nginx

### 👨‍💻 **협업 툴**

    - Git Lab
    - Jira
    - Mattermost

## 2-2. 개발문서

### **아키텍처**

![image]()

### **ERD**

![Imgur](https://i.imgur.com/MpDzsMi.png)

### **MongoDB Document Architecture**

```
{
  "_id": {
    "$oid": "6705102076ff19781935ca88"
  },
  "participants": [
    {
      "$numberLong": "1"
    },
    {
      "$numberLong": "2"
    }
  ],
  "recentMessage": {
    "_id": {
        "$oid": "6705103476ff19781935ca8b"
      },
      "sender": {
        "$numberLong": "1"
      },
      "registTime": "2024-10-08T19:57:56.152097400",
      "text": "오 안녕하세요",
  },
  "messages": [
    {
      "_id": {
        "$oid": "6705103476ff19781935ca8b"
      },
      "sender": {
        "$numberLong": "1"
      },
      "registTime": "2024-10-08T19:57:56.152097400",
      "text": "오 안녕하세요",
      "_class": "..."
    },
    {
      "_id": {
        "$oid": "6705102776ff19781935ca8a"
      },
      "sender": {
        "$numberLong": "2"
      },
      "registTime": "2024-10-08T19:57:43.822451700",
      "text": "안녕하세요!",
      "_class": "..."
    },
    {
      "_id": {
        "$oid": "6705102076ff19781935ca89"
      },
      "registTime": "2024-10-08T19:57:36.114742100",
      "title": "팔아요 거북이",
      "price": 30000,
      "image": "....jpg",
      "_class": "..."
    }
  ],
  "unreadCount": [
    0,
    0
  ],
  "_class": ""
}
```

### **요구사항 명세서**

### **API 명세서**

### **블록체인 명세서**

# 3. 💗 주요 기능

### 로그인, 회원 가입

<table>    
    <tr align="center"> 
        <td><strong> 초기 화면 </strong></td>
        <td><strong> 회원 가입</strong></td>
    </tr>
    <tr align="center"> 
        <td> <img src="assets/gif/mobile/01_opening.gif" height="450"> </td>
        <td> <img src="assets/gif/mobile/02_signin.gif" height="450"> </td>
    </tr>
    <tr> 
        <td>
            1. 앱 실행 시 로그인 및 회원가입 진행 가능 <br>
        </td>
        <td>
            1. 이메일 주소를 입력<br>
            2. 수신 받은 인증번호를 통해 회원 가입 진행<br>
        </td>
    </tr>
</table>

### 내 정보 관리

<table>    
    <tr align="center"> 
        <td><strong> 내 거북이 조회 </strong></td>
        <td><strong> 내 거래 내역 조회</strong></td>
    </tr>
    <tr align="center"> 
        <td> <img src="assets/gif/mobile/01_opening.gif" height="450"> </td>
        <td> <img src="assets/gif/mobile/02_signin.gif" height="450"> </td>
    </tr>
    <tr> 
        <td>
            1. 내가 소유한 거북이의 정보 확인 가능 <br>
        </td>
        <td>
            1. 나의 거래 내역 확인 가능 <br>
        </td>
    </tr>
</table>

### 인공 증식 서류 등록

<table>    
    <tr align="center"> 
        <td><strong> 서류 내용 입력</strong></td>
        <td><strong> (관리자) 서류 승인</strong></td>
    </tr>
    <tr align="center"> 
        <td> <img src="assets/gif/mobile/01_opening.gif" height="450"> </td>
        <td> <img src="assets/gif/mobile/02_signin.gif" height="450"> </td>
    </tr>
    <tr> 
        <td>
            1. 인공 증식에 필요한 내용 입력 후 블록체인에 등록<br>
        </td>
        <td>
            1. 서류 내용과 양식이 유효한지 확인 후 서류 승인<br>
            2. 서류 승인 이후 거북이가 실제 데이터로 관리된다.<br>
        </td>
    </tr>
</table>

### 거북이 거래 및 양도 양수 서류 등록

<table>    
    <tr align="center"> 
        <td><strong> (판매자) 거래 등록</strong></td>
        <td><strong> (구매자) 에스크로 결제 진행</strong></td>
    </tr>
    <tr align="center"> 
        <td> <img src="assets/gif/mobile/01_opening.gif" height="450"> </td>
        <td> <img src="assets/gif/mobile/02_signin.gif" height="450"> </td>
    </tr>
    <tr> 
        <td>
            1. 판매에 필요한 정보를 입력하고 거래 등록<br>
        </td>
        <td>
            1. ERC 20 토큰을 사용해 에스크로 결제 시도<br>
        </td>
    </tr>
</table>
# 이 부분은 시연하면서 플로우 다시 그려봐야 할듯

### 거래 채팅

<table>    
    <tr align="center"> 
        <td><strong> 판매자와 채팅 시작</strong></td>
        <td><strong> 채팅</strong></td>
    </tr>
    <tr align="center"> 
        <td> <img src="assets/gif/mobile/01_opening.gif" height="450"> </td>
        <td> <img src="assets/gif/mobile/02_signin.gif" height="450"> </td>
    </tr>
    <tr> 
        <td>
            1. 거래 상세 페이지에서 판매자와의 채팅 시작 가능<br>
        </td>
        <td>
            1. 실시간 채팅 가능<br>
            2. 로그인이 되어 있을 경우 알림도 수신한다.
        </td>
    </tr>
</table>

### 거북이 경매

<table>    
    <tr align="center"> 
        <td><strong> (판매자) 경매 등록</strong></td>
        <td><strong> 경매 시작 대기</strong></td>
    </tr>
    <tr align="center"> 
        <td> <img src="assets/gif/mobile/01_opening.gif" height="450"> </td>
        <td> <img src="assets/gif/mobile/02_signin.gif" height="450"> </td>
    </tr>
    <tr> 
        <td>
            1. 경매에 필요한 정보를 입력하고 경매 등록<br>
        </td>
        <td>
            1. 경매가 시작하기 전 경매화면에서 시작 대기<br>
        </td>
    </tr>
    <tr align="center"> 
        <td><strong> 경매 시작 및 입찰</strong></td>
        <td><strong> 경매 완료 및 낙찰</strong></td>
    </tr>
    <tr align="center"> 
        <td> <img src="assets/gif/mobile/01_opening.gif" height="450"> </td>
        <td> <img src="assets/gif/mobile/02_signin.gif" height="450"> </td>
    </tr>
    <tr> 
        <td>
            1. 시간이 되면 화면이 자동 전환되며 입찰이 가능<br>
            2. 현재 입찰가에 의해 결정되는 고정비용으로 입찰이 가능<br>
            3. 30초의 시간동안 입찰 가능하고 누군가 입찰시 다시 30초의 시간 부여
        </td>
        <td>
            1. 시간이 종료되면 경매 종료<br>
        </td>
    </tr>
</table>

### 폐사 질병 서류 등록

<table>    
    <tr align="center"> 
        <td><strong> 서류 내용 입력</strong></td>
        <td><strong> (관리자) 서류 승인</strong></td>
    </tr>
    <tr align="center"> 
        <td> <img src="assets/gif/mobile/01_opening.gif" height="450"> </td>
        <td> <img src="assets/gif/mobile/02_signin.gif" height="450"> </td>
    </tr>
    <tr> 
        <td>
            1. 필요한 내용 입력 후 블록체인에 등록<br>
        </td>
        <td>
            1. 서류 내용과 양식이 유효한지 확인 후 서류 승인<br>
        </td>
    </tr>
</table>

# 4. 활용 기술

- **트래픽 관리를 위한 서버 분리**
  1. 짧은 시간동안 이루어지는 경매에 몰리는 트래픽을 방지하기 위해 경매 서버 분리
  2. Spring Cloud와 Euraka, RabbitMQ를 적용한 서버간의 IPC 구현 ( 이 부분 자세히 쓰면 좋을 듯)
- **경매 입찰 동시성 관리**
  1. Redis Lock을 사용한 ...
- **Spring Security 적용 회원 관리**
  1. ...
- **Spring Batch와 이더리움 트랜잭션의 비동기 사용**
  1. ...
- **프론트 성능 개선 관련**
  1. ...
- **ERC20 토큰과 에스크로 거래 구현**
  1. ...

# 5. ⚙ Git Flow

## 🗨 Commit Convention

    📌 feat: 새로운 기능 추가, 기능 수정, 삭제

    📌 fix: 오류, 버그 수정

    📌 docs: README나 WIKI 같은 문서 개정

    📌 style: 코드 스타일 혹은 포맷 등에 관한 커밋
    📌 refactor:  코드 리팩토링에 대한 커밋 (쓸모없는 코드 삭제 등)
    📌 test : 테스트 코드 수정에 대한 커밋

    📌 config : 모듈 설치, 설정 파일 추가, 라이브러리 추가, 패키지 구조 수정 등

    📌 chore: 간단한 코드 수정(오탈자 등), 내부 파일 수정 등 기타 변경 사항

    📌 rename: 파일 이름 변경이 있을 때 사용

    📌 remove : 파일 삭제
