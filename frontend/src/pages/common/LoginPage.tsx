import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import BackgroundImage from "../../assets/login_background.jpg";
import naver_logo from "../../assets/login/naver_logo2.png";
import kakao_logo from "../../assets/login/kakao_logo.png";
import { login } from "../../apis/userApi";

// 해야할 것 : api 요청 결과에 따라 분기처리
// 히야할 것 : api 요청 직전에 입력값 확인

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    alert("로그인 핸들");
    console.log(email, password);
    await login(email, password);
    navigate("/login");
  };

  return (
    <>
      <Helmet>
        <title>꼬북ZIP: 로그인</title>
      </Helmet>

      <div className="relative flex items-center justify-center h-screen overflow-hidden">
        {/* 배경 이미지 */}
        <img
          src={BackgroundImage}
          alt="login-turtle-background"
          className="w-full h-full object-cover min-h-screen absolute"
        />
        {/* 로그인 컴포넌트 */}
        <div className="relative w-1/2  bg-white/30 backdrop-blur-md p-8 rounded-lg shadow-lg z-10">
          <div className="w-2/3 m-auto">
            <h2 className="text-4xl font-bold text-center mb-6">로그인</h2>

            <form className="space-y-4">
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="email"
                placeholder="이메일"
                className="w-full p-3 border rounded bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
                placeholder="비밀번호"
                className="w-full p-3 border rounded bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={handleLogin}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                로그인하기
              </button>
            </form>

            <div className="flex justify-between items-center mt-4 text-sm">
              <span>아직 회원이 아니신가요?</span>
              <Link to="/join" className="text-blue-500 hover:underline">
                회원가입
              </Link>
            </div>

            <div className="mt-6 space-y-2">
              <button className="flex w-full justify-center m-auto bg-black text-white py-2 rounded">
                이메일 로그인
              </button>
              <button
                className="flex items-center m-auto justify-center w-full bg-[#03C75A]
                py-2 rounded text-white
                "
                // hover:bg-[#03C75A]/80 transition-all duration-300 ease-in-out
                // hover:text-green-600
                // hover:shadow-lg
                // hover:shadow-green-500/50
                // hover:scale-105
                // hover:rotate-1
                // active:scale-100
                // active:rotate-0
                // border border-green-500
                // hover:border-green-600"
              >
                <img
                  src={naver_logo}
                  alt="Naver Logo"
                  className="w-5 h-5 mr-2"
                />
                네이버 로그인
              </button>

              <button
                className="flex items-center m-auto justify-center w-full bg-[#fae300]
                py-2 rounded text-white
                "
                // hover:bg-[#fae300]/80 transition-all duration-300 ease-in-out
                // border border-yellow-500
                // hover:border-yellow-600
                // hover:text-yellow-600
                // hover:shadow-lg
                // hover:shadow-yellow-500/50
                // hover:scale-105
                // hover:rotate-1
                // active:scale-100
                // active:rotate-0"
              >
                <img
                  src={kakao_logo}
                  alt="Kakao Logo"
                  className="w-5 h-5 mr-2"
                />
                KAKAO 로그인
              </button>
            </div>
          </div>
        </div>{" "}
      </div>
    </>
  );
}

export default LoginPage;
