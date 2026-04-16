"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import Preloader from '@/components/Preloader';
import SuggestionTicker from './SuggestionTicker';
import styles from '@/app/layout.module.css';

export default function LayoutShell({
    children,
    isIOSDevice,
}: {
    children: React.ReactNode;
    isIOSDevice: boolean;
}) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');
    const showSuggestionTicker = pathname !== '/' && !isIOSDevice;

    // Admin routes get a completely standalone layout — no site nav, footer, or preloader
    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <div className={styles.layoutContainer}>
            <Preloader skip={isIOSDevice} />
            <Navbar />
            {showSuggestionTicker ? <SuggestionTicker /> : null}
            <main className={styles.mainContent}>
                {children}
            </main>
            <Footer />
        </div>
    );
}
