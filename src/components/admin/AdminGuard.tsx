import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AdminLayout from './AdminLayout';

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
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#ec4899', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
                    <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Verifying secure session...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <AdminLayout>
            <Outlet />
        </AdminLayout>
    );
}
