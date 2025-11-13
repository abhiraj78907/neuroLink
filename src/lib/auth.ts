import { User } from './types';
import { firebaseAuthService } from './firebaseAuth';

// Re-export Firebase auth service as the main auth service
export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    return await firebaseAuthService.login(email, password);
  },

  register: async (
    email: string,
    password: string,
    name: string,
    role: 'doctor' | 'caregiver' | 'patient' = 'patient'
  ): Promise<User> => {
    return await firebaseAuthService.register(email, password, name, role);
  },

  logout: async (): Promise<void> => {
    await firebaseAuthService.logout();
  },

  getCurrentUser: (): User | null => {
    return firebaseAuthService.getCurrentUser();
  },

  isAuthenticated: (): boolean => {
    return firebaseAuthService.isAuthenticated();
  },

  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return firebaseAuthService.onAuthStateChanged(callback);
  },
};
