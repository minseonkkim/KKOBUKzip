import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import useDeviceStore from "../../store/useDeviceStore";
import naver_logo from "../../assets/login/naver_logo2.webp";
import kakao_logo from "../../assets/login/kakao_logo.webp";
import Header from "../../components/common/Header";
import StopTurtleImg from "../../assets/turtle_home_stop.png";
import { FaRegEye } from "@react-icons/all-files/fa/FaRegEye";
import { FaRegEyeSlash } from "@react-icons/all-files/fa/FaRegEyeSlash";
import { loginRequest } from "../../apis/userApi";
import { useUserStore } from "../../store/useUserStore";

// 해야할 것 : api 요청 결과에 따라 분기처리
// 히야할 것 : api 요청 직전에 입력값 확인
// role 값에 따라서 처리할 것
// 유저는 user 관리자는 admin

function LoginPage() {
  const isMobile = useDeviceStore((state) => state.isMobile);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hide, setHide] = useState(true);
  const { setLogin } = useUserStore();
  const navigate = useNavigate();
  const [failMessage, setFailMessage] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { success, data, error } = await loginRequest(email, password);
    if (success) {
      const userData = {
        ...data?.data?.data!,
        foreignFlag: false, 
      };
      
      setLogin(userData);
      localStorage.setItem("accessToken", userData.accessToken);
      localStorage.setItem("refreshToken", userData.refreshToken);
      navigate("/");
    } else {
      console.log(error);
      setFailMessage("이메일 또는 비밀번호를 올바르지 않습니다.");
    }
};

  return (
    <>
      <Helmet>
        <title>로그인</title>
      </Helmet>
      <Header />
      <main className="px-4 lg:px-[250px] flex justify-center items-center mt-[60px] h-[calc(100vh-60px)]">
        {/* 로그인 컴포넌트 */}
        <section className="relative w-full bg-[#D5E5BD] backdrop-blur-sm rounded-[20px] shadow-[20px] z-10 flex h-[640px] md:h-[600px] flex-col md:flex-row">
          <div className="w-full md:w-1/2 h-[190px] md:h-full">
            <img
              src={StopTurtleImg}
              className="w-full rounded-tl-[20px] rounded-tr-[20px] md:rounded-tr-none rounded-bl-none md:rounded-bl-[20px] h-full object-cover"
              draggable="false"
            />
          </div>

          <div className="h-full rounded-r-[20px] w-full md:w-1/2 m-0 md:m-auto flex justify-center items-center">
            <div className="w-2/3">
              <h2 className="text-[35px] md:text-[38px] text-center mb-5 md:mb-8 font-dnf-bitbit">
                로그인
              </h2>

              <form onSubmit={handleLogin} className="space-y-5 mb-7 md:mb-10">
                <input
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  type="email"
                  placeholder="이메일"
                  className="w-full p-3 text-[20px] border rounded bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-[#4B721F]"
                />
                <div className="relative">
                  <input
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    type={hide ? "password" : "text"}
                    placeholder="비밀번호"
                    className="w-full p-3 text-[20px] border rounded bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-[#4B721F]"
                  />
                  {hide ? (
                    <div
                      className="cursor-pointer absolute top-[17px] right-5 text-[21px] text-[#7c7c7c]"
                      onClick={() => setHide(false)}
                    >
                      <FaRegEyeSlash />
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer absolute top-[17px] right-5 text-[21px] text-[#7c7c7c]"
                      onClick={() => setHide(true)}
                    >
                      <FaRegEye />
                    </div>
                  )}
                </div>
                <div className="text-red-700 text-center">{failMessage}</div>
                <button className="w-full bg-[#4B721F] text-[22px] text-white py-3 rounded hover:bg-[#3E5A1E]">
                  로그인하기
                </button>
              </form>

              {/* <div className="flex justify-between items-center mt-4 text-[17px] font-bold">
                <span>아직 회원이 아니신가요?</span>
                <Link to="/join" className="text-blue-500 hover:underline">
                  회원가입
                </Link>
              </div> */}
              {/* 
              <div className="flex flex-row justify-center gap-12">
                <div className="cursor-pointer w-[53px] h-[53px] bg-[#03C75A] rounded-full flex justify-center items-center">
                  <img
                    src={naver_logo}
                    alt="Naver Logo"
                    className="w-6 h-6"
                    draggable="false"
                  />
                </div>

                <div className="cursor-pointer w-[53px] h-[53px] bg-[#fae300] rounded-full flex justify-center items-center">
                  <img
                    src={kakao_logo}
                    alt="Kakao Logo"
                    className="w-6 h-6"
                    draggable="false"
                  />
                </div>
              </div> */}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default LoginPage;
