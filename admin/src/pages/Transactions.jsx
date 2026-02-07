import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAdminData } from '../hooks/useAdminData';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const { fetchTransactions, loading } = useAdminData();

    useEffect(() => {
        const loadTransactions = async () => {
            const data = await fetchTransactions();
            if (data) {
                setTransactions(data);
            }
        };
        loadTransactions();
    }, [fetchTransactions]);

    return (
        <Layout>
            <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                    Transactions
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Payment ID</strong></TableCell>
                                <TableCell><strong>User</strong></TableCell>
                                <TableCell><strong>Amount</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Date</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                        <CircularProgress size={40} />
                                    </TableCell>
                                </TableRow>
                            ) : transactions.map(tx => (
                                <TableRow key={tx.id} hover>
                                    <TableCell>{tx.razorpay_payment_id}</TableCell>
                                    <TableCell>{tx.User?.name}</TableCell>
                                    <TableCell>{tx.amount / 100} INR</TableCell>
                                    <TableCell>{tx.status}</TableCell>
                                    <TableCell>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                            {transactions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Typography variant="body2" color="text.secondary">
                                            No transactions found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Layout>
    );
}
