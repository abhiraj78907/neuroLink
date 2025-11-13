import { User, Patient, CognitiveTest, SpeechAnalysis, ImagingResult, TimelineEvent, Notification } from './types';

// Demo user accounts
export const demoUsers: User[] = [
  {
    id: 'doc1',
    email: 'doctor@neurocare.demo',
    name: 'Dr. Sarah Mitchell',
    role: 'doctor',
  },
  {
    id: 'care1',
    email: 'caregiver@neurocare.demo',
    name: 'James Wilson',
    role: 'caregiver',
  },
  {
    id: 'pat1',
    email: 'patient@neurocare.demo',
    name: 'Mary Thompson',
    role: 'patient',
  },
];

// Mock patients
export const mockPatients: Patient[] = [
  {
    id: 'p1',
    name: 'Mary Thompson',
    age: 68,
    gender: 'female',
    dateOfBirth: '1956-03-15',
    riskScore: 72,
    riskLevel: 'high',
    lastAssessment: '2025-01-10',
    assignedDoctor: 'doc1',
    assignedCaregiver: 'care1',
    medicalHistory: ['Hypertension', 'Type 2 Diabetes', 'Family history of Alzheimer\'s'],
    phone: '+1 (555) 123-4567',
    email: 'mary.thompson@email.com',
    address: '123 Oak Street, Springfield, IL 62701',
  },
  {
    id: 'p2',
    name: 'Robert Anderson',
    age: 74,
    gender: 'male',
    dateOfBirth: '1950-07-22',
    riskScore: 45,
    riskLevel: 'medium',
    lastAssessment: '2025-01-08',
    assignedDoctor: 'doc1',
    medicalHistory: ['High cholesterol', 'Mild cognitive impairment'],
    phone: '+1 (555) 234-5678',
    email: 'robert.a@email.com',
    address: '456 Maple Ave, Chicago, IL 60601',
  },
  {
    id: 'p3',
    name: 'Linda Martinez',
    age: 65,
    gender: 'female',
    dateOfBirth: '1959-11-30',
    riskScore: 28,
    riskLevel: 'low',
    lastAssessment: '2025-01-12',
    assignedDoctor: 'doc1',
    assignedCaregiver: 'care1',
    medicalHistory: ['No significant history'],
    phone: '+1 (555) 345-6789',
    email: 'linda.m@email.com',
    address: '789 Pine Rd, Boston, MA 02101',
  },
  {
    id: 'p4',
    name: 'James Cooper',
    age: 71,
    gender: 'male',
    dateOfBirth: '1953-05-18',
    riskScore: 85,
    riskLevel: 'critical',
    lastAssessment: '2025-01-11',
    assignedDoctor: 'doc1',
    medicalHistory: ['Progressive memory loss', 'Depression', 'Stroke (2019)'],
    phone: '+1 (555) 456-7890',
    email: 'j.cooper@email.com',
    address: '321 Cedar Ln, Seattle, WA 98101',
  },
  {
    id: 'p5',
    name: 'Patricia Davis',
    age: 69,
    gender: 'female',
    dateOfBirth: '1955-09-08',
    riskScore: 38,
    riskLevel: 'low',
    lastAssessment: '2025-01-09',
    assignedDoctor: 'doc1',
    medicalHistory: ['Anxiety', 'Sleep apnea'],
    phone: '+1 (555) 567-8901',
    email: 'p.davis@email.com',
    address: '654 Birch St, Austin, TX 73301',
  },
];

// Mock cognitive tests
export const mockCognitiveTests: CognitiveTest[] = [
  {
    id: 'ct1',
    patientId: 'p1',
    date: '2025-01-10',
    type: 'MMSE',
    score: 22,
    maxScore: 30,
    percentile: 73,
    notes: 'Mild impairment in recall and orientation',
    aiAnalysis: 'Score indicates mild cognitive impairment. Recommend follow-up assessment in 3 months.',
  },
  {
    id: 'ct2',
    patientId: 'p1',
    date: '2024-10-05',
    type: 'MoCA',
    score: 21,
    maxScore: 30,
    percentile: 70,
  },
  {
    id: 'ct3',
    patientId: 'p2',
    date: '2025-01-08',
    type: 'MMSE',
    score: 26,
    maxScore: 30,
    percentile: 87,
    aiAnalysis: 'Normal cognitive function for age group.',
  },
];

