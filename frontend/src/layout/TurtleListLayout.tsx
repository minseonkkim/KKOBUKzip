import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../components/common/Header";
import { GrPowerReset } from "@react-icons/all-files/gr/GrPowerReset";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { IoIosSearch } from "@react-icons/all-files/io/IoIosSearch";
import { IoFilterOutline } from "@react-icons/all-files/io5/IoFilterOutline";
import { useInView } from "react-intersection-observer";
import useTradeFilter from "../hooks/useTradeFilter";
import AuctionTurtleSkeleton from "../components/skeleton/auction/AuctionTurtleSkeleton";
import OptionFilter from "../components/common/OptionFilter";
import NoImage from "../assets/no_image.webp";

interface TurtleListLayoutProps {
  title: string;
  items: JSX.Element[];
  fetchData: (
    page: number,
    filters: object,
    isSearch?: boolean
  ) => Promise<any>;
  isProgressItemChecked: boolean;
  setIsProgressItemChecked: () => void;
  resetFilters: () => void;
}

const TurtleListLayout: React.FC<TurtleListLayoutProps> = ({
  title,
  items,
  fetchData,
  isProgressItemChecked,
  setIsProgressItemChecked,
  resetFilters,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [itemLoading, setItemLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [pages, setPages] = useState(0);
  const [maxPage, setMaxPage] = useState(-1);
  const [selectedFiltersText, setSelectedFiltersText] = useState("필터");

  const [ref, inView] = useInView({ threshold: 1 });
  const { filters, filterResetHandle, updateFilter } = useTradeFilter();

  const resetFilterState = () => {
    updateFilter("gender", "");
    updateFilter("minWeight", "");
    updateFilter("maxWeight", "");
    updateFilter("minPrice", "");
    updateFilter("maxPrice", "");
  };

  useEffect(() => {
    const getData = async () => {
      setItemLoading(true);
      try {
        const response = await fetchData(pages, filters);
        if (response?.status == 200) {
          setMaxPage(response.data.data.data.total_pages);
        }
        setPages(1);
      } finally {
        setItemLoading(false);
        setInitialLoad(false);
      }
    };
    getData();
  }, [fetchData]);

  const loadMore = async () => {
    if (itemLoading || pages >= maxPage) return;
    setItemLoading(true);
    try {
      const response = await fetchData(pages, filters);

      if (response.success) {
        setMaxPage(response.data.data.data.total_pages - 1);
        setPages((prev) => prev + 1);
      }
    } finally {
      setItemLoading(false);
    }
  };

  useEffect(() => {
    if (inView) loadMore();
  }, [inView]);

  const toggleFilterDiv = () => {
    if (isFilterOpen) {
      // 필터를 닫을 때 필터 초기화
      filterResetHandle();
    } else {
      // 필터를 다시 열 때 필터 초기화
      resetFilterState();
    }
    setIsFilterOpen(!isFilterOpen);
  };

  const searchHandle = async () => {
    setPages(0);
    await fetchData(0, filters, true);
    setIsFilterOpen(false);
    updateSelectedFiltersText();
  };

  const updateSelectedFiltersText = () => {
    const filterTexts: string[] = [];
    if (filters.gender)
      filterTexts.push(filters.gender === "FEMALE" ? "암컷" : "수컷");
    if (filters.minWeight && filters.maxWeight)
      filterTexts.push(`${filters.minWeight}~${filters.maxWeight}g`);
    if (filters.minPrice && filters.maxPrice)
      filterTexts.push(`${filters.minPrice}~${filters.maxPrice}TURT`);

    setSelectedFiltersText(
      filterTexts.length > 0 ? filterTexts.join(", ") : "필터"
    );
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <Header />
      <main className="h-screen flex flex-col pt-[85px] px-4 lg:px-[250px]">
        <div className="flex flex-col md:flex-row items-center justify-between pt-0 lg:pt-[18px] pb-[5px] lg:pb-[13px]">
          <div className="whitespace-nowrap text-[28px] md:text-[33px] text-gray-900 font-dnf-bitbit mr-3 mb-2 md:mb-0">
            {title}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <div className="text-[18px] md:text-[23px] font-bold flex items-center mb-2 md:mb-0">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="hidden"
                readOnly
                onClick={() => setIsProgressItemChecked()}
                checked={isProgressItemChecked}
              />
              <div
                className={`w-5 h-5 md:w-6 md:h-6 border-2 border-gray-500 rounded-[5px] p-1 mr-2 cursor-pointer flex justify-center items-center ${
                  isProgressItemChecked ? "bg-[#FFD9D9]" : "bg-[#fff]"
                }`}
              >
                {isProgressItemChecked && <FaCheck />}
              </div>
              <span className="cursor-pointer whitespace-nowrap text-[20px] md:text-[18px] xl:text-[21px]">
                {title.includes("판매") ? "거래가능한" : "경매중인"} 거북이만
                보기
              </span>
            </label>
          </div>

          <div className="flex flex-row items-center space-x-3">
            <div
              className={`flex justify-center items-center border-[2px] rounded-[30px] px-3 h-[42px] cursor-pointer hover:text-[#4B721F] hover:border-[#4B721F] ${
                selectedFiltersText !== "필터"
                  ? "text-[#4B721F] bg-[#E0F3C9] border-[#4B721F]"
                  : "border-[#DADADA]"
              }`}
              onClick={toggleFilterDiv}
            >
              <IoFilterOutline
                className={`text-[18px] md:text-[22px] mr-2 ${
                  selectedFiltersText !== "필터"
                    ? "text-[#4B721F] font-bold"
                    : ""
                }`}
              />
              <span className="text-[16px] md:text-[18px]">
                {selectedFiltersText}
              </span>
            </div>
            <div
              onClick={async () => {
                resetFilters();
                await fetchData(0, {}, true);
                setIsFilterOpen(false);
                setSelectedFiltersText("필터");
              }}
              className="flex justify-center items-center border-[2px] border-[#DADADA] rounded-[360px] w-[38px] md:w-[42px] h-[38px] md:h-[42px] cursor-pointer font-bold hover:text-[#4B721F] hover:border-[#4B721F]"
            >
              <GrPowerReset className="text-[18px] md:text-[20px] " />
            </div>
          </div>
        </div>

        <div
          className={`transition-all duration-300 ease-in-out transform  ${
            isFilterOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          {isFilterOpen && (
            <OptionFilter
              filterApplyHandle={searchHandle}
              filters={filters}
              updateFilter={updateFilter}
            />
          )}
        </div>

        {itemLoading ? (
          <div className="md:mx-0 mx-auto grid flex-1 overflow-y-auto grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-[30px] mt-[10px]">
            {Array(6)
              .fill(null)
              .map((_, index) => (
                <AuctionTurtleSkeleton key={index} />
              ))}
          </div>
        ) : items.length === 0 ? (
          <div className="w-full h-auto flex flex-col items-center justify-center space-y-5 bg-[#f4f4f4] rounded-[20px] py-20">
            <img
              src={NoImage}
              className="w-[220px] h-[220px] object-cover"
              draggable="false"
              alt="turtle image"
            />
            <div className="text-[28px] font-bold font-stardust">
              거북이가 없어요
            </div>
          </div>
        ) : (
          <div className="md:mx-0 mx-auto grid flex-1 overflow-y-auto grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-[30px] mt-[10px]">
            {items}
          </div>
        )}
      </main>
    </>
  );
};

export default TurtleListLayout;
