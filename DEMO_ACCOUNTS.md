# Demo Accounts

The application includes three pre-configured demo accounts that are automatically created on first use.

## Demo Account Credentials

### 1. Doctor Account
- **Email:** `doctor@neurocare.demo`
- **Password:** `demo123`
- **Name:** Dr. Sarah Johnson
- **Role:** Doctor
- **Access:** Full access to all patients, reports, and AI analysis features

### 2. Caregiver Account
- **Email:** `caregiver@neurocare.demo`
- **Password:** `demo123`
- **Name:** John Caregiver
- **Role:** Caregiver
- **Access:** Access to assigned patients only

### 3. Patient Account
- **Email:** `patient@neurocare.demo`
- **Password:** `demo123`
- **Name:** Alice Patient
- **Role:** Patient
- **Access:** View own health data and assessments

## How to Use

1. **Automatic Setup:** Demo accounts are automatically created when you first visit the login page
2. **Quick Login:** Click any demo account button on the login page
3. **Manual Login:** Enter the email and password manually

## Features

- ✅ Auto-creation on first use
- ✅ All accounts use the same password: `demo123`
- ✅ Accounts are created in Firebase with proper roles
- ✅ Roles are stored in Firestore for proper access control

## Notes

- Demo accounts are created automatically if they don't exist
- If you see an error, ensure:
  - Firebase Email/Password authentication is enabled
  - Firebase configuration is correct in `.env` file
  - You have proper Firebase permissions

## Manual Creation

If auto-creation fails, you can manually create these accounts:

1. Go to Firebase Console > Authentication > Users
2. Click "Add user"
3. Enter the email and password from above
4. After creation, update the user's display name
5. Create a document in Firestore `users` collection with the user's UID and role

