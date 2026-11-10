# Spendr PWA — Deploy Instructions

## Files
```
index.html      ← the app (now with Firebase sync)
manifest.json   ← PWA identity & icons config
sw.js           ← service worker (offline + caching)
icons/          ← app icons (8 sizes)
```

---

## Step 1 — Create a Firebase project (free, ~5 min)

1. Go to https://console.firebase.google.com
2. Click **"Add project"** → give it a name (e.g. "spendr") → Continue
3. Disable Google Analytics (not needed) → **Create project**

---

## Step 2 — Enable Google Sign-In

1. In your project: **Build → Authentication → Get started**
2. Click **Google** under Sign-in providers → Enable → Save

---

## Step 3 — Create a Firestore database

1. **Build → Firestore Database → Create database**
2. Choose **"Start in production mode"** → Next
3. Pick any region close to you → **Enable**
4. Go to the **Rules** tab and paste this, then **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

This means each user can only read/write their own data.

---

## Step 4 — Get your Firebase config and paste it into index.html

1. **Project Settings** (gear icon) → **Your apps** → click **</>** (Web)
2. Register app name (e.g. "spendr-web") → **Register app**
3. Copy the `firebaseConfig` object — it looks like:
   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "yourproject.firebaseapp.com",
     projectId: "yourproject",
     storageBucket: "yourproject.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123...",
   };
   ```
4. Open `index.html`, find the section that says:
   ```
   // ── PASTE YOUR FIREBASE CONFIG HERE ──
   ```
   Replace each `"REPLACE_WITH_YOUR_..."` value with your actual values.

---

## Step 5 — Add your deployed URL to Authorized Domains

After you deploy (Step 6), you need to whitelist your URL:

1. Firebase Console → **Authentication → Settings → Authorized domains**
2. Click **Add domain** → paste your Netlify/Vercel URL (e.g. `spendr-abc123.netlify.app`)

> **localhost is already whitelisted** — sign-in works locally without this step.

---

## Step 6 — Deploy to Netlify (free, ~2 min)

1. Go to https://netlify.com → **"Add new site" → "Deploy manually"**
2. Drag the entire `spendr-pwa/` folder onto the drop zone
3. You'll get a live URL like `https://spendr-abc123.netlify.app`
4. Add that URL to Firebase Authorized Domains (Step 5 above)

---

## How sync works

- **Not signed in:** data is saved only to this device (localStorage), same as before
- **Signed in:** every change is debounced and saved to Firestore after 1.2s
- **New device:** sign in → your data loads automatically from the cloud
- **Offline:** changes save locally; they sync when you're back online (Firestore offline cache)
- **Sign out:** data stays on the device but stops syncing

