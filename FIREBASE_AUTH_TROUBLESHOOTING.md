# Firebase Authentication Troubleshooting Guide

## Common 400 Bad Request Error

The `400 (Bad Request)` error from Firebase Auth typically indicates one of these issues:

### 1. **Email/Password Authentication Not Enabled**

**Solution:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** > **Sign-in method**
4. Click on **Email/Password**
5. Enable it and click **Save**

### 2. **Invalid or Missing API Key**

**Solution:**
1. Check your `.env` file has all required variables:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

2. Get your Firebase config:
   - Go to Firebase Console > Project Settings
   - Scroll to "Your apps" section
   - Click the web icon (`</>`) or select your web app
   - Copy the configuration values

3. **Restart your dev server** after updating `.env`:
   ```bash
   npm run dev
   ```

### 3. **API Key Restrictions**

If your API key has restrictions:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Find your API key
4. Check **API restrictions** - ensure "Identity Toolkit API" is allowed
5. Check **Application restrictions** - ensure your domain/localhost is allowed

### 4. **User Doesn't Exist**

The 400 error can occur if you try to sign in with a user that doesn't exist.

**Solutions:**
- **Option 1:** Use the registration page (`/register`) to create a new account
- **Option 2:** Create users manually in Firebase Console:
  1. Go to **Authentication** > **Users**
  2. Click **Add user**
  3. Enter email and password
  4. Click **Add user**

### 5. **Incorrect Firebase Project Configuration**

Ensure all environment variables match your Firebase project:
- `VITE_FIREBASE_PROJECT_ID` must match your project ID
- `VITE_FIREBASE_AUTH_DOMAIN` should be `{project-id}.firebaseapp.com`
- All other values must be from the same Firebase project

## Error Code Reference

The improved error handling now provides specific messages for:

- `auth/invalid-email` - Invalid email format
- `auth/user-not-found` - User doesn't exist (register first)
- `auth/wrong-password` - Incorrect password
- `auth/invalid-credential` - Invalid email or password
- `auth/operation-not-allowed` - Email/Password auth not enabled
- `auth/invalid-api-key` - API key is invalid
- `auth/email-already-in-use` - Email already registered
- `auth/weak-password` - Password too weak (min 6 characters)
- `auth/too-many-requests` - Too many failed attempts
- `auth/network-request-failed` - Network connectivity issue

## Quick Fix Checklist

- [ ] Email/Password authentication enabled in Firebase Console
- [ ] All Firebase environment variables set in `.env` file
- [ ] Dev server restarted after `.env` changes
- [ ] API key is valid and not restricted
- [ ] User account exists (or use registration)
- [ ] Firebase project ID matches in all config values
- [ ] Check browser console for detailed error messages

## Testing

1. **Test Registration:**
   - Go to `/register`
   - Create a new account
   - This will help verify Firebase is configured correctly

2. **Test Login:**
   - Use the account you just created
   - Or create a test user in Firebase Console

3. **Check Console:**
   - Open browser DevTools (F12)
   - Check Console tab for detailed error messages
   - Check Network tab to see the exact API request/response

## Still Having Issues?

1. **Verify Firebase Config:**
   ```javascript
   // Check in browser console
   console.log(import.meta.env.VITE_FIREBASE_API_KEY);
   ```

2. **Check Firebase Console:**
   - Ensure project is active
   - Check billing status (some features require billing)
   - Verify API quotas haven't been exceeded

3. **Network Issues:**
   - Check if Firebase services are accessible
   - Verify no firewall/proxy blocking requests
   - Try from different network

4. **Clear Cache:**
   - Clear browser cache
   - Hard refresh (Ctrl+Shift+R)
   - Restart dev server

## Security Notes

- Never commit `.env` file to version control
- Keep API keys secure
- Use Firebase App Check in production
- Set up proper Firestore security rules
- Enable email verification for production

