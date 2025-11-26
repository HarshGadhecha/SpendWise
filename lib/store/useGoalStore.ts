import { create } from 'zustand';
import { Goal } from '@/lib/types';

interface GoalState {
  goals: Goal[];
  isLoading: boolean;

  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addToGoal: (id: string, amount: number) => void;
  getTotalSaved: () => number;
  getTotalTarget: () => number;
  getCompletedGoals: () => Goal[];
  getActiveGoals: () => Goal[];
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  isLoading: false,

  setGoals: (goals) => set({ goals }),

  addGoal: (goal) => set((state) => ({
    goals: [...state.goals, goal]
  })),

  updateGoal: (id, updatedGoal) => set((state) => ({
    goals: state.goals.map((goal) =>
      goal.id === id ? { ...goal, ...updatedGoal } : goal
    ),
  })),

  deleteGoal: (id) => set((state) => ({
    goals: state.goals.filter((goal) => goal.id !== id),
  })),

  addToGoal: (id, amount) => set((state) => ({
    goals: state.goals.map((goal) =>
      goal.id === id
        ? {
            ...goal,
            currentAmount: goal.currentAmount + amount,
            isCompleted: goal.currentAmount + amount >= goal.targetAmount,
            updatedAt: new Date(),
          }
        : goal
    ),
  })),

  getTotalSaved: () => {
    const { goals } = get();
    return goals.reduce((total, goal) => total + goal.currentAmount, 0);
  },

  getTotalTarget: () => {
    const { goals } = get();
    return goals.reduce((total, goal) => total + goal.targetAmount, 0);
  },

  getCompletedGoals: () => {
    const { goals } = get();
    return goals.filter((g) => g.isCompleted);
  },

  getActiveGoals: () => {
    const { goals } = get();
    return goals.filter((g) => !g.isCompleted);
  },
}));
