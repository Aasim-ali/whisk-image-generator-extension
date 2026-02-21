import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAdminData } from '../hooks/useAdminData';
import {
    Box, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, CircularProgress, Avatar,
} from '@mui/material';

function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function stringToColor(str) {
    const colors = ['#7c6af7', '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#f5c518', '#06b6d4'];
    let hash = 0;
    for (let i = 0; i < (str || '').length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
}

export default function Customers() {
    const [users, setUsers] = useState([]);
    const { fetchCustomers, loading } = useAdminData();

    useEffect(() => {
        const loadUsers = async () => {
            const data = await fetchCustomers();
            if (data) setUsers(data);
        };
        loadUsers();
    }, [fetchCustomers]);

    return (
        <Layout>
            <Box>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" fontWeight={700}>Customers</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Manage your registered users
                    </Typography>
                </Box>

                <Paper sx={{ overflow: 'hidden' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>User</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Credits</TableCell>
                                    <TableCell>Joined</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                            <CircularProgress size={32} sx={{ color: '#f5c518' }} />
                                        </TableCell>
                                    </TableRow>
                                ) : users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                            <Typography variant="body2" color="text.secondary">No customers found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : users.map(user => {
                                    const color = stringToColor(user.name);
                                    return (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{
                                                        width: 34, height: 34,
                                                        bgcolor: `${color}22`,
                                                        color: color,
                                                        fontSize: '0.8rem', fontWeight: 700,
                                                        border: `1px solid ${color}44`,
                                                    }}>
                                                        {getInitials(user.name)}
                                                    </Avatar>
                                                    <Typography fontWeight={500} fontSize="0.875rem">
                                                        {user.name}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                                                {user.email}
                                            </TableCell>
                                            <TableCell>
                                                <Box component="span" sx={{
                                                    px: 1.5, py: 0.4,
                                                    bgcolor: 'rgba(245,197,24,0.12)',
                                                    color: '#f5c518',
                                                    borderRadius: '6px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 700,
                                                }}>
                                                    {user.credits}
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                                                {new Date(user.createdAt).toLocaleDateString('en-IN', {
                                                    year: 'numeric', month: 'short', day: 'numeric'
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </Layout>
    );
}
