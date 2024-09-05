import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { HelmetProvider } from "react-helmet-async";
import MainPage from "./pages/common/MainPage";
import LoginPage from "./pages/common/LoginPage";
import JoinPage from "./pages/common/JoinPage";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          {/* Common Domain */}
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/join" element={<JoinPage />} />

          {/* 이하 다른 도메인 */}
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
