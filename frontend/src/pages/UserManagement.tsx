import { useEffect, useState } from 'react';
import { UserService } from '../services/dataService';
import type { User } from '../types';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = () => {
        UserService.getAllUsers().then((data: any) => setUsers(data)).catch(console.error).finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (uid: string) => {
        if (confirm('Are you sure you want to delete this user document? Note: This does not delete their Auth account on the free plan.')) {
            try {
                await deleteDoc(doc(db, 'users', uid));
                fetchUsers();
            } catch (err: any) {
                alert(err.message);
            }
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading Users...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1 style={{ fontWeight: 800 }}>Internal User Management</h1>
                <button className="btn btn-primary" onClick={() => alert('On the Firease Free Plan, please add users manually in the Firebase Console Auth tab, then create their document here.')}>
                    Help: Add User
                </button>
            </div>

            <div className="glass-card">
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ color: 'var(--text-dim)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.uid} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>{u.name}</td>
                                <td>{u.email}</td>
                                <td>
                                    <span style={{
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        background: u.role === 'admin' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(34, 211, 238, 0.1)',
                                        color: u.role === 'admin' ? 'var(--primary)' : 'var(--accent)'
                                    }}>
                                        {u.role.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(u.uid)} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', background: 'var(--danger)', fontSize: '0.75rem' }}>
                                        Remove Record
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
