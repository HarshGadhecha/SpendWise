import { create } from 'zustand';
import { LifeInsurance } from '@/lib/types';

interface InsuranceState {
  policies: LifeInsurance[];
  isLoading: boolean;

  setPolicies: (policies: LifeInsurance[]) => void;
  addPolicy: (policy: LifeInsurance) => void;
  updatePolicy: (id: string, policy: Partial<LifeInsurance>) => void;
  deletePolicy: (id: string) => void;
  getActivePolicies: () => LifeInsurance[];
  getTotalCoverage: () => number;
  getTotalPremium: () => number;
}

export const useInsuranceStore = create<InsuranceState>((set, get) => ({
  policies: [],
  isLoading: false,

  setPolicies: (policies) => set({ policies }),

  addPolicy: (policy) => set((state) => ({
    policies: [...state.policies, policy]
  })),

  updatePolicy: (id, updatedPolicy) => set((state) => ({
    policies: state.policies.map((policy) =>
      policy.id === id ? { ...policy, ...updatedPolicy } : policy
    ),
  })),

  deletePolicy: (id) => set((state) => ({
    policies: state.policies.filter((policy) => policy.id !== id),
  })),

  getActivePolicies: () => {
    const { policies } = get();
    return policies.filter((p) => p.isActive);
  },

  getTotalCoverage: () => {
    const { policies } = get();
    return policies
      .filter((p) => p.isActive)
      .reduce((total, policy) => total + policy.coverageAmount, 0);
  },

  getTotalPremium: () => {
    const { policies } = get();
    return policies
      .filter((p) => p.isActive)
      .reduce((total, policy) => total + policy.premiumAmount, 0);
  },
}));
