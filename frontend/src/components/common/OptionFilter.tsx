// 거래, 경매의 옵션 필터
// custom hook 의 useTradeFilter.tsx와 종속성이 있음, 수정 시 같이 수정 필요

import { ChangeEvent } from "react";

// 뭔가 빠진듯한 옵션 -> 경매 시작 전/ 경매중/유찰/낙찰 필터?
type FilterType = "gender" | "minWeight" | "maxWeight" | "minPrice" | "maxPrice";

function OptionFilter({
  filters,
  updateFilter,
  filterApplyHandle,
}: {
  filters: { gender: string; minWeight: string; maxWeight: string; minPrice: string; maxPrice: string };
  updateFilter: (filterType: FilterType, value: string) => void;
  filterApplyHandle: () => void;
})  {
  const formatNumberWithCommas = (value: string): string => {
    const numberValue = value.replace(/,/g, '');
    if (!isNaN(Number(numberValue)) && numberValue !== '') {
      return Number(numberValue).toLocaleString();
    }
    return '';
  };
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value = formatNumberWithCommas(e.target.value);
  };

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
          </div>
        </div>
        <div className="mb-4 flex flex-row items-center">
          <label className="block mb-2 font-bold text-lg w-[100px]">
              체중
            </label>
            <div className="flex space-x-4 items-center">
              <div>
                <input
                  value={filters.minWeight}
                  onChange={(e) => updateFilter("minWeight", e.target.value)}
                  className="mr-1 w-[180px] h-[38px] bg-[#f2f2f2] focus:outline-none rounded-[10px] p-1"
                  placeholder="최소 체중"
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.value = target.value.replace(/[^0-9]/g, '');
                  }}
                />
                <span>kg</span>
              </div>
              <span className="text-[22px]">~</span>
              <div>
                <input
                  value={filters.maxWeight}
                  
                  onChange={(e) => updateFilter("maxWeight", e.target.value)}
                  className="mr-1 w-[180px] h-[38px] bg-[#f2f2f2] focus:outline-none rounded-[10px] p-1"
                  placeholder="최대 체중"
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.value = target.value.replace(/[^0-9]/g, '');
                  }}
                />
                <span>kg</span>
              </div>
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
                className="w-[200px] h-[38px] bg-[#f2f2f2] focus:outline-none rounded-[10px] p-1"
                placeholder="최소 가격"
                onInput={handleInputChange}
              />
              <span className="text-[22px]">~</span>
              <input
                value={filters.maxPrice}
                onChange={(e) => updateFilter("maxPrice", e.target.value)}
                className="w-[200px] h-[38px] bg-[#f2f2f2] focus:outline-none rounded-[10px] p-1"
                placeholder="최대 가격"
                onInput={handleInputChange}
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
