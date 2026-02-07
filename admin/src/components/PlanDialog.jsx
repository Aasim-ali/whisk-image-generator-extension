import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Chip,
    IconButton,
    Typography,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';

export default function PlanDialog({ open, onClose, plan, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        currency: 'INR',
        credits: '',
        features: [],
    });
    const [featureInput, setFeatureInput] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (plan) {
            setFormData({
                name: plan.name || '',
                price: plan.price ? plan.price / 100 : '', // Convert from paise to rupees
                currency: plan.currency || 'INR',
                credits: plan.credits || '',
                features: plan.features || [],
            });
        } else {
            setFormData({
                name: '',
                price: '',
                currency: 'INR',
                credits: '',
                features: [],
            });
        }
        setErrors({});
    }, [plan, open]);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.price || formData.price <= 0) {
            newErrors.price = 'Price must be greater than 0';
        }
        if (!formData.credits || formData.credits < 0) {
            newErrors.credits = 'Credits must be 0 or greater';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            const planData = {
                ...formData,
                price: Math.round(parseFloat(formData.price) * 100), // Convert to paise
                credits: parseInt(formData.credits, 10),
            };
            onSave(planData);
        }
    };

    const handleAddFeature = () => {
        if (featureInput.trim()) {
            setFormData({
                ...formData,
                features: [...formData.features, featureInput.trim()],
            });
            setFeatureInput('');
        }
    };

    const handleDeleteFeature = (index) => {
        setFormData({
            ...formData,
            features: formData.features.filter((_, i) => i !== index),
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {plan ? 'Edit Plan' : 'Create New Plan'}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Plan Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        error={!!errors.name}
                        helperText={errors.name}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Price (₹)"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        error={!!errors.price}
                        helperText={errors.price || 'Price in rupees'}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Currency"
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        fullWidth
                        placeholder="INR"
                    />
                    <TextField
                        label="Credits"
                        type="number"
                        value={formData.credits}
                        onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                        error={!!errors.credits}
                        helperText={errors.credits}
                        fullWidth
                        required
                    />

                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            Features
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <TextField
                                size="small"
                                placeholder="Add a feature"
                                value={featureInput}
                                onChange={(e) => setFeatureInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddFeature();
                                    }
                                }}
                                fullWidth
                            />
                            <IconButton
                                color="primary"
                                onClick={handleAddFeature}
                                disabled={!featureInput.trim()}
                            >
                                <AddIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {formData.features.map((feature, index) => (
                                <Chip
                                    key={index}
                                    label={feature}
                                    onDelete={() => handleDeleteFeature(index)}
                                    size="small"
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">
                    {plan ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
