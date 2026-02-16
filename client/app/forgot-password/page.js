'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Loader, ChevronRight, ArrowLeft, Check, Clock } from 'lucide-react';
import { fadeInUp } from '../../utils/animations';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useForgotPassword } from '../../hooks/useForgotPassword';

const STEP_EMAIL = 1;
const STEP_OTP = 2;
const STEP_PASSWORD = 3;

export default function ForgotPassword() {
    const [step, setStep] = useState(STEP_EMAIL);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetToken, setResetToken] = useState('');
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [canResend, setCanResend] = useState(false);
    const router = useRouter();

    const { loading, error, success, requestOTP, verifyOTP, resetPassword, clearMessages } = useForgotPassword();

    // Countdown timer for OTP expiry
    useEffect(() => {
        if (step === STEP_OTP && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [step, timeLeft]);

    // Enable resend button after 60 seconds
    useEffect(() => {
        if (step === STEP_OTP) {
            const resendTimer = setTimeout(() => {
                setCanResend(true);
            }, 60000); // 60 seconds
            return () => clearTimeout(resendTimer);
        }
    }, [step]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Step 1: Request OTP
    const handleRequestOTP = async (e) => {
        e.preventDefault();

        const result = await requestOTP(email);

        if (result.success) {
            setTimeLeft(600); // Reset timer
            setCanResend(false);
            setTimeout(() => {
                setStep(STEP_OTP);
                clearMessages();
            }, 1500);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        const result = await requestOTP(email);

        if (result.success) {
            setTimeLeft(600);
            setCanResend(false);
            setOtp(''); // Clear old OTP
            setTimeout(() => clearMessages(), 3000);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        const result = await verifyOTP(email, otp);

        if (result.success) {
            setResetToken(result.resetToken);
            setTimeout(() => {
                setStep(STEP_PASSWORD);
                clearMessages();
            }, 1500);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();

        const result = await resetPassword(resetToken, newPassword, confirmPassword);

        if (result.success) {
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 px-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-20 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="w-full max-w-md my-4"
            >
                <Card className="card-base border-none overflow-hidden pb-8">
                    <CardHeader className="text-center pt-10 pb-6">
                        <motion.div
                            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary flex items-center justify-center text-black text-3xl font-black shadow-lg shadow-primary/30"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Lock size={32} />
                        </motion.div>
                        <CardTitle className="text-4xl font-black mb-2 text-gray-900">
                            {step === STEP_EMAIL && 'Forgot Password?'}
                            {step === STEP_OTP && 'Verify OTP'}
                            {step === STEP_PASSWORD && 'Create New Password'}
                        </CardTitle>
                        <CardDescription className="text-gray-500 font-bold">
                            {step === STEP_EMAIL && 'Enter your email to receive a reset code'}
                            {step === STEP_OTP && 'Enter the 6-digit code sent to your email'}
                            {step === STEP_PASSWORD && 'Choose a strong password for your account'}
                        </CardDescription>

                        {/* Progress Indicators */}
                        <div className="flex justify-center gap-2 mt-6">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`h-2 rounded-full transition-all duration-300 ${s === step ? 'w-12 bg-primary' :
                                        s < step ? 'w-8 bg-primary/50' : 'w-8 bg-gray-200'
                                        }`}
                                />
                            ))}
                        </div>
                    </CardHeader>

                    <CardContent>
                        {/* Success Alert */}
                        {success && (
                            <motion.div
                                className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-2xl mb-6 text-sm font-bold flex items-center gap-2"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Check size={16} />
                                {success}
                            </motion.div>
                        )}

                        {/* Error Alert */}
                        {error && (
                            <motion.div
                                className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl mb-6 text-sm font-bold flex items-center gap-2"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                                {error}
                            </motion.div>
                        )}

                        {/* Step 1: Email */}
                        {step === STEP_EMAIL && (
                            <form onSubmit={handleRequestOTP} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-gray-900/70 ml-1">Email Address</Label>
                                    <div className="relative">
                                        <Input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-4"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary h-14 text-lg group"
                                >
                                    {loading ? (
                                        <Loader className="animate-spin mr-2" size={20} />
                                    ) : (
                                        <>
                                            Send OTP
                                            <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                                        </>
                                    )}
                                </Button>
                            </form>
                        )}

                        {/* Step 2: OTP */}
                        {step === STEP_OTP && (
                            <form onSubmit={handleVerifyOTP} className="space-y-6">
                                {/* Timer */}
                                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center justify-center gap-2">
                                    <Clock size={20} className="text-gray-900" />
                                    <span className="font-black text-gray-900">
                                        Time remaining: {formatTime(timeLeft)}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-900/70 ml-1">Enter OTP Code</Label>
                                    <Input
                                        type="text"
                                        placeholder="123456"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="text-center text-2xl font-black tracking-widest"
                                        maxLength={6}
                                        required
                                    />
                                    <p className="text-xs text-gray-500 text-center mt-2 font-bold">
                                        Sent to {email}
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading || otp.length !== 6}
                                    className="w-full btn-primary h-14 text-lg group"
                                >
                                    {loading ? (
                                        <Loader className="animate-spin mr-2" size={20} />
                                    ) : (
                                        <>
                                            Verify OTP
                                            <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                                        </>
                                    )}
                                </Button>

                                {/* Resend OTP */}
                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={!canResend || loading}
                                        className={`text-sm font-bold ${canResend
                                            ? 'text-primary hover:text-primary-dark cursor-pointer'
                                            : 'text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {canResend ? 'Resend OTP' : 'Resend available in 60s'}
                                    </button>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep(STEP_EMAIL)}
                                    className="w-full btn-outline h-12"
                                >
                                    <ArrowLeft size={16} className="mr-2" />
                                    Change Email
                                </Button>
                            </form>
                        )}

                        {/* Step 3: New Password */}
                        {step === STEP_PASSWORD && (
                            <form onSubmit={handleResetPassword} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-gray-900/70 ml-1">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="pr-12"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 ml-1 font-bold">
                                        Minimum 6 characters
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-900/70 ml-1">Confirm Password</Label>
                                    <div className="relative">
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="pr-12"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary h-14 text-lg group"
                                >
                                    {loading ? (
                                        <Loader className="animate-spin mr-2" size={20} />
                                    ) : (
                                        <>
                                            Reset Password
                                            <Check className="ml-2 group-hover:scale-110 transition-transform" size={20} />
                                        </>
                                    )}
                                </Button>
                            </form>
                        )}

                        {/* Back to Login */}
                        <div className="text-center mt-6">
                            <Link
                                href="/login"
                                className="text-sm text-gray-500 hover:text-primary transition-colors font-bold inline-flex items-center gap-1"
                            >
                                <ArrowLeft size={14} />
                                Back to Login
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
