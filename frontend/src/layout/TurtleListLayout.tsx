// TurtleListLayout.tsx
import { Helmet } from "react-helmet-async";
import Header from "../components/common/Header";
import { GrPowerReset } from "@react-icons/all-files/gr/GrPowerReset";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { IoIosSearch } from "@react-icons/all-files/io/IoIosSearch";
import { IoFilterOutline } from "@react-icons/all-files/io5/IoFilterOutline";
import { useEffect, useState } from "react";
import OptionFilter from "../components/common/OptionFilter";
import { useInView } from "react-intersection-observer";
import useTradeFilter from "../hooks/useTradeFilter";
import AuctionTurtleSkeleton from "../components/auction/skeleton/AuctionTurtleSkeleton";

interface TurtleListLayoutProps {
  title: string;
  items: JSX.Element[];
  fetchData: (page: number, filters: object) => Promise<any>;
  // skeletonComponent?: JSX.Element;
}

const TurtleListLayout: React.FC<TurtleListLayoutProps> = ({
  title,
  items,
  fetchData,
  // skeletonComponent,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [itemLoading, setItemLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [pages, setPages] = useState(0); // next page, 0부터~
  const [maxPage, setMaxPage] = useState(-1);

  const [ref, inView] = useInView({ threshold: 1 });
  const { filters, filterResetHandle, updateFilter } = useTradeFilter();

  useEffect(() => {
    const getData = async () => {
      setItemLoading(true);
      try {
        const response = await fetchData(pages, filters);
        if (response.success) {
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
    console.log(pages >= maxPage);
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

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const toggleFilterDiv = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const searchHandle = async () => {
    setPages(0);
    await fetchData(0, filters);
    // console.log(filters);
  };
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <Header />
      <main className="h-screen flex flex-col pt-[85px] px-4 lg:px-[250px]">
        <div className="flex flex-col md:flex-row items-center justify-between pt-0 lg:pt-[32px] pb-[5px] lg:pb-[13px]">
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
                checked={isChecked}
              />
              <div
                className={`w-5 h-5 md:w-6 md:h-6 border-2 border-gray-500 rounded-[5px] p-1 mr-2 cursor-pointer flex justify-center items-center ${
                  isChecked ? "bg-[#FFD9D9]" : "bg-[#fff]"
                }`}
                onClick={handleCheckboxChange}
              >
                {isChecked && <FaCheck />}
              </div>
              <span
                onClick={handleCheckboxChange}
                className="cursor-pointer whitespace-nowrap text-[20px] md:text-[18px] xl:text-[21px]"
              >
                {title.includes("판매") ? "거래가능한" : "경매중인"} 거북이만
                보기
              </span>
            </label>
          </div>

          <div className="flex flex-row items-center space-x-3">
            <div className="flex items-center xl:w-[320px] lg:w-[190px] md:w-[300px] h-[38px] bg-[#f2f2f2] rounded-[10px] p-1">
              <IoIosSearch className="text-gray-400 mx-2 text-[20px] md:text-[30px]" />
              <input
                type="text"
                placeholder="종을 검색하세요"
                className="w-full h-full bg-[#f2f2f2] text-[16px] md:text-[19px] focus:outline-none p-1"
              />
            </div>

            <div
              className="flex justify-center items-center border-[2px] border-[#DADADA] rounded-[30px] w-[80px] md:w-[90px] h-[42px] cursor-pointer hover:text-[#4B721F]"
              onClick={toggleFilterDiv}
            >
              <IoFilterOutline className="text-[18px] md:text-[22px] mr-2" />
              <span className="text-[16px] md:text-[18px]">필터</span>
            </div>
            <div
              onClick={filterResetHandle}
              className="flex justify-center items-center border-[2px] border-[#DADADA] rounded-[360px] w-[38px] md:w-[42px] h-[38px] md:h-[42px] cursor-pointer font-bold hover:text-[#4B721F]"
            >
              <GrPowerReset className="text-[18px] md:text-[20px]" />
            </div>
          </div>
        </div>

        <div
          className={`transition-all duration-300 ease-in-out transform ${
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

        <div className="md:mx-0 mx-auto grid flex-1 overflow-y-auto grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-[30px] mt-[10px]">
          {/* {skeletonComponent} */}
          {!initialLoad && items}
          {initialLoad ||
            (itemLoading && (
              <>
                <div className="hidden md:block col-span-1">
                  <AuctionTurtleSkeleton />
                </div>
                <div className="hidden xl:block col-span-1">
                  <AuctionTurtleSkeleton />
                </div>
                <div className="block col-span-1">
                  <AuctionTurtleSkeleton />
                </div>
              </>
            ))}
          <div ref={ref} className="w-full h-[1px] col-span-full" />
        </div>
      </main>
    </>
  );
};

export default TurtleListLayout;
