import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import DinoGame from "react-chrome-dino-ts";
import "react-chrome-dino-ts/index.css";
import Turtle from "../../assets/NotFoundPage_Turtle.gif";

function NotFoundPage() {
  return (
    <div className="h-screen bg-green-50 flex items-center justify-center">
      <div className="w-[700px] bg-white border-4 border-green-100 rounded-lg shadow-xl p-8 text-center">
        <div className="mb-3">
          <img src={Turtle} alt="turtle" className="mx-auto h-36 w-36" />
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-4 font-dnf-bitbit">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-6 font-stardust">거북이가 길을 잃었어요!</h2>
        <div>
          <p className="text-xl text-gray-600">이런, 우리 꼬북이가 길을 잃은 것 같아요.</p>
          <p className="text-xl text-gray-600">찾으시는 페이지가 없거나 이동되었을 수 있어요.</p>
        </div>
        <div className="my-8 flex flex-row justify-center">
          <DinoGame />
        </div>
        <Link to="/" className="animate-pulse inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300">
          <FaHome className="mr-2 h-6 w-6" />
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
