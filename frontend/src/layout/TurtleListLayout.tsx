import { Helmet } from "react-helmet-async";
import Header from "../components/common/Header";
import { useEffect, useState } from "react";
import OptionFilter from "../components/common/OptionFilter";
import { useInView } from "react-intersection-observer";
import useTradeFilter from "../hooks/useTradeFilter";

interface TurtleListLayoutProps {
  title: string;
  items: JSX.Element[];
  fetchData: (page: number, filters: object) => Promise<any>;
  skeletonComponent?: JSX.Element;
}

const TurtleListLayout: React.FC<TurtleListLayoutProps> = ({
  title,
  items,
  fetchData,
  skeletonComponent,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [itemLoading, setItemLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true); // Track the initial data loading
  const [pages, setPages] = useState(1);
  const [maxPage, setMaxPage] = useState(-1);

  const [ref, inView] = useInView({ threshold: 1 });
  const { filters, filterResetHandle, updateFilter } = useTradeFilter();

  useEffect(() => {
    const getData = async () => {
      setItemLoading(true);
      try {
        const response = await fetchData(pages, filters);
        if (response.success) {
          setMaxPage(response.data.total_pages);
        }
        setPages((prev) => prev + 1);
      } finally {
        setItemLoading(false);
        setInitialLoad(false); 
      }
    };
    getData();
  }, [fetchData, filters, pages]);

  const loadMore = async () => {
    if (itemLoading || pages > maxPage) return;
    setItemLoading(true);
    try {
      const response = await fetchData(pages, filters);
      if (response.success) {
        setMaxPage(response.data.total_pages ?? -1);
      }
    } finally {
      setItemLoading(false);
    }
  };

  useEffect(() => {
    if (inView) loadMore();
  }, [inView]);

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <Header />
      <div className="h-screen flex flex-col pt-[85px] px-4 lg:px-[250px]">
        <div className="flex flex-col md:flex-row items-center justify-between pt-0 lg:pt-[40px] pb-[5px] lg:pb-[13px]">
          <div className="whitespace-nowrap text-[28px] md:text-[33px] text-gray-900 font-dnf-bitbit mr-3 mb-2 md:mb-0">
            {title}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mb-4">

        </div>

        {/* Filter component */}
        <div
          className={`transition-all duration-300 ease-in-out transform ${
            isFilterOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          {isFilterOpen && (
            <OptionFilter
              filterApplyHandle={() => console.log(filters)}
              filters={filters}
              updateFilter={updateFilter}
            />
          )}
        </div>

        <div className="md:mx-0 mx-auto grid flex-1 overflow-y-auto grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-[30px] mt-[10px]">

          {initialLoad &&
            Array.from({ length: 6 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="col-span-1">
                {skeletonComponent}
              </div>
            ))}

          {!initialLoad && items}

          <div ref={ref} className="w-full h-[1px] col-span-full" />
        </div>
      </div>
    </>
  );
};

export default TurtleListLayout;
