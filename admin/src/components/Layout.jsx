import { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Drawer,
    List,
    Typography,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Avatar,
    Tooltip,
    Divider,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Receipt as ReceiptIcon,
    CreditCard as CreditCardIcon,
    Mail as MailIcon,
    Logout as LogoutIcon,
    Menu as MenuIcon,
    Close as CloseIcon,
} from '@mui/icons-material';

const drawerWidth = 256;

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', color: '#f5c518' },
    { text: 'Customers', icon: <PeopleIcon />, path: '/customers', color: '#7c6af7' },
    { text: 'Transactions', icon: <ReceiptIcon />, path: '/transactions', color: '#22c55e' },
    { text: 'Plans', icon: <CreditCardIcon />, path: '/plans', color: '#3b82f6' },
    { text: 'Contacts', icon: <MailIcon />, path: '/contacts', color: '#f59e0b' },
];

export default function Layout({ children }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/login');
    };

    const currentPage = menuItems.find(item => item.path === location.pathname);

    const SidebarContent = () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', py: 2 }}>
            {/* Logo */}
            <Box sx={{ px: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{
                    width: 40, height: 40,
                    bgcolor: '#f5c518',
                    borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '1.1rem', color: '#0f0f13',
                    boxShadow: '0 0 20px rgba(245,197,24,0.35)',
                }}>
                    W
                </Box>
                <Box>
                    <Typography fontWeight={700} fontSize="0.95rem" color="text.primary">
                        Whisk Admin
                    </Typography>
                    <Typography fontSize="0.72rem" color="text.secondary">
                        Control Panel
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Nav Items */}
            <List sx={{ px: 1.5, flexGrow: 1 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                component={RouterLink}
                                to={item.path}
                                onClick={() => setMobileOpen(false)}
                                sx={{
                                    borderRadius: '10px',
                                    px: 2,
                                    py: 1.1,
                                    position: 'relative',
                                    backgroundColor: isActive ? 'rgba(245,197,24,0.1)' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: isActive
                                            ? 'rgba(245,197,24,0.15)'
                                            : 'rgba(255,255,255,0.04)',
                                    },
                                    '&::before': isActive ? {
                                        content: '""',
                                        position: 'absolute',
                                        left: 0,
                                        top: '20%',
                                        height: '60%',
                                        width: '3px',
                                        borderRadius: '0 3px 3px 0',
                                        backgroundColor: '#f5c518',
                                    } : {},
                                }}
                            >
                                <ListItemIcon sx={{
                                    minWidth: 36,
                                    color: isActive ? item.color : '#8892a4',
                                    '& .MuiSvgIcon-root': { fontSize: '1.2rem' },
                                }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontSize: '0.875rem',
                                        fontWeight: isActive ? 600 : 400,
                                        color: isActive ? '#e2e8f0' : '#8892a4',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {/* Logout */}
            <Box sx={{ px: 2.5, pt: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <ListItemButton
                    onClick={handleLogout}
                    sx={{
                        borderRadius: '10px',
                        px: 2,
                        py: 1,
                        '&:hover': { backgroundColor: 'rgba(239,68,68,0.1)' },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 36, color: '#ef4444', '& .MuiSvgIcon-root': { fontSize: '1.2rem' } }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Logout"
                        primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500, color: '#ef4444' }}
                    />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { width: drawerWidth, bgcolor: '#13131c' },
                }}
            >
                <SidebarContent />
            </Drawer>

            {/* Desktop Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        bgcolor: '#13131c',
                        borderRight: '1px solid rgba(255,255,255,0.06)',
                    },
                }}
                open
            >
                <SidebarContent />
            </Drawer>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, ml: { md: `${drawerWidth}px` }, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                {/* Top Header Bar */}
                <Box sx={{
                    px: { xs: 2, sm: 3 },
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    bgcolor: '#13131c',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                }}>
                    <IconButton
                        sx={{ display: { md: 'none' }, color: 'text.secondary' }}
                        onClick={() => setMobileOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography fontWeight={700} fontSize="1.1rem">
                            {currentPage?.text || 'Admin'}
                        </Typography>
                        <Typography fontSize="0.75rem" color="text.secondary">
                            Whisk Image Generator
                        </Typography>
                    </Box>
                    <Tooltip title="Logout">
                        <IconButton onClick={handleLogout} sx={{
                            color: 'text.secondary',
                            '&:hover': { color: '#ef4444', bgcolor: 'rgba(239,68,68,0.08)' },
                        }}>
                            <LogoutIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Page Content */}
                <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }} className="page-fade-in">
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
