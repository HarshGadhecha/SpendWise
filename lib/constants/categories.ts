import { TransactionCategory } from '@/lib/types';

export const INCOME_CATEGORIES: TransactionCategory[] = [
  'salary',
  'freelance',
  'business',
  'investment',
  'rental',
  'other_income',
];

export const EXPENSE_CATEGORIES: TransactionCategory[] = [
  'food',
  'transport',
  'shopping',
  'bills',
  'entertainment',
  'health',
  'education',
  'groceries',
  'emi',
  'insurance',
  'other_expense',
];

export const CATEGORY_ICONS: Record<TransactionCategory, string> = {
  // Income
  salary: '💼',
  freelance: '💻',
  business: '🏢',
  investment: '📈',
  rental: '🏠',
  other_income: '💰',

  // Expense
  food: '🍔',
  transport: '🚗',
  shopping: '🛍️',
  bills: '📄',
  entertainment: '🎬',
  health: '⚕️',
  education: '📚',
  groceries: '🛒',
  emi: '💳',
  insurance: '🛡️',
  other_expense: '💸',
};

export const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  // Income (Green shades)
  salary: '#10b981',
  freelance: '#34d399',
  business: '#059669',
  investment: '#047857',
  rental: '#065f46',
  other_income: '#6ee7b7',

  // Expense (Red/Orange shades)
  food: '#ef4444',
  transport: '#f59e0b',
  shopping: '#ec4899',
  bills: '#8b5cf6',
  entertainment: '#6366f1',
  health: '#f43f5e',
  education: '#3b82f6',
  groceries: '#84cc16',
  emi: '#f97316',
  insurance: '#14b8a6',
  other_expense: '#64748b',
};

export const CATEGORY_NAMES: Record<TransactionCategory, string> = {
  salary: 'Salary',
  freelance: 'Freelance',
  business: 'Business',
  investment: 'Investment',
  rental: 'Rental',
  other_income: 'Other Income',

  food: 'Food & Dining',
  transport: 'Transport',
  shopping: 'Shopping',
  bills: 'Bills & Utilities',
  entertainment: 'Entertainment',
  health: 'Health & Fitness',
  education: 'Education',
  groceries: 'Groceries',
  emi: 'EMI',
  insurance: 'Insurance',
  other_expense: 'Other Expense',
};
