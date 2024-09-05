import { Helmet } from "react-helmet-async";

function MainPage() {
  return (
    <>
      <Helmet>
        <title>Main Page</title>
      </Helmet>
      <div className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">
        메인 페이지
      </div>
    </>
  );
}

export default MainPage;
