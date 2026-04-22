import { useCallback, useEffect, useRef, useState } from 'react';

export type AdminToastTone = 'success' | 'error' | 'info';

export type AdminToastItem = {
    id: number;
    title: string;
    message?: string;
    tone: AdminToastTone;
};

type ToastInput = {
    title: string;
    message?: string;
    tone?: AdminToastTone;
    duration?: number;
};

const DEFAULT_DURATION = 3600;

export function useAdminToast() {
    const [toasts, setToasts] = useState<AdminToastItem[]>([]);
    const nextIdRef = useRef(1);
    const timeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

    const dismiss = useCallback((id: number) => {
        const timeout = timeoutsRef.current.get(id);
        if (timeout) {
            clearTimeout(timeout);
            timeoutsRef.current.delete(id);
        }
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const push = useCallback(({ title, message, tone = 'info', duration = DEFAULT_DURATION }: ToastInput) => {
        const id = nextIdRef.current++;
        setToasts((current) => [...current, { id, title, message, tone }]);

        if (duration > 0) {
            const timeout = setTimeout(() => {
                timeoutsRef.current.delete(id);
                setToasts((current) => current.filter((toast) => toast.id !== id));
            }, duration);
            timeoutsRef.current.set(id, timeout);
        }

        return id;
    }, []);

    useEffect(() => {
        return () => {
            timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
            timeoutsRef.current.clear();
        };
    }, []);

    return {
        toasts,
        dismiss,
        push,
        success: (title: string, message?: string, duration?: number) => push({ title, message, duration, tone: 'success' }),
        error: (title: string, message?: string, duration?: number) => push({ title, message, duration, tone: 'error' }),
        info: (title: string, message?: string, duration?: number) => push({ title, message, duration, tone: 'info' }),
    };
}