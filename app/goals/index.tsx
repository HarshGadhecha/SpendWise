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
import { useGoalStore } from '@/lib/store/useGoalStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Goal } from '@/lib/types';
import { formatCurrency } from '@/lib/constants/currencies';

const GOAL_ICONS = ['🎯', '🏠', '✈️', '🚗', '💍', '🎓', '💻', '📱'];

export default function GoalsScreen() {
  const { user } = useAuthStore();
  const { goals, addGoal, updateGoal, deleteGoal, addToGoal, getTotalSaved, getTotalTarget } = useGoalStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [addMoneyModal, setAddMoneyModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [addAmount, setAddAmount] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '0',
    category: 'savings',
    priority: 'medium' as 'low' | 'medium' | 'high',
    deadline: '',
  });

  const totalSaved = getTotalSaved();
  const totalTarget = getTotalTarget();
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const handleCreateGoal = () => {
    if (!formData.name.trim() || !formData.targetAmount) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    const newGoal: Goal = {
      id: Date.now().toString(),
      userId: user?.id || '',
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      currency: user?.currency || 'USD',
      category: formData.category,
      priority: formData.priority,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addGoal(newGoal);
    resetForm();
    setModalVisible(false);
    Alert.alert('Success', 'Goal created successfully!');
  };

  const handleAddMoney = () => {
    if (!selectedGoal || !addAmount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    const amount = parseFloat(addAmount);
    if (amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    addToGoal(selectedGoal.id, amount);
    setAddAmount('');
    setAddMoneyModal(false);
    setSelectedGoal(null);
    Alert.alert('Success', `Added ${formatCurrency(amount, user?.currency || 'USD')} to your goal!`);
  };

  const handleDeleteGoal = (goalId: string) => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteGoal(goalId);
            Alert.alert('Success', 'Goal deleted');
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '0',
      category: 'savings',
      priority: 'medium',
      deadline: '',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Goals</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.addButton}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Overview Card */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewLabel}>Total Progress</Text>
          <Text style={styles.overviewAmount}>
            {formatCurrency(totalSaved, user?.currency || 'USD')}
          </Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(overallProgress, 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {formatCurrency(totalTarget, user?.currency || 'USD')} target ({overallProgress.toFixed(0)}%)
            </Text>
          </View>
        </View>

        {/* Goals List */}
        {goals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyTitle}>No Goals Yet</Text>
            <Text style={styles.emptyText}>
              Set your first savings goal and start working towards it
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.createButtonText}>Create Goal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.goalsList}>
            {goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const remaining = goal.targetAmount - goal.currentAmount;

              return (
                <View
                  key={goal.id}
                  style={[
                    styles.goalCard,
                    goal.isCompleted && styles.goalCardCompleted,
                  ]}
                >
                  {goal.isCompleted && (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedText}>✓ Completed</Text>
                    </View>
                  )}

                  <View style={styles.goalHeader}>
                    <View style={styles.goalInfo}>
                      <Text style={styles.goalName}>{goal.name}</Text>
                      <View style={styles.priorityBadge}>
                        <Text
                          style={[
                            styles.priorityText,
                            { color: getPriorityColor(goal.priority) },
                          ]}
                        >
                          {goal.priority.toUpperCase()} PRIORITY
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteGoal(goal.id)}>
                      <Text style={styles.deleteIcon}>🗑️</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.goalAmounts}>
                    <Text style={styles.currentAmount}>
                      {formatCurrency(goal.currentAmount, goal.currency)}
                    </Text>
                    <Text style={styles.targetAmount}>
                      of {formatCurrency(goal.targetAmount, goal.currency)}
                    </Text>
                  </View>

                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${Math.min(progress, 100)}%` },
                      ]}
                    />
                  </View>

                  <View style={styles.goalFooter}>
                    <Text style={styles.remainingText}>
                      {remaining > 0
                        ? `${formatCurrency(remaining, goal.currency)} remaining`
                        : 'Goal reached!'}
                    </Text>
                    {!goal.isCompleted && (
                      <TouchableOpacity
                        style={styles.addMoneyButton}
                        onPress={() => {
                          setSelectedGoal(goal);
                          setAddMoneyModal(true);
                        }}
                      >
                        <Text style={styles.addMoneyText}>+ Add Money</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Create Goal Modal */}
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
              <Text style={styles.modalTitle}>Create Goal</Text>
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
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Goal Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Emergency Fund, Vacation, New Car"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Target Amount</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  value={formData.targetAmount}
                  onChangeText={(text) => setFormData({ ...formData, targetAmount: text })}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Starting Amount (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  value={formData.currentAmount}
                  onChangeText={(text) => setFormData({ ...formData, currentAmount: text })}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Priority</Text>
                <View style={styles.priorityButtons}>
                  {['low', 'medium', 'high'].map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.priorityButton,
                        formData.priority === priority && styles.priorityButtonActive,
                      ]}
                      onPress={() => setFormData({ ...formData, priority: priority as any })}
                    >
                      <Text
                        style={[
                          styles.priorityButtonText,
                          formData.priority === priority && styles.priorityButtonTextActive,
                        ]}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

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
                <TouchableOpacity style={styles.saveButton} onPress={handleCreateGoal}>
                  <Text style={styles.saveButtonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Money Modal */}
      <Modal
        visible={addMoneyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setAddAmount('');
          setAddMoneyModal(false);
          setSelectedGoal(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.smallModalContent}>
            <Text style={styles.modalTitle}>Add Money to Goal</Text>
            <Text style={styles.goalNameText}>{selectedGoal?.name}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={addAmount}
                onChangeText={setAddAmount}
                keyboardType="decimal-pad"
                autoFocus
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setAddAmount('');
                  setAddMoneyModal(false);
                  setSelectedGoal(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddMoney}>
                <Text style={styles.saveButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: '#f59e0b',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  overviewLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 8,
  },
  overviewAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  goalsList: {
    gap: 16,
  },
  goalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  goalCardCompleted: {
    backgroundColor: '#d1fae5',
  },
  completedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  goalInfo: {
    flex: 1,
    paddingRight: 12,
  },
  goalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  deleteIcon: {
    fontSize: 20,
  },
  goalAmounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 12,
  },
  currentAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  targetAmount: {
    fontSize: 16,
    color: '#6b7280',
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  remainingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  addMoneyButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addMoneyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
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
  smallModalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
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
    marginBottom: 8,
  },
  goalNameText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
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
  priorityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  priorityButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  priorityButtonTextActive: {
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
