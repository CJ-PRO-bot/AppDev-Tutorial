# 📱 AppDev Tutorial

**An Interactive Mobile Application for Learning App Development**  
CTE308 — Mobile Application Development | Project II  
**Student:** Chabsel Jungney Wangchuk (02240146)  
**Institution:** College of Science and Technology, Royal University of Bhutan

A complete **React Native + Expo + TypeScript** educational app for Android, iOS and a Windows browser preview. The app teaches programming concepts with guided learning paths, sample code, interactive quizzes, practice tasks and saved progress.

> **Works immediately without a Firebase account.** Guest mode stores progress locally. Optionally connect Firebase Authentication and Cloud Firestore for genuine registration/login and cloud progress. No pretend sign-in is included.

## ✅ Included features

| Feature | What works |
| --- | --- |
| Home dashboard | Next suggested lesson, progress percentage, learning stats |
| Tutorial categories | Four guided paths from fundamentals to release |
| Step-by-step lessons | 16 complete lessons with explanations, steps, tips and real code |
| Code examples | Syntax-preserving code blocks and copy-to-clipboard |
| Saved lessons | Bookmark and revisit lessons |
| Interactive quizzes | 2 multiple-choice questions per lesson, scoring and explanations |
| Practice tasks | Hands-on exercises marked complete independently |
| Learning progress | Completed lessons, quiz scores, streak and category progress |
| Profile | Set a display name, reset progress, manage account |
| Light/dark theme | Light, dark and system modes |
| Study reminders | Select a reminder hour, receive **local device** notifications |
| Firebase integration | Optional email/password register/login and Firestore progress storage |

### Requirements for Windows

- **Windows 10/11** and **VS Code**.
- **Node.js 22.13+ (Node 22 LTS recommended)** and npm. Installation: https://nodejs.org/
- Internet connection **for the first npm install**.
- To test on a phone: **Expo Go** installed (Android or iPhone) with computer and phone on same Wi-Fi.
- Android emulator is optional (requires Android Studio). iOS simulator requires a Mac; an actual iPhone can use Expo Go from Windows.

## 🚀 Run locally on Windows — easiest method

1. Extract the ZIP. Open **Visual Studio Code**.
2. Select **File → Open Folder** and choose the extracted **AppDev-Tutorial** folder (the one containing `package.json`).
3. Open **Terminal → New Terminal** (PowerShell).
4. Enter **these commands, one by one**:

```powershell
node -v
npm -v
npm install
npx expo install --fix
npm run web
```

5. The terminal displays a local address, usually **http://localhost:8081**. Open the address in Chrome or Edge if it doesn't open automatically.
6. Select **Explore as guest**. You can now open all lessons, take quizzes, save lessons and track progress without configuring any backend.

**Alternative:** Double-click `RUN_ON_WINDOWS.bat` from File Explorer for automatic dependency installation and a web launch. The first start requires internet access.

### Android phone with Expo Go

Open a new terminal in the same folder and run:

```powershell
npm start
```

Scan the QR code with the **Expo Go** app on Android. If your phone cannot connect, try `npx expo start --tunnel` (the tunnel may require an extra package install). You can also press `a` to launch an already configured Android emulator.

### iPhone with Expo Go

Use `npm start`, scan the QR code with the **iPhone Camera**, and open the Expo Go link. **You can write the iOS code on Windows, but iOS Simulator/Xcode only run on macOS.**

### Useful commands

```powershell
npm start                 # Expo server, QR code for phone
npm run web               # Browser preview (Windows)
npm run android           # Open emulator if installed
npm run check             # TypeScript static check
npx expo start -c         # Restart Metro with cleared cache
npx expo install --fix    # Sync dependency versions to Expo SDK
```

> The app uses **Expo SDK 57** for physical-device Expo Go compatibility during the SDK 58 transition. **React 19.2.3 / React Native 0.86.3** are paired to this SDK. Expo may prompt to upgrade Expo Go if your installed version differs.

