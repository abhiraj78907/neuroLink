# NEUROCARE - AI-Powered Alzheimer's Detection Platform

Advanced AI-powered platform for early Alzheimer's detection, patient monitoring, and care management using Firebase and Gemini AI.

## Features

- 🔐 **Firebase Authentication** - Secure role-based access (Doctor, Caregiver, Patient)
- 🧠 **AI-Powered Analysis** - Gemini AI integration for facial recognition and speech analysis
- 📊 **Real-time Data Sync** - Firestore for live data synchronization
- 🎥 **Live Stream Processing** - Real-time video and audio analysis
- 📤 **File Upload Support** - Upload images and audio for AI processing
- 📱 **Responsive Design** - Modern UI built with React, TypeScript, and Tailwind CSS
- 🔄 **Modular Architecture** - Easily extensible for future AI modalities

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **AI**: Google Gemini AI (Gemini 1.5 Pro)
- **State Management**: TanStack Query
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project created
- Google Cloud project with Gemini API enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhiraj78907/neuroLink.git
   cd neuroLink
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # Gemini AI Configuration
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Configure Firebase**
   - Enable Email/Password authentication in Firebase Console
   - Set up Firestore Database
   - Configure Storage rules
   - See [SETUP.md](./SETUP.md) for detailed instructions

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:8080`

## Demo Accounts

The application includes three pre-configured demo accounts:

- **Doctor**: `doctor@neurocare.demo` / `demo123`
- **Caregiver**: `caregiver@neurocare.demo` / `demo123`
- **Patient**: `patient@neurocare.demo` / `demo123`

Demo accounts are automatically created on first use. See [DEMO_ACCOUNTS.md](./DEMO_ACCOUNTS.md) for details.

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Feature components
├── hooks/              # Custom React hooks
├── integrations/       # Third-party integrations
│   └── firebase/       # Firebase configuration
├── lib/                # Core libraries
│   ├── firebaseAuth.ts      # Authentication service
│   ├── firestoreService.ts  # Firestore operations
│   ├── geminiAIService.ts   # Gemini AI integration
│   └── aiProcessingPipeline.ts # AI processing logic
└── pages/              # Page components
```

## Documentation

- [SETUP.md](./SETUP.md) - Complete setup guide
- [DEMO_ACCOUNTS.md](./DEMO_ACCOUNTS.md) - Demo account information
- [FIREBASE_AUTH_TROUBLESHOOTING.md](./FIREBASE_AUTH_TROUBLESHOOTING.md) - Authentication troubleshooting

## Key Features

### AI Processing

- **Facial Recognition**: Upload images or use live video stream for facial analysis
- **Speech Analysis**: Upload audio files or use live audio stream for speech analysis
- **Real-time Processing**: Immediate AI inference with fast feedback
- **Results Storage**: All AI results automatically saved to Firestore

### Authentication & Authorization

- Firebase Authentication with email/password
- Role-based access control (Doctor, Caregiver, Patient)
- Real-time auth state management
- Secure session handling

### Data Management

- Firestore for all patient data, tests, and AI results
- Real-time data synchronization
- Secure file storage in Firebase Storage
- Timeline events and notifications

## Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Deployment

The application can be deployed to:

- **Vercel**: Connect your GitHub repository
- **Netlify**: Deploy from Git
- **Firebase Hosting**: `firebase deploy`
- **Any static hosting service**: Upload the `dist/` folder

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues or questions:
- Check the [troubleshooting guide](./FIREBASE_AUTH_TROUBLESHOOTING.md)
- Review [Firebase Documentation](https://firebase.google.com/docs)
- Review [Gemini AI Documentation](https://ai.google.dev/docs)

---

**NEUROCARE** - Empowering healthcare with AI-driven insights
