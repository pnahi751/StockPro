import { useEffect, useState } from 'react';
import { AnalyticsService } from '../services/dataService';
import type { ValuationSummary } from '../types';

const AdminDashboard: React.FC = () => {
    const [valuation, setValuation] = useState<ValuationSummary | null>(null);

    useEffect(() => {
        AnalyticsService.getStockValuation().then(setValuation).catch(console.error);
    }, []);

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', fontWeight: 800 }}>Financial Analytics</h1>

            <div className="stat-grid">
                <div className="glass-card">
                    <p style={{ color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Total Stock Value (Cost)</p>
                    <h2 style={{ fontSize: '2rem' }}>${valuation?.totalValuationAtCost.toLocaleString() || '0'}</h2>
                </div>

                <div className="glass-card">
                    <p style={{ color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Total Market Value (Sale)</p>
                    <h2 style={{ fontSize: '2rem', color: 'var(--accent)' }}>${valuation?.totalValuationAtSale.toLocaleString() || '0'}</h2>
                </div>

                <div className="glass-card">
                    <p style={{ color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Potential Gross Margin</p>
                    <h2 style={{ fontSize: '2rem', color: 'var(--success)' }}>${valuation?.potentialMargin.toLocaleString() || '0'}</h2>
                </div>
            </div>

            <div className="glass-card" style={{ marginTop: '2rem' }}>
                <h3>Inventory Health</h3>
                <p style={{ color: 'var(--text-dim)', marginTop: '0.5rem' }}>
                    Real-time snapshot as of {valuation ? new Date(valuation.timestamp).toLocaleString() : 'Loading...'}
                </p>
                <div style={{ marginTop: '1.5rem', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: '65%', height: '100%', background: 'var(--primary)' }}></div>
                </div>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--text-dim)' }}>
                    65% Stock Capacity Utilized
                </p>
            </div>
        </div>
    );
};

export default AdminDashboard;
