import React, { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { FaSpinner } from "@react-icons/all-files/fa/FaSpinner"
import { FaExchangeAlt } from "@react-icons/all-files/fa/FaExchangeAlt";
import { useWeb3Store } from "../../store/useWeb3Store";
import { useMetaMaskSDKStore } from "../../store/useMetaMaskSDKStore";

// 토큰 교환 비율 설정
const EXCHANGE_RATE = 5000000; // 1 ETH = 5,000,000 TURT

const Wallet: React.FC = () => {
  // useWeb3Store에서 필요한 상태와 함수 가져오기
  const { web3, account, tokenContract, error: web3Error, connectWallet } = useWeb3Store();
  
  // useMetaMaskSDKStore에서 필요한 함수 가져오기
  const { initializeSDK } = useMetaMaskSDKStore();

  // 지갑 관련 상태 관리
  const [balance, setBalance] = useState<string>("0");
  const [ethBalance, setEthBalance] = useState<string>("0");
  const [fromCurrency, setFromCurrency] = useState<"ETH" | "TURT">("ETH");
  const [toCurrency, setToCurrency] = useState<"ETH" | "TURT">("TURT");
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 컴포넌트 마운트 시 MetaMask SDK 초기화
  useEffect(() => {
    initializeSDK();
  }, [initializeSDK]);

  // 잔액 로드 함수
  const loadBalances = useCallback(async () => {
    if (web3 && tokenContract && account) {
      try {
        // TURT 잔액 조회
        const turtBalance: number = await tokenContract.methods.balanceOf(account).call();
        setBalance(Web3.utils.fromWei(turtBalance, "ether"));

        // ETH 잔액 조회
        const ethBalance = await web3.eth.getBalance(account);
        setEthBalance(Web3.utils.fromWei(ethBalance, "ether"));
      } catch (error) {
        console.error("Error updating balances:", error);
        setError("잔액을 업데이트하는 중 오류가 발생했습니다");
      }
    }
  }, [web3, tokenContract, account]);

  // 계정 변경 시 잔액 업데이트
  useEffect(() => {
    loadBalances();
  }, [loadBalances, account]);

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
    if (!web3 || !tokenContract || !account) {
      setError("Web3 또는 계정이 초기화되지 않았습니다");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // buyTokens 함수 호출
      const result = await tokenContract.methods.buyTokens().send({
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
    if (!web3 || !tokenContract || !account) {
      setError("Web3 또는 계정이 초기화되지 않았습니다");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // sellTokens 함수 호출
      const turtAmountWei = Web3.utils.toWei(fromAmount, "ether");
      const result = await tokenContract.methods.sellTokens(turtAmountWei).send({ from: account });

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
    <div className="bg-[#F6CA19] text-black p-6 rounded-[10px] w-full shadow-md">
      {/* 계정 정보 및 잔액 표시 */}
      <div className="mt-3 mb-4">
        <div className="truncate w-70">
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
      {(error || web3Error) && (
        <div className="text-red-500 mb-4">
          {error || web3Error}
        </div>
      )}
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
              <FaExchangeAlt />
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