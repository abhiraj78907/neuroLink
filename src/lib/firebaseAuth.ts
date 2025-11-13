import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/integrations/firebase/config';
import { User } from './types';

export interface AuthState {
  user: User | null;
  loading: boolean;
}

class FirebaseAuthService {
  private listeners: Set<(user: User | null) => void> = new Set();
  private currentUser: User | null = null;

  private async mapFirebaseUser(firebaseUser: FirebaseUser | null): Promise<User | null> {
    if (!firebaseUser) {
      this.currentUser = null;
      return null;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.data();
      const role = (userData?.role || 'patient') as 'doctor' | 'caregiver' | 'patient';
      const name =
        firebaseUser.displayName ||
        userData?.name ||
        firebaseUser.email?.split('@')[0] ||
        'User';

      const mappedUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name,
        role,
        avatar: firebaseUser.photoURL || undefined,
      };

      this.currentUser = mappedUser;
      return mappedUser;
    } catch (error) {
      console.error('Failed to load user profile from Firestore:', error);

      const fallbackUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        role: 'patient',
        avatar: firebaseUser.photoURL || undefined,
      };

      this.currentUser = fallbackUser;
      return fallbackUser;
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      if (!auth) {
        throw new Error('Firebase Auth is not initialized. Please check your Firebase configuration.');
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Map Firebase user to app user (this loads role from Firestore)
      const user = await this.mapFirebaseUser(userCredential.user);
      if (!user) {
        throw new Error('Failed to create user object');
      }
      
      // Ensure user is cached
      this.currentUser = user;
      
      // Log for debugging
      console.log('Login successful:', { email, role: user.role, id: user.id });
      
      return user;
    } catch (error: any) {
      let errorMessage = 'Login failed';

      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This user account has been disabled.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No user found with this email. Please register first.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password.';
            break;
          case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed login attempts. Please try again later.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          case 'auth/invalid-api-key':
            errorMessage = 'Firebase API key is invalid. Please check your configuration.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Email/Password authentication is not enabled. Please enable it in Firebase Console.';
            break;
          default:
            errorMessage = error.message || `Login failed: ${error.code}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.error('Firebase Auth Error:', error.code || error.message, error);
      throw new Error(errorMessage);
    }
  }

  async register(
    email: string,
    password: string,
    name: string,
    role: 'doctor' | 'caregiver' | 'patient' = 'patient'
  ): Promise<User> {
    try {
      if (!auth) {
        throw new Error('Firebase Auth is not initialized. Please check your Firebase configuration.');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, { displayName: name });

      const user = await this.mapFirebaseUser(userCredential.user);
      if (!user) throw new Error('Failed to create user object');

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        role,
        email,
        name,
        createdAt: new Date().toISOString(),
      });

      const updatedUser: User = { ...user, role };
      this.currentUser = updatedUser;
      return updatedUser;
    } catch (error: any) {
      let errorMessage = 'Registration failed';

      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email is already registered. Please sign in instead.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Email/Password authentication is not enabled. Please enable it in Firebase Console.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password is too weak. Please use a stronger password.';
            break;
          case 'auth/invalid-api-key':
            errorMessage = 'Firebase API key is invalid. Please check your configuration.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          default:
            errorMessage = error.message || `Registration failed: ${error.code}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.error('Firebase Auth Registration Error:', error.code || error.message, error);
      throw new Error(errorMessage);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
      this.currentUser = null;
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  }

  getCurrentUser(): User | null {
    // Return cached user if available
    if (this.currentUser) {
      return this.currentUser;
    }

    // If no cached user, try to get from Firebase Auth
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      // Try to load user data synchronously from cache first
      // This will be updated asynchronously
      const fallbackUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        role: 'patient', // Default role until Firestore loads
        avatar: firebaseUser.photoURL || undefined,
      };
      
      // Load from Firestore asynchronously and update
      this.mapFirebaseUser(firebaseUser).then((user) => {
        if (user) {
          this.currentUser = user;
        }
      }).catch((error) => {
        console.error('Error loading user data:', error);
      });
      
      // Return fallback user immediately
      this.currentUser = fallbackUser;
      return fallbackUser;
    }

    return null;
  }

  isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const mappedUser = await this.mapFirebaseUser(firebaseUser);
      callback(mappedUser);
    });

    this.listeners.add(callback);
    return () => {
      unsubscribe();
      this.listeners.delete(callback);
    };
  }
}

export const firebaseAuthService = new FirebaseAuthService();
