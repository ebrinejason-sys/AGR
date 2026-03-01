import { Users, Calendar, Image as ImageIcon, BookOpen } from 'lucide-react';
import styles from './page.module.css';

export default function AdminOverview() {
    return (
        <div className={styles.dashboard}>
            <h1 className={styles.pageTitle}>Dashboard Overview</h1>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(216, 27, 96, 0.1)', color: 'var(--color-pink)' }}>
                        <Calendar size={24} />
                    </div>
                    <div>
                        <h3>Active Events</h3>
                        <p className={styles.statValue}>2</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(74, 20, 140, 0.1)', color: 'var(--color-purple)' }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <h3>Subscribers</h3>
                        <p className={styles.statValue}>124</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(3, 169, 244, 0.1)', color: 'var(--color-lightblue)' }}>
                        <ImageIcon size={24} />
                    </div>
                    <div>
                        <h3>Media Items</h3>
                        <p className={styles.statValue}>38</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h3>Published Stories</h3>
                        <p className={styles.statValue}>12</p>
                    </div>
                </div>
            </div>

            <div className={styles.panelsGrid}>
                <div className={styles.panel}>
                    <h2>Recent Contributions</h2>
                    <div className={styles.emptyState}>
                        No recent contributions found.
                    </div>
                </div>

                <div className={styles.panel}>
                    <h2>Quick Actions</h2>
                    <div className={styles.quickActions}>
                        <button className={styles.actionBtn}>Create New Event</button>
                        <button className={styles.actionBtn}>Upload Media</button>
                        <button className={styles.actionBtn}>Write Story</button>
                        <button className={styles.actionBtn}>Email Subscribers</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
