import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { UserType, IncomeSource, UserFocus, ReminderPreference, ThemePreference } from '@/lib/types';

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    userType: 'personal' as UserType,
    incomeSource: 'salary' as IncomeSource,
    focus: 'save' as UserFocus,
    reminderPreference: 'daily' as ReminderPreference,
    currency: 'USD',
    themePreference: 'system' as ThemePreference,
    hasSecretWallet: false,
    securityEnabled: false,
    biometricEnabled: false,
    pinEnabled: false,
  });

  const updateData = (key: string, value: any) => {
    setOnboardingData((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save onboarding data and navigate to dashboard
      completeOnboarding();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    // TODO: Save onboarding data to Firebase
    router.replace('/(tabs)');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepUserType
            selected={onboardingData.userType}
            onSelect={(value) => updateData('userType', value)}
          />
        );
      case 1:
        return (
          <StepIncomeSource
            selected={onboardingData.incomeSource}
            onSelect={(value) => updateData('incomeSource', value)}
          />
        );
      case 2:
        return (
          <StepFocus
            selected={onboardingData.focus}
            onSelect={(value) => updateData('focus', value)}
          />
        );
      case 3:
        return (
          <StepReminder
            selected={onboardingData.reminderPreference}
            onSelect={(value) => updateData('reminderPreference', value)}
          />
        );
      case 4:
        return (
          <StepCurrencyTheme
            currency={onboardingData.currency}
            theme={onboardingData.themePreference}
            onCurrencySelect={(value) => updateData('currency', value)}
            onThemeSelect={(value) => updateData('themePreference', value)}
          />
        );
      case 5:
        return (
          <StepSecretWallet
            enabled={onboardingData.hasSecretWallet}
            onToggle={(value) => updateData('hasSecretWallet', value)}
          />
        );
      case 6:
        return (
          <StepSecurity
            pinEnabled={onboardingData.pinEnabled}
            biometricEnabled={onboardingData.biometricEnabled}
            onPinToggle={(value) => updateData('pinEnabled', value)}
            onBiometricToggle={(value) => updateData('biometricEnabled', value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((currentStep + 1) / 7) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{currentStep + 1} of 7</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {renderStep()}
      </ScrollView>

      {/* Navigation buttons */}
      <View style={styles.navigation}>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={previousStep}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
          <Text style={styles.nextButtonText}>
            {currentStep === 6 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Step 1: User Type
function StepUserType({ selected, onSelect }: { selected: UserType; onSelect: (value: UserType) => void }) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>How will you use SpendWise?</Text>
      <Text style={styles.stepSubtitle}>Choose the option that best describes you</Text>

      <View style={styles.optionsContainer}>
        <OptionCard
          icon="👤"
          title="Personal"
          description="Track my personal finances"
          selected={selected === 'personal'}
          onPress={() => onSelect('personal')}
        />
        <OptionCard
          icon="👨‍👩‍👧‍👦"
          title="Family"
          description="Manage family finances together"
          selected={selected === 'family'}
          onPress={() => onSelect('family')}
        />
        <OptionCard
          icon="💼"
          title="Business"
          description="Track business expenses"
          selected={selected === 'business'}
          onPress={() => onSelect('business')}
        />
      </View>
    </View>
  );
}

// Step 2: Income Source
function StepIncomeSource({ selected, onSelect }: { selected: IncomeSource; onSelect: (value: IncomeSource) => void }) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What's your main income source?</Text>
      <Text style={styles.stepSubtitle}>This helps us personalize your experience</Text>

      <View style={styles.optionsContainer}>
        <OptionCard icon="💼" title="Salary" selected={selected === 'salary'} onPress={() => onSelect('salary')} />
        <OptionCard icon="💰" title="Pocket Money" selected={selected === 'pocket_money'} onPress={() => onSelect('pocket_money')} />
        <OptionCard icon="🏢" title="Business" selected={selected === 'business'} onPress={() => onSelect('business')} />
        <OptionCard icon="💻" title="Freelance" selected={selected === 'freelance'} onPress={() => onSelect('freelance')} />
        <OptionCard icon="📊" title="Commission" selected={selected === 'commission'} onPress={() => onSelect('commission')} />
        <OptionCard icon="🏠" title="Rental" selected={selected === 'rental'} onPress={() => onSelect('rental')} />
      </View>
    </View>
  );
}

// Step 3: Focus
function StepFocus({ selected, onSelect }: { selected: UserFocus; onSelect: (value: UserFocus) => void }) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What's your main focus?</Text>
      <Text style={styles.stepSubtitle}>We'll prioritize features based on your goal</Text>

      <View style={styles.optionsContainer}>
        <OptionCard icon="🎯" title="Save Money" selected={selected === 'save'} onPress={() => onSelect('save')} />
        <OptionCard icon="📉" title="Reduce Spending" selected={selected === 'reduce_spending'} onPress={() => onSelect('reduce_spending')} />
        <OptionCard icon="📄" title="Track Bills" selected={selected === 'track_bills'} onPress={() => onSelect('track_bills')} />
        <OptionCard icon="👥" title="Shared Finances" selected={selected === 'shared_finances'} onPress={() => onSelect('shared_finances')} />
      </View>
    </View>
  );
}

