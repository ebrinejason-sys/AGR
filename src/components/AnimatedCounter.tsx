"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedCounterProps {
    target: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    separator?: boolean;
    continuous?: boolean;
    incrementInterval?: number;
}

export default function AnimatedCounter({
    target,
    duration = 1200,
    prefix = "",
    suffix = "",
    separator = true,
    continuous = false,
    incrementInterval = 800
}: AnimatedCounterProps) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const counterRef = useRef<HTMLDivElement>(null);

    // Format number with commas
    const formatNumber = (num: number): string => {
        if (!separator) return num.toString();
        return num.toLocaleString();
    };

    useEffect(() => {
        // Fallback for browsers that don't support IntersectionObserver
        if (typeof window !== 'undefined' && !window.IntersectionObserver) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        const node = counterRef.current;
        if (node) {
            observer.observe(node);
        }

        return () => {
            if (node) observer.unobserve(node);
        };
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) return;

        let startTimestamp: number | null = null;
        let animationFrame: number;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Enhanced easing: easeOutExpo for more elegant animation
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            // Add slight overshoot and settle back for more dynamic feel
            const overshoot = progress < 0.8 ? 1.02 : 1;
            const easedProgress = easeOutExpo * overshoot;

            setCount(Math.floor(Math.min(easedProgress * target, target)));

            if (progress < 1) {
                animationFrame = window.requestAnimationFrame(step);
            } else {
                setCount(target);
            }
        };

        animationFrame = window.requestAnimationFrame(step);

        return () => {
            if (animationFrame) {
                window.cancelAnimationFrame(animationFrame);
            }
        };
    }, [isVisible, target, duration]);

    useEffect(() => {
        if (!isVisible || !continuous) return;

        let interval: NodeJS.Timeout;

        // Start continuous increment only after initial animation reaches target
        // We wait for the duration of the initial animation
        const timeout = setTimeout(() => {
            interval = setInterval(() => {
                setCount(prev => prev + Math.floor(Math.random() * 3) + 1);
            }, incrementInterval);
        }, duration);

        return () => {
            clearTimeout(timeout);
            if (interval) clearInterval(interval);
        };
    }, [isVisible, continuous, incrementInterval, duration]);

    return (
        <div
            ref={counterRef}
            className="animated-counter"
            style={{
                display: 'inline-block',
                fontVariantNumeric: 'tabular-nums', // Prevents number shifting
                transition: 'all 0.3s ease'
            }}
        >
            {prefix}{formatNumber(count)}{suffix}
        </div>
    );
}
