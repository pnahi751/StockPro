# Deployment Guide (Netlify + Firebase - FREE PLAN)

## 1. Firebase Project Setup
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project (e.g., `StockPro`).
3. Enable **Authentication** and activate **Email/Password** provider.
4. Enable **Firestore Database** in **Native Mode**.
   - Start in Production Mode.
5. **No Billing Required**: You can stay on the **Spark Plan**.

## 2. Security Rules Deployment
1. I have already created the `firebase.json` and `.firebaserc` files for you.
2. I have also successfully deployed the rules to your project `stockpro-e4793`.
3. If you ever change the rules in `firestore.rules`, simply run:
   ```bash
   firebase deploy --only firestore:rules
   ```

## 3. Netlify Frontend Deployment
1. Login to **Netlify**.
2. Create a new site from your Git repository.
3. **Build Settings**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. **Environment Variables**:
   Add the following in Netlify Site Settings -> Environment Variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

## 4. Initialization (The First Admin)
Since we are on the Free Plan without an Admin SDK:
1. Go to Firebase Console -> Authentication -> Add User.
2. Note the **UID** of the created user.
3. Go to Firestore -> Create a collection named `users`.
4. Create a document with the **UID** as the Document ID.
5. Add fields:
   - `name`: "Your Name"
   - `email`: "your-email@example.com"
   - `role`: "admin"
   - `createdAt`: [Current Timestamp]

## 5. Domain Allowlisting
In Firebase Console -> Authentication -> Settings -> Authorized Domains:
- Add your Netlify domain (e.g., `your-stock-pro.netlify.app`).
