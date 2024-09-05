C107 KKOBUKZIP

특이사항
index.html 의 description / manijest.json 의 description 수정하기 (한 줄 문구)




typescript
react
vitePWA

tailwind css
zustand

react router
web3.js

react-helmet-async
--------이상 설치 완료
--------이하 설치 필요(필요시에)

react portal
Flowbite
react-multi-carousel

(pdf-lib)
(driver.js)


-------------------------------
-DDD 에 맞게 프로젝트 구성-

컴포넌트 폴더 관리 컨셉
상위 폴더(ex. components)
도메인 폴더 - 사용자(user), 판매(sale), 경매(auction), 서류(document), 채팅(chat), 관리자(admin)
// 필요에 의해 추가 가능, 채팅은 애매한...데 일단 분리
하위에 컴포넌트

예시(gpt생성)
src/
  components/
    common/              # 도메인에 종속되지 않는 공통 컴포넌트
      Button.tsx
      Input.tsx
      Modal.tsx
    auction/             # 경매 도메인 관련 컴포넌트
      AuctionList.tsx
      AuctionDetail.tsx
      AuctionRegister.tsx
    sale/                # 판매 도메인 관련 컴포넌트
      SaleList.tsx
      SaleDetail.tsx
      SaleRegister.tsx
    document/            # 서류 도메인 관련 컴포넌트
      DocumentForm.tsx
      DocumentList.tsx
      DocumentDetail.tsx
    chat/                # 채팅 도메인 관련 컴포넌트
      ChatList.tsx
      ChatDetail.tsx
  pages/
    MainPage.tsx
    SignupPage.tsx
    LoginPage.tsx
    MyPage.tsx
    SaleListPage.tsx
    SaleDetailPage.tsx
    AuctionListPage.tsx
    AuctionDetailPage.tsx
    DocumentFormPage.tsx
    DocumentListPage.tsx
    AdminDocumentPage.tsx
  styles/
    tailwind.css
  App.tsx
  index.tsx


  # 페이지 (노션 개인 항목의 페이지 파일 참조) => be랑 용어 통일
  # 메인 Main
  # 회원가입 Join
  # 로그인 Login
  # 유저(마이) User
  # 채팅 Chat
  # 판매 Transaction
  # 경매 -> 낙찰 Auction
  # 서류 (증식양도양수폐사질병) Document
  # 관리자 Admin