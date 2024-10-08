import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";
import { useEffect } from "react";

// 로그인 체크해서 라우팅하는 컴포넌트
function LoginAccessRestrict({ element }: { element: JSX.Element }) {
  const navigate = useNavigate();
  const isLogin = useUserStore((state) => state.isLogin);
  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
      alert("로그인이 필요한 서비스입니다.");
    }
  }, [isLogin, navigate]);

  if (isLogin) return element;

  return null;
}

export default LoginAccessRestrict;
