import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useBudgetStore } from '@/lib/store/useBudgetStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Budget, TransactionCategory } from '@/lib/types';
import { EXPENSE_CATEGORIES, CATEGORY_ICONS, CATEGORY_NAMES } from '@/lib/constants/categories';
import { formatCurrency } from '@/lib/constants/currencies';

export default function BudgetsScreen() {
  const { user } = useAuthStore();
  const { budgets, addBudget, updateBudget, deleteBudget, getTotalBudget, getTotalSpent } = useBudgetStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'food' as TransactionCategory,
    amount: '',
    period: 'monthly' as 'weekly' | 'monthly' | 'yearly',
    alertThreshold: '80',
  });

  const totalBudget = getTotalBudget();
  const totalSpent = getTotalSpent();
  const budgetPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const handleCreateBudget = () => {
    if (!formData.name.trim() || !formData.amount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const startDate = new Date();
    const endDate = new Date();
    if (formData.period === 'weekly') {
      endDate.setDate(endDate.getDate() + 7);
    } else if (formData.period === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const newBudget: Budget = {
      id: Date.now().toString(),
      userId: user?.id || '',
      name: formData.name,
      category: formData.category,
      amount,
      spent: 0,
      period: formData.period,
      startDate,
      endDate,
      alertThreshold: parseFloat(formData.alertThreshold),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addBudget(newBudget);
    resetForm();
    setModalVisible(false);
    Alert.alert('Success', 'Budget created successfully!');
  };

  const handleUpdateBudget = () => {
    if (!editingBudget) return;

    updateBudget(editingBudget.id, {
      name: formData.name,
      category: formData.category,
      amount: parseFloat(formData.amount),
      period: formData.period,
      alertThreshold: parseFloat(formData.alertThreshold),
      updatedAt: new Date(),
    });

    resetForm();
    setModalVisible(false);
    setEditingBudget(null);
    Alert.alert('Success', 'Budget updated successfully!');
  };

  const handleDeleteBudget = (budgetId: string) => {
    Alert.alert(
      'Delete Budget',
      'Are you sure you want to delete this budget?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteBudget(budgetId);
            Alert.alert('Success', 'Budget deleted');
          },
        },
      ]
    );
  };

  const openEditModal = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      name: budget.name,
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period,
      alertThreshold: budget.alertThreshold.toString(),
    });
    setModalVisible(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'food',
      amount: '',
      period: 'monthly',
      alertThreshold: '80',
    });
    setEditingBudget(null);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return '#ef4444';
    if (percentage >= 80) return '#f59e0b';
    return '#10b981';
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Budgets</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.addButton}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Overview Card */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewLabel}>Total Budget</Text>
          <Text style={styles.overviewAmount}>
            {formatCurrency(totalBudget, user?.currency || 'USD')}
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(budgetPercentage, 100)}%`,
                    backgroundColor: getProgressColor(budgetPercentage),
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {formatCurrency(totalSpent, user?.currency || 'USD')} spent ({budgetPercentage.toFixed(0)}%)
            </Text>
          </View>
        </View>

        {/* Budgets List */}
        {budgets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyTitle}>No Budgets Yet</Text>
            <Text style={styles.emptyText}>
              Create your first budget to track your spending limits
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.createButtonText}>Create Budget</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.budgetsList}>
            {budgets.map((budget) => {
              const percentage = (budget.spent / budget.amount) * 100;
              const progressColor = getProgressColor(percentage);

              return (
                <TouchableOpacity
                  key={budget.id}
                  style={styles.budgetCard}
                  onPress={() => openEditModal(budget)}
                >
                  <View style={styles.budgetHeader}>
                    <Text style={styles.budgetIcon}>{CATEGORY_ICONS[budget.category]}</Text>
                    <View style={styles.budgetInfo}>
                      <Text style={styles.budgetName}>{budget.name}</Text>
                      <Text style={styles.budgetPeriod}>
                        {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteBudget(budget.id)}>
                      <Text style={styles.deleteIcon}>🗑️</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.budgetAmounts}>
                    <Text style={styles.spentAmount}>
                      {formatCurrency(budget.spent, user?.currency || 'USD')}
                    </Text>
                    <Text style={styles.totalAmount}>
                      of {formatCurrency(budget.amount, user?.currency || 'USD')}
                    </Text>
                  </View>

                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: progressColor,
                        },
                      ]}
                    />
                  </View>

                  <Text style={[styles.percentageText, { color: progressColor }]}>
                    {percentage.toFixed(0)}% used
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Create/Edit Budget Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          resetForm();
          setModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingBudget ? 'Edit Budget' : 'Create Budget'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  resetForm();
                  setModalVisible(false);
                }}
              >
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              {/* Budget Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Budget Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Monthly Food Budget"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
              </View>

              {/* Category */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.categoryList}>
                    {EXPENSE_CATEGORIES.map((category) => (
                      <TouchableOpacity
                        key={category}
                        style={[
                          styles.categoryChip,
                          formData.category === category && styles.categoryChipActive,
                        ]}
                        onPress={() => setFormData({ ...formData, category })}
                      >
                        <Text style={styles.categoryChipIcon}>{CATEGORY_ICONS[category]}</Text>
                        <Text style={styles.categoryChipText}>{CATEGORY_NAMES[category]}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Amount */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Budget Amount</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  value={formData.amount}
                  onChangeText={(text) => setFormData({ ...formData, amount: text })}
                  keyboardType="decimal-pad"
                />
              </View>

              {/* Period */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Period</Text>
                <View style={styles.periodButtons}>
                  {['weekly', 'monthly', 'yearly'].map((period) => (
                    <TouchableOpacity
                      key={period}
                      style={[
                        styles.periodButton,
                        formData.period === period && styles.periodButtonActive,
                      ]}
                      onPress={() => setFormData({ ...formData, period: period as any })}
                    >
                      <Text
                        style={[
                          styles.periodButtonText,
                          formData.period === period && styles.periodButtonTextActive,
                        ]}
                      >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    resetForm();
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={editingBudget ? handleUpdateBudget : handleCreateBudget}
                >
                  <Text style={styles.saveButtonText}>
                    {editingBudget ? 'Update' : 'Create'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  addButton: {
    fontSize: 32,
    color: '#667eea',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
  },
  overviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  overviewLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  overviewAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
  },
  budgetsList: {
    gap: 16,
  },
  budgetCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  budgetInfo: {
    flex: 1,
  },
  budgetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  budgetPeriod: {
    fontSize: 14,
    color: '#6b7280',
  },
  deleteIcon: {
    fontSize: 20,
  },
  budgetAmounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 12,
  },
  spentAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalAmount: {
    fontSize: 16,
    color: '#6b7280',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    fontSize: 24,
    color: '#9ca3af',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
  },
  categoryList: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  categoryChipActive: {
    borderColor: '#667eea',
    backgroundColor: '#eef2ff',
  },
  categoryChipIcon: {
    fontSize: 16,
  },
  categoryChipText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  periodButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  periodButtonTextActive: {
    color: '#ffffff',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#667eea',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
