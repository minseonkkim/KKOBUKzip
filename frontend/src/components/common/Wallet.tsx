import React, { useState, useEffect, useCallback } from "react";
import { MetaMaskSDK } from "@metamask/sdk";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import TurtleTokenAbi from "../../abi/TurtleToken.json";
import { FaArrowRightArrowLeft, FaSpinner } from "react-icons/fa6";

// 토큰 컨트랙트 관련 정보
const TURTLE_TOKEN_ABI: AbiItem[] = TurtleTokenAbi.abi as AbiItem[];
const TURTLE_TOKEN_ADDRESS = "0x73b0697A8A69193e5842497Cc010cB1F34A93a0a";
const EXCHANGE_RATE = 5000000; // 1 ETH = 5,000,000 TURT

const Wallet: React.FC = () => {
  const [MMSDK, setMMSDK] = useState<MetaMaskSDK | null>(null);    // - MetaMask SDK 인스턴스
  const [web3, setWeb3] = useState<Web3 | null>(null);    // - Web3 인스턴스
  const [account, setAccount] = useState<string>("");    // - 연결된 계정 주소
  const [contract, setContract] = useState<Contract<typeof TURTLE_TOKEN_ABI> | null>(null);    // - TurtleToken 컨트랙트 인스턴스
  const [balance, setBalance] = useState<string>("0");    // - TURT 토큰 잔액
  const [ethBalance, setEthBalance] = useState<string>("0");    // - ETH 잔액
  const [fromCurrency, setFromCurrency] = useState<"ETH" | "TURT">("ETH");    // - 환전 시 출발 통화 (ETH 또는 TURT)
  const [toCurrency, setToCurrency] = useState<"ETH" | "TURT">("TURT");    // - 환전 시 도착 통화 (ETH 또는 TURT)
  const [fromAmount, setFromAmount] = useState<string>("");    // - 환전할 금액 (출발 통화 기준)
  const [toAmount, setToAmount] = useState<string>("");    // - 환전 결과 금액 (도착 통화 기준)
  const [error, setError] = useState<string | null>(null);    // - 오류 메시지
  const [isLoading, setIsLoading] = useState(false);    // - 로딩 상태

  // MetaMask SDK 초기화 및 연결 설정
  useEffect(() => {
    const initSDK = async () => {
      try {
        // MetaMask SDK 인스턴스 생성
        const MMSDK = new MetaMaskSDK({
          dappMetadata: {
            name: "KkobukZIP",
            url: window.location.href,
          },
        });
        setMMSDK(MMSDK);
        
        // SDK 초기화
        await MMSDK.init();
        
        // Web3 인스턴스 생성
        const provider = MMSDK.getProvider();
        const web3Instance = new Web3(provider);
        setWeb3(web3Instance);
        
        // TurtleToken 컨트랙트 인스턴스 생성
        const tokenContract = new web3Instance.eth.Contract(TURTLE_TOKEN_ABI, TURTLE_TOKEN_ADDRESS) as unknown as Contract<typeof TURTLE_TOKEN_ABI>;
        setContract(tokenContract);
        
        // 연결된 계정 확인
        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error("Failed to initialize MetaMask SDK:", error);
        setError("MetaMask 초기화에 실패했습니다.");
      }
    };

    initSDK();
  }, []);

  // MetaMask 지갑 연결 함수
  const connectWallet = async () => {
    if (!MMSDK) {
      setError("MetaMask SDK가 초기화되지 않았습니다.");
      return;
    }

    try {
      const accounts = await MMSDK.connect();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setError(null);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setError("지갑 연결에 실패했습니다.");
    }
  };

  // 잔액 로드 함수
  const loadBalances = useCallback(async () => {
    if (web3 && contract && account) {
      try {
        // TURT 잔액 조회
        const turtBalance: number = await contract.methods.balanceOf(account).call();
        setBalance(Web3.utils.fromWei(turtBalance, "ether"));

        // ETH 잔액 조회
        const ethBalance: bigint = await web3.eth.getBalance(account);
        setEthBalance(Web3.utils.fromWei(ethBalance, "ether"));
      } catch (error) {
        console.error("Error updating balances:", error);
        setError("잔액을 업데이트하는 중 오류가 발생했습니다");
      }
    }
  }, [web3, contract, account]);

  // 계정이 변경될 때마다 잔액 업데이트
  useEffect(() => {
    loadBalances();
  }, [loadBalances]);

  // 환전 금액 입력 처리 함수
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    if (value === "") {
      setToAmount("");
    } else {
      const fromValue = parseFloat(value);
      if (!isNaN(fromValue)) {
        if (fromCurrency === "ETH") {
          setToAmount((fromValue * EXCHANGE_RATE).toFixed());
        } else {
          setToAmount((fromValue / EXCHANGE_RATE).toFixed(3));
        }
      } else {
        setToAmount("NaN");
      }
    }
  };

  // 통화 교환 함수
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    handleFromAmountChange(toAmount);
  };

  // TURT 구매 함수
  const handleBuyTurt = async () => {
    if (!web3 || !contract || !account) {
      setError("Web3 또는 계정이 초기화되지 않았습니다");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // buyTokens 함수 호출
      const result = await contract.methods.buyTokens().send({
        from: account,
        value: Web3.utils.toWei(fromAmount, "ether"),
      });

      if (result.status) {
        await loadBalances();
        setFromAmount("");
        setToAmount("");
      }
    } catch (error) {
      console.error("TURT 구매 중 오류가 발생했습니다:", error);
      setError("TURT 구매 중 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  // TURT 판매 함수
  const handleSellTurt = async () => {
    if (!web3 || !contract || !account) {
      setError("Web3 또는 계정이 초기화되지 않았습니다");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // sellTokens 함수 호출
      const turtAmountWei = Web3.utils.toWei(fromAmount, "ether");
      const result = await contract.methods.sellTokens(turtAmountWei).send({ from: account });

      if (result.status) {
        await loadBalances();
        setFromAmount("");
        setToAmount("");
      }
    } catch (error) {
      console.error("TURT 판매 중 오류가 발생했습니다:", error);
      setError("TURT 판매 중 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-yellow-400 text-black p-6 rounded-[10px] w-full max-w-[400px] shadow-md">
      {/* 계정 정보 및 잔액 표시 */}
      <div className="mt-4 mb-4">
        <div className="truncate">
          <span className="font-semibold">활성 지갑 주소 |</span> {account || "연결되지 않음"}
        </div>
        <div>
          <span className="font-semibold">보유 ETH |</span> {parseFloat(ethBalance).toFixed(4)} ETH
        </div>
        <div>
          <span className="font-semibold">보유 TURT |</span> {parseFloat(balance).toFixed()} TURT
        </div>
      </div>
      {/* 오류 메시지 표시 */}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {account ? (
        <>
          {/* 환전 입력 필드 */}
          <div className="flex space-x-2 mb-4">
            <div className="relative flex-1">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                step={fromCurrency === "ETH" ? "0.001" : "1"}
                min="0"
                className="w-full p-2 pr-16 border-2 border-yellow-600 rounded bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300"
                placeholder="0"
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 font-semibold">{fromCurrency}</span>
            </div>
            {/* 통화 교환 버튼 */}
            <button onClick={handleSwap} className="self-center p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
              <FaArrowRightArrowLeft />
            </button>
            <div className="relative flex-1">
              <input
                type="text"
                value={toAmount}
                readOnly
                className="w-full p-2 pr-16 border-2 border-gray-300 rounded bg-slate-200 focus:outline-none"
                placeholder="0"
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 font-semibold">{toCurrency}</span>
            </div>
          </div>
          {/* 환전 버튼 */}
          <button
            onClick={fromCurrency === "ETH" ? handleBuyTurt : handleSellTurt}
            className={`w-full bg-white text-black py-2 px-4 rounded transition duration-200 font-semibold ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:ring-4 hover:ring-yellow-300"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                처리 중... 잠시만 기다려 주세요!
              </span>
            ) : (
              "환전하기"
            )}
          </button>
        </>
      ) : (
        // 지갑 연결 버튼
        <button
          onClick={connectWallet}
          className="w-full bg-white text-black py-2 px-4 rounded transition duration-200 font-semibold hover:ring-4 hover:ring-yellow-300"
        >
          MetaMask 연결
        </button>
      )}
    </div>
  );
};

export default Wallet;