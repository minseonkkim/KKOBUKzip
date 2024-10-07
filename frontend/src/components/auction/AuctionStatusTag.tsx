interface AuctionStatusTagProps{
    progress: string;
}

export default function AuctionStatusTag({progress}: AuctionStatusTagProps){

    const bgColor = progress === "경매중" ? "bg-[#FFD9D9]" : (progress === "유찰" || progress === "낙찰" ? "bg-white" : "bg-[#E6EDFF]");

    return <>
        <div className={`text-[17px] font-bold rounded-[15px] ${bgColor} px-2.5 py-1`}>
            {progress}
        </div>
    </>
}