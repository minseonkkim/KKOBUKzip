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
        className="bg-[#F8F9FA] shadow-lg transition-shadow duration-300 w-full max-w-sm h-[310px] rounded-2xl flex flex-col cursor-pointer active:scale-95 relative">
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
        <div className="px-3 py-2">
          <div className="w-full overflow-hidden text-[20px] mb-4 text-gray-900 whitespace-nowrap text-ellipsis">거북이 팔아용 거북이 팔아용 거북이 팔아용 거북이 팔아용</div>

          <div className="flex justify-between items-center">
            <div className="text-[15px] xl:text-[17px] whitespace-nowrap text-[#9A9A9A]">{scientific_name}</div>
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
          <div className="whitespace-nowrap font-extrabold text-[28px] text-[#4B721F] font-stardust">
            {price.toLocaleString("ko-KR")}원
          </div>
        </div>
      </div>
    </>
  );
}
