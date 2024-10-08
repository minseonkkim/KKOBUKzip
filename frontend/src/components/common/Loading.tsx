import LoadingImage from "../../assets/loading.webp";

export default function Loading(){
  return <>
  <div className="w-full h-[100vh] flex flex-col justify-center items-center">
      <img
          src={LoadingImage}
          className="loading-image w-[500px] h-auto"
          alt="Loading"
          draggable="false"
      />
      <p className="typing-effect font-stardust font-bold text-[30px]">
          Loading...
      </p>
  </div>
  </>
}