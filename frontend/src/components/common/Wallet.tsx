import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import TurtleTokenAbi from "../../abi/TurtleToken.json";

const TURTLE_TOKEN_ABI: AbiItem[] = TurtleTokenAbi.abi as AbiItem[];
const TURTLE_TOKEN_ADDRESS = "0x5a26D7A93226041900A264d8F216f8216e6e7ef5";
const EXCHANGE_RATE = 3000000; // 1 ETH = 3,000,000 TURT

declare global {
  interface Window {
    ethereum?: any;
  }
}

const Wallet: React.FC = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string>("");
  const [contract, setContract] = useState<any | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [ethBalance, setEthBalance] = useState<string>("0");
  const [fromCurrency, setFromCurrency] = useState<"ETH" | "TURT">("ETH");
  const [toCurrency, setToCurrency] = useState<"ETH" | "TURT">("TURT");
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");

  // - 컴포넌트 초기화 및 MetaMask 연결
  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== "undefined") {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);

          const tokenContract = new web3Instance.eth.Contract(TURTLE_TOKEN_ABI, TURTLE_TOKEN_ADDRESS);
          setContract(tokenContract);
        } catch (error) {
          console.error("사용자가 계정 접근을 거부했거나 오류가 발생했습니다", error);
        }
      } else {
        console.log("MetaMask를 설치해주세요!");
      }
    };

    init();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount("");
        }
      });
    }

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, []);

  // - 잔고 로드 (TURT 및 ETH)
  useEffect(() => {
    const loadBalances = async () => {
      if (web3 && contract && account) {
        const turtBalance = await contract.methods.balanceOf(account).call();
        setBalance(Web3.utils.fromWei(turtBalance, "ether"));

        const ethBalance = await web3.eth.getBalance(account);
        setEthBalance(Web3.utils.fromWei(ethBalance, "ether"));
      }
    };

    loadBalances();
  }, [web3, contract, account]);

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

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    handleFromAmountChange(toAmount);
  };

  const handleBuyTurt = async () => {
    if (!web3 || !contract || !account) return;

    try {
      await contract.methods.buyTokens().send({
        from: account,
        value: Web3.utils.toWei(fromAmount, "ether"),
      });
      const newBalance = await contract.methods.balanceOf(account).call();
      setBalance(Web3.utils.fromWei(newBalance, "ether"));
      const newEthBalance = await web3.eth.getBalance(account);
      setEthBalance(Web3.utils.fromWei(newEthBalance, "ether"));
      setFromAmount("");
      setToAmount("");
    } catch (error) {
      console.error("TURT 구매 중 오류 발생:", error);
    }
  };

  const handleSellTurt = async () => {
    if (!web3 || !contract || !account) return;

    try {
      const turtAmountWei = Web3.utils.toWei(fromAmount, "ether");
      await contract.methods.sellTokens(turtAmountWei).send({ from: account });
      const newBalance = await contract.methods.balanceOf(account).call();
      setBalance(Web3.utils.fromWei(newBalance, "ether"));
      const newEthBalance = await web3.eth.getBalance(account);
      setEthBalance(Web3.utils.fromWei(newEthBalance, "ether"));
      setFromAmount("");
      setToAmount("");
    } catch (error) {
      console.error("TURT 판매 중 오류 발생:", error);
    }
  };

  return (
    <div className="bg-yellow-400 text-black p-4 rounded-lg shadow-md w-[300px]">
      <h2 className="font-bold text-xl mb-4">내 지갑</h2>
      <div className="mb-4">
        <div className="truncate">활성 지갑 주소: {account}</div>
        <div>보유 ETH: {parseFloat(ethBalance).toFixed(4)} ETH</div>
        <div>보유 TURT: {parseFloat(balance).toFixed()} TURT</div>
      </div>
      <div className="flex flex-col space-y-2 mb-4">
        <div className="relative">
          <input type="number" value={fromAmount} onChange={(e) => handleFromAmountChange(e.target.value)} step={fromCurrency === "ETH" ? "0.001" : "1"} min="0" className="w-full p-2 pr-16 border border-gray-300 rounded bg-white" placeholder="0" />
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 font-semibold">{fromCurrency}</span>
        </div>
        <button onClick={handleSwap} className="self-center p-1 bg-white rounded-full shadow-md hover:bg-gray-100">
          ⇅
        </button>
        <div className="relative">
          <input type="text" value={toAmount} readOnly className="w-full p-2 pr-16 border border-gray-300 rounded bg-white" placeholder="0" />
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 font-semibold">{toCurrency}</span>
        </div>
      </div>
      <button onClick={fromCurrency === "ETH" ? handleBuyTurt : handleSellTurt} className="w-full bg-white text-black py-2 px-4 rounded hover:bg-gray-100 transition duration-200 font-semibold">
        환전하기
      </button>
    </div>
  );
};

export default Wallet;
