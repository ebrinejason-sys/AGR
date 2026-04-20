import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function AdminGuard() {
    const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

    useEffect(() => {
        fetch('/api/auth')
            .then((res) => res.json())
            .then((data) => {
                if (data.authenticated) {
                    setStatus('authenticated');
                } else {
                    setStatus('unauthenticated');
                }
            })
            .catch(() => {
                setStatus('unauthenticated');
            });
    }, []);

    if (status === 'loading') {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#fff' }}>
                <p>Verifying admin session...</p>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
}
