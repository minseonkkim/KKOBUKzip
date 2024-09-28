import { create } from "zustand";
import { MetaMaskSDK, MetaMaskSDKOptions, SDKProvider } from "@metamask/sdk";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import { detect } from "detect-browser";
import TurtleTokenAbi from "../abi/TurtleToken.json";

const TURTLE_TOKEN_ABI: AbiItem[] = TurtleTokenAbi.abi as AbiItem[];
const TURTLE_TOKEN_ADDRESS = "0xe01a5F9cb53755236d1E754eb4d42286E1b62166";

const browser = detect();

interface MetaMaskSDKState {
  MMSDK: MetaMaskSDK | null;
  web3: Web3 | null;
  account: string;
  contract: Contract<typeof TURTLE_TOKEN_ABI> | null;
  error: string | null;
  isInitialized: boolean;
  isMobile: boolean | null;
  initializeSDK: () => Promise<void>;
  connectWallet: () => Promise<void>;
  handleAccountsChanged: (accounts: string[]) => void;
  checkAndPromptForMetaMask: () => Promise<boolean>;
}

interface ExtendedSDKProvider extends SDKProvider {
  on(event: string, listener: (...args: any[]) => void): this;
  // 필요한 이벤트와 메서드를 구체적으로 정의할 수도 있습니다.
}

export const useMetaMaskSDKStore = create<MetaMaskSDKState>((set, get) => ({
  MMSDK: null,
  web3: null,
  account: "",
  contract: null,
  error: null,
  isInitialized: false,
  // 모바일 기기 감지
  isMobile: browser?.os?.includes('Android') || browser?.os?.includes('iOS') || false,

  // MetaMask SDK 초기화 함수
  initializeSDK: async () => {
    if (get().isInitialized) return;

    try {
      // SDK 옵션 설정
      const options: MetaMaskSDKOptions = {
        dappMetadata: {
          name: "KkobukZIP",
          url: window.location.href,
        },
        checkInstallationImmediately: false,
        openDeeplink: (link: string) => {
          window.open(link, "_self");
        },
      };

      // SDK 인스턴스 생성 및 초기화
      const MMSDK = new MetaMaskSDK(options);

      // 초기화 성공 시 상태 업데이트
      set({ MMSDK, isInitialized: true, error: null });
    } catch (error) {
      console.error("MetaMask SDK 초기화 실패:", error);
      set({ error: "MetaMask 초기화에 실패했습니다. 잠시 후 다시 시도해주세요." });
    }
  },

  // 지갑 연결 함수
  connectWallet: async () => {
    const { MMSDK, isInitialized, isMobile } = get();
    // SDK가 초기화되지 않은 경우 초기화 시도
    if (!MMSDK || !isInitialized) {
      try {
        await get().initializeSDK();
      } catch {
        set({ error: "MetaMask SDK 초기화에 실패했습니다. 잠시 후 다시 시도해주세요." });
        return;
      }
    }

    try {
      // 모바일인 경우 MetaMask 설치 확인
      if (isMobile) {
        const isMetaMaskInstalled = await get().checkAndPromptForMetaMask();
        if (!isMetaMaskInstalled) return;
      }

      // 프로바이더 가져오기
      const provider = MMSDK!.getProvider();
      if (!provider) {
        throw new Error("MetaMask 프로바이더를 가져올 수 없습니다.");
      }

      const extendedProvider = provider as ExtendedSDKProvider;

      // Web3 인스턴스 생성 또는 재사용
      let web3Instance = get().web3;
      if (!web3Instance) {
        web3Instance = new Web3(provider as SDKProvider);
        set({ web3: web3Instance });
      }

      // 컨트랙트 인스턴스 생성 또는 재사용
      let tokenContract = get().contract;
      if (!tokenContract) {
        tokenContract = new web3Instance.eth.Contract(
          TURTLE_TOKEN_ABI,
          TURTLE_TOKEN_ADDRESS
        ) as unknown as Contract<typeof TURTLE_TOKEN_ABI>;
        set({ contract: tokenContract });
      }

      // 계정 연결
      const accounts = await provider.request({ method: "eth_requestAccounts"}) as string[];
      if (accounts && accounts.length > 0) {
        // 연결 성공 시 상태 업데이트
        set((state) => {
          if (
            state.account !== accounts[0] ||
            state.web3 !== web3Instance ||
            state.contract !== tokenContract
          ) {
            return {
              ...state,
              web3: web3Instance,
              contract: tokenContract,
              account: accounts[0],
              error: null,
            };
          }
          return state;
        });

        // 계정 변경 이벤트 리스너 설정
        extendedProvider.on('accountsChanged', (accounts: string[]) => {
          get().handleAccountsChanged(accounts);
        });
      } else {
        throw new Error("연결된 계정이 없습니다.");
      }
    } catch (error) {
      console.error("지갑 연결 실패:", error);
      set({ error: "지갑 연결에 실패했습니다. MetaMask가 설치되어 있고 올바르게 설정되어 있는지 확인해주세요." });
    }
  },

  // 계정 변경 처리 함수
  handleAccountsChanged: (accounts: string[]) => {
    set((state) => {
      if (accounts.length === 0) {
        if (state.account !== "") {
          return {
            ...state,
            account: "",
            error: "MetaMask가 잠겨있거나 계정이 연결되지 않았습니다.",
          };
        }
      } else if (accounts[0] !== state.account) {
        return {
          ...state,
          account: accounts[0],
          error: null,
        };
      }
      return state;
    });
  },

  // MetaMask 설치 확인 및 설치 안내 함수
  checkAndPromptForMetaMask: async () => {
    const { MMSDK } = get();
    if (!MMSDK) return false;

    try {
      // MetaMask 설치 여부 확인
      const provider = MMSDK.getProvider();
      const isMetaMaskInstalled = !!provider;

      if (!isMetaMaskInstalled) {
        // MetaMask 미설치 시 설치 안내
        const confirmed = window.confirm("MetaMask가 설치되어 있지 않습니다. 앱 스토어로 이동하여 설치하시겠습니까?");
        if (confirmed) {
          window.open("https://metamask.io/download/", "_blank");
        }
        return false;
      }
      return true;
    } catch (error) {
      console.error("MetaMask 설치 확인 실패:", error);
      set({ error: "MetaMask 설치 확인에 실패했습니다. 잠시 후 다시 시도해주세요." });
      return false;
    }
  },
}));