// Step 4: Reminder Preference
function StepReminder({ selected, onSelect }: { selected: ReminderPreference; onSelect: (value: ReminderPreference) => void }) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>How often should we remind you?</Text>
      <Text style={styles.stepSubtitle}>Stay on track with timely reminders</Text>

      <View style={styles.optionsContainer}>
        <OptionCard icon="📅" title="Daily" selected={selected === 'daily'} onPress={() => onSelect('daily')} />
        <OptionCard icon="📆" title="Weekly" selected={selected === 'weekly'} onPress={() => onSelect('weekly')} />
        <OptionCard icon="⚠️" title="Important Only" selected={selected === 'important'} onPress={() => onSelect('important')} />
        <OptionCard icon="🔕" title="None" selected={selected === 'none'} onPress={() => onSelect('none')} />
      </View>
    </View>
  );
}

// Step 5: Currency & Theme
function StepCurrencyTheme({
  currency,
  theme,
  onCurrencySelect,
  onThemeSelect,
}: {
  currency: string;
  theme: ThemePreference;
  onCurrencySelect: (value: string) => void;
  onThemeSelect: (value: ThemePreference) => void;
}) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personalize Your Experience</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Currency</Text>
        <View style={styles.optionsRow}>
          <OptionCard icon="💵" title="USD" selected={currency === 'USD'} onPress={() => onCurrencySelect('USD')} small />
          <OptionCard icon="💶" title="EUR" selected={currency === 'EUR'} onPress={() => onCurrencySelect('EUR')} small />
          <OptionCard icon="💷" title="GBP" selected={currency === 'GBP'} onPress={() => onCurrencySelect('GBP')} small />
          <OptionCard icon="₹" title="INR" selected={currency === 'INR'} onPress={() => onCurrencySelect('INR')} small />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme</Text>
        <View style={styles.optionsContainer}>
          <OptionCard icon="☀️" title="Light" selected={theme === 'light'} onPress={() => onThemeSelect('light')} />
          <OptionCard icon="🌙" title="Dark" selected={theme === 'dark'} onPress={() => onThemeSelect('dark')} />
          <OptionCard icon="⚙️" title="System" selected={theme === 'system'} onPress={() => onThemeSelect('system')} />
        </View>
      </View>
    </View>
  );
}

// Step 6: Secret Wallet
function StepSecretWallet({ enabled, onToggle }: { enabled: boolean; onToggle: (value: boolean) => void }) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Secret Wallet</Text>
      <Text style={styles.stepSubtitle}>
        Keep some transactions private and secure
      </Text>

      <View style={styles.featureCard}>
        <Text style={styles.featureIcon}>🔒</Text>
        <Text style={styles.featureTitle}>What is Secret Wallet?</Text>
        <Text style={styles.featureDescription}>
          A separate, encrypted wallet for sensitive transactions. Accessible only with authentication.
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        <OptionCard
          icon="✓"
          title="Enable Secret Wallet"
          selected={enabled}
          onPress={() => onToggle(true)}
        />
        <OptionCard
          icon="✗"
          title="Skip for Now"
          selected={!enabled}
          onPress={() => onToggle(false)}
        />
      </View>
    </View>
  );
}

// Step 7: Security
function StepSecurity({
  pinEnabled,
  biometricEnabled,
  onPinToggle,
  onBiometricToggle,
}: {
  pinEnabled: boolean;
  biometricEnabled: boolean;
  onPinToggle: (value: boolean) => void;
  onBiometricToggle: (value: boolean) => void;
}) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Secure Your App</Text>
      <Text style={styles.stepSubtitle}>
        Add an extra layer of security
      </Text>

      <View style={styles.optionsContainer}>
        <OptionCard
          icon="🔐"
          title="PIN Protection"
          description="Unlock with a 4-6 digit PIN"
          selected={pinEnabled}
          onPress={() => onPinToggle(!pinEnabled)}
        />
        <OptionCard
          icon="👤"
          title="Face ID / Touch ID"
          description="Unlock with biometrics"
          selected={biometricEnabled}
          onPress={() => onBiometricToggle(!biometricEnabled)}
        />
      </View>

      <Text style={styles.skipText}>You can change these settings later</Text>
    </View>
  );
}

// Reusable Option Card
function OptionCard({
  icon,
  title,
  description,
  selected,
  onPress,
  small,
}: {
  icon: string;
  title: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  small?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.optionCard,
        selected && styles.optionCardSelected,
        small && styles.optionCardSmall,
      ]}
      onPress={onPress}
    >
      <Text style={styles.optionIcon}>{icon}</Text>
      <Text style={[styles.optionTitle, small && styles.optionTitleSmall]}>{title}</Text>
      {description && <Text style={styles.optionDescription}>{description}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  stepContainer: {
    flex: 1,
    gap: 24,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: -16,
  },
  optionsContainer: {
    gap: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  optionCardSelected: {
    backgroundColor: '#eef2ff',
    borderColor: '#667eea',
  },
  optionCardSmall: {
    flex: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  optionIcon: {
    fontSize: 32,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  optionTitleSmall: {
    fontSize: 16,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  featureCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  featureIcon: {
    fontSize: 48,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  skipText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 16,
  },
  navigation: {
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    paddingBottom: 40,
  },
  backButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#667eea',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
