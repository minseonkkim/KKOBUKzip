import { useRef, useState } from "react";

function DocImgUpload({
  setImage,
}: {
  //   image: HTMLInputElement | null;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false); // 드래그 상태 관리
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
    console.log(preview);
  };

  // 드래그 앤 드롭 핸들러
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement | HTMLLabelElement>
  ) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 드래그 오버 핸들러 (드래그 중일 때 스타일 적용)
  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement | HTMLLabelElement>
  ) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // 드래그 리브 핸들러 (드래그 중지 시 스타일 복구)
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // 이미지 삭제 핸들러
  const handleDelete = () => {
    setPreview(null);
    setImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      {preview ? (
        <div className="relative">
          <img src={preview} alt="Preview" className="w-full h-auto" />
          <button
            onClick={handleDelete}
            className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 text-white px-2 py-1 rounded"
          >
            삭제
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex justify-center items-center w-full rounded-lg  
           ${isDragging ? "bg-gray-200" : " bg-gray-50"}
           `}
        >
          <label
            htmlFor="dropzone-file"
            className={`flex flex-col justify-center items-center w-full h-64 rounded-lg border-2
           border-gray-300 border-dashed cursor-pointer 
           `}
          >
            <div className="flex flex-col justify-center items-center pt-5 pb-6">
              <svg
                className="mb-3 w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="XXXXXXXXXXXXXXXXXXXXXXXXXX"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">클릭</span> 혹은 이미지를 이곳에{" "}
                <span className="font-semibold">드롭</span> 하세요
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              id="dropzone-file"
            />
          </label>
        </div>
      )}
      {/* <div>
        <div
          className={`w-full px-3 py-2 border rounded flex items-center justify-between transition-colors duration-200 
            ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-gray-50"
            }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {preview ? (
            <div className="relative w-full h-32 flex justify-center items-center">
              <img
                src={preview}
                alt="미리보기"
                className="object-contain h-full"
              />
              <button
                onClick={handleDelete}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs"
              >
                X
              </button>
            </div>
          ) : (
            <>
              <span className="text-gray-500 flex-grow">선택된 파일 없음</span>
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                id="file1"
              />
              <label htmlFor="file1" className="cursor-pointer flex-shrink">
                파일 선택
              </label>
            </>
          )}
        </div>
      </div> */}
    </div>
  );
}
export default DocImgUpload;
