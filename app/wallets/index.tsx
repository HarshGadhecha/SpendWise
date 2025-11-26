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
import { useWalletStore } from '@/lib/store/useWalletStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Wallet, WalletType } from '@/lib/types';
import { formatCurrency } from '@/lib/constants/currencies';

const WALLET_ICONS = ['💰', '👛', '💳', '🏦', '💵', '🪙', '💎', '🎯'];
const WALLET_COLORS = ['#667eea', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];

export default function WalletsScreen() {
  const { user } = useAuthStore();
  const { wallets, addWallet, updateWallet, deleteWallet, getTotalBalance } = useWalletStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'personal' as WalletType,
    balance: '0',
    icon: '💰',
    color: '#667eea',
  });

  const totalBalance = getTotalBalance();

  const handleCreateWallet = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a wallet name');
      return;
    }

    const newWallet: Wallet = {
      id: Date.now().toString(),
      userId: user?.id || '',
      name: formData.name,
      type: formData.type,
      balance: parseFloat(formData.balance) || 0,
      currency: user?.currency || 'USD',
      color: formData.color,
      icon: formData.icon,
      isDefault: wallets.length === 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addWallet(newWallet);
    resetForm();
    setModalVisible(false);
    Alert.alert('Success', 'Wallet created successfully!');
  };

  const handleUpdateWallet = () => {
    if (!editingWallet) return;

    updateWallet(editingWallet.id, {
      name: formData.name,
      type: formData.type,
      balance: parseFloat(formData.balance) || 0,
      icon: formData.icon,
      color: formData.color,
      updatedAt: new Date(),
    });

    resetForm();
    setModalVisible(false);
    setEditingWallet(null);
    Alert.alert('Success', 'Wallet updated successfully!');
  };

  const handleDeleteWallet = (walletId: string) => {
    Alert.alert(
      'Delete Wallet',
      'Are you sure you want to delete this wallet? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteWallet(walletId);
            Alert.alert('Success', 'Wallet deleted successfully');
          },
        },
      ]
    );
  };

  const openEditModal = (wallet: Wallet) => {
    setEditingWallet(wallet);
    setFormData({
      name: wallet.name,
      type: wallet.type,
      balance: wallet.balance.toString(),
      icon: wallet.icon || '💰',
      color: wallet.color || '#667eea',
    });
    setModalVisible(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'personal',
      balance: '0',
      icon: '💰',
      color: '#667eea',
    });
    setEditingWallet(null);
  };

  const closeModal = () => {
    resetForm();
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wallets</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.addButton}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Total Balance */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Balance</Text>
          <Text style={styles.totalAmount}>
            {formatCurrency(totalBalance, user?.currency || 'USD')}
          </Text>
          <Text style={styles.totalSubtext}>
            Across {wallets.length} wallet{wallets.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Wallets List */}
        {wallets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👛</Text>
            <Text style={styles.emptyTitle}>No Wallets Yet</Text>
            <Text style={styles.emptyText}>
              Create your first wallet to start tracking your finances
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.createButtonText}>Create Wallet</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.walletsList}>
            {wallets.map((wallet) => (
              <TouchableOpacity
                key={wallet.id}
                style={[styles.walletCard, { borderLeftColor: wallet.color, borderLeftWidth: 4 }]}
                onPress={() => openEditModal(wallet)}
              >
                <View style={styles.walletHeader}>
                  <Text style={styles.walletIcon}>{wallet.icon}</Text>
                  <View style={styles.walletInfo}>
                    <Text style={styles.walletName}>{wallet.name}</Text>
                    <Text style={styles.walletType}>
                      {wallet.type.charAt(0).toUpperCase() + wallet.type.slice(1)} Wallet
                    </Text>
                  </View>
                  {wallet.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.walletBalance}>
                  {formatCurrency(wallet.balance, wallet.currency)}
                </Text>

                <View style={styles.walletActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                      // TODO: Navigate to transactions for this wallet
                      Alert.alert('Coming Soon', 'View transactions feature');
                    }}
                  >
                    <Text style={styles.actionText}>View Transactions</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteWallet(wallet.id)}
                  >
                    <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Create/Edit Wallet Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingWallet ? 'Edit Wallet' : 'Create Wallet'}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              {/* Wallet Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Wallet Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Personal, Savings, Cash"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
              </View>

              {/* Wallet Type */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Wallet Type</Text>
                <View style={styles.typeButtons}>
                  {(['personal', 'family', 'secret'] as WalletType[]).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeButton,
                        formData.type === type && styles.typeButtonActive,
                      ]}
                      onPress={() => setFormData({ ...formData, type })}
                    >
                      <Text
                        style={[
                          styles.typeButtonText,
                          formData.type === type && styles.typeButtonTextActive,
                        ]}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Initial Balance */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Initial Balance</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  value={formData.balance}
                  onChangeText={(text) => setFormData({ ...formData, balance: text })}
                  keyboardType="decimal-pad"
                />
              </View>

              {/* Icon Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Choose Icon</Text>
                <View style={styles.iconGrid}>
                  {WALLET_ICONS.map((icon) => (
                    <TouchableOpacity
                      key={icon}
                      style={[
                        styles.iconButton,
                        formData.icon === icon && styles.iconButtonActive,
                      ]}
                      onPress={() => setFormData({ ...formData, icon })}
                    >
                      <Text style={styles.iconText}>{icon}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Color Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Choose Color</Text>
                <View style={styles.colorGrid}>
                  {WALLET_COLORS.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorButton,
                        { backgroundColor: color },
                        formData.color === color && styles.colorButtonActive,
                      ]}
                      onPress={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={editingWallet ? handleUpdateWallet : handleCreateWallet}
                >
                  <Text style={styles.saveButtonText}>
                    {editingWallet ? 'Update' : 'Create'}
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
  totalCard: {
    backgroundColor: '#667eea',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  totalSubtext: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
  },
  walletsList: {
    gap: 16,
  },
  walletCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  walletIcon: {
    fontSize: 36,
    marginRight: 12,
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  walletType: {
    fontSize: 14,
    color: '#6b7280',
  },
  defaultBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  walletBalance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 16,
  },
  walletActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  deleteButton: {
    borderColor: '#ef4444',
  },
  deleteText: {
    color: '#ef4444',
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
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  typeButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  typeButtonTextActive: {
    color: '#ffffff',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  iconButtonActive: {
    borderColor: '#667eea',
    backgroundColor: '#eef2ff',
  },
  iconText: {
    fontSize: 28,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorButtonActive: {
    borderColor: '#1f2937',
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
