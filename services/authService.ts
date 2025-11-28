import {
  User as FirebaseUser,
  GoogleAuthProvider,
  OAuthProvider,
  deleteUser,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithCredential,
} from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { User } from '@/lib/types';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { storage, storageUtils, STORAGE_KEYS } from '@/lib/store/storage';

class AuthService {
  // Initialize auth listener
  initAuthListener() {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Try to get user profile from Firestore
        let user = await this.getUserProfile(firebaseUser.uid);

        // If profile doesn't exist or fetch failed, create/use fallback from Firebase Auth
        if (!user) {
          const fallbackUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          user = fallbackUser;

          // Try to save to Firestore in background (don't block on this)
          this.saveUserProfile(firebaseUser.uid, fallbackUser).catch(err => {
            console.log('Will save profile when online:', err.message);
          });
        }

        useAuthStore.getState().setUser(user);
        useAuthStore.getState().setIsAuthenticated(true);

        // Check if onboarding is completed
        const onboardingCompleted = await storage.get<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETED);
        useAuthStore.getState().setIsOnboardingCompleted(onboardingCompleted || false);
      } else {
        useAuthStore.getState().setUser(null);
        useAuthStore.getState().setIsAuthenticated(false);
      }
      useAuthStore.getState().setIsLoading(false);
    });
  }

  // Save user profile to Firestore
  private async saveUserProfile(userId: string, user: Partial<User>): Promise<void> {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, user, { merge: true });
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
      await storage.clear();
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
    } catch (error: any) {
      // Handle offline errors gracefully
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        console.log('Firestore offline, will use cached data or fallback');
      } else {
        console.error('Error fetching user profile:', error);
      }
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
      await storage.set(STORAGE_KEYS.ONBOARDING_COMPLETED, true);
      useAuthStore.getState().setIsOnboardingCompleted(true);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Get current user
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // Delete user account
  async deleteAccount(): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }

      const userId = currentUser.uid;

      // Delete user profile from Firestore
      const userDocRef = doc(db, 'users', userId);
      await deleteDoc(userDocRef);

      // Delete Firebase Auth user
      await deleteUser(currentUser);

      // Clear local state and storage
      useAuthStore.getState().logout();
      await storage.clear();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export const authService = new AuthService();
