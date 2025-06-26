# Hexa - AI Logo & Art Generator Demo

A React Native Expo application that simulates an AI logo generation tool with Firebase backend integration.

## 🚀 Features

- **AI Logo Generation Simulation**: Enter prompts and select styles to generate mock logos
- **Real-time Status Updates**: Live status tracking using Firebase Firestore
- **Firebase Functions**: Backend processing with configurable delays (30-60 seconds)
- **Modern UI**: Clean, responsive design matching provided Figma specifications
- **Cross-platform**: Works on iOS, Android, and Web

## 📱 Tech Stack

- **Frontend**: React Native with Expo (Managed Workflow)
- **Backend**: Firebase Functions (Node.js)
- **Database**: Firebase Firestore
- **Styling**: React Native StyleSheet with LinearGradient
- **Icons**: Lucide React Native
- **Language**: TypeScript

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 20.x (LTS)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Firebase CLI (`npm install -g firebase-tools`)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd HexaDEMO
npm install
```

### 2. Firebase Configuration

#### Required: Set up your Firebase project
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database and Firebase Functions (Blaze plan required for Functions)
3. Get your Firebase web app configuration

#### Update Configuration Files:

**A. Create `.env` file:**
```bash
# Copy the example and fill in your values
cp env.example .env
```

Fill in your Firebase configuration in `.env`:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**B. Update `.firebaserc` file:**
```json
{
  "projects": {
    "default": "your-actual-firebase-project-id"
  }
}
```

### 3. Deploy Firebase Functions
```bash
# Login to Firebase
firebase login

# Deploy functions and Firestore rules
cd functions
npm install
cd ..
firebase deploy
```

### 4. Run the Application
```bash
# Start the development server
npm run dev

# Or use Expo CLI directly
npx expo start
```

## 🏗️ Project Structure

```
HexaDEMO/
├── app/                    # Expo Router pages
│   ├── (tabs)/
│   │   └── index.tsx      # Main input screen
│   ├── output.tsx         # Logo output screen
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
├── functions/             # Firebase Functions
│   └── src/
│       └── index.ts       # Logo generation functions
├── lib/                   # Configuration and utilities
│   └── firebase.ts        # Firebase setup
├── services/              # Business logic
│   └── logoService.ts     # Firebase service layer
├── types/                 # TypeScript type definitions
└── assets/               # Images and static files
```

## 🔥 Firebase Functions

The app includes two Firebase Functions:

### `startGeneration(prompt, style)`
- Creates a Firestore document with "processing" status
- Waits 30-60 seconds (configurable)
- Updates status to "done" with mock image URL

### `healthCheck()`
- Simple function to test Firebase Functions connectivity

## 📊 Data Flow

1. User enters prompt and selects style → clicks "Create"
2. Frontend calls `startGeneration` Firebase Function
3. Function creates Firestore document with "processing" status
4. Frontend listens to Firestore changes in real-time
5. After 30-60 seconds, function updates status to "done"
6. Frontend receives update and shows "Ready" chip
7. User taps chip → navigates to output screen

## 🔒 Security Notes

- **Environment Variables**: All sensitive configuration is in `.env` (not committed)
- **Firestore Rules**: Currently set to allow all reads/writes for demo purposes
- **API Keys**: Not exposed in source code
- **Usage Limits**: Firebase has free tier limits

⚠️ **Important**: The `.env` file contains your Firebase credentials and should never be committed to version control.

For production, implement proper authentication and restrictive security rules.

## 🎨 UI/UX Features

- **Gradient Backgrounds**: Smooth color transitions
- **Loading States**: Spinner and progress indicators
- **Status Chips**: Real-time generation status
- **Responsive Design**: Works on all screen sizes
- **Error Handling**: User-friendly error messages

## 📝 Requirements Met

✅ **Two Screens**: Input and Output screens  
✅ **Status Indicator**: Processing → Done chip transitions  
✅ **Random Delay**: 30-60 seconds generation time  
✅ **Navigation**: Tap chip to view results  
✅ **Firebase Integration**: Functions + Firestore  
✅ **Real-time Updates**: Live status monitoring  
✅ **Mock Results**: Displays generated logo images  

## 🚀 Deployment

The app can be built for production using:

```bash
# Build for web
npx expo export --platform web

# Build for mobile (requires EAS)
npx expo install @expo/cli
npx eas build
```

## 📞 Support

This is a demonstration project created for technical assessment purposes.

## 📄 License

This project is for demonstration purposes only. 