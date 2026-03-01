import AdminSidebar from '@/components/admin/AdminSidebar';
import styles from './layout.module.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.adminContainer}>
            {/* Interactive Sidebar with Mobile Hamburger */}
            <AdminSidebar />

            {/* Main Content Area */}
            <main className={styles.mainContent}>
                <header className={styles.topbar}>
                    <div className={styles.breadcrumbs}>Admin Dashboard</div>
                    <div className={styles.userProfile}>Grace Admin</div>
                </header>

                <div className={styles.pageContent}>
                    {children}
                </div>
            </main>
        </div>
    );
}
