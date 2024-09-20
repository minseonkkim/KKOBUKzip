// 거래, 경매의 옵션 필터
// custom hook 의 useTradeFilter.tsx와 종속성이 있음, 수정 시 같이 수정 필요
// 뭔가 빠진듯한 옵션 -> 경매 시작 전/ 경매중/유찰/낙찰 필터?
type FilterType = "gender" | "size" | "minPrice" | "maxPrice";

function OptionFilter({
  filters,
  updateFilter,
  filterApplyHandle,
}: {
  filters: { gender: string; size: string; minPrice: string; maxPrice: string };
  updateFilter: (filterType: FilterType, value: string) => void;
  filterApplyHandle: () => void;
}) {
  return (
    <>
      <div className="border-[2px] border-[#DADADA] rounded-[20px] px-6 py-4 mb-4 transition-all ease-in-out duration-300">
        <div className="mb-4 flex flex-row items-center">
          <label className="block mb-2 font-bold text-lg w-[100px]">성별</label>
          <div className="flex space-x-3">
            <label className="custom-radio">
              <input
                type="radio"
                name="gender"
                value="all"
                checked={filters.gender === "all"}
                onChange={(e) => updateFilter("gender", e.target.value)}
              />
              <span className="radio-mark"></span>
              전체
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={filters.gender === "male"}
                onChange={(e) => updateFilter("gender", e.target.value)}
              />
              <span className="radio-mark"></span>
              암컷
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={filters.gender === "female"}
                onChange={(e) => updateFilter("gender", e.target.value)}
              />
              <span className="radio-mark"></span>
              수컷
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                name="gender"
                value="undifferentiated"
                checked={filters.gender === "undifferentiated"}
                onChange={(e) => updateFilter("gender", e.target.value)}
              />
              <span className="radio-mark"></span>
              미구분
            </label>
          </div>
        </div>
        <div className="mb-4 flex flex-row items-center">
          <label className="block mb-2 font-bold text-lg w-[100px]">크기</label>
          <div className="flex space-x-4">
            <label className="custom-radio">
              <input
                type="radio"
                name="size"
                value="all"
                checked={filters.size === "all"}
                onChange={(e) => updateFilter("size", e.target.value)}
              />
              <span className="radio-mark"></span>
              전체
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                name="size"
                value="baby"
                checked={filters.size === "baby"}
                onChange={(e) => updateFilter("size", e.target.value)}
              />
              <span className="radio-mark"></span>
              베이비
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                name="size"
                value="subadult"
                checked={filters.size === "subadult"}
                onChange={(e) => updateFilter("size", e.target.value)}
              />
              <span className="radio-mark"></span>
              아성체
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                name="size"
                value="adult"
                checked={filters.size === "adult"}
                onChange={(e) => updateFilter("size", e.target.value)}
              />
              <span className="radio-mark"></span>
              성체
            </label>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-center">
            <label className="block mb-2 font-bold text-lg w-[100px]">
              가격
            </label>
            <div className="flex space-x-4 items-center">
              <input
                value={filters.minPrice}
                onChange={(e) => updateFilter("minPrice", e.target.value)}
                className="w-[180px] h-[38px] bg-[#f2f2f2] focus:outline-none rounded-[10px] p-1"
                placeholder="최소 가격"
              />
              <span className="text-[22px]">~</span>
              <input
                value={filters.maxPrice}
                onChange={(e) => updateFilter("maxPrice", e.target.value)}
                className="w-[180px] h-[38px] bg-[#f2f2f2] focus:outline-none rounded-[10px] p-1"
                placeholder="최대 가격"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={filterApplyHandle}
            className="bg-[#4B721F] rounded-[5px] px-3 py-1 text-white font-bold"
          >
            검색
          </button>
        </div>
      </div>
    </>
  );
}

export default OptionFilter;
