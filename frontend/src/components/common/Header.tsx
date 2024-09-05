import LogoImg from '../../assets/logo.png';
import CoinImg from '../../assets/Coin.png';
import { CgProfile } from "react-icons/cg";

export default function Header(){
    return <>
    <div className="fixed top-0 left-0 w-full h-[80px] px-[250px] flex flex-row justify-between items-center shadow-md z-50">
        <div className="text-[38px] font-dnf-bitbit flex flex-row items-center cursor-pointer">
            <img src={LogoImg} className="w-[60px] h-[60px] mr-3"/>
            <div><span className="text-[#4B721F]">꼬북</span><span className="text[#43493A]">ZIP</span></div>
        </div>

        {/* 로그인 안 됐을 때 */}
        {/* <div className="text-[22px] flex flex-row items-center font-bold">
          <div className="mr-5 cursor-pointer">로그인</div>
          <div className="cursor-pointer">회원가입</div>
        </div> */}

        {/* 로그인 됐을 때 */}
        <div className="flex flex-row items-center">
          <div className="mr-5 font-bold text-[22px] cursor-pointer">김민선님 로그인 중</div>
          <CgProfile className="mr-5 w-[30px] h-[30px] cursor-pointer" />
          <div className="bg-[#F6CA19] rounded-[10px] px-2 py-1.5 flex flex-row items-center cursor-pointer font-dnf-bitbit">
            <img src={CoinImg} className="w-[27px] h-[27px] mr-1"/>
            <span className="font-bold text-white text-[20px] tracking-widest">환전하기</span>
          </div>
        </div>

    </div>    
    </>
}