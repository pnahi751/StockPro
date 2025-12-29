import { db } from '../middleware/auth';
import * as admin from 'firebase-admin';

export type StockOperationType = 'IN' | 'OUT' | 'ADJUST';

export const updateStock = async (
    productId: string,
    type: StockOperationType,
    quantity: number,
    reason: string,
    userId: string
) => {
    return db.runTransaction(async (transaction) => {
        const productRef = db.collection('products').doc(productId);
        const productDoc = await transaction.get(productRef);

        if (!productDoc.exists) {
            throw new Error('Product not found');
        }

        const currentData = productDoc.data();
        const currentStock = currentData?.stockQuantity || 0;

        let newStock = currentStock;
        if (type === 'IN') newStock += quantity;
        if (type === 'OUT' || type === 'ADJUST') {
            // Adjust quantity can be positive or negative
            // If it's OUT, quantity is subtracted
            if (type === 'OUT') {
                newStock -= quantity;
            } else {
                // ADJUST: quantity passed is the DELTA
                newStock += quantity;
            }
        }

        if (newStock < 0) {
            throw new Error('Insufficient stock level. Quantity cannot be negative.');
        }

        // 1. Update Product Stock
        transaction.update(productRef, {
            stockQuantity: newStock,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // 2. Create Stock Movement Record
        const movementRef = db.collection('stockMovements').doc();
        transaction.set(movementRef, {
            productId,
            type,
            quantity,
            prevStock: currentStock,
            newStock,
            reason,
            performedBy: userId,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // 3. Create Audit Log
        const auditRef = db.collection('auditLogs').doc();
        transaction.set(auditRef, {
            action: `STOCK_${type}`,
            entityType: 'product',
            entityId: productId,
            performedBy: userId,
            details: { quantity, reason },
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return { success: true, newStock };
    });
};
