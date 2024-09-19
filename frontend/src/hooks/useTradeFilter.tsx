import { useState } from "react";

type FilterType = "gender" | "size" | "minPrice" | "maxPrice";

// 해당 hook는 필터의 상태만 관리, 검색 등은 외부에서 할 것
// OptionFilter와 종속성이 있어서 수정 시에 걑애 수정 필요
const useTradeFilter = () => {
  const [filters, setFilters] = useState({
    gender: "all",
    size: "all",
    minPrice: "",
    maxPrice: "",
  });

  //   Update the selected filter
  const updateFilter = (filterType: FilterType, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  const filterResetHandle = () => {
    setFilters({
      gender: "all",
      size: "all",
      minPrice: "",
      maxPrice: "",
    });
  };
  return {
    filters,
    updateFilter,
    filterResetHandle,
  };
};

export default useTradeFilter;
