# Firebase Schema for Broodl (MoodBoard)

This document describes the Firestore database structure inferred from the codebase, along with example documents and recommended security rules. Use this to recreate your schema in Firebase.

## Overview
- Firestore mode: Cloud Firestore (in Native/Server SDK mode)
- Primary collection: `users`
- Auth: Firebase Authentication (Email/Password)

Your app stores each user's daily mood as a nested map inside their user document in the `users` collection.

## Collections and Documents

- Collection: `users`
  - Document ID: the authenticated user's UID (string)
  - Document data shape: nested maps keyed by `year -> month -> day`, where values are the mood score (1–5).
  - Notes:
    - `year`, `month`, and `day` are used as object keys. When written to Firestore they are stored as string keys.
    - `month` comes from `new Date().getMonth()`, which is zero-based (January = 0, December = 11).

### Example document
Document path: `users/{uid}`

```json
{
  "2025": {
    "8": {        
      "19": 4,    
      "20": 2
    },
    "7": {
      "31": 5
    }
  },
  "2024": {
    "11": {
      "1": 3
    }
  }
}
```

- The number represents the mood for that day. Based on the UI:
  - 1 = "@#$@%" (😭)
  - 2 = "Sad" (😢)
  - 3 = "Existing" (😑)
  - 4 = "Good" (😊)
  - 5 = "Elated" (😆)

## Operations used in code
- Read user doc: `doc(db, 'users', user.uid)` + `getDoc(...)`
- Write/merge mood data: `setDoc(doc(db, 'users', currentUser.uid), newData, { merge: true })`

The app constructs `newData` by ensuring the nested objects exist and setting the mood for `year/month/day` to the chosen value.

## Suggested Security Rules (Firestore)
These rules restrict each user to only read and write their own document in `users`.

```rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

- If you also need admin access or public reads, adjust accordingly.

## Environment Variables required (from firebase.js)
Set these in your Next.js environment files (e.g., `.env.local`) to connect to your Firebase project:

```
NEXT_PUBLIC_API_KEY=...
NEXT_PUBLIC_AUTH_DOMAIN=...
NEXT_PUBLIC_PROJECT_ID=...
NEXT_PUBLIC_STORAGE_BUCKET=...
NEXT_PUBLIC_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_APP_ID=...
NEXT_PUBLIC_MEASUREMENT_ID=...
```

## How to recreate
1. Create/choose a Firebase project in the Firebase Console.
2. Enable Authentication: Email/Password sign-in method.
3. Create Cloud Firestore (Native mode).
4. Add the security rules above.
5. Configure your environment variables with your Firebase web app config.
6. Deploy/run the app; user documents in `users/{uid}` will be created/updated automatically via `setDoc(..., { merge: true })` as moods are selected.

## Optional: Seed a sample user document (for testing)
If you want to manually create a sample document in Firestore for testing, create a doc at `users/test-uid` with the example JSON above.

---
If you later add more fields (e.g., profile info), add them as top-level fields on the `users/{uid}` document alongside the nested year objects.n
