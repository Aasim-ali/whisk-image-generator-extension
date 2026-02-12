'use client';

import { useEffect, useState, useRef } from 'react';

/**
 * Custom hook to detect when an element enters the viewport
 * @param {Object} options - IntersectionObserver options
 * @returns {Array} - [ref, isInView]
 */
export function useInView(options = {}) {
    const [isInView, setIsInView] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsInView(entry.isIntersecting);
        }, {
            threshold: 0.1,
            ...options
        });

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [options]);

    return [ref, isInView];
}

/**
 * Custom hook for triggering animation once when element enters viewport
 * @param {Object} options - IntersectionObserver options
 * @returns {Array} - [ref, hasBeenInView]
 */
export function useInViewOnce(options = {}) {
    const [hasBeenInView, setHasBeenInView] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !hasBeenInView) {
                setHasBeenInView(true);
            }
        }, {
            threshold: 0.1,
            ...options
        });

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [hasBeenInView, options]);

    return [ref, hasBeenInView];
}
