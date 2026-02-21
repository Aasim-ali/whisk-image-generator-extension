import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAdminData } from '../hooks/useAdminData';
import {
    Box, Grid, Card, CardContent, Typography,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, CircularProgress, Chip,
} from '@mui/material';
import {
    People as PeopleIcon,
    Receipt as ReceiptIcon,
    CreditCard as CreditCardIcon,
    TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const statCards = [
    {
        title: 'Total Users',
        key: 'users',
        icon: <PeopleIcon />,
        gradient: 'linear-gradient(135deg, rgba(124,106,247,0.2), rgba(124,106,247,0.05))',
        glow: 'rgba(124,106,247,0.3)',
        iconColor: '#7c6af7',
        link: '/customers',
    },
    {
        title: 'Transactions',
        key: 'transactions',
        icon: <ReceiptIcon />,
        gradient: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05))',
        glow: 'rgba(34,197,94,0.3)',
        iconColor: '#22c55e',
        link: '/transactions',
    },
    {
        title: 'Subscription Plans',
        key: null,
        value: '—',
        icon: <CreditCardIcon />,
        gradient: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))',
        glow: 'rgba(59,130,246,0.3)',
        iconColor: '#3b82f6',
        link: '/plans',
    },
];

const getStatusChip = (status) => {
    const map = {
        captured: { label: 'Captured', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
        paid: { label: 'Paid', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
        failed: { label: 'Failed', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
        pending: { label: 'Pending', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    };
    const s = map[status?.toLowerCase()] || { label: status, color: '#8892a4', bg: 'rgba(136,146,164,0.12)' };
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

    return (
        <Layout>
            <Box>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight={700}>Dashboard Overview</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Monitor your platform's key metrics at a glance
                    </Typography>
                </Box>

                {/* Stat Cards */}
                <Grid container spacing={2.5} sx={{ mb: 4 }}>
                    {statCards.map((card) => (
                        <Grid item xs={12} sm={6} md={4} key={card.title}>
                            <Link to={card.link} style={{ textDecoration: 'none' }}>
                                <Card sx={{
                                    background: card.gradient,
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-3px)',
                                        boxShadow: `0 8px 30px ${card.glow}`,
                                    },
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                            <Box>
                                                <Typography fontSize="0.75rem" fontWeight={600} color="text.secondary"
                                                    sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>
                                                    {card.title}
                                                </Typography>
                                                <Typography variant="h3" fontWeight={700} color="text.primary">
                                                    {loading ? '—' : (card.value ?? stats[card.key])}
                                                </Typography>
                                            </Box>
                                            <Box sx={{
                                                width: 48, height: 48,
                                                bgcolor: `${card.iconColor}22`,
                                                borderRadius: '12px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: card.iconColor,
                                            }}>
                                                {card.icon}
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 2 }}>
                                            <TrendingUpIcon sx={{ fontSize: '0.85rem', color: '#22c55e' }} />
                                            <Typography fontSize="0.75rem" color="#22c55e">View all</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>
                    ))}
                </Grid>

                {/* Recent Transactions */}
                <Box>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                        Recent Transactions
                    </Typography>
                    <Paper sx={{ overflow: 'hidden' }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Payment ID</TableCell>
                                        <TableCell>User</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                                <CircularProgress size={32} sx={{ color: '#f5c518' }} />
                                            </TableCell>
                                        </TableRow>
                                    ) : recentTransactions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                                <Typography variant="body2" color="text.secondary">No recent transactions</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : recentTransactions.map(tx => (
                                        <TableRow key={tx.id}>
                                            <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'text.secondary' }}>
                                                {tx.razorpay_payment_id}
                                            </TableCell>
                                            <TableCell fontWeight={500}>{tx.User?.name || 'Unknown'}</TableCell>
                                            <TableCell fontWeight={600} color="text.primary">
                                                ₹{(tx.amount / 100).toFixed(2)}
                                            </TableCell>
                                            <TableCell>{getStatusChip(tx.status)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            </Box>
        </Layout>
    );
}
