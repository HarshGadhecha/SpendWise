// User Types
export type UserType = 'personal' | 'family' | 'business';
export type IncomeSource = 'salary' | 'pocket_money' | 'business' | 'freelance' | 'commission' | 'rental';
export type UserFocus = 'save' | 'reduce_spending' | 'track_bills' | 'shared_finances';
export type ReminderPreference = 'daily' | 'weekly' | 'important' | 'none';
export type ThemePreference = 'light' | 'dark' | 'system';

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  userType: UserType;
  incomeSource: IncomeSource;
  focus: UserFocus;
  reminderPreference: ReminderPreference;
  themePreference: ThemePreference;
  currency: string;
  hasSecretWallet: boolean;
  securityEnabled: boolean;
  biometricEnabled: boolean;
  pinEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Wallet Types
export type WalletType = 'personal' | 'family' | 'secret';

export interface Wallet {
  id: string;
  userId: string;
  name: string;
  type: WalletType;
  balance: number;
  currency: string;
  color?: string;
  icon?: string;
  isDefault: boolean;
  sharedWith?: string[]; // User IDs for family wallets
  createdAt: Date;
  updatedAt: Date;
}

// Transaction Types
export type TransactionType = 'income' | 'expense';
export type TransactionCategory =
  | 'salary' | 'freelance' | 'business' | 'investment' | 'rental' | 'other_income'
  | 'food' | 'transport' | 'shopping' | 'bills' | 'entertainment' | 'health'
  | 'education' | 'groceries' | 'emi' | 'insurance' | 'other_expense';

export interface Transaction {
  id: string;
  userId: string;
  walletId: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description?: string;
  notes?: string;
  photoURL?: string;
  date: Date;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // e.g., every 2 weeks
  endDate?: Date;
}

// Budget Types
export interface Budget {
  id: string;
  userId: string;
  name: string;
  category: TransactionCategory;
  amount: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  alertThreshold: number; // percentage (e.g., 80 for 80%)
  createdAt: Date;
  updatedAt: Date;
}

// Goal Types
export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  deadline?: Date;
  category: string;
  imageURL?: string;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Bill/EMI Types
export interface Bill {
  id: string;
  userId: string;
  walletId: string;
  name: string;
  amount: number;
  dueDate: Date;
  frequency: 'one_time' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  category: TransactionCategory;
  reminderDays: number; // days before due date
  isPaid: boolean;
  paidDate?: Date;
  notes?: string;
  autoPayEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Split Bill Types
export interface SplitBill {
  id: string;
  createdBy: string;
  name: string;
  totalAmount: number;
  currency: string;
  date: Date;
  category: TransactionCategory;
  description?: string;
  splits: Split[];
  status: 'pending' | 'partially_paid' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Split {
  userId: string;
  userName: string;
  amount: number;
  isPaid: boolean;
  paidDate?: Date;
}

// Investment Types
export type InvestmentType = 'fd' | 'rd' | 'sip' | 'mutual_fund' | 'etf' | 'other';

export interface Investment {
  id: string;
  userId: string;
  name: string;
  type: InvestmentType;
  purchaseValue: number;
  currentValue: number;
  currency: string;
  startDate: Date;
  maturityDate?: Date;
  interestRate?: number;
  institution: string;
  accountNumber?: string;
  notes?: string;
  documentURLs?: string[];
  reminderEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Life Insurance Types
export type InsuranceFrequency = 'monthly' | 'quarterly' | 'yearly';

export interface LifeInsurance {
  id: string;
  userId: string;
  policyName: string;
  provider: string;
  policyNumber: string;
  premiumAmount: number;
  premiumFrequency: InsuranceFrequency;
  coverageAmount: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  nextPremiumDate: Date;
  isActive: boolean;
  beneficiaries?: Beneficiary[];
  notes?: string;
  documentURLs?: string[];
  reminderEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Beneficiary {
  name: string;
  relationship: string;
  percentage: number;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'bill' | 'emi' | 'investment' | 'insurance' | 'budget' | 'goal' | 'insight';
  isRead: boolean;
  actionURL?: string;
  createdAt: Date;
}

// Insights Types
export interface Insight {
  id: string;
  userId: string;
  type: 'spending' | 'saving' | 'investment' | 'budget' | 'goal';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  createdAt: Date;
}

// Streak Types
export interface Streak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastLogDate: Date;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconURL: string;
  unlockedAt: Date;
}

// Export Types
export type ExportFormat = 'csv' | 'pdf';

export interface ExportData {
  transactions?: Transaction[];
  budgets?: Budget[];
  goals?: Goal[];
  bills?: Bill[];
  investments?: Investment[];
  insurance?: LifeInsurance[];
  dateRange: {
    start: Date;
    end: Date;
  };
}
