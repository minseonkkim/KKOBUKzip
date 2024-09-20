import { Helmet } from "react-helmet-async";
import Header from "../../components/common/Header";
import { GrPowerReset } from "react-icons/gr";
import { FaCheck } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoFilterOutline } from "react-icons/io5";
import AuctionTurtle from "../../components/auction/AuctionTurtle";
import { AuctionItemDataType } from "../../types/auction";
import { getAuctionDatas } from "../../apis/tradeApi";
import OptionFilter from "../../components/common/OptionFilter";
import useTradeFilter from "../../hooks/useTradeFilter";
import AuctionTurtleSkeleton from "../../components/auction/AuctionTurtleSkeleton";
import { useInView } from "react-intersection-observer";

// 해야할것 -> 스크롤 구현(귀찮...)
// 해야할 것 : 필터 조회 적용
// api 연동하면 더미데이터 -> 실제데이터, AuctionTurtle 내부 데이터 연동하기, 스켈레톤 이미지 활성화까지 할 것 -> 대부분 주석걸려있음

function AuctionListPage() {
  const [auctionData, setAuctionData] = useState<AuctionItemDataType[]>([]);

  const [isChecked, setIsChecked] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State to handle opening and closing of the filter div

  const [itemLoading, setItemLoading] = useState(false);
  const [pages, setPages] = useState(1); // 페이지네이션용
  const [maxPage, setMaxPage] = useState(-1); // 페이지네이션용
  const [ref, inView] = useInView({
    threshold: 0.5,
  }); // infinity-scroll observer

  const { filters, updateFilter, filterResetHandle } = useTradeFilter();

  useEffect(() => {
    // getAuctionDatas and setAuctionData
    const getData = async () => {
      try {
        setItemLoading(true);

        const response = await getAuctionDatas({ page: pages });
        if (response.success) {
          setAuctionData(response.data.auctions);
          setMaxPage(response.data.total_pages);
        }
      } finally {
        setItemLoading(false);
        setPages(pages + 1);
      }
    };

    getData();
  }, []);

  // 다음 페이지를 불러오는 함수
  const loadMore = async () => {
    if (itemLoading) return;
    setItemLoading(true);

    try {
      if (pages + 1 > maxPage) return;
      setPages((c) => c + 1);
      const response = await getAuctionDatas({
        page: pages,
        ...filters,
      });

      if (response.success) {
        setAuctionData((prev) => [...prev, ...response.data.auctions]);
      }
      // setMaxPage(response.data.maxPage);
    } finally {
      setItemLoading(false);
    }
  };

  // 스크롤을 인식해서 load
  useEffect(() => {
    console.log(inView);
    if (loadMore && inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  const handleCheckboxChange = () => {
    // 경매중인 거북이만 보기 -> progress : "DURING_AUCTION"
    setIsChecked(!isChecked);
  };

  const toggleFilterDiv = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const filterApplyHandle = () => {
    console.log(filters);
  };

  return (
    <>
      <Helmet>
        <title>경매중인 거북이</title>
      </Helmet>

      <Header />
      <div className="page-container h-screen flex flex-col pt-[85px]">
        <div className="flex flex-row items-center justify-between pt-[40px] pb-[13px]">
          <div className="text-[33px] text-gray-900 font-dnf-bitbit mr-3">
            경매중인 거북이
          </div>
        </div>

        <div className="flex flex-row items-center justify-between mb-4">
          <div className="text-[23px] font-bold flex flex-row items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="hidden"
                readOnly
                checked={isChecked}
              />
              <div
                className={`w-6 h-6 border-2 border-gray-500 rounded-[5px] p-1 mr-2 cursor-pointer flex justify-center items-center ${
                  isChecked ? "bg-[#FFD9D9]" : "bg-[#fff]"
                }`}
                onClick={handleCheckboxChange}
              >
                {isChecked && <FaCheck />}
              </div>
              <span onClick={handleCheckboxChange} className="cursor-pointer">
                경매중인 거북이만 보기
              </span>
            </label>
          </div>
          <div className="flex flex-row">
            <div className="flex items-center w-[320px] h-[38px] bg-[#f2f2f2] rounded-[10px] p-1 mr-4">
              <IoIosSearch className="text-gray-400 mx-2 text-[30px]" />
              <input
                type="text"
                placeholder="종을 검색하세요"
                className="w-full h-full bg-[#f2f2f2] text-[19px] focus:outline-none p-1"
              />
            </div>

            <div
              className="flex justify-center items-center border-[2px] border-[#DADADA] rounded-[30px] w-[90px] h-[42px] cursor-pointer hover:text-[#4B721F] mr-2"
              onClick={toggleFilterDiv}
            >
              <IoFilterOutline className="text-[22px] mr-2" />
              <span className="text-[18px]">필터</span>
            </div>
            <div
              onClick={filterResetHandle}
              className="flex justify-center items-center border-[2px] border-[#DADADA] rounded-[360px] w-[42px] h-[42px] cursor-pointer font-bold hover:text-[#4B721F]"
            >
              <GrPowerReset className="text-[20px]" />
            </div>
          </div>
        </div>

        {/* 필터 영역 */}
        <div
          className={`transition-all duration-300 ease-in-out transform ${
            isFilterOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          {isFilterOpen && (
            <OptionFilter
              filterApplyHandle={filterApplyHandle}
              filters={filters}
              updateFilter={updateFilter}
            />
          )}
        </div>
        {/* 필터 영역 끝 */}

        {/* 그리드 아이템 영역 */}
        <div className="grid flex-1 overflow-y-auto grid-cols-3 gap-4 mb-[30px] mt-[10px] ">
          {[...Array(50)].map((_, i) => (
            <AuctionTurtle key={i} />
          ))}

          {/* {auctionData.map((item, index) => (
            <AuctionTurtle key={index} data={item} />
          ))}
          {
            // 스켈레톤 컴포넌트, grid 의 개수(1줄)만큼 적용
            itemLoading &&
              [...Array(3)].map((_, i) => <AuctionTurtleSkeleton key={i} />)
          } */}

          {/* observer div */}
          <div ref={ref} className="w-full h-[1px] col-span-full" />
        </div>
        {/* 그리드 아이템 영역 끝 */}
      </div>

      {/* Custom Radio Button Styling */}
      <style>{`
        .custom-radio {
          display: flex;
          align-items: center;
          cursor: pointer;
          position: relative;
        }

        .custom-radio input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }

        .radio-mark {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background-color: #fff;
          border: 2px solid #DADADA;
          margin-right: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s ease;
        }

        .custom-radio input:checked ~ .radio-mark {
          background-color: #4B721F;
          border-color: #4B721F;
        }

        .radio-mark:after {
          content: "";
          display: none;
          width: 10px;
          height: 10px;
          background-color: white;
          border-radius: 50%;
        }

        .custom-radio input:checked ~ .radio-mark:after {
          display: block;
        }
      `}</style>
    </>
  );
}

export default AuctionListPage;
