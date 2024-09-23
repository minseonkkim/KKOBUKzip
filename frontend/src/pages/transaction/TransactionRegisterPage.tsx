import { Helmet } from "react-helmet-async";
import Header from "../../components/common/Header";
import TmpTurtleImg from "../../assets/tmp_turtle.jpg"
import { IoClose } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";
import { ChangeEvent, useState } from "react";

export default function TransactionRegisterPage(){
    const [images, setImages] = useState<File[]>([]);
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []); // 파일 리스트를 배열로 변환
        if (files.length + images.length > 3) {
        alert("사진은 최대 3장까지만 업로드 가능합니다.");
        return;
        }
        setImages((prevImages) => [...prevImages, ...files]); // 이전 상태에 새 파일 추가
    };

    const handleRemoveImage = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const handleGenderClick = (tag: string) => {
      setSelectedGender(selectedGender === tag ? null : tag);
    };

    const handleSizeClick = (tag: string) => {
      setSelectedSize(selectedSize === tag ? null : tag);
    };

    const formatNumberWithCommas = (value: string): string => {
      const numberValue = value.replace(/,/g, '');
      if (!isNaN(Number(numberValue)) && numberValue !== '') {
        return Number(numberValue).toLocaleString();
      }
      return '';
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      e.target.value = formatNumberWithCommas(e.target.value);
    };

    return <>
    <Helmet>
        <title>경매 등록하기</title>
      </Helmet>
      <Header />
      <div className="px-[250px] mt-[85px]">
        <div className="text-[33px] text-gray-900 font-dnf-bitbit mr-3 pt-[40px] pb-[13px]">판매 등록하기</div>
        <div className="rounded-[10px] p-[13px] bg-[#F2F2F2] h-[150px] flex flex-row items-center mb-[25px]">
          <img src={TmpTurtleImg} draggable="false" className="w-[170px] h-full object-cover rounded-[10px] mr-8" />
          <div className="flex flex-col">
            <div className="text-[26px] font-bold mb-2">꼬부기</div>
            <div className="text-gray-600 text-[21px]">수컷 | 18년 3월 2일생</div>
          </div>
        </div>
        <form className="text-[21px] flex flex-col gap-4">
          <div className="flex flex-row items-center">
            <label className="w-[120px]">판매가</label>
            <input
              className="w-[350px] text-[19px] border-[1px] border-[#9B9B9B] focus:outline-none px-3 py-2 rounded-[10px]"
              type="text"
              name="bid"
              onInput={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-row items-center">
            <label className="w-[120px]">체중</label>
            <input
              className="mr-1 w-[350px] text-[19px] border-[1px] border-[#9B9B9B] focus:outline-none px-3 py-2 rounded-[10px]"
              type="number"
              name="weight"
              required
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/[^0-9]/g, '');
              }}
            />
            kg
          </div>
          <div className="flex flex-row items-start">
            <label className="w-[120px]">상세 설명</label>
            <textarea
              rows={3}
              className="flex-grow border-[1px] border-[#9B9B9B] focus:outline-none px-3 py-2 rounded-[10px] mt-2"
            ></textarea>
          </div>
          <div className="flex flex-row items-start justify-between">
            <div className="flex flex-col">
              <div className="flex flex-row items-center">
                <label>사진 추가</label>
                <p className="ml-3 text-[17px] text-gray-500">*최대 3장만 가능합니다.</p>
              </div>
              <div className="flex flex-row mt-[10px]">
                {images.length < 3 && (
                    <label className="cursor-pointer bg-[#F2F2F2] w-[100px] h-[100px] rounded-[10px] mr-5 flex items-center justify-center">
                        <IoMdAddCircle className="text-[40px]" />
                        <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        />
                    </label>
                    )}
                {images.map((image, index) => (
                  <div key={index} className="relative mr-5">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      draggable="false"
                      className="w-[100px] h-[100px] object-cover rounded-[10px]"
                    />
                    <div className="absolute top-1 right-1 bg-[#D80000] rounded-full w-5 h-5 flex justify-center items-center">
                    <IoClose className="w-6 h-6 cursor-pointer text-[#fff]" onClick={() => handleRemoveImage(index)}/>
                    </div>
                    
                  </div>
                ))}
                
              </div>
            </div>
            <div className="flex flex-col gap-3 items-start w-[35%]">
              <label className="w-[120px]">태그</label>
              <div className="flex flex-row items-center space-x-2">
                <span className="text-[17px] w-[50px]">성별</span>
                <span
                  className={`px-2 py-1 rounded-full cursor-pointer text-[17px] ${
                    selectedGender === "#암컷"
                      ? "bg-[#D5F0DD] text-[#065F46]"
                      : "bg-gray-300 text-gray-600"
                  }`}
                  onClick={() => handleGenderClick("#암컷")}
                >
                  #암컷
                </span>
                <span
                  className={`px-2 py-1 rounded-full cursor-pointer text-[17px] ${
                    selectedGender === "#수컷"
                      ? "bg-[#D5F0DD] text-[#065F46]"
                      : "bg-gray-300 text-gray-600"
                  }`}
                  onClick={() => handleGenderClick("#수컷")}
                >
                  #수컷
                </span>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <span className="text-[17px] w-[50px]">크기</span>
                {["#베이비", "#아성체", "#준성체", "#성체"].map((tag) => (
                  <span
                    key={tag}
                    className={`px-2 py-1 rounded-full cursor-pointer text-[17px] ${
                      selectedSize === tag
                        ? "bg-[#D5F0DD] text-[#065F46]"
                        : "bg-gray-300 text-gray-600"
                    }`}
                    onClick={() => handleSizeClick(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center mb-[20px]">
            <button className="text-white text-[20px] font-bold bg-black w-fit px-4 py-2 rounded-[10px]">
              등록하기
            </button>
          </div>
        </form>
      </div>
    </>
}