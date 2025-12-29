# Security Best Practices

## 1. Zero Trust Backend
Even though the frontend has role-based routing, the backend **never** trusts the client. Every API request is verified using the `verifyToken` middleware which checks the Firebase ID Token against the Admin SDK.

## 2. PII Protection
User data (name, email) is stored in Firestore and access is restricted. Staff can see fellow staff names but cannot modify them.

## 3. Financial Isolation (The "Wall")
The `productFinancials` collection is completely isolated from the `products` collection.
- **Rules**: Firestore Security Rules block non-admins from even querying `productFinancials`.
- **API**: The `/products` GET route programmatically checks the user's role. If the requester is not an admin, the `financials` field is never populated. This prevents "blind" requests from leaking data.

## 4. Atomic Integrity
Stock quantities are never updated using simple `doc.update()`. We use **Firestore Transactions** in the Cloud Functions to ensure:
- `stockQuantity` never goes below zero.
- Every change is paired with an immutable `stockMovements` entry.
- Success is "all or nothing" (Atomicity).

## 5. Defense-in-Depth
1. **Frontend Auth Guards**: For UX and basic navigation control.
2. **API Middleware**: For logical role authorization and data stripping.
3. **Firestore Security Rules**: For raw database level protection if the service account were ever breached or if direct client SDK calls were attempted.

## 6. Audit Logging
Every sensitive action (User creation, Stock Adjustment, Product changes) creates a record in `auditLogs`. These logs are write-only for the system and read-only for Admins.
