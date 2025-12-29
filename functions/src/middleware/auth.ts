import * as admin from 'firebase-admin';
import { Request, Response, NextFunction } from 'express';

admin.initializeApp();
export const db = admin.firestore();
export const auth = admin.auth();

export interface AuthRequest extends Request {
    user?: admin.auth.DecodedIdToken;
    role?: 'admin' | 'staff';
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await auth.verifyIdToken(token);
        req.user = decodedToken;

        // Fetch user role from Firestore
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();
        if (!userDoc.exists) {
            return res.status(403).json({ error: 'User profile not found' });
        }

        req.role = userDoc.data()?.role;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.role !== 'admin') {
        return res.status(403).json({ error: 'Require Admin Role' });
    }
    next();
};
