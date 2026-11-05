# Feature acceptance checklist — AppDev Tutorial (Project II)

| # | Test | Expected result |
| --- | --- | --- |
| 1 | Launch without `.env` | Guest entry; no Firebase setup required |
| 2 | Open Home | Shows next lesson, progress cards and four guided paths |
| 3 | Open Learn | Search, category filters and 16 tutorials work |
| 4 | Open any Lesson | Step-by-step content, code, practice and quiz link show |
| 5 | Copy code | Example is copied to clipboard |
| 6 | Save a lesson | Appears in Saved and can be removed |
| 7 | Submit quiz | Select answers, submit, view score and explanations |
| 8 | Retake quiz | New score overwrites the last score for that lesson |
| 9 | Complete practice | Progress summary updates independently of lesson completion |
| 10 | Complete a lesson | Completion percentage increases and recommended next changes |
| 11 | Restart app | Progress and theme persist using AsyncStorage |
| 12 | Theme setting | System/light/dark appearance changes |
| 13 | Phone reminder | Permission request and recurring local device notification scheduled |
| 14 | Web reminder | Clear explanation that web preview cannot schedule device alert |
| 15 | Configure Firebase | Sign-in and create-account form appears |
| 16 | Register/login | Firebase Authentication creates/loads actual account |
| 17 | Complete while signed in | Firestore document `users/{uid}/data/progress` updates |
| 18 | Sign out/sign in | Cloud progress reappears after login |
| 19 | Security check | User cannot access a different user's progress document |
| 20 | Reset progress | Confirmation clears current profile's learning records |

*Test these on Android and iOS when devices are available. Some simulator/iOS functionality cannot be checked on Windows alone.*
