import { useNavigate } from "react-router-dom";
import TransactionStatusTag from "./TransactionStatusTag";

interface TransactionTurtleProps {
  scientific_name: string;
  price: number;
  transaction_tag: string[];
  transaction_image: string;
  progress: string;
}

export default function TransactionTurtle({
  scientific_name,
  price,
  transaction_image,
  transaction_tag,
  progress,
}: TransactionTurtleProps) {
  const navigate = useNavigate();

  const goToDetail = () => {
    navigate("/transaction-detail");
  };

  return (
    <>
      <div onClick={goToDetail}
        className="bg-[#F8F9FA] shadow-lg transition-shadow duration-300 w-full max-w-sm h-[300px] rounded-2xl flex flex-col cursor-pointer active:scale-95 relative">
        <div className="overflow-hidden rounded-t-2xl relative">
          <img
            src={transaction_image}
            className={`w-full h-[200px] object-cover transition-transform duration-300 hover:scale-110 ${
              progress !== "거래가능" ? "filter brightness-50" : ""
            }`}
            draggable="false"
            alt="거북이 이미지"
          />
        </div>
        <div className="absolute top-4 right-4">
          <TransactionStatusTag progress={progress} />
        </div>
        <div className="px-3 py-1">
          <div className="flex justify-between items-center my-2">
            <div className="text-[16px] xl:text-[17px] font-semibold whitespace-nowrap">{scientific_name}</div>
            <div className="text-[15px] text-gray-700 flex space-x-1.5">
              {transaction_tag.map((tag, index) => (
                <span
                  key={index}
                  className="whitespace-nowrap bg-[#D5F0DD] text-[#065F46] px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          <div className="whitespace-nowrap font-extrabold text-3xl text-[#4B721F] mt-1 font-stardust">
            {price.toLocaleString("ko-KR")}원
          </div>
        </div>
      </div>
    </>
  );
}
