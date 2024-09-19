import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { HelmetProvider } from "react-helmet-async";
import MainPage from "./pages/common/MainPage";
import LoginPage from "./pages/common/LoginPage";
import JoinPage from "./pages/common/JoinPage";
import DocumentFormPage from "./pages/document/DocumentFormPage";
import DocumentListPage from "./pages/document/DocumentListPage";
import TransactionDetailPage from "./pages/transaction/TransactionDetailPage";
import TransactionListPage from "./pages/transaction/TransactionListPage";
import AuctionDetailPage from "./pages/auction/AuctionDetailPage";
import AuctionListPage from "./pages/auction/AuctionListPage";
import MyPage from "./pages/user/MyPage";
import AdminDocsListPage from "./pages/user/admin/AdminDocsListPage";
import AdminDocsDetailPage from "./pages/user/admin/AdminDocsDetailPage";
import ChatList from "./components/chatting/ChatList";
import BreedDocument from "./components/document/BreedDocument";
import AssignDocument from "./components/document/AssignDocument";
import GrantorDocument from "./components/document/GrantorDocument";
import DeathDocument from "./components/document/DeathDocument";
import AuctionSuccessPage from "./pages/auction/AuctionSuccessPage";
import AuctionRegisterPage from "./pages/auction/AuctionRegisterPage";
import NotFoundPage from "./pages/common/NotFoundPage";
import TransactionRegisterPage from "./pages/transaction/TransactionRegisterPage";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          {/* Common Domain */}
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/join" element={<JoinPage />} />
          {/* 이하 다른 도메인 자유롭게 수정해주세요... path 라던가... */}

          {/* Document Domain */}
          {/* nested routing */}
          <Route path="/doc-form" element={<DocumentFormPage />}>
            <Route
              path="/doc-form/breed" // 증식페이지
              element={<BreedDocument />}
            />
            <Route
              path="/doc-form/assign" // 양수 페이지
              element={<AssignDocument />}
            />
            <Route
              path="/doc-form/grant" // 양도 페이지
              element={<GrantorDocument />}
            />
            <Route
              path="/doc-form/death" // 사망 페이지
              element={<DeathDocument />}
            />
          </Route>
          <Route path="/doc-list" element={<DocumentListPage />} />

          {/* Auction Domain - 경매 */}
          <Route path="/auction-detail" element={<AuctionDetailPage />} />
          <Route path="/auction-list" element={<AuctionListPage />} />
          <Route path="/auction-success" element={<AuctionSuccessPage />} />
          <Route path="/auction-register" element={<AuctionRegisterPage />} />
          {/* Transaction Domain - 거래 */}
          <Route
            path="/transaction-detail"
            element={<TransactionDetailPage />}
          />
          <Route path="/transaction-list" element={<TransactionListPage />} />
          <Route
            path="/transaction-register"
            element={<TransactionRegisterPage />}
          />
          {/* User Domain - 유저 */}
          <Route path="/mypage" element={<MyPage />} />
          {/* Admin */}
          <Route
            path="/admin/document/list" // 관리자 문서 리스트 조회 페이지
            element={<AdminDocsListPage />}
          />
          <Route
            path="/admin/:turtleUUID/:documentHash" // 관리자 문서 디테일 조회
            element={<AdminDocsDetailPage />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ChatList />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
