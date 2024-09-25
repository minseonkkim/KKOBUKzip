// import { useState } from "react";
// import Web3 from "web3";
// import { AbiItem } from "web3-utils";
// import { Contract } from "web3-eth-contract";
import TmpTurtleImg from "../../assets/tmp_turtle.jpg";
import BabyTurtleImg from "../../assets/babyturtle.png";
import { IoCheckmark } from "react-icons/io5";

// 컨트랙트 ABI 타입
// const CONTRACT_ABI: AbiItem[] = [];
// const CONTRACT_ADDRESS = "추후에 추가";

export default function TransactionHistory(){
    // const [web3, setWeb3] = useState<Web3 | null>(null);
    // const [contract, setContract] = useState<Contract<AbiItem[]> | null>(null);
    // const [account, setAccount] = useState<string | null>(null);

    const handlleDeposit = () => {}
    const startPapework = () => {}
    const finalizeTransaction = () => {}

    return <>
        <div className="w-full border-[2px] rounded-[20px] p-[15px] bg-[#f8f8f8] flex flex-col md:flex-row lg:flex-col xl:flex-row">
            <div className="flex flex-row">
                <img src={TmpTurtleImg} className="w-[200px] h-[150px] rounded-[10px] object-cover" draggable="false"/>
                <div className="flex flex-col justify-between w-[420px] ml-[20px]">
                    <div>
                        <div>분양자 정보</div>
                        <div>태그</div>
                        <div>가격</div>
                    </div>
                    {/* 아래 버튼은 거래 진행 상황에 따라 on/off하기! */}
                    <div className="text-[19px] font-bold">
                        {/* 경매 거래인 경우에만 활성화 해당(입금 대기 상태일 때) */}
                        <button className="w-24 h-10 bg-[#D8F1D5] rounded-[10px] hover:bg-[#CAEAC6]" onClick={() => {handlleDeposit()}}>입금하기</button>
                        {/* 예약 단계에 활성화 */}
                        {/* <button className="w-24 h-10 bg-[#D8F1D5] rounded-[10px] hover:bg-[#CAEAC6]" onClick={()=>{startPapework()}}>서류 작성</button> */}
                        {/* 서류 검토 */}
                        {/* <button className="w-24 h-10 bg-[#D8F1D5] rounded-[10px] hover:bg-[#CAEAC6]" onClick={()=>{finalizeTransaction()}}>구매 확정</button> */}
                    </div>
                </div>
            </div>
            <div>
            
            <div className="w-[360px] h-[104px] relative mt-[18px]">
                <div className="w-[290px] h-[0px] left-[24px] top-[68px] absolute border-[1.4px] border-gray-400"></div>
                
                <div className="left-0 top-0 absolute text-center text-black text-[16px]">입금대기</div>
                {/* 입금대기-완료 */}
                <div className="w-[30px] h-[30px] left-[8px] top-[53px] absolute bg-[#e7f6d1] rounded-full border border-black" />
                <div className="w-[14px] h-[14px] left-[10px] top-[54px] absolute"><IoCheckmark className="text-[28px]"/></div>
                {/* 입금대기-진행중 */}
                {/* <img className="w-[68px] left-[7px] top-[40px] absolute origin-top-left" src={BabyTurtleImg} draggable="false"/> */}
                {/* 입금대기-전 */}
                {/* <div className="w-[23px] h-[23px] left-[19px] top-[61px] absolute bg-[#aeaeae] rounded-full border border-black" /> */}

                
                <div className="left-[78px] top-0 absolute text-center text-black text-[16px]">예약</div>
                {/* 예약-완료 */}
                <div className="w-[30px] h-[30px] left-[77px] top-[53px] absolute bg-[#e7f6d1] rounded-full border border-black" />
                <div className="w-[14px] h-[14px] left-[79px] top-[54px] absolute"><IoCheckmark className="text-[28px]"/></div>
                {/* 예약-진행중 */}
                {/* <img className="w-[68px] left-[137px] top-[40px] absolute origin-top-left" src={BabyTurtleImg} draggable="false"/> */}
                {/* 예약-전 */}
                {/* <div className="w-[23px] h-[23px] left-[155px] top-[61px] absolute bg-[#aeaeae] rounded-full border border-black" /> */}


                <div className="left-[130px] top-0 absolute text-center text-black text-[16px] font-bold">서류검토</div>
                {/* 서류검토-완료 */}
                {/* <div className="w-[37px] h-[37px] left-[308px] top-[53px] absolute bg-[#e7f6d1] rounded-full border border-black" />
                <div className="w-[25px] h-[29px] left-[314px] top-[57px] absolute"><IoCheckmark className="text-[28px]"/></div> */}
                {/* 서류검토-진행중 */}
                <img className="w-[54px] left-[137px] top-[41px] absolute origin-top-left" src={BabyTurtleImg} draggable="false"/>
                {/* 서류검토-전 */}
                {/* <div className="w-[23px] h-[23px] left-[317px] top-[61px] absolute bg-[#aeaeae] rounded-full border border-black" /> */}
                
                <div className="left-[206px] top-0 absolute text-center text-black text-[16px]">서류승인</div>
                {/* 서류검토-완료 */}
                <div className="w-[30px] h-[30px] left-[220px] top-[53px] absolute bg-[#e7f6d1] rounded-full border border-black" />
                <div className="w-[14px] h-[14px] left-[222px] top-[54px] absolute"><IoCheckmark className="text-[28px]"/></div>
                {/* 서류검토-진행중 */}
                {/* <img className="w-[68px] left-[297px] top-[40px] absolute origin-top-left" src={BabyTurtleImg} draggable="false"/> */}
                {/* 서류검토-전 */}
                {/* <div className="w-[23px] h-[23px] left-[317px] top-[61px] absolute bg-[#aeaeae] rounded-full border border-black" /> */}

                <div className="left-[280px] top-0 absolute text-center text-black text-[16px]">거래완료</div>
                {/* 거래완료-완료 */}
                {/* <div className="w-[37px] h-[37px] left-[457px] top-[53px] absolute bg-[#e7f6d1] rounded-full border border-black" />
                <div className="w-[25px] h-[29px] left-[463px] top-[57px] absolute"><IoCheckmark className="text-[28px]"/></div> */}
                {/* 거래완료-진행중 */}
                {/* <img className="w-[68px] left-[447px] top-[40px] absolute origin-top-left" src={BabyTurtleImg} draggable="false"/> */}
                {/* 거래완료-전 */}
                <div className="w-[20px] h-[20px] left-[298px] top-[59px] absolute bg-[#aeaeae] rounded-full border border-black" />
                </div>
            </div>
        </div>
    </>
}