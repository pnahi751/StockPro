import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebase';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await auth.signOut();
        navigate('/login');
    };

    return (
        <div className="layout-container">
            <aside className="sidebar">
                <div style={{ marginBottom: '2rem', padding: '0 1rem' }}>
                    <h2 style={{ color: 'var(--primary)', fontWeight: 800 }}>STOCKPRO</h2>
                </div>

                <nav>
                    <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/inventory" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        Inventory
                    </NavLink>
                    {isAdmin && (
                        <>
                            <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                Stock History
                            </NavLink>
                            <NavLink to="/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                User Management
                            </NavLink>
                        </>
                    )}
                </nav>

                <div style={{ marginTop: 'auto', padding: '1rem' }}>
                    <div style={{ marginBottom: '1rem', color: 'var(--text-dim)', fontSize: '0.875rem' }}>
                        {user?.email} <br />
                        <span style={{ color: 'var(--accent)' }}>{isAdmin ? 'Admin' : 'Staff'}</span>
                    </div>
                    <button onClick={handleLogout} className="btn btn-primary" style={{ width: '100%', background: 'var(--danger)' }}>
                        Logout
                    </button>
                </div>
            </aside>

            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
