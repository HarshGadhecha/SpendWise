import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Wallet, Transaction, Budget, Goal, Bill, Investment, LifeInsurance } from '@/lib/types';

type Timestamp = FirebaseFirestoreTypes.Timestamp;

class FirebaseService {
  // Wallets
  async saveWallet(wallet: Wallet): Promise<void> {
    await db().collection('wallets').doc(wallet.id).set({
      ...wallet,
      createdAt: firestore.Timestamp.fromDate(wallet.createdAt),
      updatedAt: firestore.Timestamp.fromDate(wallet.updatedAt),
    });
  }

  async getWallets(userId: string): Promise<Wallet[]> {
    const snapshot = await db()
      .collection('wallets')
      .where('userId', '==', userId)
      .get();
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Wallet[];
  }

  // Transactions
  async saveTransaction(transaction: Transaction): Promise<void> {
    await db().collection('transactions').doc(transaction.id).set({
      ...transaction,
      date: firestore.Timestamp.fromDate(transaction.date),
      createdAt: firestore.Timestamp.fromDate(transaction.createdAt),
      updatedAt: firestore.Timestamp.fromDate(transaction.updatedAt),
    });
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    const snapshot = await db()
      .collection('transactions')
      .where('userId', '==', userId)
      .orderBy('date', 'desc')
      .get();
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
    await db().collection('budgets').doc(budget.id).set({
      ...budget,
      startDate: firestore.Timestamp.fromDate(budget.startDate),
      endDate: firestore.Timestamp.fromDate(budget.endDate),
      createdAt: firestore.Timestamp.fromDate(budget.createdAt),
      updatedAt: firestore.Timestamp.fromDate(budget.updatedAt),
    });
  }

  async getBudgets(userId: string): Promise<Budget[]> {
    const snapshot = await db()
      .collection('budgets')
      .where('userId', '==', userId)
      .get();
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
    await db().collection('goals').doc(goal.id).set({
      ...goal,
      deadline: goal.deadline ? firestore.Timestamp.fromDate(goal.deadline) : null,
      createdAt: firestore.Timestamp.fromDate(goal.createdAt),
      updatedAt: firestore.Timestamp.fromDate(goal.updatedAt),
    });
  }

  async getGoals(userId: string): Promise<Goal[]> {
    const snapshot = await db()
      .collection('goals')
      .where('userId', '==', userId)
      .get();
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
    await db().collection('bills').doc(bill.id).set({
      ...bill,
      dueDate: firestore.Timestamp.fromDate(bill.dueDate),
      paidDate: bill.paidDate ? firestore.Timestamp.fromDate(bill.paidDate) : null,
      createdAt: firestore.Timestamp.fromDate(bill.createdAt),
      updatedAt: firestore.Timestamp.fromDate(bill.updatedAt),
    });
  }

  async getBills(userId: string): Promise<Bill[]> {
    const snapshot = await db()
      .collection('bills')
      .where('userId', '==', userId)
      .get();
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
    await db().collection('investments').doc(investment.id).set({
      ...investment,
      startDate: firestore.Timestamp.fromDate(investment.startDate),
      maturityDate: investment.maturityDate
        ? firestore.Timestamp.fromDate(investment.maturityDate)
        : null,
      createdAt: firestore.Timestamp.fromDate(investment.createdAt),
      updatedAt: firestore.Timestamp.fromDate(investment.updatedAt),
    });
  }

  async getInvestments(userId: string): Promise<Investment[]> {
    const snapshot = await db()
      .collection('investments')
      .where('userId', '==', userId)
      .get();
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
    await db().collection('insurance').doc(insurance.id).set({
      ...insurance,
      startDate: firestore.Timestamp.fromDate(insurance.startDate),
      endDate: firestore.Timestamp.fromDate(insurance.endDate),
      nextPremiumDate: firestore.Timestamp.fromDate(insurance.nextPremiumDate),
      createdAt: firestore.Timestamp.fromDate(insurance.createdAt),
      updatedAt: firestore.Timestamp.fromDate(insurance.updatedAt),
    });
  }

  async getInsurance(userId: string): Promise<LifeInsurance[]> {
    const snapshot = await db()
      .collection('insurance')
      .where('userId', '==', userId)
      .get();
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
  async deleteDocument(collectionName: string, id: string): Promise<void> {
    await db().collection(collectionName).doc(id).delete();
  }

  // Real-time listeners
  subscribeToCollection(
    collectionName: string,
    userId: string,
    callback: (data: any[]) => void
  ): () => void {
    return db()
      .collection(collectionName)
      .where('userId', '==', userId)
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        callback(data);
      });
  }
}

export const firebaseService = new FirebaseService();
