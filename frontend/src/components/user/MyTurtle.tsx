import { useNavigate } from "react-router-dom";
import TmpTurtleImg from "../../assets/tmp_turtle.jpg";

export default function MyTurtle(){
    const navigate = useNavigate();

    const goToRegister = () => {
        navigate('/auction-register');
    };

    return <>
        <div className="w-[23.5%] h-[373px] border-[2px] rounded-[20px] my-[13px] p-[15px] bg-[#f8f8f8]">
            <div className="flex flex-row justify-between items-center mb-3">
                <div className="text-[20px]">
                    꼬북이
                </div>
                <div className="font-bold text-gray-400">2024.09.01</div>
            </div>
            <img src={TmpTurtleImg} className="rounded-[10px] w-full h-[190px] object-cover" draggable="false"/>
            <div className="flex flex-row justify-between mt-4 text-[18px]">
                <button className="w-[48%] h-[38px] bg-[#D8F1D5] rounded-[10px] hover:bg-[#CAEAC6]">상세 정보</button>
                <button className="w-[48%] h-[38px] bg-[#D8F1D5] rounded-[10px] hover:bg-[#CAEAC6]">서류 조회</button>
            </div>
            <div className="flex flex-row justify-between mt-3 text-[18px]">
                <button className="w-[48%] h-[38px] bg-[#D8F1D5] rounded-[10px] hover:bg-[#CAEAC6]">판매 등록</button>
                <button onClick={goToRegister} className="w-[48%] h-[38px] bg-[#D8F1D5] rounded-[10px] hover:bg-[#CAEAC6]">경매 등록</button>
            </div>
        </div>
    </>
}