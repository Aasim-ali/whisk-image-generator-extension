import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const res = await axios.get('http://localhost:5000/api/admin/transactions', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTransactions(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchTransactions();
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <Link to="/dashboard" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '1rem', display: 'inline-block' }}>&larr; Back to Dashboard</Link>
            <h1>Transactions</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                    <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                        <th style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>Payment ID</th>
                        <th style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>User</th>
                        <th style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>Amount</th>
                        <th style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>Status</th>
                        <th style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(tx => (
                        <tr key={tx.id}>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>{tx.razorpay_payment_id}</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>{tx.User?.name}</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>{tx.amount / 100} INR</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>{tx.status}</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>{new Date(tx.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
