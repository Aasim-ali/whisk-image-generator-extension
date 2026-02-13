'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 5000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
    const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
    const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);
    const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);

    return (
        <ToastContext.Provider value={{ success, error, warning, info, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 max-w-sm">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </AnimatePresence>
        </div>
    );
}

function Toast({ toast, onClose }) {
    const { type, message, duration } = toast;

    const icons = {
        success: <CheckCircle size={20} className="text-success flex-shrink-0" />,
        error: <AlertCircle size={20} className="text-danger flex-shrink-0" />,
        warning: <AlertTriangle size={20} className="text-warning flex-shrink-0" />,
        info: <Info size={20} className="text-info flex-shrink-0" />
    };

    const colors = {
        success: 'border-success/30 bg-success/10',
        error: 'border-danger/30 bg-danger/10',
        warning: 'border-warning/30 bg-warning/10',
        info: 'border-info/30 bg-info/10'
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className={`relative border-2 ${colors[type]} p-5 rounded-[2rem] bg-white shadow-2xl min-w-[320px] overflow-hidden`}
        >
            <div className="flex items-start gap-4">
                <div className="mt-1">{icons[type]}</div>
                <p className="flex-1 text-gray-900 font-bold text-sm leading-relaxed">{message}</p>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-black transition-colors flex-shrink-0 mt-1"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Progress bar */}
            {duration > 0 && (
                <motion.div
                    className="absolute bottom-0 left-0 h-1.5 bg-primary"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: duration / 1000, ease: 'linear' }}
                />
            )}
        </motion.div>
    );
}
