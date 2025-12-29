export type UserRole = 'admin' | 'staff';

export interface User {
    uid: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: any;
}

export interface Product {
    id: string;
    name: string;
    category: string;
    stockQuantity: number;
    isActive: boolean;
    createdAt: any;
    financials?: ProductFinancials;
}

export interface ProductFinancials {
    costPrice: number;
    sellingPrice: number;
    updatedAt: any;
}

export interface StockMovement {
    id: string;
    productId: string;
    type: 'IN' | 'OUT' | 'ADJUST';
    quantity: number;
    prevStock: number;
    newStock: number;
    reason: string;
    performedBy: string;
    createdAt: any;
}

export interface ValuationSummary {
    totalValuationAtCost: number;
    totalValuationAtSale: number;
    potentialMargin: number;
    timestamp: string;
}
