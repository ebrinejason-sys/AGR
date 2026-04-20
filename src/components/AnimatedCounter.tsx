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
    incrementInterval = 400
}: AnimatedCounterProps) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const counterRef = useRef<HTMLDivElement>(null);

    const formatNumber = (num: number): string => {
        if (!separator) return num.toString();
        return num.toLocaleString();
    };

    useEffect(() => {
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
        if (node) observer.observe(node);

        return () => {
            if (node) observer.unobserve(node);
        };
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) return;

        const isSafeMode = document.documentElement.getAttribute('data-runtime-safe') === '1';
        if (isSafeMode) {
            setCount(target);
            return;
        }

        let startTimestamp: number | null = null;
        let animationFrame: number;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(Math.floor(Math.min(easeOutExpo * target, target)));

            if (progress < 1) {
                animationFrame = window.requestAnimationFrame(step);
            } else {
                setCount(target);
            }
        };

        animationFrame = window.requestAnimationFrame(step);

        return () => {
            if (animationFrame) window.cancelAnimationFrame(animationFrame);
        };
    }, [isVisible, target, duration]);

    useEffect(() => {
        if (!isVisible || !continuous) return;

        const isSafeMode = document.documentElement.getAttribute('data-runtime-safe') === '1';
        if (isSafeMode) return;

        let interval: NodeJS.Timeout;

        const timeout = setTimeout(() => {
            interval = setInterval(() => {
                // Continuous tick for that "endless" feeling
                setCount(prev => prev + Math.floor(Math.random() * 2) + 1);
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
                fontVariantNumeric: 'tabular-nums',
            }}
        >
            {prefix}{formatNumber(count)}{suffix}
        </div>
    );
}
