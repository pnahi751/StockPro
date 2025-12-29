# StockPro - Internal Stock Management System

StockPro is a premium, internal-only inventory control system built with **React**, **TypeScript**, and **Firebase**. It is designed to be completely free to run on the **Firebase Spark (Free) Plan**.

## 🚀 Key Features
- **Product Management**: Create and track internal items.
- **Atomic Stock Control**: Perform IN/OUT/ADJUST operations with transactional integrity.
- **Role-Based Access**: Specialized views for Admins and Staff.
- **Financial Analytics**: Secure, Admin-only valuation of current inventory based on cost and selling prices.
- **Premium UI**: Modern dark-mode interface with glassmorphism aesthetics.

## 🛠️ Technology Stack
- **Frontend**: React + TypeScript + Vite
- **Database**: Firestore (Direct Client SDK)
- **Authentication**: Firebase Auth (Email/Password)
- **Security**: Strict Firestore Security Rules
- **Hosting**: Netlify

## 🛡️ Security System
This application uses a **Zero-Trust Client-Side Architecture**. Since there is no paid backend, security is enforced via:
1. **Firestore Security Rules**: Hard-blocking non-admins from sensitive collections.
2. **Transactional Logic**: Preventing stock from going negative at the database level.
3. **Audit Trails**: Immutable logs of every stock movement.

## 📖 Documentation
- [Architecture & Design](ARCHITECTURE.md)
- [Database Schema](SCHEMA.md)
- [Security Best Practices](SECURITY.md)
- [Deployment Guide](DEPLOYMENT.md)

## 🏗️ Getting Started
1. Clone this repository.
2. Install dependencies: `cd frontend && npm install`.
3. Create a Firebase project and copy the config to your `.env` (see `DEPLOYMENT.md`).
4. Apply Firestore rules: `firebase deploy --only firestore:rules`.
5. Run locally: `npm run dev`.

---
*Note: This is NOT a POS system. It does not handle billing, checkouts, or customer payments.*
