import { Helmet } from "react-helmet-async";
import useDeviceStore from "../../store/useDeviceStore";

function MainPage() {
  const isMobile = useDeviceStore((state) => state.isMobile);

  return (
    <>
      <Helmet>
        <title>Main Page</title>
      </Helmet>
      <div className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">
        <div className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900">
          메인 페이지
          {isMobile && <p className="text-gray-200">모바일</p>}
        </div>
      </div>
    </>
  );
}

export default MainPage;