## 🔥 Optional: enable real Firebase login & cloud progress

1. Open https://console.firebase.google.com/ and create a Firebase project.
2. In **Build → Authentication → Sign-in method**, enable **Email/Password**.
3. In **Build → Firestore Database**, create a Firestore database.
4. In Firestore **Rules**, paste the rules from [`firestore.rules`](firestore.rules), then **Publish**. Do **not** leave a public test database open.
5. In Firebase **Project settings**, add a **Web App** and copy its client config values.
6. Copy the sample environment file to `.env`:

   ```powershell
   Copy-Item .env.example .env
   ```

7. Fill these entries inside `.env` with YOUR Firebase web-app config values:

   ```dotenv
   EXPO_PUBLIC_FIREBASE_API_KEY=your_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

8. Fully restart Expo:

   ```powershell
   npx expo start -c
   ```

The welcome page will show **Sign in or create an account**. After registration, learners can save progress to `users/{uid}/data/progress` in Firestore. **Guest progress is separate from cloud progress and is not automatically merged.** Cloud use needs an internet connection and valid Firestore rules.

See [`docs/FIREBASE_SETUP.md`](docs/FIREBASE_SETUP.md) for more help.

### Daily reminders

Reminders are **local notifications** scheduled on the Android/iOS device. Go to **Profile → Daily study reminder**, choose a time and press **Enable**. Grant notification permission. Test these on a real phone; the **web preview intentionally does not support device reminders**. This project does not send remote push notifications.

### Project structure

```text
AppDev-Tutorial/
├── App.tsx                       # app navigation + bottom tabs
├── index.ts                      # Expo entry point
├── src/
│   ├── data/curriculum.ts        # 16 lessons, practice tasks, 32 quiz questions
│   ├── navigation.ts             # typed screen routes
│   ├── screens/AuthScreen.tsx     # welcome / optional Firebase sign-in
│   ├── screens/MainScreens.tsx   # home, learning paths, saved, progress, profile
│   ├── screens/LessonScreens.tsx # lesson detail, interactive quizzes
│   ├── services/firebase.ts      # optional Firebase configuration
│   ├── state/AppState.tsx        # progress persistence and cloud save
│   └── ui/                       # common interface elements and themes
├── firestore.rules              # per-user Firestore protection
├── .env.example                 # optional Firebase environment template
├── RUN_ON_WINDOWS.bat           # quick Windows launcher
└── docs/                        # setup & test checklists
```

## Testing checklist for Project II

Run through these tasks before presenting your project:

1. Guest opens the dashboard and browses all four categories.
2. Search finds a lesson, and its code can be copied.
3. Bookmark a lesson and reopen it from **Saved**.
4. Answer a quiz and confirm that the result appears in **Progress**.
5. Mark a practice task and a lesson as complete; progress updates.
6. Close and reopen the app; guest progress is still there.
7. Switch between light and dark modes.
8. On a phone, enable a study reminder and check permissions.
9. After Firebase setup, register, log out, log in again and verify cloud progress.
10. Run `npm run check` and fix any reported issues before submitting.

## Notes and boundaries

- Code samples are **illustrative and readable**, not executed by the app. Practice activities are self-reported by learners, not automatically graded.
- Quizzes are graded by the built-in answer key; the displayed results correspond to the learner's selections.
- Guest progress uses **unencrypted AsyncStorage** and should not contain private credentials.
- The Firebase client API key is app configuration, not an admin key; **never upload service-account private keys**.
- Because cloud saving requires Firestore and network access, check the device connection and Firestore Rules if progress cannot sync.
- `node_modules` is intentionally excluded from the ZIP. It is installed by `npm install`.

---

**Project:** AppDev Tutorial – An Interactive Mobile Application for Learning App Development  
**Author:** Chabsel Jungney Wangchuk | Student ID: 02240146  
**Course:** CTE308 – Mobile Application Development  
**College:** College of Science and Technology, Royal University of Bhutan
