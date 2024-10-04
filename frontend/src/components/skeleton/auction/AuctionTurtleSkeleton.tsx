// infinity scroll 용도의 스켈레톤 디자인


export default function AuctionTurtleSkeleton() {
  return (
    <div>
      <div className="bg-[#F8F9FA] shadow-lg transition-shadow duration-300 w-full max-w-sm h-[300px] rounded-2xl flex flex-col cursor-pointer relative">
        <div className="overflow-hidden rounded-t-2xl relative">
          <div className="bg-gray-300 w-full h-[200px] object-cover transition-transform duration-300 hover:scale-110"></div>
        </div>
        <div className="absolute top-4 right-4">
          <div className="bg-gray-200 rounded-full h-6 w-16"></div>
        </div>
        <div className="px-3 py-2">
          <div className="bg-gray-200 h-6 w-full mb-4 rounded"></div>

          <div className="flex justify-between items-center">
            <div className="bg-gray-200 h-4 w-24 rounded"></div>
            <div className="flex space-x-1.5">
              <span className="bg-gray-200 h-6 w-10 rounded-full"></span>
              <span className="bg-gray-200 h-6 w-10 rounded-full"></span>
            </div>
          </div>
          <div className="bg-gray-200 h-8 w-32 mt-2 rounded"></div>
        </div>
      </div>
    </div>
  );
}

