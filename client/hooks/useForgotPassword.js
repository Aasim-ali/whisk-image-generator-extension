import { useState } from 'react';
import axios from 'axios';

export const useForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Request OTP
    const requestOTP = async (email) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await axios.post(`${API_URL}/auth/forgot-password/request-otp`, {
                email,
            });
            setSuccess(response.data.message);
            setLoading(false);
            return { success: true, message: response.data.message };
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to send OTP. Please try again.';
            setError(errorMsg);
            setLoading(false);
            return { success: false, error: errorMsg };
        }
    };

    // Verify OTP
    const verifyOTP = async (email, otp) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await axios.post(`${API_URL}/auth/forgot-password/verify-otp`, {
                email,
                otp,
            });
            setSuccess(response.data.message);
            setLoading(false);
            return {
                success: true,
                resetToken: response.data.resetToken,
                message: response.data.message
            };
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Invalid OTP. Please try again.';
            setError(errorMsg);
            setLoading(false);
            return { success: false, error: errorMsg };
        }
    };

    // Reset Password
    const resetPassword = async (resetToken, newPassword, confirmPassword) => {
        setLoading(true);
        setError('');
        setSuccess('');

        // Client-side validation
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return { success: false, error: 'Password must be at least 6 characters long' };
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return { success: false, error: 'Passwords do not match' };
        }

        try {
            const response = await axios.post(`${API_URL}/auth/forgot-password/reset-password`, {
                resetToken,
                newPassword,
            });
            setSuccess(response.data.message);
            setLoading(false);
            return { success: true, message: response.data.message };
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to reset password. Please try again.';
            setError(errorMsg);
            setLoading(false);
            return { success: false, error: errorMsg };
        }
    };

    const clearMessages = () => {
        setError('');
        setSuccess('');
    };

    return {
        loading,
        error,
        success,
        requestOTP,
        verifyOTP,
        resetPassword,
        clearMessages,
    };
};
