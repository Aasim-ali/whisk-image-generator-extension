import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, CircularProgress, Button, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
} from '@mui/material';
import { Close as CloseIcon, Reply as ReplyIcon, Delete as DeleteIcon } from '@mui/icons-material';

const API_URL = import.meta.env.VITE_API_URL;

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    return new Date(dateStr).toLocaleDateString();
}

export default function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/contact`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setContacts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching contacts:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchContacts(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this contact message?')) return;
        setDeleting(true);
        try {
            const token = localStorage.getItem('adminToken');
            await fetch(`${API_URL}/contact/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            setContacts(prev => prev.filter(c => c.id !== id));
            if (selected?.id === id) setSelected(null);
        } catch (err) {
            console.error('Error deleting contact:', err);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Layout>
            <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                    Contact Messages
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {contacts.length} message{contacts.length !== 1 ? 's' : ''} · Auto-deleted after 30 days
                </Typography>

                <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>User</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Preview</strong></TableCell>
                                <TableCell><strong>Received</strong></TableCell>
                                <TableCell align="right"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                        <CircularProgress size={36} />
                                    </TableCell>
                                </TableRow>
                            ) : contacts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            No contact messages yet
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : contacts.map(contact => (
                                <TableRow key={contact.id} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={700}>
                                            {contact.userName}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {contact.userEmail}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 280 }}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                        >
                                            {contact.description}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={timeAgo(contact.createdAt)}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            size="small"
                                            variant="contained"
                                            onClick={() => setSelected(contact)}
                                            sx={{ mr: 1, borderRadius: 2 }}
                                        >
                                            View
                                        </Button>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDelete(contact.id)}
                                            disabled={deleting}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* ── Read Modal ── */}
            <Dialog
                open={!!selected}
                onClose={() => setSelected(null)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
            >
                {selected && (
                    <>
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pb: 1 }}>
                            <Box>
                                <Typography variant="h6" fontWeight={800}>
                                    {selected.userName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {selected.userEmail} · {new Date(selected.createdAt).toLocaleString()}
                                </Typography>
                            </Box>
                            <IconButton onClick={() => setSelected(null)} size="small">
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>

                        <DialogContent dividers>
                            <Typography
                                variant="body1"
                                sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}
                            >
                                {selected.description}
                            </Typography>
                        </DialogContent>

                        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDelete(selected.id)}
                                disabled={deleting}
                                sx={{ borderRadius: 2 }}
                            >
                                Delete
                            </Button>
                            <Box sx={{ flexGrow: 1 }} />
                            <Button
                                variant="contained"
                                startIcon={<ReplyIcon />}
                                href={`mailto:${selected.userEmail}?subject=Re: Your Whisk Feedback&body=Hi ${selected.userName.split(' ')[0]},%0D%0A%0D%0A`}
                                component="a"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ borderRadius: 2 }}
                            >
                                Reply via Email
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Layout>
    );
}
