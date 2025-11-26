import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTransactionStore } from '@/lib/store/useTransactionStore';
import { useWalletStore } from '@/lib/store/useWalletStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Transaction, TransactionCategory } from '@/lib/types';
import { EXPENSE_CATEGORIES, CATEGORY_ICONS, CATEGORY_NAMES } from '@/lib/constants/categories';

export default function AddExpenseScreen() {
  const { user } = useAuthStore();
  const { wallets } = useWalletStore();
  const { addTransaction } = useTransactionStore();

  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory>('food');
  const [selectedWallet, setSelectedWallet] = useState(wallets[0]?.id || '');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());

  const handleAddExpense = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!selectedWallet) {
      Alert.alert('Error', 'Please select a wallet');
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      userId: user?.id || '',
      walletId: selectedWallet,
      type: 'expense',
      amount: parseFloat(amount),
      category: selectedCategory,
      description: description || CATEGORY_NAMES[selectedCategory],
      notes,
      date,
      isRecurring: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addTransaction(transaction);
    Alert.alert('Success', 'Expense added successfully!', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Expense</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Amount Input */}
        <View style={styles.amountSection}>
          <Text style={styles.currencySymbol}>{user?.currency || 'USD'}</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            autoFocus
          />
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoryGrid}>
            {EXPENSE_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={styles.categoryIcon}>{CATEGORY_ICONS[category]}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {CATEGORY_NAMES[category]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Wallet Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wallet</Text>
          <View style={styles.walletList}>
            {wallets.map((wallet) => (
              <TouchableOpacity
                key={wallet.id}
                style={[
                  styles.walletButton,
                  selectedWallet === wallet.id && styles.walletButtonActive,
                ]}
                onPress={() => setSelectedWallet(wallet.id)}
              >
                <Text style={styles.walletIcon}>{wallet.icon}</Text>
                <Text
                  style={[
                    styles.walletText,
                    selectedWallet === wallet.id && styles.walletTextActive,
                  ]}
                >
                  {wallet.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description (Optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Lunch at restaurant, Grocery shopping"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (Optional)</Text>
          <TextInput
            style={[styles.textInput, styles.notesInput]}
            placeholder="Add any additional notes..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Add Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
          <Text style={styles.addButtonText}>Add Expense</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    fontSize: 28,
    color: '#374151',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  scrollContent: {
    padding: 20,
  },
  amountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#ef4444',
    borderRadius: 20,
    marginBottom: 24,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 8,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    minWidth: 150,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    width: '31%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  categoryButtonActive: {
    borderColor: '#ef4444',
    backgroundColor: '#fee2e2',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#dc2626',
    fontWeight: '600',
  },
  walletList: {
    gap: 12,
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  walletButtonActive: {
    borderColor: '#ef4444',
    backgroundColor: '#fee2e2',
  },
  walletIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  walletText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  walletTextActive: {
    color: '#dc2626',
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 40,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
