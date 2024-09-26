import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function AuctionItemInfoSkeleton() {
  return (
    <div className="w-[48%] h-[360px] rounded-[20px] relative bg-gray-200 animate-pulse">
      <Skeleton className="w-full h-full object-cover rounded-[20px]" />
      <button className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400 text-[27px] p-2 rounded-full font-bold cursor-not-allowed">
        &lt;
      </button>
      <button className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 text-[27px] p-2 rounded-full font-bold cursor-not-allowed">
        &gt;
      </button>
      <div className="absolute bottom-3 right-3 bg-gray-300 text-gray-600 px-4 py-2 rounded-[20px]">
        <Skeleton className="w-12 h-6" />
      </div>
      <div className="flex flex-row justify-between items-center mt-[15px] mb-[7px]">
        <Skeleton className="w-36 h-6" />
        <div className="flex flex-row space-x-2">
          <Skeleton className="px-2 py-1 rounded-full w-20 h-6" />
          <Skeleton className="px-2 py-1 rounded-full w-20 h-6" />
        </div>
      </div>
      <div className="mb-[13px] text-gray-400 text-[17px]">
        <Skeleton className="w-36 h-6" />
      </div>
      <div className="text-[17px] leading-7 border-[2px] rounded-[10px] p-2 line-clamp">
        <Skeleton className="w-full h-20" />
      </div>
      <div className="mt-[20px] mb-[3px] text-gray-600 font-bold">
        <Skeleton className="w-32 h-6" />
      </div>
      <div className="bg-gray-300 h-[60px] rounded-[10px] flex flex-row justify-between items-center px-2 py-1">
        <div className="flex flex-row items-center">
          <Skeleton className="rounded-full w-[43px] h-[43px] mr-3" />
          <Skeleton className="w-20 h-6" />
        </div>
        <div className="cursor-not-allowed bg-gray-400 h-fit flex justify-center items-center rounded-[10px] font-bold px-3 py-2 text-gray-200">
          <Skeleton className="w-24 h-6" />
        </div>
      </div>
    </div>
  );
}

export default AuctionItemInfoSkeleton;
