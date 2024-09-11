import TmpTurtle from "../../assets/tmp_turtle.jpg";
import TransactionStatusTag from "./TransactionStatusTag";

export default function TransactionTurtle() {
  return (
    <>
      <div className="bg-[#F8F9FA] shadow-lg transition-shadow duration-300 w-full max-w-sm h-[300px] rounded-2xl flex flex-col cursor-pointer active:scale-95 relative">
        <div className="absolute top-4 right-4 z-10">
          <TransactionStatusTag progress={"거래가능"} />
        </div>

        <div className="overflow-hidden rounded-t-2xl relative">
          <img
            src={TmpTurtle}
            className="w-full h-[200px] object-cover transition-transform duration-300 hover:scale-110"
            draggable="false"
            alt="거북이 이미지"
          />
        </div>
        <div className="px-4 py-1">
          <div className="flex justify-between items-center my-2">
            <h3 className="text-xl font-semibold">페닐슐라쿠터</h3>
            <div className="text-[16px] text-gray-700">
              <span className="bg-[#D5F0DD] text-[#065F46] px-2 py-1 rounded-full">#태그</span>
            </div>
          </div>
          <div className="font-extrabold text-3xl text-[#4B721F] mt-1">
            3,000,000원
          </div>
        </div>
      </div>
    </>
  );
}
