import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/integrations/firebase/config';

export interface DemoUser {
  email: string;
  password: string;
  name: string;
  role: 'doctor' | 'caregiver' | 'patient';
}

export const demoUsers: DemoUser[] = [
  {
    email: 'doctor@neurocare.demo',
    password: 'demo123',
    name: 'Dr. Sarah Johnson',
    role: 'doctor',
  },
  {
    email: 'caregiver@neurocare.demo',
    password: 'demo123',
    name: 'John Caregiver',
    role: 'caregiver',
  },
  {
    email: 'patient@neurocare.demo',
    password: 'demo123',
    name: 'Alice Patient',
    role: 'patient',
  },
];

export async function createDemoUsers(): Promise<void> {
  console.log('Creating demo users...');
  
  for (const demoUser of demoUsers) {
    try {
      try {
        const credential = await signInWithEmailAndPassword(auth, demoUser.email, demoUser.password);
        console.log(`✓ User ${demoUser.email} already exists`);

        if (!credential.user.displayName || credential.user.displayName !== demoUser.name) {
          await updateProfile(credential.user, { displayName: demoUser.name });
        }

        const userRef = doc(db, 'users', credential.user.uid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            role: demoUser.role,
            email: demoUser.email,
            name: demoUser.name,
            createdAt: new Date().toISOString(),
            isDemo: true,
          });
        } else {
          const data = userDoc.data() || {};
          if (data.role !== demoUser.role || data.name !== demoUser.name) {
            await setDoc(userRef, {
              ...data,
              role: demoUser.role,
              name: demoUser.name,
              email: demoUser.email,
              updatedAt: new Date().toISOString(),
              isDemo: true,
            }, { merge: true });
          }
        }

        await signOut(auth);
      } catch (error: any) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
          console.log(`Creating user: ${demoUser.email}...`);
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            demoUser.email,
            demoUser.password
          );

          await updateProfile(userCredential.user, {
            displayName: demoUser.name,
          });

          await setDoc(doc(db, 'users', userCredential.user.uid), {
            role: demoUser.role,
            email: demoUser.email,
            name: demoUser.name,
            createdAt: new Date().toISOString(),
            isDemo: true,
          });

          console.log(`✓ Created user: ${demoUser.email} (${demoUser.role})`);
          await signOut(auth);
        } else {
          console.error(`Error checking user ${demoUser.email}:`, error.message);
        }
      }
    } catch (error: any) {
      console.error(`Failed to create user ${demoUser.email}:`, error.message);
    }
  }
  
  console.log('Demo users setup complete!');
}

export async function quickLoginDemo(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    const userData = userDoc.data();
    
    return {
      id: userCredential.user.uid,
      email: userCredential.user.email || '',
      name: userCredential.user.displayName || userData?.name || email.split('@')[0],
      role: (userData?.role || 'patient') as 'doctor' | 'caregiver' | 'patient',
      avatar: userCredential.user.photoURL || undefined,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Login failed');
  }
}

