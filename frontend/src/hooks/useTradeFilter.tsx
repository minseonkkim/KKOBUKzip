// useTradeFilter.tsx
import { useState } from "react";
type FilterType = "gender" | "minWeight" | "maxWeight" | "minPrice" | "maxPrice";

const useTradeFilter = () => {
  const [filters, setFilters] = useState({
    gender: "all",
    minWeight: "",
    maxWeight: "",
    minPrice: "",
    maxPrice: "",
  });

  const updateFilter = (filterType: FilterType, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  const filterResetHandle = () => {
    setFilters({
      gender: "all",
      minWeight: "",
      maxWeight: "",
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
