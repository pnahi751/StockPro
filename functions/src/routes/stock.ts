import { Router } from 'express';
import { isAdmin, AuthRequest, db } from '../middleware/auth';
import { updateStock } from '../services/stockService';

const router = Router();

// GET Stock History (Mostly Admin, but maybe staff can see recent?)
// User specified: View complete stock history (Admin)
router.get('/history', isAdmin, async (req: AuthRequest, res) => {
    try {
        const historySnapshot = await db.collection('stockMovements')
            .orderBy('createdAt', 'desc')
            .limit(100)
            .get();

        const history = historySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stock history' });
    }
});

// STOCK IN
router.post('/in', async (req: AuthRequest, res) => {
    const { productId, quantity, reason } = req.body;
    if (!productId || !quantity) return res.status(400).json({ error: 'Missing details' });

    try {
        const result = await updateStock(productId, 'IN', quantity, reason || 'Stock Inbound', req.user!.uid);
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// STOCK OUT
router.post('/out', async (req: AuthRequest, res) => {
    const { productId, quantity, reason } = req.body;
    if (!productId || !quantity) return res.status(400).json({ error: 'Missing details' });

    try {
        const result = await updateStock(productId, 'OUT', quantity, reason || 'Stock Outbound', req.user!.uid);
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// STOCK ADJUST (Admin Only)
router.post('/adjust', isAdmin, async (req: AuthRequest, res) => {
    const { productId, quantity, reason } = req.body; // quantity is delta
    if (!productId || quantity === undefined) return res.status(400).json({ error: 'Missing details' });

    try {
        const result = await updateStock(productId, 'ADJUST', quantity, reason || 'Stock Adjustment', req.user!.uid);
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
