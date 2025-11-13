# NEUROCARE - Firebase & Gemini AI Integration Setup

This guide will help you set up Firebase Authentication, Firestore, and Gemini AI integration for the NEUROCARE application.

## Prerequisites

- Node.js 18+ installed
- Firebase project created
- Google Cloud project with Gemini API enabled

## Step 1: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable the following services:
   - **Authentication**: 
     - Go to Authentication > Sign-in method
     - Enable Email/Password authentication
   - **Firestore Database**:
     - Go to Firestore Database
     - Create database in production mode
     - Set up security rules (see below)
   - **Storage**:
     - Go to Storage
     - Get started with default rules

4. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll down to "Your apps"
   - Click on the web icon (`</>`) to add a web app
   - Copy the Firebase configuration object

## Step 2: Gemini AI Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key for Gemini
3. Copy the API key

## Step 3: Environment Variables

1. Copy `.env.example` to `.env` in the root directory:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. Add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

## Step 4: Firestore Security Rules

Set up Firestore security rules in Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Patients - doctors can read all, caregivers can read assigned, patients can read their own
    match /patients/{patientId} {
      allow read: if request.auth != null && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'doctor' ||
        resource.data.assignedCaregiver == request.auth.uid ||
        resource.data.id == request.auth.uid
      );
      allow write: if request.auth != null && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'doctor'
      );
    }
    
    // Cognitive tests, speech analyses, imaging results
    match /{collection}/{documentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // AI processing results
    match /aiProcessingResults/{resultId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Timeline events
    match /timelineEvents/{eventId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## Step 5: Storage Security Rules

Set up Storage security rules in Firebase Console > Storage > Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /patients/{patientId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 6: Install Dependencies

```bash
npm install
```

## Step 7: Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Step 8: Create Initial Users

Since Firebase Authentication is now required, you'll need to:

1. Use the Firebase Console to create test users, OR
2. Use the registration feature in the app (if implemented), OR
3. Use Firebase CLI to create users:

```bash
firebase auth:import users.json
```

## Features

### Real-time AI Processing

- **Facial Recognition**: Upload images or use live video stream
- **Speech Analysis**: Upload audio files or use live audio stream
- **Immediate Feedback**: Real-time processing status and results
- **Firestore Sync**: All AI results automatically saved to Firestore

### Authentication

- Firebase Authentication with email/password
- Role-based access (doctor, caregiver, patient)
- Real-time auth state management

### Data Management

- Firestore for all patient data, tests, and AI results
- Real-time data synchronization
- Secure file storage in Firebase Storage

## Troubleshooting

### "Firebase not initialized" error
- Check that all environment variables are set correctly
- Verify Firebase project configuration

### "Gemini API key not found" warning
- Ensure `VITE_GEMINI_API_KEY` is set in `.env`
- Restart the dev server after adding the key

### Authentication errors
- Verify Email/Password is enabled in Firebase Console
- Check Firestore security rules
- Ensure user roles are set in Firestore `users` collection

### AI processing fails
- Check Gemini API key is valid
- Verify API quotas haven't been exceeded
- Check browser console for detailed error messages

## Architecture

### Modular Design

- **Firebase Integration** (`src/integrations/firebase/`): Firebase configuration
- **Auth Service** (`src/lib/firebaseAuth.ts`): Authentication logic
- **Firestore Service** (`src/lib/firestoreService.ts`): Database operations
- **Gemini AI Service** (`src/lib/geminiAIService.ts`): AI processing
- **AI Pipeline** (`src/lib/aiProcessingPipeline.ts`): Processing orchestration
- **UI Components** (`src/components/`): Reusable AI components
- **Hooks** (`src/hooks/useAIProcessing.ts`): React hooks for AI features

### Extensibility

The system is designed to easily extend AI capabilities:
- Add new modalities by extending `geminiAIService`
- Add new processing types in `aiProcessingPipeline`
- Create new UI components following the existing patterns

## Security Notes

- Never commit `.env` file to version control
- Keep API keys secure
- Regularly review Firestore security rules
- Monitor API usage and quotas
- Use Firebase App Check for production

## Support

For issues or questions, please refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Gemini AI Documentation](https://ai.google.dev/docs)
- Project README.md

