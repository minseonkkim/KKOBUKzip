import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { HelmetProvider } from "react-helmet-async";
import React, { Suspense, useEffect } from "react";
import LoadingImage from "../src/assets/loading.webp";

const MainPage = React.lazy(() => import("./pages/common/MainPage"));
const LoginPage = React.lazy(() => import("./pages/common/LoginPage"));
const JoinPage = React.lazy(() => import("./pages/common/JoinPage"));
const DocumentFormPage = React.lazy(
  () => import("./pages/document/DocumentFormPage")
);
// const DocumentListPage = React.lazy(
//   () => import("./pages/document/DocumentListPage")
// );

// 하단 5개 컴포넌트는 개별 최적화 -> socket, sse 연결이 우선적으로 적용되어야 함.(레이아웃 공유라서 거래 포함)
import TransactionDetailPage from "./pages/transaction/TransactionDetailPage";
import TransactionListPage from "./pages/transaction/TransactionListPage";
import AuctionDetailPage from "./pages/auction/AuctionDetailPage";
import AuctionListPage from "./pages/auction/AuctionListPage";
import ChatList from "./components/chatting/ChatList";
import { useUserStore } from "./store/useUserStore";
import LoginAccessRestrict from "./components/common/LoginAccessRestrict";
import Loading from "./components/common/Loading";

const MyPage = React.lazy(() => import("./pages/user/MyPage"));

const AdminDocsListPage = React.lazy(
  () => import("./pages/user/admin/AdminDocsListPage")
);
const AdminDocsDetailPage = React.lazy(
  () => import("./pages/user/admin/AdminDocsDetailPage")
);
const BreedDocument = React.lazy(
  () => import("./components/document/BreedDocument")
);
const AssignDocument = React.lazy(
  () => import("./components/document/AssignDocument")
);
const GrantorDocument = React.lazy(
  () => import("./components/document/GrantorDocument")
);
const DeathDocument = React.lazy(
  () => import("./components/document/DeathDocument")
);
// const AuctionSuccessPage = React.lazy(
//   () => import("./pages/auction/AuctionSuccessPage")
// );
const AuctionRegisterPage = React.lazy(
  () => import("./pages/auction/AuctionRegisterPage")
);
const NotFoundPage = React.lazy(() => import("./pages/common/NotFoundPage"));
const TransactionRegisterPage = React.lazy(
  () => import("./pages/transaction/TransactionRegisterPage")
);

function App() {
  useEffect(() => {
    const preloadImage = new Image();
    preloadImage.src = LoadingImage;
    preloadImage.loading = "eager";
    preloadImage.decode().catch(() => { });
  }, []);
  const role = useUserStore((state) => state.userInfo?.role);
  const isLogin = useUserStore((state) => state.isLogin);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Suspense
          fallback={
            <Loading />
          }
        >
          <Routes>
            {/* Common Domain */}
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/join" element={<JoinPage />} />

            {/* Document Domain */}
            <Route
              path="/doc-form"
              element={<LoginAccessRestrict element={<DocumentFormPage />} />}
            >
              <Route path="/doc-form/breed" element={<BreedDocument />} />
              <Route path="/doc-form/assign" element={<AssignDocument />} />
              <Route path="/doc-form/grant" element={<GrantorDocument />} />
              <Route path="/doc-form/death" element={<DeathDocument />} />
            </Route>
            {/* <Route path="/doc-list" element={<DocumentListPage />} /> */}

            {/* Auction Domain - 경매 */}
            <Route
              path="/auction-detail/:auctionId"
              element={
                <LoginAccessRestrict
                  element={<AuctionDetailPage />}
                />
              }
            />
            <Route path="/auction-list" element={<AuctionListPage />} />
            {/* <Route path="/auction-success" element={<AuctionSuccessPage />} /> */}
            <Route path="/auction-register" element={
              <LoginAccessRestrict
                element={
                  <AuctionRegisterPage />
                }
              />

            } />

            {/* Transaction Domain - 거래 */}
            <Route
              path="/transaction-detail/:id"
              element={<TransactionDetailPage />}
            />
            <Route path="/transaction-list" element={<TransactionListPage />} />
            <Route
              path="/transaction-register"

              element={
                <LoginAccessRestrict
                  element={<TransactionRegisterPage />}
                />
              }
            />

            {/* User Domain - 유저 */}
            <Route
              path="/mypage"
              element={<LoginAccessRestrict element={<MyPage />} />}
            />

            {/* Admin */}
            <Route
              path="/admin/document/list"
              element={<LoginAccessRestrict element={<AdminDocsListPage />} />}
            />
            <Route
              path="/admin/:turtleUUID/:documentHash"
              element={
                <LoginAccessRestrict element={<AdminDocsDetailPage />} />
              }
            />

            {/* Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          {isLogin && role === "ROLE_USER" && <ChatList />}
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
