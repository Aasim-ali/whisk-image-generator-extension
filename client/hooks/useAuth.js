import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadUser = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');
            if (token && userData) {
                setUser(JSON.parse(userData));
                // Optional: Validate token with backend here
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const setUserData = (user, token) => {
        localStorage.setItem("token", token)
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    }

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password });
            const { token, user } = res.data;
            setUserData(user, token)
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, { name, email, password });
            const { token, user } = res.data;
            setUserData(user, token)
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    // Re-fetch the current user from the server and sync into state + localStorage.
    // Call this after any action that mutates user data server-side (e.g. plan purchase).
    const refreshUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const freshUser = res.data;
            localStorage.setItem('user', JSON.stringify(freshUser));
            setUser(freshUser);
        } catch (err) {
            console.error('refreshUser failed:', err);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);