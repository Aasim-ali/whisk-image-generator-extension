import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Customers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const res = await axios.get('http://localhost:5000/api/admin/customers', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <Link to="/dashboard" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '1rem', display: 'inline-block' }}>&larr; Back to Dashboard</Link>
            <h1>Customers</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                    <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                        <th style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>Name</th>
                        <th style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>Email</th>
                        <th style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>Credits</th>
                        <th style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>Joined</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>{user.name}</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>{user.email}</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>{user.credits}</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
