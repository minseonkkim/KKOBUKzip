import { create } from "zustand";
import { MetaMaskSDK, MetaMaskSDKOptions } from "@metamask/sdk";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import TurtleTokenAbi from "../abi/TurtleToken.json";
import TurtleEscrowAbi from '../abi/TurtleEscrow.json';
import TurtleDocumentationAbi from "../abi/TurtleDocumentation.json"

const TURTLE_TOKEN_ADDRESS = "0xe01a5F9cb53755236d1E754eb4d42286E1b62166";
const TURTLE_TOKEN_ABI: AbiItem[] = TurtleTokenAbi.abi as AbiItem[];

const TURTLE_ESCROW_ADDRESS = "0x4C3f97793a723BEe60d27c53255aC372A23d4Ba2";
const TURTLE_ESCROW_ABI: AbiItem[] = TurtleEscrowAbi.abi as AbiItem[];

const TURTLE_DOCUMENTATION_ADDRESS = "0x472A3113E6Fc421b070DA538bB4F425AeA6cCc1b";
const TURTLE_DOCUMENTATION_ABI: AbiItem[] = TurtleDocumentationAbi.abi as AbiItem[];

interface Web3State {
  MMSDK: MetaMaskSDK | null;
  web3: Web3 | null;
  account: string;
  tokenContract: Contract<typeof TURTLE_TOKEN_ABI> | null;
  escrowContract: Contract<typeof TURTLE_ESCROW_ABI> | null;
  documentContract: Contract<typeof TURTLE_DOCUMENTATION_ABI> | null;
  error: string | null;
  isInitialized: boolean;
  initializeSDK: () => Promise<void>;
  connectWallet: () => Promise<void>;
  getTokenContract: () => Contract<typeof TURTLE_TOKEN_ABI> | null;
  getEscrowContract: () => Contract<typeof TURTLE_ESCROW_ABI> | null;
  getDocumentContract: () => Contract<typeof TURTLE_DOCUMENTATION_ABI> | null;
  handleAccountsChanged: (accounts: string[]) => void;
}

export const useWeb3Store = create<Web3State>((set, get) => ({
  MMSDK: null,
  web3: null,
  account: "",
  tokenContract: null,
  escrowContract: null,
  documentContract: null,
  error: null,
  isInitialized: false,

  initializeSDK: async () => {
    if (get().isInitialized) return;

    try {
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

      const MMSDK = new MetaMaskSDK(options);
      set({ MMSDK, isInitialized: true, error: null });

      // 전역 이벤트 리스너 설정
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.on('accountsChanged', ((accounts: unknown) => {
          if (Array.isArray(accounts)) {
            get().handleAccountsChanged(accounts);
          }
        }) as (...args: unknown[]) => void);
      }
    } catch (error) {
      console.error("MetaMask SDK 초기화 실패:", error);
      set({ error: "MetaMask 초기화에 실패했습니다. 잠시 후 다시 시도해주세요." });
    }
  },

  connectWallet: async () => {
    const { MMSDK, isInitialized } = get();
    if (!MMSDK || !isInitialized) {
      try {
        await get().initializeSDK();
      } catch {
        set({ error: "MetaMask SDK 초기화에 실패했습니다. 잠시 후 다시 시도해주세요." });
        return;
      }
    }

    try {
      const provider = MMSDK!.getProvider();
      if (!provider) {
        throw new Error("MetaMask 프로바이더를 가져올 수 없습니다.");
      }

      const web3Instance = new Web3(provider);
      const accounts = await web3Instance.eth.requestAccounts();

      if (accounts && accounts.length > 0) {
        const newAccount = web3Instance.utils.toChecksumAddress(accounts[0]);
        
        const tokenContract = new web3Instance.eth.Contract(
          TURTLE_TOKEN_ABI,
          TURTLE_TOKEN_ADDRESS
        );
        const escrowContract = new web3Instance.eth.Contract(
          TURTLE_ESCROW_ABI,
          TURTLE_ESCROW_ADDRESS
        );
        const documentContract = new web3Instance.eth.Contract(
          TURTLE_DOCUMENTATION_ABI,
          TURTLE_DOCUMENTATION_ADDRESS
        );

        set({
          web3: web3Instance,
          account: newAccount,
          tokenContract,
          escrowContract,
          documentContract,
          error: null,
        });

        console.log("wallet is connected");
      } else {
        throw new Error("연결된 계정이 없습니다.");
      }
    } catch (error) {
      console.error("지갑 연결 실패:", error);
      set({ error: "지갑 연결에 실패했습니다. MetaMask가 설치되어 있고 올바르게 설정되어 있는지 확인해주세요." });
    }
  },

  handleAccountsChanged: (accounts: string[]) => {
    const { web3 } = get();
    if (!web3) {
      console.error("Web3 인스턴스가 없습니다. 먼저 지갑을 연결해주세요.");
      return;
    }

    if (accounts.length === 0) {
      // MetaMask가 연결 해제됨
      set({ account: "", error: "MetaMask 연결이 해제되었습니다." });
    } else {
      // 새 계정으로 변경됨
      const newAccount = web3.utils.toChecksumAddress(accounts[0]);
      
      // 컨트랙트 인스턴스 재생성
      const tokenContract = new web3.eth.Contract(
        TURTLE_TOKEN_ABI,
        TURTLE_TOKEN_ADDRESS
      );
      const escrowContract = new web3.eth.Contract(
        TURTLE_ESCROW_ABI,
        TURTLE_ESCROW_ADDRESS
      );
      const documentContract = new web3.eth.Contract(
        TURTLE_DOCUMENTATION_ABI,
        TURTLE_DOCUMENTATION_ADDRESS
      );

      set({ 
        account: newAccount, 
        tokenContract, 
        escrowContract,
        documentContract,
        error: null 
      });
    }
  },

  getTokenContract: () => get().tokenContract,
  getEscrowContract: () => get().escrowContract,
  getDocumentContract: () => get().documentContract,
}));