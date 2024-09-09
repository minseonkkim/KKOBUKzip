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
import AdminPage from "./pages/user/AdminPage";
import UserPage from "./pages/user/UserPage";

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
          <Route
            path="/doc-form/assign-grant" // 양수/양도 페이지
            element={<DocumentFormPage />}
          />
          <Route
            path="/doc-form/breed" // 증식페이지
            element={<DocumentFormPage />}
          />
          <Route
            path="/doc-form/death" // 사망 페이지
            element={<DocumentFormPage />}
          />
          <Route path="/doc-list" element={<DocumentListPage />} />

          {/* Auction Domain - 경매 */}
          <Route path="/auction-detail" element={<AuctionDetailPage />} />
          <Route path="/auction-list" element={<AuctionListPage />} />

          {/* Transaction Domain - 거래 */}
          <Route
            path="/transaction-detail"
            element={<TransactionDetailPage />}
          />
          <Route path="/transaction-list" element={<TransactionListPage />} />

          {/* User Domain - 유저 */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/mypage" element={<UserPage />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
