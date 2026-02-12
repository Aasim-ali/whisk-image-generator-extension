'use client';

import { useEffect, useState, useRef } from 'react';
import { useInViewOnce } from '../hooks/useInView';

/**
 * Animated counter component that counts up when in viewport
 * @param {number} end - Target number to count to
 * @param {number} duration - Animation duration in ms
 * @param {string} prefix - Prefix to add before number (default: '')
 * @param {string} suffix - Suffix to add after number (default: '')
 * @param {number} decimals - Number of decimal places (default: 0)
 */
export default function AnimatedCounter({
    end,
    duration = 2000,
    prefix = '',
    suffix = '',
    decimals = 0,
    className = ''
}) {
    const [count, setCount] = useState(0);
    const [ref, isInView] = useInViewOnce({ threshold: 0.5 });
    const frameRef = useRef();
    const startTimeRef = useRef();

    useEffect(() => {
        if (!isInView) return;

        const animate = (currentTime) => {
            if (!startTimeRef.current) {
                startTimeRef.current = currentTime;
            }

            const progress = Math.min((currentTime - startTimeRef.current) / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);

            setCount(easeOutQuart * end);

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            }
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [isInView, end, duration]);

    return (
        <span ref={ref} className={className}>
            {prefix}{count.toFixed(decimals)}{suffix}
        </span>
    );
}
