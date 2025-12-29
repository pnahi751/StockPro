# Firestore Schema Design

## Collections

### 1. `users`
Represents internal users and their roles.
*   `uid` (Document ID)
*   `name`: string
*   `email`: string
*   `role`: "admin" | "staff"
*   `createdAt`: timestamp

### 2. `products`
General product information accessible by all authenticated staff.
*   `id` (Document ID)
*   `name`: string
*   `category`: string
*   `stockQuantity`: number
*   `isActive`: boolean
*   `createdAt`: timestamp

### 3. `productFinancials`
Restricted financial details. Admin only.
*   `productId` (Document ID - same as `products` id)
*   `costPrice`: number
*   `sellingPrice`: number (for P&L calculations, even if not a POS system)
*   `updatedAt`: timestamp

### 4. `stockMovements`
Immutable history of all stock changes.
*   `id` (Document ID)
*   `productId`: string
*   `type`: "IN" | "OUT" | "ADJUST"
*   `quantity`: number (positive or negative)
*   `reason`: string
*   `performedBy`: string (uid)
*   `createdAt`: timestamp

### 5. `auditLogs`
Tracking administrative actions.
*   `id` (Document ID)
*   `action`: string (e.g., "USER_CREATED", "PRODUCT_MODIFIED")
*   `entityType`: "user" | "product" | "stock"
*   `entityId`: string
*   `performedBy`: string (uid)
*   `createdAt`: timestamp

---

## Why Firestore?
Firestore provides a flexible document model that fits inventory metadata perfectly. It allows for hierarchical data and expressive queries while maintaining high availability.

## Replacing Relational Tables
Instead of `JOIN`s, we use structured document IDs (e.g., matching `productFinancials` ID to `products` ID) and denormalization where appropriate. Stock quantity is kept in the product document for fast lookups, while history is kept in a separate collection.

## Query Strategy
*   **Composite Indexes**: Required for filtering stock history by product and date.
*   **Security Rules**: Enforce that `productFinancials` can never be queried by non-admin roles.
