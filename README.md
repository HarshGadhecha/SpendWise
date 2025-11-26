# 💰 SpendWise - Smart Finance Tracker

SpendWise is a comprehensive, free, and ad-supported finance management app built with React Native and Expo. Track your income, expenses, investments, life insurance, and achieve your financial goals all in one place.

## ✨ Features

### 🎯 Core Features (Completed)
- ✅ **Authentication System** - Email/password, Google Sign-In, Apple Sign-In (iOS)
- ✅ **Personalized Onboarding** - 7-step intelligent onboarding flow
- ✅ **Beautiful Dashboard** - Real-time overview of your finances
- ✅ **Multi-Wallet Support** - Personal, Family, and Secret wallets
- ✅ **Secure Storage** - PIN & Biometric authentication (Face ID/Touch ID)
- ✅ **Dark/Light Themes** - System-based or manual theme selection

### 🚧 In Development
- 🔄 Income & Expense Tracking
- 🔄 Budgets & Goals Management
- 🔄 EMI/Bill Tracker with Reminders
- 🔄 Split Bills Feature
- 🔄 Investment Portfolio (FD, RD, SIP, Mutual Funds, ETFs)
- 🔄 Life Insurance Management
- 🔄 Firebase Real-Time Sync
- 🔄 Push Notifications
- 🔄 AdMob Integration
- 🔄 Export to CSV/PDF
- 🔄 Insights & Analytics

## 🛠️ Tech Stack

- **Framework**: React Native with Expo Router
- **Language**: TypeScript
- **Backend**: Firebase (Authentication, Firestore, Storage, Cloud Messaging)
- **State Management**: Zustand
- **Local Storage**: MMKV (encrypted)
- **Security**: expo-secure-store, expo-local-authentication
- **Authentication**: Firebase Auth, Google Sign-In, Apple Sign-In
- **Charts**: react-native-chart-kit
- **Monetization**: Google AdMob

## 📁 Project Structure

```
SpendWise/
├── app/                          # Expo Router pages
│   ├── (tabs)/                   # Tab navigation
│   │   └── index.tsx             # Dashboard
│   ├── auth/                     # Authentication screens
│   │   ├── index.tsx             # Welcome screen
│   │   ├── login.tsx             # Login screen
│   │   └── signup.tsx            # Sign up screen
│   ├── onboarding/               # Onboarding flow
│   │   └── index.tsx             # 7-step onboarding
│   ├── wallets/                  # Wallet management
│   ├── income/                   # Income tracking
│   ├── expenses/                 # Expense tracking
│   ├── budgets/                  # Budget management
│   ├── goals/                    # Goals tracking
│   ├── emi-bills/                # EMI & Bills
│   ├── split-bills/              # Split bills feature
│   ├── investments/              # Investment portfolio
│   ├── insurance/                # Life insurance
│   ├── settings/                 # App settings
│   └── notifications/            # Notifications center
│
├── lib/                          # Core library
│   ├── firebase/                 # Firebase configuration
│   │   └── config.ts
│   ├── store/                    # Zustand stores
│   │   ├── storage.ts            # MMKV storage
│   │   ├── useAuthStore.ts       # Authentication state
│   │   ├── useWalletStore.ts     # Wallet state
│   │   └── useTransactionStore.ts # Transaction state
│   ├── types/                    # TypeScript types
│   │   └── index.ts              # All type definitions
│   ├── constants/                # App constants
│   │   ├── categories.ts         # Income/expense categories
│   │   └── currencies.ts         # Currency definitions
│   └── utils/                    # Utility functions
│       └── dateUtils.ts          # Date formatting utilities
│
├── services/                     # Business logic services
│   ├── authService.ts            # Authentication service
│   ├── securityService.ts        # PIN & biometric security
│   ├── firebase-sync/            # Firebase sync service
│   ├── notifications/            # Push notifications
│   └── storage/                  # Storage service
│
└── components/                   # Reusable UI components

```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator
- Firebase project (for backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YourUsername/SpendWise.git
   cd SpendWise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password, Google, Apple)
   - Create a Firestore database
   - Enable Storage
   - Copy your Firebase configuration

4. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Add your Firebase credentials:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Start the development server**
   ```bash
   npx expo start
   ```

6. **Run on device/emulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app

## 📱 Features Overview

### Authentication & Security
- **Multiple Sign-In Options**: Email/password, Google, and Apple Sign-In
- **Biometric Security**: Face ID and Touch ID support
- **PIN Protection**: 4-6 digit PIN for additional security
- **Secure Storage**: All sensitive data encrypted using MMKV

### Onboarding Experience
1. **User Type**: Personal, Family, or Business
2. **Income Source**: Salary, Freelance, Business, etc.
3. **Primary Focus**: Save, Reduce Spending, Track Bills
4. **Reminder Preferences**: Daily, Weekly, Important only, or None
5. **Currency & Theme**: Choose currency and appearance
6. **Secret Wallet**: Optional encrypted wallet setup
7. **Security Settings**: Configure PIN and biometric authentication

### Dashboard
- **Total Balance Overview**: See all your money at a glance
- **Income vs Expense**: Visual breakdown of cash flow
- **Quick Actions**: Fast access to common operations
- **Recent Transactions**: Latest financial activities
- **Wallet Summary**: Overview of all wallets
- **Upcoming Bills**: Never miss a payment
- **Daily Insights**: Smart financial tips

## 🔐 Security Features

- **End-to-End Encryption**: Secret wallet uses hardware-backed encryption
- **Secure Authentication**: Firebase Auth with multi-factor support
- **Biometric Lock**: Face ID/Touch ID for quick secure access
- **PIN Protection**: Customizable PIN for app lock
- **Auto-Lock**: Configurable timeout for automatic locking
- **Encrypted Storage**: MMKV with encryption for local data

## 🎨 Design Philosophy

- **User-First**: Clean, intuitive interface designed for everyone
- **Fast & Responsive**: Optimized performance with offline-first approach
- **Accessible**: Support for dark/light themes and large text
- **Beautiful**: Modern design with smooth animations
- **Consistent**: Unified experience across iOS and Android

## 📊 Data Architecture

### Firebase Collections
```
users/
  └── {userId}/
      ├── profile (user data)
      └── settings (user preferences)

wallets/
  └── {walletId}/
      ├── metadata
      └── balance

transactions/
  └── {transactionId}/
      ├── type (income/expense)
      ├── amount
      ├── category
      └── timestamp

budgets/
goals/
bills/
investments/
insurance/
notifications/
```

## 🔄 Development Status

### Phase 1: Foundation ✅
- [x] Project setup and dependencies
- [x] Firebase configuration
- [x] Type system and data models
- [x] State management with Zustand
- [x] Local storage with MMKV

### Phase 2: Authentication ✅
- [x] Email/password authentication
- [x] Google Sign-In
- [x] Apple Sign-In (iOS)
- [x] Security services (PIN/Biometric)

### Phase 3: Onboarding ✅
- [x] 7-step onboarding flow
- [x] User personalization
- [x] Theme and currency selection

### Phase 4: Core Features ✅
- [x] Dashboard design and implementation
- [x] Wallet management foundation

### Phase 5: In Progress 🔄
- [ ] Income & Expense tracking
- [ ] Transaction management
- [ ] Budgets & Goals
- [ ] EMI/Bill tracker
- [ ] Split bills
- [ ] Investments module
- [ ] Insurance management

### Phase 6: Advanced Features 📋
- [ ] Firebase real-time sync
- [ ] Push notifications
- [ ] AdMob integration
- [ ] Export functionality
- [ ] Analytics & insights

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev)
- Powered by [Firebase](https://firebase.google.com)
- Icons and design inspiration from various open-source projects

## 📞 Contact

For questions or feedback, please open an issue on GitHub.

---

Made with ❤️ by the SpendWise Team
