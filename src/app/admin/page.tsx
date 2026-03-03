"use client";

import { useEffect, useState } from 'react';
import { Users, Calendar, Image as ImageIcon, BookOpen } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

type Stats = {
    activeEvents: number;
    subscribers: number;
    mediaItems: number;
    publishedStories: number;
};

export default function AdminOverview() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                } else {
                    const data = await res.json().catch(() => ({ error: 'Failed to load stats' }));
                    setError(data.error || 'Failed to load stats');
                }
            } catch {
                setError('Network error loading stats');
            }
        };
        fetchStats();
    }, []);

    return (
        <div className={styles.dashboard}>
            <h1 className={styles.pageTitle}>Dashboard Overview</h1>

            {error && (
                <div className={styles.errorBanner}>
                    ⚠️ {error}
                </div>
            )}

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconPink}`}>
                        <Calendar size={24} />
                    </div>
                    <div>
                        <h3>Active Events</h3>
                        <p className={styles.statValue}>{stats ? stats.activeEvents : '—'}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconPurple}`}>
                        <Users size={24} />
                    </div>
                    <div>
                        <h3>Subscribers</h3>
                        <p className={styles.statValue}>{stats ? stats.subscribers : '—'}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconBlue}`}>
                        <ImageIcon size={24} />
                    </div>
                    <div>
                        <h3>Media Items</h3>
                        <p className={styles.statValue}>{stats ? stats.mediaItems : '—'}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconDefault}`}>
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h3>Published Stories</h3>
                        <p className={styles.statValue}>{stats ? stats.publishedStories : '—'}</p>
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
                        <Link href="/admin/events" className={styles.actionBtn}>Create New Event</Link>
                        <Link href="/admin/media" className={styles.actionBtn}>Upload Media</Link>
                        <Link href="/admin/stories" className={styles.actionBtn}>Write Story</Link>
                        <Link href="/admin/subscriptions" className={styles.actionBtn}>Email Subscribers</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
