import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import PlanDialog from '../components/PlanDialog';
import { usePlans } from '../hooks/usePlans';
import {
    Box, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton,
    Typography, Chip, Dialog, DialogTitle, DialogContent,
    DialogActions, DialogContentText, Alert, Snackbar, CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

export default function Plans() {
    const { plans, loading, error, fetchPlans, createPlan, updatePlan, deletePlan } = usePlans();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [planToDelete, setPlanToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => { fetchPlans(); }, [fetchPlans]);
    useEffect(() => { if (error) showSnackbar(error, 'error'); }, [error]);

    const handleCreatePlan = () => { setSelectedPlan(null); setDialogOpen(true); };
    const handleEditPlan = (plan) => { setSelectedPlan(plan); setDialogOpen(true); };

    const handleSavePlan = async (planData) => {
        let result;
        if (selectedPlan) {
            result = await updatePlan(selectedPlan.id, planData);
            if (result.success) showSnackbar('Plan updated successfully', 'success');
        } else {
            result = await createPlan(planData);
            if (result.success) showSnackbar('Plan created successfully', 'success');
        }
        if (result.success) setDialogOpen(false);
    };

    const handleDeleteClick = (plan) => { setPlanToDelete(plan); setDeleteDialogOpen(true); };

    const handleConfirmDelete = async () => {
        const result = await deletePlan(planToDelete.id);
        if (result.success) {
            showSnackbar('Plan deleted successfully', 'success');
            setDeleteDialogOpen(false);
            setPlanToDelete(null);
        }
    };

    const showSnackbar = (message, severity) => setSnackbar({ open: true, message, severity });
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    return (
        <Layout>
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>Subscription Plans</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Manage pricing plans and features
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreatePlan}
                        sx={{ flexShrink: 0 }}
                    >
                        Add Plan
                    </Button>
                </Box>

                <Paper sx={{ overflow: 'hidden' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Plan Name</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Credits</TableCell>
                                    <TableCell>Limits</TableCell>
                                    <TableCell>Features</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                            <CircularProgress size={32} sx={{ color: '#f5c518' }} />
                                        </TableCell>
                                    </TableRow>
                                ) : plans.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                No plans found. Create your first plan to get started.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : plans.map((plan) => (
                                    <TableRow key={plan.id}>
                                        <TableCell>
                                            <Typography fontWeight={600} fontSize="0.875rem">{plan.name}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography fontWeight={700} color="#f5c518" fontSize="0.9rem">
                                                {plan.currency} {(plan.price / 100).toFixed(2)}
                                            </Typography>
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
                                                {plan.credits}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                <Box component="span" sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                                                    📱 {plan.maxDevices || 1} devices
                                                </Box>
                                                <Box component="span" sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                                                    📅 {plan.dailyLimit || 100}/day
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                {plan.features?.length > 0 ? plan.features.map((feature, i) => (
                                                    <Chip
                                                        key={i}
                                                        label={feature}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: 'rgba(124,106,247,0.12)',
                                                            color: '#7c6af7',
                                                            border: '1px solid rgba(124,106,247,0.2)',
                                                            fontSize: '0.72rem',
                                                        }}
                                                    />
                                                )) : (
                                                    <Typography variant="body2" color="text.secondary" fontSize="0.8rem">—</Typography>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                onClick={() => handleEditPlan(plan)}
                                                size="small"
                                                sx={{
                                                    color: '#3b82f6',
                                                    '&:hover': { bgcolor: 'rgba(59,130,246,0.1)' },
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleDeleteClick(plan)}
                                                size="small"
                                                sx={{
                                                    color: '#ef4444',
                                                    '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' },
                                                    ml: 0.5,
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                <PlanDialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    plan={selectedPlan}
                    onSave={handleSavePlan}
                />

                <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                    <DialogTitle sx={{ fontWeight: 700 }}>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete <strong>"{planToDelete?.name}"</strong>? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>Cancel</Button>
                        <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2 }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Layout>
    );
}
