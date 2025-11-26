import { create } from 'zustand';
import { Wallet } from '@/lib/types';

interface WalletState {
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  isLoading: boolean;

  setWallets: (wallets: Wallet[]) => void;
  addWallet: (wallet: Wallet) => void;
  updateWallet: (id: string, wallet: Partial<Wallet>) => void;
  deleteWallet: (id: string) => void;
  setSelectedWallet: (wallet: Wallet | null) => void;
  getTotalBalance: () => number;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  wallets: [],
  selectedWallet: null,
  isLoading: false,

  setWallets: (wallets) => set({ wallets }),

  addWallet: (wallet) => set((state) => ({
    wallets: [...state.wallets, wallet]
  })),

  updateWallet: (id, updatedWallet) => set((state) => ({
    wallets: state.wallets.map((wallet) =>
      wallet.id === id ? { ...wallet, ...updatedWallet } : wallet
    ),
  })),

  deleteWallet: (id) => set((state) => ({
    wallets: state.wallets.filter((wallet) => wallet.id !== id),
  })),

  setSelectedWallet: (wallet) => set({ selectedWallet: wallet }),

  getTotalBalance: () => {
    const { wallets } = get();
    return wallets.reduce((total, wallet) => total + wallet.balance, 0);
  },
}));
