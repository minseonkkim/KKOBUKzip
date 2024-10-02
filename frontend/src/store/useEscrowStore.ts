import { create } from 'zustand';
import { useWeb3Store } from './useWeb3Store';

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
  createTransaction: (isAuction: boolean, transactionId: number, seller: string, amount: number) => Promise<boolean | undefined>;
  releaseFunds: (isAuction: boolean, transactionId: number) => Promise<boolean | undefined>;
  refund: (isAuction: boolean, transactionId: number) => Promise<void>;
  getTransactionDetails: (isAuction: boolean, transactionId: number) => Promise<void>;
  setArbiter: (newArbiter: string) => Promise<void>;
  updateLockPeriod: (isAuction: boolean, transactionId: number, newLockPeriod: number) => Promise<void>;
}

export const useEscrowStore = create<EscrowState>((set) => ({
  transactionDetails: null,
  error: null,

  createTransaction: async (isAuction: boolean, transactionId: number, seller: string, amount: number) => {
    const { account } = useWeb3Store.getState();
    const escrowContract = useWeb3Store.getState().getEscrowContract();
    if (!escrowContract || !account) {
      set({ error: "Escrow contract or account not initialized" });
      return;
    }

    try {
      await escrowContract.methods.createTransaction(isAuction, transactionId, seller, amount).send({ from: account });
      set({ error: null });
      return true;
    } catch {
      set({ error: "Failed to create transaction" });
      return false;
    }
  },

  releaseFunds: async (isAuction: boolean, transactionId: number) => {
    const { account } = useWeb3Store.getState();
    const escrowContract = useWeb3Store.getState().getEscrowContract();
    if (!escrowContract || !account) {
      set({ error: "Escrow contract or account not initialized" });
      return;
    }

    try {
      await escrowContract.methods.releaseFunds(isAuction, transactionId).send({ from: account });
      set({ error: null });
      return true;
    } catch {
      set({ error: "Failed to release funds" });
      return false;
    }
  },

  refund: async (isAuction: boolean, transactionId: number) => {
    const { account } = useWeb3Store.getState();
    const escrowContract = useWeb3Store.getState().getEscrowContract();
    if (!escrowContract || !account) {
      set({ error: "Escrow contract or account not initialized" });
      return;
    }

    try {
      await escrowContract.methods.refund(isAuction, transactionId).send({ from: account });
      set({ error: null });
    } catch {
      set({ error: "Failed to refund" });
    }
  },

  getTransactionDetails: async (isAuction: boolean, transactionId: number) => {
    const escrowContract = useWeb3Store.getState().getEscrowContract();
    if (!escrowContract) {
      set({ error: "Escrow contract not initialized" });
      return;
    }

    try {
      const details: TransactionDetails = await escrowContract.methods.getTransactionDetails(isAuction, transactionId).call();
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

  updateLockPeriod: async (isAuction: boolean, transactionId: number, newLockPeriod: number) => {
    const { account } = useWeb3Store.getState();
    const escrowContract = useWeb3Store.getState().getEscrowContract();
    if (!escrowContract || !account) {
      set({ error: "Escrow contract or account not initialized" });
      return;
    }

    try {
      await escrowContract.methods.updateLockPeriod(isAuction, transactionId, newLockPeriod).send({ from: account });
      set({ error: null });
    } catch {
      set({ error: "Failed to update lock period"});
    }
  }
}));