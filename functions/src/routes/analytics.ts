import { Router } from 'express';
import { isAdmin, AuthRequest, db } from '../middleware/auth';

const router = Router();

router.use(isAdmin); // All analytics are Admin Only

// GET Stock Valuation
router.get('/stock-valuation', async (req: AuthRequest, res) => {
    try {
        const productsSnapshot = await db.collection('products').get();
        const financialsSnapshot = await db.collection('productFinancials').get();

        const financialsMap = new Map();
        financialsSnapshot.docs.forEach(doc => {
            financialsMap.set(doc.id, doc.data());
        });

        let totalWaitValue = 0; // At cost
        let totalPotentialValue = 0; // At selling price

        productsSnapshot.docs.forEach(doc => {
            const product = doc.data();
            const financial = financialsMap.get(doc.id);

            if (financial) {
                totalWaitValue += (product.stockQuantity || 0) * (financial.costPrice || 0);
                totalPotentialValue += (product.stockQuantity || 0) * (financial.sellingPrice || 0);
            }
        });

        res.json({
            totalValuationAtCost: totalWaitValue,
            totalValuationAtSale: totalPotentialValue,
            potentialMargin: totalPotentialValue - totalWaitValue,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to calculate valuation' });
    }
});

// GET Profit/Loss (Simple financial snapshot)
router.get('/profit-loss', async (req: AuthRequest, res) => {
    // In a pure stock system, this is usually simplified to 
    // "Purchases vs Stock on Hand" or similar logic.
    // For this demonstration, we'll return a placeholder summary.
    res.json({
        period: "Current Snapshot",
        revenue: 0, // No sales in a pure stock-only system
        inventoryCost: 0,
        netValuation: 0,
        note: "Pure stock management systems track valuation; P&L requires sales data (POS)."
    });
});

export default router;
