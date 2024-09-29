import { create } from "zustand";
import { useWeb3Store } from "./useWeb3Store";

interface MetaMaskSDKState {
  initializeSDK: () => Promise<void>;
  connectWallet: () => Promise<void>;
  checkAndPromptForMetaMask: () => Promise<boolean>;
}

export const useMetaMaskSDKStore = create<MetaMaskSDKState>(() => ({
  initializeSDK: async () => {
    await useWeb3Store.getState().initializeSDK();
  },

  connectWallet: async () => {
    await useWeb3Store.getState().connectWallet();
  },

  checkAndPromptForMetaMask: async () => {
    const { MMSDK } = useWeb3Store.getState();
    if (!MMSDK) return false;

    try {
      const provider = MMSDK.getProvider();
      
      if (provider && typeof provider.isMetaMask !== 'undefined') {
        return true;
      }

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isMobile) {
        const hasMetaMask = window.confirm("MetaMask 앱이 설치되어 있나요? '확인'을 눌러 앱을 실행하거나, '취소'를 눌러 설치 페이지로 이동합니다.");
        
        if (hasMetaMask) {
          const mmLink = 'https://metamask.app.link/dapp/' + window.location.host + window.location.pathname;
          window.location.href = mmLink;
          return false;
        } else {
          window.open('https://metamask.io/download/', '_blank');
          return false;
        }
      } else {
        const confirmed = window.confirm("MetaMask가 설치되어 있지 않습니다. 설치 페이지로 이동하시겠습니까?");
        if (confirmed) {
          window.open("https://metamask.io/download/", "_blank");
        }
        return false;
      }
    } catch (error) {
      console.error("MetaMask 설치 확인 실패:", error);
      return false;
    }
  },
}));