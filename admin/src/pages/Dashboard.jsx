import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAdminData } from '../hooks/useAdminData';
import { Box, Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { People as PeopleIcon, Receipt as ReceiptIcon, CreditCard as CreditCardIcon } from '@mui/icons-material';

export default function Dashboard() {
    const [stats, setStats] = useState({ users: 0, transactions: 0 });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const { fetchDashboardStats, loading } = useAdminData();

    useEffect(() => {
        const loadStats = async () => {
            const data = await fetchDashboardStats();
            if (data) {
                setStats(data.stats);
                setRecentTransactions(data.recentTransactions);
            }
        };
        loadStats();
    }, [fetchDashboardStats]);

    const StatCard = ({ title, value, icon, color, link }) => (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography color="text.secondary" gutterBottom variant="overline">
                            {title}
                        </Typography>
                        <Typography variant="h3" component="div">
                            {value}
                        </Typography>
                    </Box>
                    <Box sx={{ color: color, fontSize: 48 }}>
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Layout>
            <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                    Dashboard Overview
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Link to="/customers" style={{ textDecoration: 'none' }}>
                            <StatCard
                                title="Total Users"
                                value={stats.users}
                                icon={<PeopleIcon fontSize="inherit" />}
                                color="primary.main"
                            />
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Link to="/transactions" style={{ textDecoration: 'none' }}>
                            <StatCard
                                title="Total Transactions"
                                value={stats.transactions}
                                icon={<ReceiptIcon fontSize="inherit" />}
                                color="success.main"
                            />
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Link to="/plans" style={{ textDecoration: 'none' }}>
                            <StatCard
                                title="Subscription Plans"
                                value="-"
                                icon={<CreditCardIcon fontSize="inherit" />}
                                color="info.main"
                            />
                        </Link>
                    </Grid>
                </Grid>

                <Typography variant="h5" component="h2" gutterBottom>
                    Recent Transactions
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>User</strong></TableCell>
                                <TableCell><strong>Amount</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {recentTransactions.map(tx => (
                                <TableRow key={tx.id} hover>
                                    <TableCell>{tx.razorpay_payment_id}</TableCell>
                                    <TableCell>{tx.User?.name || 'Unknown'}</TableCell>
                                    <TableCell>{tx.amount / 100} INR</TableCell>
                                    <TableCell>{tx.status}</TableCell>
                                </TableRow>
                            ))}
                            {recentTransactions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <Typography variant="body2" color="text.secondary">
                                            No recent transactions
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
