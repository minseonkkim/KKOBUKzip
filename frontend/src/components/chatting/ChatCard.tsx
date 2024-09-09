import TmpProfileImg from "../../assets/tmp_profile.png";

export default function ChatCard(){
    return <>
    <div className="text-black bg-white rounded-[10px] p-2 flex flex-row justify-between items-center my-3 mx-1">
        <div className="flex flex-row">
            <img src={TmpProfileImg} className="rounded-full w-[52px] h-[52px] mr-3"/>
            <div className="flex flex-col">
                <div className="text-[16px]">꼬북맘</div>
                <div className="text-[20px]">팔겠습니다.</div>
            </div>
        </div>
        <div className="rounded-full bg-[#DE0000] w-[27px] h-[27px] flex justify-center items-center text-white font-bold text-[20px]">
            1
        </div>
    </div>
    </>
}