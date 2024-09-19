import { create } from "zustand";
import { MetaMaskSDK, MetaMaskSDKOptions } from "@metamask/sdk";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import TurtleTokenAbi from "../abi/TurtleToken.json";

const TURTLE_TOKEN_ABI: AbiItem[] = TurtleTokenAbi.abi as AbiItem[];
const TURTLE_TOKEN_ADDRESS = "0x73b0697A8A69193e5842497Cc010cB1F34A93a0a";

interface MetaMaskSDKState {
  MMSDK: MetaMaskSDK | null;
  web3: Web3 | null;
  account: string;
  contract: Contract<typeof TURTLE_TOKEN_ABI> | null;
  error: string | null;
  isInitialized: boolean;
  initializeSDK: () => Promise<void>;
  connectWallet: () => Promise<void>;
  handleAccountsChanged: (accounts: string[]) => void;
}

export const useMetaMaskSDKStore = create<MetaMaskSDKState>((set, get) => ({
  MMSDK: null,
  web3: null,
  account: "",
  contract: null,
  error: null,
  isInitialized: false,

  initializeSDK: async () => {
    if (get().isInitialized) return;

    try {
      // MetaMask SDK 옵션 설정
      const options: MetaMaskSDKOptions = {
        dappMetadata: {
          name: "KkobukZIP",
          url: window.location.href,
        },
        // 모바일 지원을 위한 추가 옵션
        checkInstallationImmediately: false
      };

      // MetaMask SDK 인스턴스 생성 및 초기화
      const MMSDK = new MetaMaskSDK(options);
      await MMSDK.init();

      const provider = MMSDK.getProvider();
      if (!provider) {
        throw new Error("MetaMask 프로바이더를 가져올 수 없습니다.");
      }

      const web3Instance = new Web3(provider);

      // 토큰 컨트랙트 인스턴스 생성
      const tokenContract = new web3Instance.eth.Contract(
        TURTLE_TOKEN_ABI,
        TURTLE_TOKEN_ADDRESS
      ) as unknown as Contract<typeof TURTLE_TOKEN_ABI>;

      // 연결된 계정 가져오기
      const accounts = await web3Instance.eth.getAccounts();
      const account = accounts.length > 0 ? accounts[0] : "";

      // 계정 변경 이벤트 리스너 설정
      provider.on('accountsChanged', (...args: unknown[]) => {
        const accounts = args[0] as string[];
        get().handleAccountsChanged(accounts);
      });

      // 상태 업데이트
      set({
        MMSDK,
        web3: web3Instance,
        contract: tokenContract,
        account,
        isInitialized: true,
        error: null,
      });
    } catch (error) {
      console.error("Failed to initialize MetaMask SDK:", error);
      set({ error: `MetaMask 초기화에 실패했습니다: ${(error as Error).message}` });
    }
  },

  connectWallet: async () => {
    const { MMSDK, isInitialized } = get();
    if (!MMSDK || !isInitialized) {
      try {
        await get().initializeSDK();
      } catch (error) {
        set({ error: `MetaMask SDK 초기화 실패: ${(error as Error).message}` });
        return;
      }
    }

    try {
      // MetaMask 연결 요청
      const accounts = await get().MMSDK!.connect();
      if (accounts && accounts.length > 0) {
        set({ account: accounts[0], error: null });
      } else {
        throw new Error("연결된 계정이 없습니다.");
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      set({ error: `지갑 연결에 실패했습니다: ${(error as Error).message}` });
    }
  },

  handleAccountsChanged: (accounts: string[]) => {
    if (accounts.length === 0) {
      // MetaMask가 잠겼거나 계정이 연결되지 않은 경우
      set({ account: "", error: "MetaMask가 잠겨있거나 계정이 연결되지 않았습니다." });
    } else if (accounts[0] !== get().account) {
      // 현재 계정 업데이트
      set({ account: accounts[0], error: null });
    }
  },
}));