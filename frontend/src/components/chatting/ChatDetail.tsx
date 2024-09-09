import TmpProfileImg from "../../assets/tmp_profile.png";

interface Chat{
    name: string;
    message: string;
}

interface ChatDetailProps{
    closeChatDetail: (chat: any) => void;
    chat: Chat;
}

export default function ChatDetail({ closeChatDetail, chat }:ChatDetailProps){
    return <>
        <div className="text-black bg-gray-100 rounded-[10px] flex flex-col justify-between w-full h-full">
            <div>
                <div className="text-[#43493A] p-[10px] flex flex-row justify-between items-center text-[29px] font-dnf-bitbit">
                    <span onClick={closeChatDetail}>&lt;&nbsp;{chat.name}</span>
                </div>
                <div className="p-[10px] flex flex-col-reverse">
                  
                    

                    {/* 받은 메세지 */}
                    <div className="flex flex-row my-2 items-end">
                        <img src={TmpProfileImg} className="rounded-full w-[40px] h-[40px] mr-2"/>
                        <div className="p-2.5 bg-white rounded-[10px] w-fit max-w-[230px] break-words mr-1">
                            {chat.message}
                        </div>
                        <span className="text-[12px] mr-1 text-gray-400">09:38</span>
                    </div>
                    {/* 보낸 메세지 */}
                    <div className="flex flex-row-reverse my-2 items-end">
                        <div className="p-2.5 bg-white rounded-[10px] w-fit max-w-[230px]">
                            거북이 사요~~ 거북이 귀여워용.
                        </div>
                        <span className="text-[12px] mr-1 text-gray-400">09:30</span>
                    </div>
                    {/* 날짜 */}
                    <div className="flex flex-row justify-between items-center">
                        <div className="w-full bg-gray-400 h-[2px]"></div>
                        <span className="w-[300px] text-center text-gray-600">24년 9월 9일</span>
                        <div className="w-full bg-gray-400 h-[2px]"></div>
                    </div>
                </div>
            </div>

            <div className="mt-auto">
                <input
                    type="text"
                    placeholder="메시지를 입력하세요..."
                    className="w-full p-2 border rounded-lg"
                />
            </div>
        </div>
    
    </>
}