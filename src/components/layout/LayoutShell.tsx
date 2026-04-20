import Navbar from './Navbar';
import Footer from './Footer';
import Preloader from '@/components/Preloader';
import styles from './layout.module.css';

export default function LayoutShell({
    children,
    isIOSDevice,
    isAdmin,
}: {
    children: React.ReactNode;
    isIOSDevice: boolean;
    isAdmin?: boolean;
}) {
    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <div className={styles.layoutContainer}>
            <Preloader skip={isIOSDevice} />
            <Navbar />
            <main className={styles.mainContent}>
                {children}
            </main>
            <Footer />
        </div>
    );
}
