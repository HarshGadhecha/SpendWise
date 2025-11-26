import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Wallet, Transaction, Budget, Goal, Bill, Investment, LifeInsurance } from '@/lib/types';

class FirebaseService {
  // Wallets
  async saveWallet(wallet: Wallet): Promise<void> {
    await setDoc(doc(db, 'wallets', wallet.id), {
      ...wallet,
      createdAt: Timestamp.fromDate(wallet.createdAt),
      updatedAt: Timestamp.fromDate(wallet.updatedAt),
    });
  }

  async getWallets(userId: string): Promise<Wallet[]> {
    const q = query(collection(db, 'wallets'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Wallet[];
  }

  // Transactions
  async saveTransaction(transaction: Transaction): Promise<void> {
    await setDoc(doc(db, 'transactions', transaction.id), {
      ...transaction,
      date: Timestamp.fromDate(transaction.date),
      createdAt: Timestamp.fromDate(transaction.createdAt),
      updatedAt: Timestamp.fromDate(transaction.updatedAt),
    });
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      date: doc.data().date?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Transaction[];
  }

  // Budgets
  async saveBudget(budget: Budget): Promise<void> {
    await setDoc(doc(db, 'budgets', budget.id), {
      ...budget,
      startDate: Timestamp.fromDate(budget.startDate),
      endDate: Timestamp.fromDate(budget.endDate),
      createdAt: Timestamp.fromDate(budget.createdAt),
      updatedAt: Timestamp.fromDate(budget.updatedAt),
    });
  }

  async getBudgets(userId: string): Promise<Budget[]> {
    const q = query(collection(db, 'budgets'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      startDate: doc.data().startDate?.toDate(),
      endDate: doc.data().endDate?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Budget[];
  }

  // Goals
  async saveGoal(goal: Goal): Promise<void> {
    await setDoc(doc(db, 'goals', goal.id), {
      ...goal,
      deadline: goal.deadline ? Timestamp.fromDate(goal.deadline) : null,
      createdAt: Timestamp.fromDate(goal.createdAt),
      updatedAt: Timestamp.fromDate(goal.updatedAt),
    });
  }

  async getGoals(userId: string): Promise<Goal[]> {
    const q = query(collection(db, 'goals'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      deadline: doc.data().deadline?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Goal[];
  }

  // Bills
  async saveBill(bill: Bill): Promise<void> {
    await setDoc(doc(db, 'bills', bill.id), {
      ...bill,
      dueDate: Timestamp.fromDate(bill.dueDate),
      paidDate: bill.paidDate ? Timestamp.fromDate(bill.paidDate) : null,
      createdAt: Timestamp.fromDate(bill.createdAt),
      updatedAt: Timestamp.fromDate(bill.updatedAt),
    });
  }

  async getBills(userId: string): Promise<Bill[]> {
    const q = query(collection(db, 'bills'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      dueDate: doc.data().dueDate?.toDate(),
      paidDate: doc.data().paidDate?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Bill[];
  }

  // Investments
  async saveInvestment(investment: Investment): Promise<void> {
    await setDoc(doc(db, 'investments', investment.id), {
      ...investment,
      startDate: Timestamp.fromDate(investment.startDate),
      maturityDate: investment.maturityDate
        ? Timestamp.fromDate(investment.maturityDate)
        : null,
      createdAt: Timestamp.fromDate(investment.createdAt),
      updatedAt: Timestamp.fromDate(investment.updatedAt),
    });
  }

  async getInvestments(userId: string): Promise<Investment[]> {
    const q = query(collection(db, 'investments'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      startDate: doc.data().startDate?.toDate(),
      maturityDate: doc.data().maturityDate?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Investment[];
  }

  // Life Insurance
  async saveInsurance(insurance: LifeInsurance): Promise<void> {
    await setDoc(doc(db, 'insurance', insurance.id), {
      ...insurance,
      startDate: Timestamp.fromDate(insurance.startDate),
      endDate: Timestamp.fromDate(insurance.endDate),
      nextPremiumDate: Timestamp.fromDate(insurance.nextPremiumDate),
      createdAt: Timestamp.fromDate(insurance.createdAt),
      updatedAt: Timestamp.fromDate(insurance.updatedAt),
    });
  }

  async getInsurance(userId: string): Promise<LifeInsurance[]> {
    const q = query(collection(db, 'insurance'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      startDate: doc.data().startDate?.toDate(),
      endDate: doc.data().endDate?.toDate(),
      nextPremiumDate: doc.data().nextPremiumDate?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as LifeInsurance[];
  }

  // Delete operations
  async deleteDocument(collection: string, id: string): Promise<void> {
    await deleteDoc(doc(db, collection, id));
  }

  // Real-time listeners
  subscribeToCollection(
    collectionName: string,
    userId: string,
    callback: (data: any[]) => void
  ): () => void {
    const q = query(collection(db, collectionName), where('userId', '==', userId));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      callback(data);
    });
  }
}

export const firebaseService = new FirebaseService();
