import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [stats, setStats] = useState({ users: 0, transactions: 0 });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const res = await axios.get('http://localhost:5000/api/admin/dashboard', {
                    headers: { Authorization: `Bearer ${token}` } // Note: Backend needs middleware to use this
                });
                setStats(res.data.stats);
                setRecentTransactions(res.data.recentTransactions);
            } catch (error) {
                console.error(error);
            }
        };
        fetchStats();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/login');
    };

    return (
        <div style={{ padding: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1>Admin Dashboard</h1>
                <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
            </header>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
                <Link to="/customers" style={{ flex: 1, textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ padding: '2rem', background: '#e7f5ff', borderRadius: '8px', textAlign: 'center' }}>
                        <h3>Total Users</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.users}</p>
                    </div>
                </Link>
                <Link to="/transactions" style={{ flex: 1, textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ padding: '2rem', background: '#e3fcef', borderRadius: '8px', textAlign: 'center' }}>
                        <h3>Total Transactions</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.transactions}</p>
                    </div>
                </Link>
            </div>

            <h2>Recent Transactions</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                    <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                        <th style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>ID</th>
                        <th style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>User</th>
                        <th style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>Amount</th>
                        <th style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {recentTransactions.map(tx => (
                        <tr key={tx.id}>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>{tx.razorpay_payment_id}</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>{tx.User?.name || 'Unknown'}</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>{tx.amount / 100} INR</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>{tx.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
