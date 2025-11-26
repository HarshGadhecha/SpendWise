import { create } from 'zustand';
import { Investment } from '@/lib/types';

interface InvestmentState {
  investments: Investment[];
  isLoading: boolean;

  setInvestments: (investments: Investment[]) => void;
  addInvestment: (investment: Investment) => void;
  updateInvestment: (id: string, investment: Partial<Investment>) => void;
  deleteInvestment: (id: string) => void;
  getTotalInvested: () => number;
  getTotalCurrentValue: () => number;
  getTotalGains: () => number;
}

export const useInvestmentStore = create<InvestmentState>((set, get) => ({
  investments: [],
  isLoading: false,

  setInvestments: (investments) => set({ investments }),

  addInvestment: (investment) => set((state) => ({
    investments: [...state.investments, investment]
  })),

  updateInvestment: (id, updatedInvestment) => set((state) => ({
    investments: state.investments.map((investment) =>
      investment.id === id ? { ...investment, ...updatedInvestment } : investment
    ),
  })),

  deleteInvestment: (id) => set((state) => ({
    investments: state.investments.filter((investment) => investment.id !== id),
  })),

  getTotalInvested: () => {
    const { investments } = get();
    return investments.reduce((total, inv) => total + inv.purchaseValue, 0);
  },

  getTotalCurrentValue: () => {
    const { investments } = get();
    return investments.reduce((total, inv) => total + inv.currentValue, 0);
  },

  getTotalGains: () => {
    const { getTotalCurrentValue, getTotalInvested } = get();
    return getTotalCurrentValue() - getTotalInvested();
  },
}));
