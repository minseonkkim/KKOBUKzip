import { create } from 'zustand';
import { useWeb3Store } from './useWeb3Store';
import { changeTransactionStateToStart, changeTransactionStateToEnd } from '../apis/tradeApi';

interface TransactionDetails {
  buyer: string,
  seller: string,
  amount: string,
  state: number,
  createdAt: number,
  lockPeriod: number
}

interface EscrowState {
  transactionDetails: TransactionDetails | null;
  error: string | null;
  createTransaction: (transactionId: number, seller: string, amount: number, turtleUuid: string, buyerUuid: string, sellerUuid: string ) => Promise<boolean | undefined>;
  releaseFunds: (transactionId: number) => Promise<boolean | undefined>;
  refund: (transactionId: number) => Promise<void>;
  getTransactionDetails: (transactionId: number) => Promise<void>;
  setArbiter: (newArbiter: string) => Promise<void>;
  updateLockPeriod: (transactionId: number, newLockPeriod: number) => Promise<void>;
}

export const useEscrowStore = create<EscrowState>((set) => ({
  transactionDetails: null,
  error: null,

  createTransaction: async (transactionId: number, seller: string, amount: number, turtleUuid: string, buyerUuid: string, sellerUuid: string) => {
    const { account } = useWeb3Store.getState();
    const escrowContract = useWeb3Store.getState().getEscrowContract();
    if (!escrowContract || !account) {
      set({ error: "Escrow contract or account not initialized" });
      return;
    }

    try {
      // 블록체인 트랜잭션 생성 함수 호출
      await escrowContract.methods.createTransaction(transactionId, seller, amount, turtleUuid, buyerUuid, sellerUuid).send({ from: account });
      // 거래에 대한 상태 변경 api
      await changeTransactionStateToStart(transactionId);
      set({ error: null });
      return true;
    } catch {
      set({ error: "Failed to create transaction" });
      return false;
    }
  },

  releaseFunds: async (transactionId: number) => {
    const { account } = useWeb3Store.getState();
    const escrowContract = useWeb3Store.getState().getEscrowContract();
    if (!escrowContract || !account) {
      set({ error: "Escrow contract or account not initialized" });
      return;
    }

    try {
      // 블록체인 트랜잭션 거래 완료 함수 호출
      await escrowContract.methods.releaseFunds(transactionId).send({ from: account });
      // 거래에 대한 상태 변경 api
      await changeTransactionStateToEnd(transactionId);
      set({ error: null });
      return true;
    } catch {
      set({ error: "Failed to release funds" });
      return false;
    }
  },

  refund: async (transactionId: number) => {
    const { account } = useWeb3Store.getState();
    const escrowContract = useWeb3Store.getState().getEscrowContract();
    if (!escrowContract || !account) {
      set({ error: "Escrow contract or account not initialized" });
      return;
    }

    try {
      await escrowContract.methods.refund(transactionId).send({ from: account });
      set({ error: null });
    } catch {
      set({ error: "Failed to refund" });
    }
  },

  getTransactionDetails: async (transactionId: number) => {
    const escrowContract = useWeb3Store.getState().getEscrowContract();
    if (!escrowContract) {
      set({ error: "Escrow contract not initialized" });
      return;
    }

    try {
      const details: TransactionDetails = await escrowContract.methods.getTransactionDetails(transactionId).call();
      set({ transactionDetails: details, error: null });
    } catch {
      set({ error: "Failed to get transaction details" });
    }
  },

  setArbiter: async (newArbiter: string) => {
    const { account } = useWeb3Store.getState();
    const escrowContract = useWeb3Store.getState().getEscrowContract();
    if (!escrowContract || !account) {
      set({ error: "Escrow contract or account not initialized" });
      return;
    }

    try {
      await escrowContract.methods.setArbiter(newArbiter).send({ from: account });
      set({ error: null });
    } catch {
      set({ error: "Failed to set arbiter" });
    }
  },

  updateLockPeriod: async (transactionId: number, newLockPeriod: number) => {
    const { account } = useWeb3Store.getState();
    const escrowContract = useWeb3Store.getState().getEscrowContract();
    if (!escrowContract || !account) {
      set({ error: "Escrow contract or account not initialized" });
      return;
    }

    try {
      await escrowContract.methods.updateLockPeriod(transactionId, newLockPeriod).send({ from: account });
      set({ error: null });
    } catch {
      set({ error: "Failed to update lock period"});
    }
  }
}));