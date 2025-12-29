import { Router } from 'express';
import { db, isAdmin, AuthRequest } from '../middleware/auth';
import * as admin from 'firebase-admin';

const router = Router();

// GET all products
router.get('/', async (req: AuthRequest, res) => {
    try {
        const productsSnapshot = await db.collection('products').get();
        const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // IMPORTANT: Even if they are separate collections, 
        // we ensure regular products NEVER contain financial data here.
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// GET single product with optional financials (Admin only)
router.get('/:id', async (req: AuthRequest, res) => {
    try {
        const productDoc = await db.collection('products').doc(req.params.id).get();
        if (!productDoc.exists) return res.status(404).json({ error: 'Product not found' });

        let productData: any = { id: productDoc.id, ...productDoc.data() };

        // If Admin, attach financial data
        if (req.role === 'admin') {
            const financialDoc = await db.collection('productFinancials').doc(req.params.id).get();
            if (financialDoc.exists) {
                productData.financials = financialDoc.data();
            }
        }

        res.json(productData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// CREATE Product (Admin Only)
router.post('/', isAdmin, async (req: AuthRequest, res) => {
    const { name, category, costPrice, sellingPrice } = req.body;

    if (!name || !category) return res.status(400).json({ error: 'Missing required fields' });

    try {
        const batch = db.batch();
        const productRef = db.collection('products').doc();
        const productId = productRef.id;

        batch.set(productRef, {
            name,
            category,
            stockQuantity: 0,
            isActive: true,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Write financial data to separate collection
        const financialRef = db.collection('productFinancials').doc(productId);
        batch.set(financialRef, {
            productId,
            costPrice: costPrice || 0,
            sellingPrice: sellingPrice || 0,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        await batch.commit();
        res.status(201).json({ id: productId, message: 'Product created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// UPDATE Product (Admin Only)
router.put('/:id', isAdmin, async (req: AuthRequest, res) => {
    const { name, category, costPrice, sellingPrice, isActive } = req.body;
    const productId = req.params.id;

    try {
        const batch = db.batch();
        const productRef = db.collection('products').doc(productId);

        const updateData: any = {};
        if (name) updateData.name = name;
        if (category) updateData.category = category;
        if (isActive !== undefined) updateData.isActive = isActive;

        batch.update(productRef, updateData);

        if (costPrice !== undefined || sellingPrice !== undefined) {
            const financialRef = db.collection('productFinancials').doc(productId);
            const finData: any = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
            if (costPrice !== undefined) finData.costPrice = costPrice;
            if (sellingPrice !== undefined) finData.sellingPrice = sellingPrice;
            batch.set(financialRef, finData, { merge: true });
        }

        await batch.commit();
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
});

export default router;
