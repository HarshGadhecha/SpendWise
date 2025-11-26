import { create } from 'zustand';
import { Transaction, TransactionType } from '@/lib/types';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;

  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionsByWallet: (walletId: string) => Transaction[];
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getTotalIncome: () => number;
  getTotalExpense: () => number;
  getBalance: () => number;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,

  setTransactions: (transactions) => set({ transactions }),

  addTransaction: (transaction) => set((state) => ({
    transactions: [transaction, ...state.transactions]
  })),

  updateTransaction: (id, updatedTransaction) => set((state) => ({
    transactions: state.transactions.map((transaction) =>
      transaction.id === id ? { ...transaction, ...updatedTransaction } : transaction
    ),
  })),

  deleteTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter((transaction) => transaction.id !== id),
  })),

  getTransactionsByWallet: (walletId) => {
    const { transactions } = get();
    return transactions.filter((t) => t.walletId === walletId);
  },

  getTransactionsByType: (type) => {
    const { transactions } = get();
    return transactions.filter((t) => t.type === type);
  },

  getTotalIncome: () => {
    const { transactions } = get();
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((total, t) => total + t.amount, 0);
  },

  getTotalExpense: () => {
    const { transactions } = get();
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((total, t) => total + t.amount, 0);
  },

  getBalance: () => {
    const { getTotalIncome, getTotalExpense } = get();
    return getTotalIncome() - getTotalExpense();
  },
}));
