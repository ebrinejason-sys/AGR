"use client";

import { useEffect, useState } from 'react';
import { Users, Calendar, Image as ImageIcon, BookOpen, PlusCircle, LayoutGrid, FileText, Send } from 'lucide-react';
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
    const [greeting, setGreeting] = useState('Welcome back');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');

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
            <div className={styles.welcomeBanner}>
                <h2>{greeting}, Grace!</h2>
                <p>Manage your core programs, track community impact, and stay connected with your supporters through this centralized dashboard.</p>
            </div>

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
                    <h2>Navigation Guide</h2>
                    <div className={styles.navGuide}>
                        <div className={styles.guideItem}>
                            <div className={`${styles.guideIcon} ${styles.statIconPink}`}>
                                <LayoutGrid size={18} />
                            </div>
                            <div className={styles.guideContent}>
                                <h4>Projects & Programs</h4>
                                <p>Manage the four core pillars. Add new initiatives like the Rise Room or Academic Rescue.</p>
                            </div>
                        </div>
                        <div className={styles.guideItem}>
                            <div className={`${styles.guideIcon} ${styles.statIconPurple}`}>
                                <Calendar size={18} />
                            </div>
                            <div className={styles.guideContent}>
                                <h4>Events & Fundraising</h4>
                                <p>Track the Education Drive 2025 and other community workshops. Update progress and goals.</p>
                            </div>
                        </div>
                        <div className={styles.guideItem}>
                            <div className={`${styles.guideIcon} ${styles.statIconBlue}`}>
                                <ImageIcon size={18} />
                            </div>
                            <div className={styles.guideContent}>
                                <h4>Media Library</h4>
                                <p>Central hub for images and videos. Content uploaded here can be linked to specific events.</p>
                            </div>
                        </div>
                        <div className={styles.guideItem}>
                            <div className={`${styles.guideIcon} ${styles.statIconDefault}`}>
                                <FileText size={18} />
                            </div>
                            <div className={styles.guideContent}>
                                <h4>Voices of Resilience</h4>
                                <p>Publish stories of transformation directly to the public website under the &apos;Stories&apos; tab.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.panel}>
                    <h2>Quick Actions</h2>
                    <div className={styles.quickActions}>
                        <Link href="/admin/events" className={styles.actionBtn}>
                            <PlusCircle size={20} className={styles.actionIcon} />
                            <span>Create New Event</span>
                        </Link>
                        <Link href="/admin/media" className={styles.actionBtn}>
                            <ImageIcon size={20} className={styles.actionIcon} />
                            <span>Upload Media</span>
                        </Link>
                        <Link href="/admin/stories" className={styles.actionBtn}>
                            <PlusCircle size={20} className={styles.actionIcon} />
                            <span>Write Story</span>
                        </Link>
                        <Link href="/admin/subscriptions" className={styles.actionBtn}>
                            <Send size={20} className={styles.actionIcon} />
                            <span>Email Subscribers</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
