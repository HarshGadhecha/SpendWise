import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// React Native Firebase automatically initializes using:
// - google-services.json (Android)
// - GoogleService-Info.plist (iOS)
// No manual configuration needed

// Export Firebase services
export { auth, firestore as db, storage };

// Export auth as default for compatibility
export default auth;
