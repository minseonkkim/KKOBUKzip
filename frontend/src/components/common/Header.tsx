import LogoImg from '../../assets/logo.png';
import CoinImg from '../../assets/Coin.png';
import { CgProfile } from "react-icons/cg";
import { Link, useLocation } from 'react-router-dom';

export default function Header(){
  const location = useLocation();

  const backgroundColor = location.pathname === '/' ? '#AAE0F2' : '#fff';

    return <>
    <div
      className="fixed top-0 left-0 w-full h-[85px] px-[230px] flex flex-row justify-between items-center shadow-md z-50"
      style={{ backgroundColor }}
    >
        <Link to="/">
          <div className="text-[40px] font-dnf-bitbit flex flex-row items-center cursor-pointer">
              <img src={LogoImg} className="w-[60px] h-[60px] mr-3" draggable="false" />
              <div><span className="text-[#4B721F]">꼬북</span><span className="text[#43493A]">ZIP</span></div>
          </div>
        </Link>

        {/* 로그인 안 됐을 때 */}
        <div className="text-[22px] flex flex-row items-center font-bold">
          <div className="mr-5 cursor-pointer font-stardust">로그인</div>
          <div className="cursor-pointer font-stardust">회원가입</div>
        </div>

        {/* 로그인 됐을 때 */}
        {/* <div className="flex flex-row items-center">
          <div className="mr-3 font-bold text-[22px] cursor-pointer font-stardust">꼬북맘님 로그인 중</div>
          <div className="mr-3 bg-[#F6CA19] hover:bg-[#DFB509] shadow-[3px_3px_0px_#DFB509] hover:shadow-[3px_3px_0px_#CAA612] rounded-[10px] px-2 py-1.5 flex flex-row items-center cursor-pointer font-dnf-bitbit active:scale-95">
            <img src={CoinImg} className="w-[27px] h-[27px] mr-1"/>
            <span className="font-bold text-white text-[20px] tracking-widest">내 지갑</span>
          </div>
          <div className="bg-[#B9A6E6] hover:bg-[#9B8BC1] shadow-[3px_3px_0px_#8568CB] hover:shadow-[3px_3px_0px_#8E70D3] rounded-[10px] px-2 py-1.5 flex flex-row items-center cursor-pointer font-dnf-bitbit active:scale-95">
            <span className="font-bold text-white text-[20px] tracking-widest">마이페이지</span>
          </div>
        </div> */}

    </div>    
    </>
}