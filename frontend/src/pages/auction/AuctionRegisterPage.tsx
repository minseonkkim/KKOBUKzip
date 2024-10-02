import { Helmet } from "react-helmet-async";
import Header from "../../components/common/Header";
import TmpTurtleImg from "../../assets/tmp_turtle.jpg";
import { IoMdAddCircle } from "@react-icons/all-files/io/IoMdAddCircle";
import { ChangeEvent, useState } from "react";
import { IoClose } from "@react-icons/all-files/io5/IoClose";
import { addAuctionItem } from "../../apis/tradeApi";

export default function AuctionRegisterPage() {
  const [images, setImages] = useState<File[]>([]);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [minBid, setMinBid] = useState("");
  const [startTime, setStartTime] = useState("");
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 3) {
      alert("사진은 최대 3장까지만 업로드 가능합니다.");
      return;
    }
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const formatNumberWithCommas = (value: string): string => {
    const numberValue = value.replace(/,/g, "");
    if (!isNaN(Number(numberValue)) && numberValue !== "") {
      return Number(numberValue).toLocaleString();
    }
    return "";
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(formatNumberWithCommas(e.target.value));
    setMinBid(formatNumberWithCommas(e.target.value));
    // setMinBid(e.target.value);
  };

  const handleGenderClick = (tag: string) => {
    setSelectedGender(selectedGender === tag ? null : tag);
  };

  const handleSizeClick = (tag: string) => {
    setSelectedSize(selectedSize === tag ? null : tag);
  };

  const submitHandle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      title: "params으로 넘겨받을 이름",
      turtleId: "params으로 넘겨받은 아이디",
      userId: "store에서 가져온 유저아이디",
      content: e.currentTarget.content.value,
      minBid: minBid.replace(/,/g, ""),
      startTime: startTime,
      tags: [selectedGender, selectedSize],
    };

    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });
    formData.append("data", JSON.stringify(data));

    console.log(data);

    await addAuctionItem(formData);
    alert("서브밋 핸들");
  };
  return (
    <>
      <Helmet>
        <title>경매 등록하기</title>
      </Helmet>

      <Header />

      <main className="px-4 lg:px-[250px] mt-[72px]">
        <h1 className="text-[28px] md:text-[33px] text-gray-900 font-dnf-bitbit mr-3 pt-0 lg:pt-[32px] pb-[13px]">
          경매 등록하기
        </h1>
        <div className="rounded-[10px] p-[13px] bg-[#F2F2F2] h-[150px] flex flex-row items-center mb-[25px]">
          <img
            src={TmpTurtleImg}
            alt="turtle image"
            draggable="false"
            className="w-[150px] md:w-[170px] h-full object-cover rounded-[10px] mr-4 md:mr-8"
          />
          <div className="flex flex-col">
            <div className="text-[24px] md:text-[26px] font-bold mb-2">
              꼬부기
            </div>
            <div className="text-gray-600 text-[18px] md:text-[21px]">
              수컷 | 18년 3월 2일생
            </div>
          </div>
        </div>
        <form
          onSubmit={submitHandle}
          className="text-[19px] md:text-[21px] flex flex-col gap-4"
        >
          <div className="flex xl:flex-row flex-col items-start xl:items-center gap-4">
            <div className="flex flex-row items-center w-full xl:w-[50%] ">
              <label className="w-[108px] md:w-[120px]">시작일</label>
              <input
                className="text-[19px] w-[270px] border-[1px] border-[#9B9B9B] focus:outline-none px-3 py-2 rounded-[10px]"
                type="datetime-local"
                name="start_time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            {/* <div className="flex flex-row items-center ml-[100px]">
              <label className="w-[108px] md:w-[120px]">종료일</label>
              <input
                className="text-[19px] border-[1px] border-[#9B9B9B] focus:outline-none px-3 py-2 rounded-[10px]"
                type="datetime-local"
                name="end_time"
                required
              />
            </div> */}
            <div className="flex flex-row items-center">
              <label className="w-[108px] md:w-[120px]">시작 가격</label>
              <input
                className="mr-1 w-[250px] text-[19px] border-[1px] border-[#9B9B9B] focus:outline-none px-3 py-2 rounded-[10px]"
                type="text"
                name="min_bid"
                value={minBid}
                onInput={handleInputChange}
                required
              />
              TURT
            </div>
          </div>

          <div className="flex flex-row items-center">
            <label className="w-[108px] md:w-[120px]">체중</label>
            <input
              className="mr-1 w-[250px] text-[19px] border-[1px] border-[#9B9B9B] focus:outline-none px-3 py-2 rounded-[10px]"
              type="number"
              name="weight"
              required
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/[^0-9]/g, "");
              }}
            />
            kg
          </div>
          {/* 제목은 30자 이내로만 입력 가능하게 하기 */}
          <div className="flex flex-row items-center">
            <label className="w-[108px] md:w-[120px]">제목</label>
            <input
              className="md:w-[540px] lg:w-[400px] xl:w-[540px] w-[270px] text-[19px] border-[1px] border-[#9B9B9B] focus:outline-none px-3 py-2 rounded-[10px]"
              type="text"
              name="title"
              onInput={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-row items-start">
            <label className="w-[108px] md:w-[120px]">상세 설명</label>
            <textarea
              rows={3}
              id="content"
              className="flex-grow text-[19px] border-[1px] border-[#9B9B9B] focus:outline-none px-3 py-2 rounded-[10px]"
            ></textarea>
          </div>
          <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row items-start justify-between">
            <div className="flex flex-col">
              <div className="flex flex-row items-center">
                <label>사진 추가</label>
                <p className="ml-3 text-[17px] text-gray-500">
                  *최대 3장만 가능합니다.
                </p>
              </div>
              <div className="flex flex-row mt-[10px]">
                {images.map((image, index) => (
                  <div key={index} className="relative mr-5">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      draggable="false"
                      className="w-[100px] h-[100px] object-cover rounded-[10px]"
                    />
                    <div className="absolute top-1 right-1 bg-[#D80000] rounded-full w-5 h-5 flex justify-center items-center">
                      <IoClose
                        className="w-6 h-6 cursor-pointer text-[#fff]"
                        onClick={() => handleRemoveImage(index)}
                      />
                    </div>
                  </div>
                ))}
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
              </div>
            </div>
            <div className="flex flex-col gap-3 items-start w-[35%] my-4 md:my-0 lg:my-4 xl:my-0">
              <label className="w-[120px]">태그</label>
              <div className="flex flex-row items-center space-x-2">
                <span className="text-[17px] w-[50px]">성별</span>
                <span
                  className={`whitespace-nowrap px-2 py-1 rounded-full cursor-pointer text-[17px] ${
                    selectedGender === "#암컷"
                      ? "bg-[#D5F0DD] text-[#065F46]"
                      : "bg-gray-300 text-gray-600"
                  }`}
                  onClick={() => handleGenderClick("#암컷")}
                >
                  #암컷
                </span>
                <span
                  className={`whitespace-nowrap px-2 py-1 rounded-full cursor-pointer text-[17px] ${
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
                    className={`whitespace-nowrap px-2 py-1 rounded-full cursor-pointer text-[17px] ${
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
            <button
              type="submit"
              className="text-white text-[20px] font-bold bg-black w-fit px-4 py-2 rounded-[10px]"
            >
              등록하기
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
