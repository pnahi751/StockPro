import { useEffect, useState } from 'react';
import { HistoryService } from '../services/dataService';
import type { StockMovement } from '../types';

const StockHistory: React.FC = () => {
    const [history, setHistory] = useState<StockMovement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        HistoryService.getMovementHistory().then(setHistory).catch(console.error).finally(() => setLoading(false));
    }, []);

    if (loading) return <div style={{ padding: '2rem' }}>Loading History...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', fontWeight: 800 }}>Stock Movement History</h1>
            <div className="glass-card">
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ color: 'var(--text-dim)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '1rem' }}>Date</th>
                            <th>Product ID</th>
                            <th>Type</th>
                            <th>Quantity</th>
                            <th>Reason</th>
                            <th>Performed By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map(m => (
                            <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>
                                    {m.createdAt?.seconds
                                        ? new Date(m.createdAt.seconds * 1000).toLocaleString()
                                        : 'Pending...'}
                                </td>
                                <td>{m.productId}</td>
                                <td>
                                    <span style={{
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        background: m.type === 'IN' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: m.type === 'IN' ? 'var(--success)' : 'var(--danger)'
                                    }}>
                                        {m.type}
                                    </span>
                                </td>
                                <td style={{ fontWeight: 700 }}>{m.quantity > 0 ? `+${m.quantity}` : m.quantity}</td>
                                <td style={{ color: 'var(--text-dim)' }}>{m.reason}</td>
                                <td style={{ fontSize: '0.8rem' }}>{m.performedBy}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockHistory;
