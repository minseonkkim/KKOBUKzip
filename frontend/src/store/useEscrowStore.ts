import { create } from 'zustand';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import TurtleEscrowABI from '../abi/TurtleEscrow.json';

interface TurtleEscrowState {
  web3: Web3 | null;
  contract: Contract<AbiItem[]> | null;
  account: string | null;
  transactionDetails: TransactionDetails | Partial<TransactionDetails> | null;
  error: string | null;
  initializeEscrowWeb3: () => Promise<void>;
  createTransaction: (isAuction: boolean, transactionId: number, seller: string, amount: number) => Promise<void>;
  releaseFunds: (isAuction: boolean, transactionId: number) => Promise<void>;
  refund: (isAuction: boolean, transactionId: number) => Promise<void>;
  getTransactionDetails: (isAuction: boolean, transactionId: number) => Promise<void>;
  setArbiter: (newArbiter: string) => Promise<void>;
  updateLockPeriod: (isAuction: boolean, transactionId: number, newLockPeriod: number) => Promise<void>;
}

interface TransactionDetails {
  buyer: string,
  seller: string,
  amount: string,
  state: number,
  createdAt: number,
  lockPeriod: number
}

const TURTLE_ESCROW_ADDRESS = "0x8A2453A5c1846Aa73143aFf35C054c4cE41BeB91";

export const useEscrowStore = create<TurtleEscrowState>((set, get) => ({
  web3: null,
  contract: null,
  account: null,
  transactionDetails: null,
  error: null,

  initializeEscrowWeb3: async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(TurtleEscrowABI.abi as AbiItem[], TURTLE_ESCROW_ADDRESS);
        
        set({ web3, contract, account: accounts[0] });
      } catch {
        set({ error: 'Failed to connect to Web3' });
      }
    } else {
      set({ error: 'Web3 not found' });
    }
  },

  createTransaction: async (isAuction: boolean, transactionId: number, seller: string, amount: number) => {
    const { contract, account } = get();
    if (!contract || !account) return;

    try {
      await contract.methods.createTransaction(isAuction, transactionId, seller, amount).send({ from: account });
      set({ error: null });
    } catch {
      set({ error: "Failed to create transaction" });
    }
  },

  releaseFunds: async (isAuction: boolean, transactionId: number) => {
    const { contract, account } = get();
    if (!contract || !account) return;

    try {
      await contract.methods.releaseFunds(isAuction, transactionId).send({ from: account });
      set({ error: null });
    } catch {
      set({ error: "Failed to release funds" });
    }
  },

  refund: async (isAuction: boolean, transactionId: number) => {
    const { contract, account } = get();
    if (!contract || !account) return;

    try {
      await contract.methods.refund(isAuction, transactionId).send({ from: account });
      set({ error: null });
    } catch {
      set({ error: "Failed to refund" });
    }
  },

  getTransactionDetails: async (isAuction: boolean, transactionId: number) => {
    const { contract } = get();
    if (!contract) return;

    try {
      const details: TransactionDetails | Partial<TransactionDetails> = await contract.methods.getTransactionDetails(isAuction, transactionId).call();
      set({ transactionDetails: details, error: null });
    } catch {
      set({ error: "Failed to get transaction details" });
    }
  },

  setArbiter: async (newArbiter: string) => {
    const { contract, account } = get();
    if (!contract || !account) return;

    try {
      await contract.methods.setArbiter(newArbiter).send({ from: account });
      set({ error: null });
    } catch {
      set({ error: "Failed to set arbiter" });
    }
  },

  updateLockPeriod: async (isAuction: boolean, transactionId: number, newLockPeriod: number) => {
    const { contract, account } = get();
    if (!contract || !account) return;

    try {
      await contract.methods.updateLockPeriod(isAuction, transactionId, newLockPeriod).send({ from: account });
      set({ error: null });
    } catch {
      set({ error: "Failed to update lock period"});
    }
  }
}));