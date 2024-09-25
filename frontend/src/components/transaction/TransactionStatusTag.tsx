interface TransactionStatusTagProps{
    progress: string;
}

export default function TransactionStatusTag({progress}: TransactionStatusTagProps){

    const bgColor = progress === "거래가능" ? "bg-[#FFD9D9]" : "bg-white";

    return <>
        <div className={`text-[17px] font-bold rounded-[15px] ${bgColor} px-2.5 py-1`}>
            {progress}
        </div>
    </>
}