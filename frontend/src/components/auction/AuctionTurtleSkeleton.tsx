// infinity scroll 용도의 스켈레톤 디자인

export default function AuctionTurtleSkeleton() {
  return (
    <>
      <div className="bg-[#F8F9FA] shadow-lg w-full max-w-sm h-[330px] rounded-2xl flex flex-col cursor-default relative animate-pulse">
        <div className="absolute top-4 right-4 z-10">
          {/* Skeleton status tag */}
          <div className="w-16 h-6 bg-gray-300 rounded-full"></div>
        </div>

        <div className="overflow-hidden rounded-t-2xl relative">
          {/* Skeleton image */}
          <div className="w-full h-[200px] bg-gray-300"></div>
        </div>

        <div className="px-4 py-2">
          <div className="flex justify-between items-center mb-2">
            {/* Skeleton title */}
            <div className="w-32 h-6 bg-gray-300 rounded-md"></div>
            {/* Skeleton tag */}
            <div className="w-16 h-6 bg-gray-300 rounded-full"></div>
          </div>

          <div className="flex flex-col">
            {/* Skeleton price */}
            <div className="w-24 h-8 bg-gray-300 rounded-md my-1"></div>
          </div>

          {/* Skeleton time */}
          <div className="w-36 h-4 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    </>
  );
}
