import { ChangeEvent } from "react";

type FilterType =
  | "gender"
  | "minWeight"
  | "maxWeight"
  | "minPrice"
  | "maxPrice";

function OptionFilter({
  filters,
  updateFilter,
  filterApplyHandle,
}: {
  filters: {
    gender: string;
    minWeight: string;
    maxWeight: string;
    minPrice: string;
    maxPrice: string;
  };
  updateFilter: (filterType: FilterType, value: string) => void;
  filterApplyHandle: () => void;
}) {
  const formatNumberWithCommas = (value: string): string => {
    const numberValue = value.replace(/,/g, "");
    if (!isNaN(Number(numberValue)) && numberValue !== "") {
      return Number(numberValue).toLocaleString();
    }
    return "";
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value = formatNumberWithCommas(e.target.value);
  };

  const handleFilterApply = () => {
    const minWeight = Number(filters.minWeight);
    const maxWeight = Number(filters.maxWeight);
    const minPrice = Number(filters.minPrice.replace(/,/g, ""));
    const maxPrice = Number(filters.maxPrice.replace(/,/g, ""));

    if (minWeight > maxWeight) {
      alert("최소 체중은 최대 체중보다 클 수 없습니다.");
      return;
    }

    if (minPrice > maxPrice) {
      alert("최소 가격은 최대 가격보다 클 수 없습니다.");
      return;
    }

    filterApplyHandle();
  };

  return (
    <>
      <style>{`
        .custom-checkbox {
          cursor: pointer;
          position: relative;
          padding-left: 30px;
          font-size: 16px;
        }

        .custom-checkbox input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }

        .checkbox-mark {
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 20px;
          width: 20px;
          background-color: #eee;
          border-radius: 50%;
          transition: background-color 0.3s, border-color 0.3s;
        }

        .custom-checkbox input:checked ~ .checkbox-mark {
          background-color: #4b721f;
          border-color: #4b721f;
        }

        .checkbox-mark:after {
          content: "";
          position: absolute;
          display: none;
        }

        .custom-checkbox input:checked ~ .checkbox-mark:after {
          display: block;
        }

        .custom-checkbox .checkbox-mark:after {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
        }
      `}</style>
      <div className="border-[2px] border-[#DADADA] rounded-[20px] px-6 py-4 mb-4 transition-all ease-in-out duration-300">
        <div className="mb-4 flex flex-row items-center">
          <label className="block font-bold text-lg w-[60px] md:w-[100px]">
            성별
          </label>
          <div className="flex space-x-3">
            <label className="custom-checkbox">
              <input
                type="radio"
                name="gender"
                value=""
                checked={filters.gender === ""}
                onChange={(e) => updateFilter("gender", e.target.value)}
              />
              <span className="checkbox-mark"></span>
              전체
            </label>
            <label className="custom-checkbox">
              <input
                type="radio"
                name="gender"
                value="FEMALE"
                checked={filters.gender === "FEMALE"}
                onChange={(e) => updateFilter("gender", e.target.value)}
              />
              <span className="checkbox-mark"></span>
              암컷
            </label>
            <label className="custom-checkbox">
              <input
                type="radio"
                name="gender"
                value="MALE"
                checked={filters.gender === "MALE"}
                onChange={(e) => updateFilter("gender", e.target.value)}
              />
              <span className="checkbox-mark"></span>
              수컷
            </label>
          </div>
        </div>
        <div className="mb-4 flex flex-row items-center">
          <label className="block font-bold text-lg w-[60px] md:w-[100px]">
            체중
          </label>
          <div className="flex space-x-4 items-center">
            <div>
              <input
                value={filters.minWeight}
                onChange={(e) => updateFilter("minWeight", e.target.value)}
                className="mr-1 w-[90px] md:w-[180px] h-[38px] bg-[#f2f2f2] focus:outline-none rounded-[10px] p-1"
                placeholder="최소 체중"
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/[^0-9]/g, "");
                }}
              />
              <span>kg</span>
            </div>
            <span className="text-[22px]">~</span>
            <div>
              <input
                value={filters.maxWeight}
                onChange={(e) => updateFilter("maxWeight", e.target.value)}
                className="mr-1 w-[90px] md:w-[180px] h-[38px] bg-[#f2f2f2] focus:outline-none rounded-[10px] p-1"
                placeholder="최대 체중"
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/[^0-9]/g, "");
                }}
              />
              <span>kg</span>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-center">
            <label className="block font-bold text-lg w-[60px] md:w-[100px]">
              가격
            </label>
            <div className="flex space-x-4 items-center">
              <input
                value={filters.minPrice}
                onChange={(e) => updateFilter("minPrice", e.target.value)}
                className="w-[90px] md:w-[200px] h-[38px] bg-[#f2f2f2] focus:outline-none rounded-[10px] p-1"
                placeholder="최소 가격"
                onInput={handleInputChange}
              />
              <span className="text-[22px]">~</span>
              <input
                value={filters.maxPrice}
                onChange={(e) => updateFilter("maxPrice", e.target.value)}
                className="w-[90px] md:w-[200px] h-[38px] bg-[#f2f2f2] focus:outline-none rounded-[10px] p-1"
                placeholder="최대 가격"
                onInput={handleInputChange}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleFilterApply}
            className="bg-[#4B721F] rounded-[5px] px-3 py-1 text-white font-bold whitespace-nowrap"
          >
            검색
          </button>
        </div>
      </div>
    </>
  );
}

export default OptionFilter;