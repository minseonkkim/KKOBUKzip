import TmpTurtleImg from "../../assets/tmp_turtle.jpg";
import BabyTurtleImg from "../../assets/babyturtle.png";
import { IoCheckmark } from "react-icons/io5";

export default function TransactionHistory(){
    return <>
        <div className="w-full h-[180px] border-[2px] rounded-[20px] my-[12px] p-[15px] bg-[#f8f8f8] flex flex-row">
            <img src={TmpTurtleImg} className="w-[200px] h-[150px] rounded-[10px] object-cover" draggable="false"/>
            <div className="w-[420px] ml-[20px]">
                <div>분양자 정보</div>
                <div>태그</div>
                <div>가격</div>
            </div>
            <div>
            <div className="w-[510px] h-[104px] relative mt-[18px]">
                <div className="w-[460px] h-[0px] left-[24px] top-[71px] absolute border-[1.4px] border-gray-400"></div>
                
                <div className="left-0 top-0 absolute text-center text-black text-xl font-[15px]">입금대기</div>
                {/* 입금대기-완료 */}
                <div className="w-[37px] h-[37px] left-[8px] top-[53px] absolute bg-[#e7f6d1] rounded-full border border-black" />
                <div className="w-[25px] h-[29px] left-[14px] top-[57px] absolute"><IoCheckmark className="text-[28px]"/></div>
                {/* 입금대기-진행중 */}
                {/* <img className="w-[68px] left-[7px] top-[40px] absolute origin-top-left" src={BabyTurtleImg} draggable="false"/> */}
                {/* 입금대기-전 */}
                {/* <div className="w-[23px] h-[23px] left-[19px] top-[61px] absolute bg-[#aeaeae] rounded-full border border-black" /> */}

                
                <div className="left-[150px] top-[2px] absolute text-center text-black text-xl font-[15px]">예약</div>
                {/* 예약-완료 */}
                <div className="w-[37px] h-[37px] left-[149px] top-[53px] absolute bg-[#e7f6d1] rounded-full border border-black" />
                <div className="w-[25px] h-[29px] left-[155px] top-[57px] absolute"><IoCheckmark className="text-[28px]"/></div>
                {/* 예약-진행중 */}
                {/* <img className="w-[68px] left-[137px] top-[40px] absolute origin-top-left" src={BabyTurtleImg} draggable="false"/> */}
                {/* 예약-전 */}
                {/* <div className="w-[23px] h-[23px] left-[155px] top-[61px] absolute bg-[#aeaeae] rounded-full border border-black" /> */}


                <div className="left-[290px] top-0 absolute text-center text-black text-[21px] font-bold">서류검토</div>
                {/* 서류검토-완료 */}
                {/* <div className="w-[37px] h-[37px] left-[308px] top-[53px] absolute bg-[#e7f6d1] rounded-full border border-black" />
                <div className="w-[25px] h-[29px] left-[314px] top-[57px] absolute"><IoCheckmark className="text-[28px]"/></div> */}
                {/* 서류검토-진행중 */}
                <img className="w-[68px] left-[297px] top-[40px] absolute origin-top-left" src={BabyTurtleImg} draggable="false"/>
                {/* 서류검토-전 */}
                {/* <div className="w-[23px] h-[23px] left-[317px] top-[61px] absolute bg-[#aeaeae] rounded-full border border-black" /> */}


                <div className="left-[440px] top-[2px] absolute text-center text-black text-xl font-[15px]">거래완료</div>
                {/* 거래완료-완료 */}
                {/* <div className="w-[37px] h-[37px] left-[457px] top-[53px] absolute bg-[#e7f6d1] rounded-full border border-black" />
                <div className="w-[25px] h-[29px] left-[463px] top-[57px] absolute"><IoCheckmark className="text-[28px]"/></div> */}
                {/* 거래완료-진행중 */}
                {/* <img className="w-[68px] left-[447px] top-[40px] absolute origin-top-left" src={BabyTurtleImg} draggable="false"/> */}
                {/* 거래완료-전 */}
                <div className="w-[23px] h-[23px] left-[465px] top-[61px] absolute bg-[#aeaeae] rounded-full border border-black" />
                </div>
            </div>
        </div>
    </>
}