import { useState } from 'react';
import useDeviceStore from "../../store/useDeviceStore";
import LogoImg from '../../assets/logo.png';
import CoinImg from '../../assets/Coin.png';
import MyPageImg from '../../assets/mypage.png';
import { Link, useLocation } from 'react-router-dom';
import Wallet from './Wallet';
import Modal from './Modal';

export default function Header(){
  const location = useLocation();
  const isMobile = useDeviceStore((state) => state.isMobile);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  const backgroundColor = location.pathname === '/' ? '#AAE0F2' : '#fff';

  const toggleWallet = () => {
    setIsWalletOpen((prev) => !prev);
  }

    return <>
    <div
      className={ isMobile ? 
        "fixed top-0 left-0 w-full h-[65px] px flex flex-row justify-between items-center shadow-md z-50"
        : "fixed top-0 left-0 w-full h-[85px] px-[250px] flex flex-row justify-between items-center shadow-md z-50"
      }
      style={{ backgroundColor }}
    >
        <Link to="/">
          <div className={ isMobile ?
            "text-[27px] font-dnf-bitbit flex flex-row items-center cursor-pointer"
            : "text-[40px] font-dnf-bitbit flex flex-row items-center cursor-pointer"
          }>
            <img src={LogoImg} className={isMobile ? "w-[45px] h-[45px] mr-3" : "w-[60px] h-[60px] mr-3"} draggable="false" />
            <div><span className="text-[#4B721F]">꼬북</span>ZIP</div>
          </div>
        </Link>

        {/* 로그인 안 됐을 때 */}
        {/* <div className="text-[22px] flex flex-row items-center font-bold">
          <div className="mr-5 cursor-pointer font-stardust">로그인</div>
          <div className="cursor-pointer font-stardust">회원가입</div>
        </div> */}

        {/* 로그인 됐을 때 */}
        <div className="flex flex-row items-center">
          { !isMobile && <div className="mr-3 font-bold text-[22px] cursor-pointer font-stardust">꼬북맘님 로그인 중</div> }
          <div className={ isMobile ?
            "mr-3 bg-[#F6CA19] hover:bg-[#DFB509] shadow-[3px_3px_0px_#C49B07] hover:shadow-[3px_3px_0px_#CAA612] rounded-full px-1.5 py-1.5 flex flex-row items-center gap-1 cursor-pointer font-dnf-bitbit active:scale-95"
            : "mr-3 bg-[#F6CA19] hover:bg-[#DFB509] shadow-[3px_3px_0px_#C49B07] hover:shadow-[3px_3px_0px_#CAA612] rounded-[10px] px-2 py-1.5 flex flex-row items-center gap-1 cursor-pointer font-dnf-bitbit active:scale-95"
          } onClick={toggleWallet}>
            <img src={CoinImg} className="w-[27px] h-[27px]" draggable="false"/>
            { !isMobile && <span className="text-white text-[20px] tracking-widest">내 지갑</span> }
          </div>
          <Link to="/mypage">
          <div className={ isMobile ?
            "bg-[#B9A6E6] hover:bg-[#9B8BC1] shadow-[3px_3px_0px_#8568CB] hover:shadow-[3px_3px_0px_#8E70D3] rounded-full px-1.5 py-1.5 flex flex-row items-center cursor-pointer font-dnf-bitbit active:scale-95"
            : "bg-[#B9A6E6] hover:bg-[#9B8BC1] shadow-[3px_3px_0px_#8568CB] hover:shadow-[3px_3px_0px_#8E70D3] rounded-[10px] px-2 py-1.5 flex flex-row items-center cursor-pointer font-dnf-bitbit active:scale-95"
          }>
            { isMobile ?
              <img src={MyPageImg} className="w-[25px] h-[25px]" draggable="false"/>
              : <span className="text-white text-[20px] tracking-widest">마이페이지</span>
            }
          </div>
          </Link>
        </div>

        <Modal isOpen={isWalletOpen} onClose={toggleWallet}>
          <Wallet />
        </Modal>

    </div>    
    </>
}