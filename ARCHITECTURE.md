# Stock Management System - Architecture & Design

## 1. Zero-Cost Client-Side Architecture

This system is optimized for the **Firebase Spark (Free) Plan**. 

### Why this architecture?
1.  **Zero Monthly Cost**: By using the Firebase Web SDK directly, we avoid the credit-card requirement of Cloud Functions.
2.  **Atomic Integrity**: We use `runTransaction` on the frontend to ensure stock updates and movement logs happen as a single atomic unit.
3.  **Security via Rules**: Since there is no backend "gateway", we use robust **Firestore Security Rules** to block unauthorized access to financial data.
2.  **Scalability & Maintenance**:
    *   **Stateless Backend**: Express inside Cloud Functions allows for easy scaling and clean routing logic.
    *   **Netlify CD**: Provides seamless global distribution for the React SPA.
3.  **Cost Efficiency**:
    *   The entire stack (Firebase + Netlify) operates on a "pay-as-you-go" / "free tier" model that handles burst traffic without dedicated server costs.

### Tech Stack Details
*   **Frontend**: React (TS) + Vite for a fast, type-safe development experience.
*   **Backend**: Firebase Cloud Functions running Express.js for robust API design.
*   **Database**: Firestore (NoSQL) for real-time updates and flexible document structure.
*   **Storage/Hosting**: Netlify handles the static frontend builds.

---

## 2. Role Storage & Access Strategy

### Role Storage
Roles are stored in the `/users` collection in Firestore. This collection maps Firebase Auth `uid` to a `role` ("admin" or "staff").

### Backend Role Enforcement (The Gateway)
The Express backend uses a custom middleware that:
1.  Verifies the Firebase ID Token (JWT) sent in the `Authorization` header.
2.  Queries the user's role from Firestore.
3.  Attaches the role to the request object.
4.  Subsequent route handlers check the user's role before processing financial or sensitive operations.

### Frontend Route Guarding (The UX)
React-router guards redirect non-admins away from administrative pages. However, this is for UX ONLY. All actual data fetching is protected by the backend.

### Why Frontend restrictions are insecure
Client-side code can be modified, bypassed, or inspected. Never treat frontend "hiding" as security. Real security happens at the API and Database level.

---

## 3. Authentication & Authorization Flow

1.  **Login**: User enters credentials via Firebase Auth.
2.  **Token**: Firebase returns an ID Token (JWT).
3.  **API Request**: Frontend sends this token in the header: `Authorization: Bearer <token>`.
4.  **Verification**: Backend uses `firebase-admin` to verify the token and get the `uid`.
5.  **Authorization**: Backend checks the role and allows/denies the specific operation.

**Why no manual JWT?**
Firebase Auth manages token rotation, security, and verification out-of-the-box. Implementing manual JWTs adds unnecessary complexity and security risk (e.g., handling refresh tokens, signing keys).

---

## 4. Financial Data Visibility (Defense-in-Depth)

**Separation of Concerns**:
*   `products`: Public list (name, stock level). Available to Staff.
*   `productFinancials`: Restricted list (cost prices). Available ONLY to Admins.

**Backend Calculation**:
Profit/Loss and Valuation are never calculated on the client. The backend aggregates this data and returns only the final results to Admins. This prevents leakage of sensitive unit costs to unauthorized users.
