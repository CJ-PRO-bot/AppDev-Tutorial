# Optional Firebase setup

The app runs in Guest Mode without a backend. Firebase is needed only if you want **real email/password registration, login and saved progress across devices**.

1. Open https://console.firebase.google.com/ and create a project.
2. Go to **Authentication → Sign-in method → Email/Password → Enable**.
3. Go to **Firestore Database → Create database**. Choose a region and configure securely.
4. In **Firestore → Rules**, use the contents of `firestore.rules` and click **Publish**.
5. In Project settings → Your apps, register a **Web** app (the Firebase JS SDK is used for Expo Go). Copy its config fields.
6. In the root folder, run `Copy-Item .env.example .env` in PowerShell.
7. Edit `.env` using the values copied from the registered web app.
8. Restart with `npx expo start -c`.
9. Create an account in the welcome screen, complete a lesson, sign out and sign back in. The progress should reappear.

Your Firestore data path is:

```text
users/
  <firebase-auth-uid>/
    data/
      progress
```

Each signed-in user can read/write only **their own** progress document. Other paths are denied by the provided rules. Avoid Firestore's permissive test rules for submitted/public projects.

**Troubleshooting**

- Missing Firebase sign-in button: ensure the API key, project ID and app ID fields are filled and Expo is restarted.
- `auth/operation-not-allowed`: enable Email/Password in Firebase Authentication.
- `auth/invalid-credential`: check email/password.
- `permission-denied`: publish the correct Firestore Rules and confirm the signed-in user owns the document.
- Incorrect Firebase project: recheck `.env` values against Firebase console.
- When running the web version, add the relevant domain to **Authentication → Settings → Authorized domains** if Firebase reports an unauthorized domain.
- **Guest and Firebase data are separate**; signing in does not silently migrate guest data.

**Security:** Only client Firebase configuration goes in `.env`, not Firebase Admin/service-account secrets. Since Expo public environment variables are embedded in the app bundle, never put passwords, tokens or private keys in them.
