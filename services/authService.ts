import {
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { User } from '@/lib/types';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { storageUtils, STORAGE_KEYS } from '@/lib/store/storage';

class AuthService {
  // Initialize auth listener
  initAuthListener() {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = await this.getUserProfile(firebaseUser.uid);
        if (user) {
          useAuthStore.getState().setUser(user);
          useAuthStore.getState().setIsAuthenticated(true);

          // Check if onboarding is completed
          const onboardingCompleted = storageUtils.get<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETED);
          useAuthStore.getState().setIsOnboardingCompleted(onboardingCompleted || false);
        }
      } else {
        useAuthStore.getState().setUser(null);
        useAuthStore.getState().setIsAuthenticated(false);
      }
      useAuthStore.getState().setIsLoading(false);
    });
  }

  // Sign in with Google
  async signInWithGoogle(idToken: string): Promise<FirebaseUser> {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);

      // Check if user profile exists, if not create one
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const user: Partial<User> = {
          id: userCredential.user.uid,
          email: userCredential.user.email!,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await setDoc(userDocRef, user);
      }

      return userCredential.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Sign in with Apple
  async signInWithApple(identityToken: string, nonce?: string): Promise<FirebaseUser> {
    try {
      const provider = new OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: identityToken,
        rawNonce: nonce,
      });
      const userCredential = await signInWithCredential(auth, credential);

      // Check if user profile exists, if not create one
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const user: Partial<User> = {
          id: userCredential.user.uid,
          email: userCredential.user.email!,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await setDoc(userDocRef, user);
      }

      return userCredential.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      useAuthStore.getState().logout();
      storageUtils.clear();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Get user profile from Firestore
  async getUserProfile(userId: string): Promise<User | null> {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return userDoc.data() as User;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, {
        ...updates,
        updatedAt: new Date(),
      }, { merge: true });

      // Update local state
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().setUser({ ...currentUser, ...updates });
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Complete onboarding
  async completeOnboarding(userId: string, onboardingData: Partial<User>): Promise<void> {
    try {
      await this.updateUserProfile(userId, onboardingData);
      storageUtils.set(STORAGE_KEYS.ONBOARDING_COMPLETED, true);
      useAuthStore.getState().setIsOnboardingCompleted(true);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Get current user
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }
}

export const authService = new AuthService();
