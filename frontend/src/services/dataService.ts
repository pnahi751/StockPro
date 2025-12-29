import {
    collection,
    doc,
    runTransaction,
    serverTimestamp,
    getDocs,
    query,
    orderBy,
    limit,
    QueryDocumentSnapshot,
    Transaction
} from 'firebase/firestore';
import { db, auth } from './firebase';
import type { Product, StockMovement } from '../types';

export const StockService = {
    async performStockOperation(
        productId: string,
        type: 'IN' | 'OUT' | 'ADJUST',
        quantity: number,
        reason: string
    ) {
        const user = auth.currentUser;
        if (!user) throw new Error('Not authenticated');

        return runTransaction(db, async (transaction: Transaction) => {
            const productRef = doc(db, 'products', productId);
            const productSnap = await transaction.get(productRef);

            if (!productSnap.exists()) throw new Error('Product not found');

            const currentStock = (productSnap.data() as any).stockQuantity || 0;
            let newStock = currentStock;

            if (type === 'IN') newStock += quantity;
            else if (type === 'OUT') newStock -= quantity;
            else if (type === 'ADJUST') newStock += quantity;

            if (newStock < 0) throw new Error('Insufficient stock! Operation aborted.');

            transaction.update(productRef, {
                stockQuantity: newStock,
                updatedAt: serverTimestamp()
            });

            const movementRef = doc(collection(db, 'stockMovements'));
            transaction.set(movementRef, {
                productId,
                type,
                quantity,
                prevStock: currentStock,
                newStock,
                reason,
                performedBy: user.uid,
                createdAt: serverTimestamp()
            });

            return { success: true, newStock };
        });
    }
};

export const ProductService = {
    async getAllProducts(isAdmin: boolean) {
        const productsSnap = await getDocs(collection(db, 'products'));
        const products = productsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product));

        if (isAdmin) {
            const finSnaps = await getDocs(collection(db, 'productFinancials'));
            const finMap: Record<string, any> = {};
            finSnaps.docs.forEach((d: QueryDocumentSnapshot) => {
                finMap[d.id] = d.data();
            });

            return products.map((p: Product) => ({
                ...p,
                financials: finMap[p.id] || null
            }));
        }

        return products;
    },

    async createProduct(data: { name: string; category: string; costPrice: number; sellingPrice: number }) {
        const productRef = doc(collection(db, 'products'));
        const productId = productRef.id;

        await runTransaction(db, async (transaction: Transaction) => {
            transaction.set(productRef, {
                name: data.name,
                category: data.category,
                stockQuantity: 0,
                isActive: true,
                createdAt: serverTimestamp()
            });

            const finRef = doc(db, 'productFinancials', productId);
            transaction.set(finRef, {
                productId,
                costPrice: data.costPrice,
                sellingPrice: data.sellingPrice,
                updatedAt: serverTimestamp()
            });
        });

        return productId;
    }
};

export const AnalyticsService = {
    async getStockValuation() {
        const productsSnap = await getDocs(collection(db, 'products'));
        const financialsSnap = await getDocs(collection(db, 'productFinancials'));

        const finMap: Record<string, any> = {};
        financialsSnap.docs.forEach((doc: QueryDocumentSnapshot) => {
            finMap[doc.id] = doc.data();
        });

        let totalCost = 0;
        let totalSale = 0;

        productsSnap.docs.forEach((doc: QueryDocumentSnapshot) => {
            const p = doc.data() as any;
            const f = finMap[doc.id];
            if (f) {
                totalCost += (p.stockQuantity || 0) * (f.costPrice || 0);
                totalSale += (p.stockQuantity || 0) * (f.sellingPrice || 0);
            }
        });

        return {
            totalValuationAtCost: totalCost,
            totalValuationAtSale: totalSale,
            potentialMargin: totalSale - totalCost,
            timestamp: new Date().toISOString()
        };
    }
};

export const HistoryService = {
    async getMovementHistory() {
        const q = query(collection(db, 'stockMovements'), orderBy('createdAt', 'desc'), limit(100));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as StockMovement));
    }
};

export const UserService = {
    async getAllUsers() {
        const snap = await getDocs(collection(db, 'users'));
        return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
    }
};
