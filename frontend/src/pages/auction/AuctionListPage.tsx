import { Helmet } from "react-helmet-async";
import Header from "../../components/common/Header";
import { GrPowerReset } from "react-icons/gr";
import { FaCheck } from "react-icons/fa6";
import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoFilterOutline } from "react-icons/io5";
import AuctionTurtle from "../../components/auction/AuctionTurtle";

type FilterType = 'gender' | 'size' | 'price';

function AuctionListPage() {
  const [isChecked, setIsChecked] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State to handle opening and closing of the filter div
  const [filters, setFilters] = useState({
    gender: '',
    size: '',
    price: '',
  });

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const toggleFilterDiv = () => {
    setIsFilterOpen(!isFilterOpen); // Toggle filter div visibility
  };

  // Update the selected filter
  const updateFilter = (filterType: FilterType, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  return (
    <>
      <Helmet>
        <title>경매중인 거북이</title>
      </Helmet>
      <Header />
      <div className="px-[250px] mt-[85px]">
        <div className="flex flex-row items-center justify-between pt-[40px] pb-[13px]">
          <div className="text-[33px] text-gray-900 font-dnf-bitbit mr-3">경매중인 거북이</div>

        </div>
        
        {/* New Search Bar for Species and Filter Toggle */}
        <div className="flex flex-row items-center justify-between mb-4">
        <div className="text-[23px] font-bold flex flex-row items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="hidden"
                checked={isChecked}
              />
              <div
                className={`w-6 h-6 border-2 border-gray-500 rounded-[5px] p-1 mr-2 cursor-pointer flex justify-center items-center ${
                  isChecked ? 'bg-[#FFD9D9]' : 'bg-[#fff]'
                }`}
                onClick={handleCheckboxChange}
              >
                {isChecked && <FaCheck />}
              </div>
              <span onClick={handleCheckboxChange} className="cursor-pointer">경매중인 거북이만 보기</span>
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
            <div className="flex justify-center items-center border-[2px] border-[#DADADA] rounded-[360px] w-[42px] h-[42px] cursor-pointer font-bold hover:text-[#4B721F]">
              <GrPowerReset className="text-[20px]" />
            </div>
          </div>
        </div>

        {/* Collapsible Search Filter Div */}
        {isFilterOpen && (
          <div className="border-[2px] border-[#DADADA] rounded-[20px] px-6 py-4 mb-4 transition-all ease-in-out duration-300">
            <div className="mb-4 flex flex-row items-center">
              <label className="block mb-2 font-bold text-lg w-[100px]">성별</label>
              <div className="flex space-x-3">
                <label className="custom-radio">
                  <input
                    type="radio"
                    name="gender"
                    value="all"
                    onChange={(e) => updateFilter('gender', e.target.value)}
                  />
                  <span className="radio-mark"></span>
                  전체
                </label>
                <label className="custom-radio">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={filters.gender === 'male'}
                    onChange={(e) => updateFilter('gender', e.target.value)}
                  />
                  <span className="radio-mark"></span>
                  암컷
                </label>
                <label className="custom-radio">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={filters.gender === 'female'}
                    onChange={(e) => updateFilter('gender', e.target.value)}
                  />
                  <span className="radio-mark"></span>
                  수컷
                </label>
                <label className="custom-radio">
                  <input
                    type="radio"
                    name="gender"
                    value="undifferentiated"
                    checked={filters.gender === ''}
                    onChange={(e) => updateFilter('gender', e.target.value)}
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
                    onChange={(e) => updateFilter('size', e.target.value)}
                  />
                  <span className="radio-mark"></span>
                  전체
                </label>
                <label className="custom-radio">
                  <input
                    type="radio"
                    name="size"
                    value="baby"
                    checked={filters.size === 'baby'}
                    onChange={(e) => updateFilter('size', e.target.value)}
                  />
                  <span className="radio-mark"></span>
                  베이비
                </label>
                <label className="custom-radio">
                  <input
                    type="radio"
                    name="size"
                    value="subadult"
                    checked={filters.size === 'subadult'}
                    onChange={(e) => updateFilter('size', e.target.value)}
                  />
                  <span className="radio-mark"></span>
                  아성체
                </label>
                <label className="custom-radio">
                  <input
                    type="radio"
                    name="size"
                    value="adult"
                    checked={filters.size === 'adult'}
                    onChange={(e) => updateFilter('size', e.target.value)}
                  />
                  <span className="radio-mark"></span>
                  성체
                </label>
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="flex flex-row items-center">
                <label className="block mb-2 font-bold text-lg w-[100px]">가격</label>
                <div className="flex space-x-4 flex items-center">
                  <input className="w-[180px] h-[38px] bg-[#f2f2f2] focus:outline-none rounded-[10px] p-1" placeholder="최소 가격"/>
                  <span className="text-[22px]">~</span>
                  <input className="w-[180px] h-[38px] bg-[#f2f2f2] focus:outline-none rounded-[10px] p-1" placeholder="최대 가격"/>
                </div>
              </div>
              <button className="bg-[#4B721F] rounded-[5px] px-3 py-1 text-white font-bold">검색</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-[30px] mt-[10px]">
          <AuctionTurtle/>
          <AuctionTurtle/>
          <AuctionTurtle/>
          <AuctionTurtle/>
          <AuctionTurtle/>
        </div>
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
