import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // 스타일 import

const TransactionDetailSkeleton = () => {
  return (
    <>
      {/* Left Side (Turtle Image and Details) */}
      <div className="flex flex-col w-full md:w-[48%] rounded-[20px] relative">
        <div className="relative w-full flex-grow md:flex-1 h-[240px] md:h-auto rounded-[20px] overflow-hidden">
          <Skeleton height="100%" />
        </div>
        <div className="text-[23px] mt-[13px]">
          <Skeleton height={30} />
        </div>
        <div className="flex flex-row justify-between lg:justify-start xl:justify-between items-center mt-[10px] mb-[10px]">
          <div className="text-[#9A9A9A] text-[18px]">
            <Skeleton width={150} />
          </div>
          <div className="flex flex-row space-x-2">
            <Skeleton width={60} height={30} />
            <Skeleton width={60} height={30} />
          </div>
        </div>
        <div className="text-[17px] leading-7 border-[2px] rounded-[10px] p-2 line-clamp">
          <Skeleton count={4} />
        </div>
        <div className="mt-[20px] mb-[3px] text-[#737373] font-bold">
          <Skeleton width={100} />
        </div>
        <div className="bg-[#F2F2F2] h-[60px] rounded-[10px] flex flex-row justify-between items-center px-2 py-1">
          <div className="flex flex-row items-center">
            <Skeleton circle={true} height={43} width={43} />
            <Skeleton height={30} width={150} />
          </div>
          <Skeleton height={40} width={100} />
        </div>
      </div>

      {/* Right Side (Price and Action) */}
      <div className="my-5 mb-10 md:my-0 md:mb-0 w-full md:w-[48%] h-[130px] md:h-[675px] bg-[#f4f4f4] rounded-[20px] flex flex-col justify-start items-center">
      <div className="w-full px-[20px] md:px-[40px] h-full flex justify-center items-center mt-3 md:mt-0">
        <div className="w-full flex flex-row md:flex-col justify-between items-center mb-4">
          <div className="whitespace-nowrap flex flex-row md:flex-col xl:flex-row items-center">
            <div className="font-bold text-[20px] md:text-[25px]">
              <Skeleton width={100} />
            </div>
            <div className="font-bold flex flex-row items-end font-stardust text-[#4B721F]">
              <Skeleton width={150} height={40} />
            </div>
          </div>

          <Skeleton width={150} height={50} className="mt-0 md:mt-5" />
        </div>
      </div>
    </div>
    </>
  );
};

export default TransactionDetailSkeleton;
