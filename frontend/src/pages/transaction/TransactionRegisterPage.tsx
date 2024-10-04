import { Helmet } from "react-helmet-async";
import Header from "../../components/common/Header";
import TmpTurtleImg from "../../assets/tmp_turtle.jpg";
import { IoClose } from "@react-icons/all-files/io5/IoClose";
import { IoMdAddCircle } from "@react-icons/all-files/io/IoMdAddCircle";
import { ChangeEvent, useState } from "react";
import { addTransactionItem } from "../../apis/tradeApi";
import formatDate from "../../utils/formatDate";
import { useWeb3Store } from "../../store/useWeb3Store";

// import { account } from "../../store/useWeb3Store";

const turtleData = {
  id: 1,
  name: "꼬집이",
  scientificName: "페닐슐라쿠터 ",
  gender: "MALE", // 암컷 : w , 수컷 : m
  weight: 10,
  birth: "2024-09-03 01:01:01",
  dead: false,
  imageAddress: "http://dkfdsfsd",
};

export default function TransactionRegisterPage() {
  const [images, setImages] = useState<File[]>([]);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { account } = useWeb3Store();

  const [transactionData, setTransactionData] = useState({
    weight: "",
    title: "",
    content: "",
  });
  const [price, setPrice] = useState("");
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
    const numberValue = value.replace(/,/g, "");
    if (!isNaN(Number(numberValue)) && numberValue !== "") {
      return Number(numberValue).toLocaleString();
    }
    return "";
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value = formatNumberWithCommas(e.target.value);
    setPrice(e.target.value);
  };

  const changeHandle = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTransactionData({ ...transactionData, [name]: value });
  };
  const submitHandle = async (e: React.FormEvent<HTMLFormElement>) => {
    alert("submit");
    e.preventDefault();
    console.log(transactionData);
    console.log(price);
    console.log(images);
    console.log(selectedGender);
    console.log(selectedSize);
    console.log(turtleData);

    const formData = new FormData();

    const newTransactionData = {
      title: transactionData.title,
      content: transactionData.content,
      price: price,
      turtleId: 1,
      sellerAddress: account,
      transactionTags: [selectedGender, selectedSize],
    };
    const blob = new Blob([JSON.stringify(newTransactionData)], {
      type: "application/json",
    });

    formData.append("data", blob);
    images.forEach((image) => {
      formData.append(`transactionPhotos`, image);
    });

    try {
      const response = await addTransactionItem(formData);
      console.log("Transaction added successfully:", response);
      // 성공 처리 (예: 사용자에게 성공 메시지 표시, 페이지 리디렉션 등)
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("새로운 거래 생성에 실패했습니다. 다시 시도해 주세요.");
    }
  };
  const gender = {
    MALE: "수컷",
    FEMALE: "암컷",
    NONE: "미분류",
  };
  return (
    <>
      <Helmet>
        <title>판매 등록하기</title>
      </Helmet>
      <Header />
      <div className="px-4 lg:px-[250px] mt-[72px]">
        <div className="text-[28px] md:text-[33px] text-gray-900 font-dnf-bitbit mr-3 pt-0 lg:pt-[32px] pb-[13px]">
          판매 등록하기
        </div>
        <div className="rounded-[10px] p-[13px] bg-[#F2F2F2] h-[150px] flex flex-row items-center mb-[25px]">
          <img
            src={TmpTurtleImg}
            draggable="false"
            className="w-[150px] md:w-[170px] h-full object-cover rounded-[10px] mr-4 md:mr-8"
            alt="turtle image"
          />
          <div className="flex flex-col">
            <div className="text-[24px] md:text-[26px] font-bold mb-2">
              {turtleData.name}
            </div>
            <div className="text-gray-600 text-[18px] md:text-[21px]">
              {gender[turtleData.gender as "MALE" | "FEMALE" | "NONE"]} |{" "}
              {formatDate(turtleData.birth)}생
            </div>
          </div>
        </div>
        <form
          onSubmit={submitHandle}
          className="text-[19px] md:text-[21px] flex flex-col gap-4"
        >
          <div className="flex flex-row items-center">
            <label className="w-[108px] md:w-[120px]">판매가</label>
            <input
              className="mr-1 w-[250px] text-[19px] border-[1px] border-[#9B9B9B] focus:outline-none px-3 py-2 rounded-[10px]"
              type="text"
              name="bid"
              onInput={handleInputChange}
              value={price}
              placeholder="판매가를 입력해주세요"
              maxLength={15}
              required
            />
            TURT
          </div>
          <div className="flex flex-row items-center">
            <label className="w-[108px] md:w-[120px]">체중</label>
            <input
              className="mr-1 w-[250px] text-[19px] border-[1px] border-[#9B9B9B] focus:outline-none px-3 py-2 rounded-[10px]"
              type="number"
              name="weight"
              required
              value={transactionData.weight}
              placeholder="체중을 입력해주세요"
              maxLength={8}
              pattern="[0-9]*"
              onChange={changeHandle}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/[^0-9]/g, "");
              }}
            />
            g
          </div>

          {/* 제목 30자 이내로만 입력할 수 있게 하기 */}
          <div className="flex flex-row items-center">
            <label className="w-[108px] md:w-[120px]">제목</label>
            <input
              className="md:w-[540px] w-[270px] text-[19px] border-[1px] border-[#9B9B9B] focus:outline-none px-3 py-2 rounded-[10px]"
              type="text"
              onChange={changeHandle}
              name="title"
              maxLength={30}
              placeholder="제목을 입력해주세요"
              value={transactionData.title}
              required
            />
          </div>
          <div className="flex flex-row items-start">
            <label className="w-[108px] md:w-[120px]">상세 설명</label>
            <textarea
              onChange={changeHandle}
              name="content"
              value={transactionData.content}
              placeholder="상세 설명을 입력해주세요"
              rows={3}
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
                      <IoClose
                        className="w-6 h-6 cursor-pointer text-[#fff]"
                        onClick={() => handleRemoveImage(index)}
                      />
                    </div>
                  </div>
                ))}
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
                <span
                  className={`whitespace-nowrap px-2 py-1 rounded-full cursor-pointer text-[17px] ${
                    selectedGender === "#미분류"
                      ? "bg-[#D5F0DD] text-[#065F46]"
                      : "bg-gray-300 text-gray-600"
                  }`}
                  onClick={() => handleGenderClick("#미분류")}
                >
                  #미분류
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
      </div>
    </>
  );
}
