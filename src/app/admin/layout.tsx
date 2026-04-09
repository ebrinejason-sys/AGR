"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import styles from './layout.module.css';

const PAGE_NAMES: Record<string, string> = {
    '/admin': 'Overview',
    '/admin/projects': 'Projects & Programs',
    '/admin/media': 'Media Library',
    '/admin/stories': 'Stories',
    '/admin/events': 'Events',
    '/admin/subscriptions': 'Subscribers',
    '/admin/contacts': 'Messages',
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    useEffect(() => {
        // Don't auto-logout if we're already on the login page
        if (pathname === '/admin/login') return;

        let timeoutId: NodeJS.Timeout;

        const handleLogout = async () => {
            await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'logout' }),
            });
            window.location.href = '/admin/login?expired=true';
        };

        const resetTimeout = () => {
            clearTimeout(timeoutId);
            // 15 minutes = 900000 ms
            timeoutId = setTimeout(handleLogout, 900000);
        };

        resetTimeout();

        const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
        events.forEach(e => window.addEventListener(e, resetTimeout));

        return () => {
            clearTimeout(timeoutId);
            events.forEach(e => window.removeEventListener(e, resetTimeout));
        };
    }, [pathname]);

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const pageTitle = PAGE_NAMES[pathname] || 'Dashboard';

    return (
        <div className={styles.adminContainer}>
            {/* Interactive Sidebar with Mobile Hamburger */}
            <AdminSidebar />

            {/* Main Content Area */}
            <main className={styles.mainContent}>
                <header className={styles.topbar}>
                    <div className={styles.breadcrumbs}>
                        <span className={styles.breadcrumbOrg}>AGR</span>
                        <span className={styles.breadcrumbSep}>/</span>
                        {pageTitle}
                    </div>
                    <div className={styles.userProfile}>
                        <span className={styles.adminBadge}>Administrator</span>
                    </div>
                </header>

                <div className={styles.pageContent}>
                    {children}
                </div>
            </main>
        </div>
    );
}
