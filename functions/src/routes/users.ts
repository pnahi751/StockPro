import { Router } from 'express';
import { isAdmin, AuthRequest, db, auth } from '../middleware/auth';
import * as admin from 'firebase-admin';

const router = Router();

router.use(isAdmin); // All user management is Admin Only

// GET all users
router.get('/', async (req: AuthRequest, res) => {
    try {
        const usersSnapshot = await db.collection('users').get();
        const users = usersSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// CREATE User
router.post('/', async (req: AuthRequest, res) => {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name || !role) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // 1. Create in Firebase Auth
        const userRecord = await auth.createUser({
            email,
            password,
            displayName: name,
        });

        // 2. Create in Firestore
        await db.collection('users').doc(userRecord.uid).set({
            name,
            email,
            role,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.status(201).json({ uid: userRecord.uid, message: 'User created successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE User
router.delete('/:uid', async (req: AuthRequest, res) => {
    const { uid } = req.params;
    if (uid === req.user?.uid) {
        return res.status(400).json({ error: 'Cannot delete yourself' });
    }

    try {
        await auth.deleteUser(uid);
        await db.collection('users').doc(uid).delete();
        res.json({ message: 'User deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
