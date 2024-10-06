import { useNavigate } from "react-router-dom";
import TransactionStatusTag from "./TransactionStatusTag";
import { TransactionItemDataType } from "../../types/transaction";

export default function TransactionTurtle({
  item,
}: {
  item: TransactionItemDataType;
}) {
  const navigate = useNavigate();

  const goToDetail = () => {
    navigate("/transaction-detail/" + item.transactionId);
  };

  return (
    <>
      <div
        onClick={goToDetail}
        className="bg-[#F8F9FA] shadow-lg transition-shadow duration-300 w-full max-w-sm h-[310px] rounded-2xl flex flex-col cursor-pointer active:scale-95 relative"
      >
        <div className="overflow-hidden rounded-t-2xl relative">
          <img
            src={item.transactionImage[0]}
            className={`w-full h-[200px] object-cover transition-transform duration-300 hover:scale-110 ${
              item.progress !== "SAIL" ? "filter brightness-50" : ""
            }`}
            draggable="false"
            alt="turtle image"
          />
        </div>
        <div className="absolute top-4 right-4">
          <TransactionStatusTag
            progress={item.progress === "SAIL" ? "거래가능" : "거래완료"}
          />
        </div>
        <div className="px-3 py-2">
          <div className="w-full overflow-hidden text-[20px] mb-2 text-gray-900 whitespace-nowrap text-ellipsis">
            {item.title}
          </div>

          <div className="flex flex-row flex-wrap justify-between items-center mb-1">
            <div className="text-[15px] xl:text-[17px] whitespace-normal text-[#9A9A9A]">
              {item.scientificName}
            </div>
            <div className="text-[14px] text-gray-700 flex flex-wrap space-x-1">
              {item.transactionTag.map((tag, index) => (
                <span
                  key={index}
                  className="whitespace-nowrap bg-[#D5F0DD] text-[#065F46] px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="font-bold flex flex-row items-end font-stardust text-[#4B721F]">
            <div className="text-[28px] md:text-[32px]">
              {Math.floor(item.price).toLocaleString()} 
            </div>
            <div className="text-[18px] md:text-[22px]">TURT</div>
          </div>
        </div>
      </div>
    </>
  );
}
