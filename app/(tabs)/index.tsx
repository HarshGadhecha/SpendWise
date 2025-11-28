import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useWalletStore } from '@/lib/store/useWalletStore';
import { useTransactionStore } from '@/lib/store/useTransactionStore';
import { formatCurrency } from '@/lib/constants/currencies';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const { wallets, getTotalBalance } = useWalletStore();
  const { transactions, getTotalIncome, getTotalExpense } = useTransactionStore();
  const [refreshing, setRefreshing] = useState(false);

  const totalBalance = getTotalBalance();
  const totalIncome = getTotalIncome();
  const totalExpense = getTotalExpense();

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch data from Firebase
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.displayName || 'User'}! 👋</Text>
            <Text style={styles.subtitle}>Welcome back to MintyFlow</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push('/notifications')}
          >
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Total Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>
            {formatCurrency(totalBalance, user?.currency || 'USD')}
          </Text>

          <View style={styles.balanceStats}>
            <View style={styles.balanceStat}>
              <Text style={styles.statIcon}>📈</Text>
              <Text style={styles.statLabel}>Income</Text>
              <Text style={[styles.statAmount, styles.incomeText]}>
                +{formatCurrency(totalIncome, user?.currency || 'USD')}
              </Text>
            </View>

            <View style={styles.balanceStatDivider} />

            <View style={styles.balanceStat}>
              <Text style={styles.statIcon}>📉</Text>
              <Text style={styles.statLabel}>Expense</Text>
              <Text style={[styles.statAmount, styles.expenseText]}>
                -{formatCurrency(totalExpense, user?.currency || 'USD')}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <QuickActionButton
              icon="➕"
              label="Add Income"
              color="#10b981"
              onPress={() => router.push('/income')}
            />
            <QuickActionButton
              icon="➖"
              label="Add Expense"
              color="#ef4444"
              onPress={() => router.push('/expenses')}
            />
            <QuickActionButton
              icon="💰"
              label="Wallets"
              color="#667eea"
              onPress={() => router.push('/wallets')}
            />
            <QuickActionButton
              icon="🎯"
              label="Goals"
              color="#f59e0b"
              onPress={() => router.push('/goals')}
            />
          </View>
        </View>

        {/* Wallets Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Wallets</Text>
            <TouchableOpacity onPress={() => router.push('/wallets')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {wallets.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👛</Text>
              <Text style={styles.emptyText}>No wallets yet</Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => router.push('/wallets')}
              >
                <Text style={styles.emptyButtonText}>Create Wallet</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.walletsContainer}>
              {wallets.slice(0, 3).map((wallet) => (
                <View key={wallet.id} style={styles.walletCard}>
                  <View style={styles.walletHeader}>
                    <Text style={styles.walletIcon}>{wallet.icon || '💰'}</Text>
                    <View style={styles.walletInfo}>
                      <Text style={styles.walletName}>{wallet.name}</Text>
                      <Text style={styles.walletType}>{wallet.type}</Text>
                    </View>
                  </View>
                  <Text style={styles.walletBalance}>
                    {formatCurrency(wallet.balance, wallet.currency)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyText}>No transactions yet</Text>
              <Text style={styles.emptySubtext}>
                Start tracking your finances by adding your first transaction
              </Text>
            </View>
          ) : (
            <View style={styles.transactionsContainer}>
              {transactions.slice(0, 5).map((transaction) => (
                <View key={transaction.id} style={styles.transactionItem}>
                  <View style={styles.transactionLeft}>
                    <View
                      style={[
                        styles.transactionIconContainer,
                        {
                          backgroundColor:
                            transaction.type === 'income'
                              ? '#d1fae5'
                              : '#fee2e2',
                        },
                      ]}
                    >
                      <Text style={styles.transactionIcon}>
                        {transaction.type === 'income' ? '📈' : '📉'}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.transactionDescription}>
                        {transaction.description || transaction.category}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {new Date(transaction.date).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      transaction.type === 'income'
                        ? styles.incomeText
                        : styles.expenseText,
                    ]}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount, user?.currency || 'USD')}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Upcoming Bills/EMIs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Bills & EMIs</Text>
            <TouchableOpacity onPress={() => router.push('/emi-bills')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📄</Text>
            <Text style={styles.emptyText}>No upcoming bills</Text>
          </View>
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Insights</Text>
          <View style={styles.insightCard}>
            <Text style={styles.insightIcon}>💡</Text>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Great job!</Text>
              <Text style={styles.insightText}>
                Your expenses are 20% lower than last month
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function QuickActionButton({
  icon,
  label,
  color,
  onPress,
}: {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Text style={styles.quickActionEmoji}>{icon}</Text>
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationIcon: {
    fontSize: 20,
  },
  balanceCard: {
    backgroundColor: '#667eea',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 24,
  },
  balanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  balanceStat: {
    flex: 1,
    alignItems: 'center',
  },
  balanceStatDivider: {
    width: 1,
    backgroundColor: '#ffffff',
    opacity: 0.2,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 4,
  },
  statAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  incomeText: {
    color: '#10b981',
  },
  expenseText: {
    color: '#ef4444',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionEmoji: {
    fontSize: 24,
  },
  quickActionLabel: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
    textAlign: 'center',
  },
  walletsContainer: {
    gap: 12,
  },
  walletCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  walletIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  walletType: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  walletBalance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
  },
  transactionsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionIcon: {
    fontSize: 20,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  insightCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    color: '#78350f',
  },
});
