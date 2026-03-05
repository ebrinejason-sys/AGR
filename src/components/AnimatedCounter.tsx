"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedCounterProps {
    target: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
}

export default function AnimatedCounter({ target, duration = 2000, prefix = "", suffix = "" }: AnimatedCounterProps) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const counterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (counterRef.current) {
            observer.observe(counterRef.current);
        }

        return () => {
            if (counterRef.current) observer.unobserve(counterRef.current);
        };
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // easing out quint
            const easeOut = 1 - Math.pow(1 - progress, 5);

            setCount(Math.floor(easeOut * target));

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                setCount(target);
            }
        };

        window.requestAnimationFrame(step);
    }, [isVisible, target, duration]);

    return (
        <div ref={counterRef} style={{ display: 'inline-block' }}>
            {prefix}{count}{suffix}
        </div>
    );
}
