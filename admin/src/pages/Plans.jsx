import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import PlanDialog from '../components/PlanDialog';
import { usePlans } from '../hooks/usePlans';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Typography,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Alert,
    Snackbar,
    CircularProgress,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';

export default function Plans() {
    const { plans, loading, error, fetchPlans, createPlan, updatePlan, deletePlan } = usePlans();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [planToDelete, setPlanToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    // Show error from hook if it occurs
    useEffect(() => {
        if (error) {
            showSnackbar(error, 'error');
        }
    }, [error]);

    const handleCreatePlan = () => {
        setSelectedPlan(null);
        setDialogOpen(true);
    };

    const handleEditPlan = (plan) => {
        setSelectedPlan(plan);
        setDialogOpen(true);
    };

    const handleSavePlan = async (planData) => {
        let result;
        if (selectedPlan) {
            result = await updatePlan(selectedPlan.id, planData);
            if (result.success) showSnackbar('Plan updated successfully', 'success');
        } else {
            result = await createPlan(planData);
            if (result.success) showSnackbar('Plan created successfully', 'success');
        }

        if (result.success) {
            setDialogOpen(false);
        }
    };

    const handleDeleteClick = (plan) => {
        setPlanToDelete(plan);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        const result = await deletePlan(planToDelete.id);
        if (result.success) {
            showSnackbar('Plan deleted successfully', 'success');
            setDeleteDialogOpen(false);
            setPlanToDelete(null);
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Layout>
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Subscription Plans
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreatePlan}
                    >
                        Add Plan
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Price</strong></TableCell>
                                <TableCell><strong>Credits</strong></TableCell>
                                <TableCell><strong>Limits</strong></TableCell>
                                <TableCell><strong>Features</strong></TableCell>
                                <TableCell align="right"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                        <CircularProgress size={40} />
                                    </TableCell>
                                </TableRow>
                            ) : plans.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography variant="body2" color="text.secondary">
                                            No plans found. Create your first plan to get started.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                plans.map((plan) => (
                                    <TableRow key={plan.id} hover>
                                        <TableCell>{plan.name}</TableCell>
                                        <TableCell>
                                            {plan.currency} {(plan.price / 100).toFixed(2)}
                                        </TableCell>
                                        <TableCell>{plan.credits}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                <Typography variant="caption">Devices: {plan.maxDevices || 1}</Typography>
                                                <Typography variant="caption">Daily: {plan.dailyLimit || 100}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                {plan.features && plan.features.length > 0 ? (
                                                    plan.features.map((feature, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={feature}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    ))
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                        No features
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleEditPlan(plan)}
                                                size="small"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteClick(plan)}
                                                size="small"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Plan Dialog */}
                <PlanDialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    plan={selectedPlan}
                    onSave={handleSavePlan}
                />

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                >
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete the plan "{planToDelete?.name}"? This
                            action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleConfirmDelete} color="error" variant="contained">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar for notifications */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Layout>
    );
}
