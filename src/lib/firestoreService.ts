import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  addDoc,
  serverTimestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/integrations/firebase/config';
import { Patient, CognitiveTest, SpeechAnalysis, ImagingResult, TimelineEvent, Notification } from './types';

class FirestoreService {
  // Patients
  async getPatient(patientId: string): Promise<Patient | null> {
    const docRef = doc(db, 'patients', patientId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Patient;
    }
    return null;
  }

  async getPatients(userId?: string, role?: string): Promise<Patient[]> {
    let q = query(collection(db, 'patients'), orderBy('name'));
    
    if (role === 'caregiver') {
      q = query(collection(db, 'patients'), where('assignedCaregiver', '==', userId), orderBy('name'));
    } else if (role === 'patient') {
      q = query(collection(db, 'patients'), where('id', '==', userId), orderBy('name'));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Patient[];
  }

  async createPatient(patient: Omit<Patient, 'id'>): Promise<string> {
    const docRef = doc(collection(db, 'patients'));
    await setDoc(docRef, {
      ...patient,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  async updatePatient(patientId: string, updates: Partial<Patient>): Promise<void> {
    const docRef = doc(db, 'patients', patientId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  async deletePatient(patientId: string): Promise<void> {
    await deleteDoc(doc(db, 'patients', patientId));
  }

  // Real-time patient subscription
  subscribeToPatients(
    callback: (patients: Patient[]) => void,
    userId?: string,
    role?: string
  ): () => void {
    let q = query(collection(db, 'patients'), orderBy('name'));
    
    if (role === 'caregiver') {
      q = query(collection(db, 'patients'), where('assignedCaregiver', '==', userId), orderBy('name'));
    } else if (role === 'patient') {
      q = query(collection(db, 'patients'), where('id', '==', userId), orderBy('name'));
    }

    return onSnapshot(q, (snapshot) => {
      const patients = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Patient[];
      callback(patients);
    });
  }

  // Cognitive Tests
  async getCognitiveTests(patientId: string): Promise<CognitiveTest[]> {
    const q = query(
      collection(db, 'cognitiveTests'),
      where('patientId', '==', patientId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CognitiveTest[];
  }

  async createCognitiveTest(test: Omit<CognitiveTest, 'id'>): Promise<string> {
    const docRef = doc(collection(db, 'cognitiveTests'));
    await setDoc(docRef, {
      ...test,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }

  // Speech Analyses
  async getSpeechAnalyses(patientId: string): Promise<SpeechAnalysis[]> {
    const q = query(
      collection(db, 'speechAnalyses'),
      where('patientId', '==', patientId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as SpeechAnalysis[];
  }

  async createSpeechAnalysis(analysis: Omit<SpeechAnalysis, 'id'>): Promise<string> {
    const docRef = doc(collection(db, 'speechAnalyses'));
    await setDoc(docRef, {
      ...analysis,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }

  // Imaging Results
  async getImagingResults(patientId: string): Promise<ImagingResult[]> {
    const q = query(
      collection(db, 'imagingResults'),
      where('patientId', '==', patientId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ImagingResult[];
  }

  async createImagingResult(result: Omit<ImagingResult, 'id'>): Promise<string> {
    const docRef = doc(collection(db, 'imagingResults'));
    await setDoc(docRef, {
      ...result,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }

  // AI Processing Results
  async saveAIProcessingResult(
    patientId: string,
    modality: 'facial' | 'speech' | 'imaging',
    result: any
  ): Promise<string> {
    const docRef = doc(collection(db, 'aiProcessingResults'));
    await setDoc(docRef, {
      patientId,
      modality,
      result,
      processedAt: serverTimestamp(),
      status: 'completed',
    });
    return docRef.id;
  }

  async updateAIProcessingStatus(
    processingId: string,
    status: 'processing' | 'completed' | 'error',
    result?: any,
    error?: string
  ): Promise<void> {
    const docRef = doc(db, 'aiProcessingResults', processingId);
    await updateDoc(docRef, {
      status,
      result: result || null,
      error: error || null,
      updatedAt: serverTimestamp(),
    });
  }

  // Real-time AI processing status subscription
  subscribeToAIProcessing(
    patientId: string,
    callback: (processing: any[]) => void
  ): () => void {
    const q = query(
      collection(db, 'aiProcessingResults'),
      where('patientId', '==', patientId),
      orderBy('processedAt', 'desc'),
      limit(10)
    );

    return onSnapshot(q, (snapshot) => {
      const processing = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(processing);
    });
  }

  // Timeline Events
  async getTimelineEvents(patientId: string): Promise<TimelineEvent[]> {
    const q = query(
      collection(db, 'timelineEvents'),
      where('patientId', '==', patientId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TimelineEvent[];
  }

  async createTimelineEvent(event: Omit<TimelineEvent, 'id'>): Promise<string> {
    const docRef = doc(collection(db, 'timelineEvents'));
    await setDoc(docRef, {
      ...event,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Notification[];
  }

  async createNotification(notification: Omit<Notification, 'id'>): Promise<string> {
    const docRef = doc(collection(db, 'notifications'));
    await setDoc(docRef, {
      ...notification,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await updateDoc(doc(db, 'notifications', notificationId), {
      read: true,
      readAt: serverTimestamp(),
    });
  }
}

export const firestoreService = new FirestoreService();

