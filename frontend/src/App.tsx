import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import StockHistory from './pages/StockHistory';
import UserManagement from './pages/UserManagement';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, role, loading } = useAuth();

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white' }}>
      <h2>Initializing StockPro...</h2>
    </div>
  );

  if (!user) return <Navigate to="/login" />;

  // If user is logged in but has no role yet (manual setup pending)
  if (!role) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white', textAlign: 'center', padding: '2rem' }}>
        <div>
          <h2 style={{ color: '#ef4444' }}>Access Pending</h2>
          <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Your account exists, but an Admin has not assigned your role yet.</p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7 }}>UID: {user.uid}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary" style={{ marginTop: '2rem' }}>Check Again</button>
        </div>
      </div>
    );
  }

  // Redirect staff away from admin-only pages
  if (adminOnly && role !== 'admin') {
    return <Navigate to="/inventory" />;
  }

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={
            <ProtectedRoute adminOnly>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/inventory" element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          } />

          <Route path="/history" element={
            <ProtectedRoute adminOnly>
              <StockHistory />
            </ProtectedRoute>
          } />

          <Route path="/users" element={
            <ProtectedRoute adminOnly>
              <UserManagement />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