// Mock speech analyses
export const mockSpeechAnalyses: SpeechAnalysis[] = [
  {
    id: 'sa1',
    patientId: 'p1',
    date: '2025-01-10',
    duration: 180,
    transcription: 'I went to the... um... the place where you buy food. The... store. Yes, the grocery store. I needed to get some... things. Milk and... bread, I think.',
    metrics: {
      pauseFrequency: 8.5,
      wordRepetition: 3.2,
      clarity: 72,
      vocabularyRichness: 65,
    },
    aiInsights: 'Increased pause frequency and word-finding difficulties detected. Mild concern for semantic memory.',
    riskIndicators: ['Frequent pauses', 'Word-finding difficulty', 'Circumlocution'],
  },
  {
    id: 'sa2',
    patientId: 'p2',
    date: '2025-01-08',
    duration: 120,
    transcription: 'Yesterday I visited my daughter and we had a wonderful time. We went to the park and enjoyed the beautiful weather.',
    metrics: {
      pauseFrequency: 2.1,
      wordRepetition: 0.5,
      clarity: 92,
      vocabularyRichness: 88,
    },
    aiInsights: 'Speech patterns within normal range. No significant cognitive concerns.',
    riskIndicators: [],
  },
];

// Mock imaging results
export const mockImagingResults: ImagingResult[] = [
  {
    id: 'img1',
    patientId: 'p1',
    date: '2024-12-15',
    type: 'MRI',
    imageUrl: '/placeholder-brain-mri.jpg',
    findings: ['Mild hippocampal atrophy', 'White matter hyperintensities', 'Reduced temporal lobe volume'],
    aiAnalysis: {
      atrophyLevel: 6.2,
      hippocampalVolume: 3200,
      whiteMatters: 'Moderate changes',
      overallRisk: 68,
    },
  },
  {
    id: 'img2',
    patientId: 'p4',
    date: '2024-11-20',
    type: 'PET',
    imageUrl: '/placeholder-brain-pet.jpg',
    findings: ['Reduced glucose metabolism in temporal and parietal regions', 'Amyloid-positive scan'],
    aiAnalysis: {
      atrophyLevel: 8.5,
      hippocampalVolume: 2800,
      whiteMatters: 'Severe changes',
      overallRisk: 92,
    },
  },
];

// Mock timeline events
export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: 'te1',
    patientId: 'p1',
    date: '2025-01-10',
    type: 'test',
    title: 'MMSE Cognitive Assessment',
    description: 'Score: 22/30 - Mild impairment detected',
    severity: 'warning',
  },
  {
    id: 'te2',
    patientId: 'p1',
    date: '2024-12-15',
    type: 'imaging',
    title: 'MRI Brain Scan',
    description: 'Mild hippocampal atrophy observed',
    severity: 'warning',
  },
  {
    id: 'te3',
    patientId: 'p1',
    date: '2024-11-20',
    type: 'appointment',
    title: 'Follow-up Consultation',
    description: 'Discussed treatment options and lifestyle modifications',
    severity: 'info',
  },
  {
    id: 'te4',
    patientId: 'p1',
    date: '2024-10-05',
    type: 'test',
    title: 'MoCA Assessment',
    description: 'Score: 21/30',
    severity: 'warning',
  },
];

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 'doc1',
    type: 'alert',
    title: 'High Risk Patient Alert',
    message: 'James Cooper shows critical risk indicators. Immediate review recommended.',
    timestamp: '2025-01-13T09:30:00Z',
    read: false,
    patientId: 'p4',
  },
  {
    id: 'n2',
    userId: 'doc1',
    type: 'result',
    title: 'New Test Results Available',
    message: 'MMSE results for Mary Thompson are ready for review.',
    timestamp: '2025-01-12T14:15:00Z',
    read: false,
    patientId: 'p1',
  },
  {
    id: 'n3',
    userId: 'care1',
    type: 'reminder',
    title: 'Medication Reminder',
    message: 'Mary Thompson - Evening medication due in 1 hour',
    timestamp: '2025-01-13T18:00:00Z',
    read: false,
    patientId: 'p1',
  },
  {
    id: 'n4',
    userId: 'doc1',
    type: 'message',
    title: 'Patient Question',
    message: 'Robert Anderson has submitted a question about his recent assessment.',
    timestamp: '2025-01-11T10:45:00Z',
    read: true,
    patientId: 'p2',
  },
];

// Chart data for dashboard
export const generateMockChartData = () => {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  return months.map((month, index) => ({
    month,
    cognition: Math.max(15, 30 - index * 1.5 + Math.random() * 3),
    speech: Math.max(60, 95 - index * 2 + Math.random() * 5),
    imaging: Math.max(50, 85 - index * 3 + Math.random() * 4),
  }));
};

export const riskDistributionData = [
  { name: 'Low Risk', value: 35, fill: 'hsl(var(--risk-low))' },
  { name: 'Medium Risk', value: 28, fill: 'hsl(var(--risk-medium))' },
  { name: 'High Risk', value: 22, fill: 'hsl(var(--risk-high))' },
  { name: 'Critical', value: 15, fill: 'hsl(var(--risk-critical))' },
];
