export type UserRole = 'doctor' | 'caregiver' | 'patient';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastAssessment: string;
  assignedDoctor?: string;
  assignedCaregiver?: string;
  medicalHistory: string[];
  avatar?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface CognitiveTest {
  id: string;
  patientId: string;
  date: string;
  type: 'MMSE' | 'MoCA' | 'CDR' | 'ADAS-Cog';
  score: number;
  maxScore: number;
  percentile: number;
  notes?: string;
  aiAnalysis?: string;
}

export interface SpeechAnalysis {
  id: string;
  patientId: string;
  date: string;
  duration: number;
  transcription: string;
  audioUrl?: string;
  metrics: {
    pauseFrequency: number;
    wordRepetition: number;
    clarity: number;
    vocabularyRichness: number;
  };
  aiInsights: string;
  riskIndicators: string[];
}

export interface ImagingResult {
  id: string;
  patientId: string;
  date: string;
  type: 'MRI' | 'CT' | 'PET';
  imageUrl: string;
  findings: string[];
  aiAnalysis: {
    atrophyLevel: number;
    hippocampalVolume: number;
    whiteMatters: string;
    overallRisk: number;
  };
  heatmapUrl?: string;
}

export interface TimelineEvent {
  id: string;
  patientId: string;
  date: string;
  type: 'test' | 'imaging' | 'appointment' | 'note' | 'alert';
  title: string;
  description: string;
  severity?: 'info' | 'warning' | 'critical';
}

export interface Notification {
  id: string;
  userId: string;
  type: 'alert' | 'reminder' | 'result' | 'message';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  patientId?: string;
}

export interface Report {
  id: string;
  patientId: string;
  generatedBy: string;
  generatedAt: string;
  type: 'comprehensive' | 'cognitive' | 'imaging' | 'speech';
  summary: string;
  recommendations: string[];
  pdfUrl?: string;
}
