import { create } from 'zustand';
import { Bill } from '@/lib/types';

interface BillState {
  bills: Bill[];
  isLoading: boolean;

  setBills: (bills: Bill[]) => void;
  addBill: (bill: Bill) => void;
  updateBill: (id: string, bill: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  markAsPaid: (id: string) => void;
  getUpcomingBills: () => Bill[];
  getOverdueBills: () => Bill[];
}

export const useBillStore = create<BillState>((set, get) => ({
  bills: [],
  isLoading: false,

  setBills: (bills) => set({ bills }),

  addBill: (bill) => set((state) => ({
    bills: [...state.bills, bill]
  })),

  updateBill: (id, updatedBill) => set((state) => ({
    bills: state.bills.map((bill) =>
      bill.id === id ? { ...bill, ...updatedBill } : bill
    ),
  })),

  deleteBill: (id) => set((state) => ({
    bills: state.bills.filter((bill) => bill.id !== id),
  })),

  markAsPaid: (id) => set((state) => ({
    bills: state.bills.map((bill) =>
      bill.id === id
        ? { ...bill, isPaid: true, paidDate: new Date() }
        : bill
    ),
  })),

  getUpcomingBills: () => {
    const { bills } = get();
    const now = new Date();
    return bills.filter((b) => !b.isPaid && b.dueDate > now);
  },

  getOverdueBills: () => {
    const { bills } = get();
    const now = new Date();
    return bills.filter((b) => !b.isPaid && b.dueDate < now);
  },
}));
