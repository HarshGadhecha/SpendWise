import { create } from 'zustand';
import { Budget } from '@/lib/types';

interface BudgetState {
  budgets: Budget[];
  isLoading: boolean;

  setBudgets: (budgets: Budget[]) => void;
  addBudget: (budget: Budget) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  getBudgetsByCategory: (category: string) => Budget[];
  getTotalBudget: () => number;
  getTotalSpent: () => number;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budgets: [],
  isLoading: false,

  setBudgets: (budgets) => set({ budgets }),

  addBudget: (budget) => set((state) => ({
    budgets: [...state.budgets, budget]
  })),

  updateBudget: (id, updatedBudget) => set((state) => ({
    budgets: state.budgets.map((budget) =>
      budget.id === id ? { ...budget, ...updatedBudget } : budget
    ),
  })),

  deleteBudget: (id) => set((state) => ({
    budgets: state.budgets.filter((budget) => budget.id !== id),
  })),

  getBudgetsByCategory: (category) => {
    const { budgets } = get();
    return budgets.filter((b) => b.category === category);
  },

  getTotalBudget: () => {
    const { budgets } = get();
    return budgets.reduce((total, budget) => total + budget.amount, 0);
  },

  getTotalSpent: () => {
    const { budgets } = get();
    return budgets.reduce((total, budget) => total + budget.spent, 0);
  },
}));
