This app is a feature-rich React Native demo showcasing:

Firebase Authentication (Email/Password)
Real-time 1:1 Chat using Firestore
Video Reels Feed with autoplay
Firebase Cloud Messaging (Foreground handling)
Notifications Screen
🔗 Optional: Deep Linking support


 1. Firebase Authentication
Signup/Login with email & password


 2. Chat (Authenticated Users)
Real-time chat using Firebase Firestore
Authenticated users can search and chat with any other registered user
Messages are loaded and displayed in real-time
Send and receive messages live between any two users


3. Reels Feed
FlatList with 3+ video items (local or Firestore)
Auto-plays video when visible
Includes Like button (UI only, optional local state)


4. Firebase Cloud Messaging (Simulated)
Receives FCM foreground messages
On tap, navigates to NotificationScreen with the message data


5. Deep Linking
Open screen via link like: myapp://chat/:id



Setup Instructions:
Prerequisites
Node.js v18+
React Native CLI
Firebase Project
Android Studio / Xcode