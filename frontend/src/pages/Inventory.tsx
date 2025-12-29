import { useEffect, useState } from 'react';
import { ProductService, StockService } from '../services/dataService';
import type { Product } from '../types';
import { useAuth } from '../context/AuthContext';

const InventoryPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin } = useAuth();

    const fetchProducts = async () => {
        try {
            const data = await ProductService.getAllProducts(isAdmin);
            setProducts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [isAdmin]);

    const handleStockOperation = async (productId: string, type: 'IN' | 'OUT' | 'ADJUST', quantity: number) => {
        try {
            await StockService.performStockOperation(productId, type, quantity, 'Manual Operation');
            fetchProducts(); // Refresh
            alert('Stock updated successfully');
        } catch (err: any) {
            alert(err.message || 'Operation failed');
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading Inventory...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1 style={{ fontWeight: 800 }}>Inventory Overview</h1>
                {isAdmin && <button className="btn btn-primary">Add New Product</button>}
            </div>

            <div className="glass-card">
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ color: 'var(--text-dim)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '1rem' }}>Product Name</th>
                            <th>Category</th>
                            <th>Stock Level</th>
                            {isAdmin && <th>Cost Price</th>}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>{p.name}</td>
                                <td style={{ color: 'var(--text-dim)' }}>{p.category}</td>
                                <td>
                                    <span style={{
                                        color: p.stockQuantity < 10 ? 'var(--danger)' : 'var(--success)',
                                        background: 'rgba(255,255,255,0.05)',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px'
                                    }}>
                                        {p.stockQuantity}
                                    </span>
                                </td>
                                {isAdmin && <td>${p.financials?.costPrice || '0'}</td>}
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => handleStockOperation(p.id, 'IN', 1)} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>IN</button>
                                        <button onClick={() => handleStockOperation(p.id, 'OUT', 1)} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: 'var(--accent)' }}>OUT</button>
                                        {isAdmin && <button onClick={() => handleStockOperation(p.id, 'ADJUST', 0)} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: '#475569' }}>ADJ</button>}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryPage;
