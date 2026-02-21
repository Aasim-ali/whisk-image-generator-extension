import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAdminData } from '../hooks/useAdminData';
import {
    Box, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, CircularProgress,
} from '@mui/material';

const getStatusBadge = (status) => {
    const map = {
        captured: { label: 'Captured', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
        paid: { label: 'Paid', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
        failed: { label: 'Failed', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
        pending: { label: 'Pending', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
        refunded: { label: 'Refunded', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    };
    const s = map[status?.toLowerCase()] || { label: status || '—', color: '#8892a4', bg: 'rgba(136,146,164,0.12)' };
    return (
        <Box component="span" sx={{
            px: 1.5, py: 0.4,
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: s.color,
            bgcolor: s.bg,
            display: 'inline-block',
        }}>
            {s.label}
        </Box>
    );
};

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const { fetchTransactions, loading } = useAdminData();

    useEffect(() => {
        const loadTransactions = async () => {
            const data = await fetchTransactions();
            if (data) setTransactions(data);
        };
        loadTransactions();
    }, [fetchTransactions]);

    return (
        <Layout>
            <Box>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" fontWeight={700}>Transactions</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        All payment transactions on the platform
                    </Typography>
                </Box>

                <Paper sx={{ overflow: 'hidden' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Payment ID</TableCell>
                                    <TableCell>User</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                            <CircularProgress size={32} sx={{ color: '#f5c518' }} />
                                        </TableCell>
                                    </TableRow>
                                ) : transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                            <Typography variant="body2" color="text.secondary">No transactions found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : transactions.map(tx => (
                                    <TableRow key={tx.id}>
                                        <TableCell sx={{
                                            fontFamily: 'monospace',
                                            fontSize: '0.78rem',
                                            color: 'text.secondary',
                                            maxWidth: 180,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {tx.razorpay_payment_id}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                            {tx.User?.name || '—'}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#22c55e' }}>
                                            ₹{(tx.amount / 100).toFixed(2)}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(tx.status)}</TableCell>
                                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                                            {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </Layout>
    );
}
