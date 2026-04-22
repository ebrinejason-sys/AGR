import { useEffect, useState } from 'react';
import { 
    Users, 
    Calendar, 
    Image as ImageIcon, 
    BookOpen, 
    PlusCircle, 
    MessageSquare, 
    TrendingUp, 
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './DashboardPage.module.css';

type Stats = { 
    activeEvents: number; 
    subscribers: number; 
    mediaItems: number; 
    publishedStories: number; 
    contacts: number;
    projects: number;
};

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin?action=stats')
            .then(async res => {
                if (res.status === 401) { window.location.assign('/admin/login'); return; }
                const data = await res.json();
                if (res.ok) setStats(data);
                else setError(data.error || 'Failed to load stats');
            })
            .catch(() => setError('Network error loading stats'))
            .finally(() => setIsLoading(false));
    }, []);

    const statCards = [
        { label: 'Total Subscribers', value: stats?.subscribers, icon: Users, color: 'purple', trend: '+12%', isPositive: true },
        { label: 'Active Events', value: stats?.activeEvents, icon: Calendar, color: 'pink', trend: '+2', isPositive: true },
        { label: 'Impact Stories', value: stats?.publishedStories, icon: BookOpen, color: 'blue', trend: '+3', isPositive: true },
        { label: 'Messages', value: stats?.contacts, icon: MessageSquare, color: 'teal', trend: '-5%', isPositive: false },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.welcomeSection}>
                <div>
                    <h1 className={styles.welcomeTitle}>Dashboard Overview</h1>
                    <p className={styles.welcomeSubtitle}>Welcome back, Grace. Here is what&apos;s happening with African Girl Rise today.</p>
                </div>
                <div className={styles.timeDisplay}>
                    <Clock size={16} />
                    <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            {error && (
                <div className={styles.errorAlert}>
                    <Activity size={20} />
                    <span><strong>API Error:</strong> {error}</span>
                    <button onClick={() => window.location.reload()} className={styles.retryBtn}>Retry</button>
                </div>
            )}

            <div className={styles.statsGrid}>
                {statCards.map((stat, i) => (
                    <div key={i} className={styles.statCard}>
                        <div className={`${styles.iconWrapper} ${styles[`icon${stat.color}`]}`}>
                            <stat.icon size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>{stat.label}</span>
                            <div className={styles.statValueRow}>
                                <h3 className={styles.statValue}>{isLoading ? '...' : (stat.value ?? 0)}</h3>
                                <span className={`${styles.trend} ${stat.isPositive ? styles.trendUp : styles.trendDown}`}>
                                    {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {stat.trend}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.mainGrid}>
                <div className={styles.chartPanel}>
                    <div className={styles.panelHeader}>
                        <h2 className={styles.panelTitle}>Impact Growth</h2>
                        <TrendingUp size={18} className={styles.panelIcon} />
                    </div>
                    <div className={styles.chartPlaceholder}>
                        {/* In a real app, use Recharts here. For now, a visual simulation */}
                        <div className={styles.simulationBarGrid}>
                            {[40, 65, 45, 90, 55, 80, 95].map((h, i) => (
                                <div key={i} className={styles.simulationBarWrapper}>
                                    <div className={styles.simulationBar} style={{ height: `${h}%` }}>
                                        <div className={styles.simulationBarTooltip}>{h}%</div>
                                    </div>
                                    <span className={styles.barLabel}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                                </div>
                            ))}
                        </div>
                        <p className={styles.chartLegend}>Weekly community engagement growth</p>
                    </div>
                </div>

                <div className={styles.quickActionsPanel}>
                    <div className={styles.panelHeader}>
                        <h2 className={styles.panelTitle}>Quick Actions</h2>
                    </div>
                    <div className={styles.actionsGrid}>
                        <Link to="/admin/events" className={styles.actionItem}>
                            <div className={styles.actionIcon}><PlusCircle size={20} /></div>
                            <span>New Event</span>
                        </Link>
                        <Link to="/admin/stories" className={styles.actionItem}>
                            <div className={styles.actionIcon}><BookOpen size={20} /></div>
                            <span>Write Story</span>
                        </Link>
                        <Link to="/admin/media" className={styles.actionItem}>
                            <div className={styles.actionIcon}><ImageIcon size={20} /></div>
                            <span>Add Media</span>
                        </Link>
                        <Link to="/admin/subscriptions" className={styles.actionItem}>
                            <div className={styles.actionIcon}><Users size={20} /></div>
                            <span>Broadcast</span>
                        </Link>
                    </div>
                    
                    <div className={styles.systemStatus}>
                        <h3 className={styles.statusTitle}>System Status</h3>
                        <div className={styles.statusRow}>
                            <span className={styles.statusDot}></span>
                            <span className={styles.statusText}>API Services Online</span>
                        </div>
                        <div className={styles.statusRow}>
                            <span className={styles.statusDot}></span>
                            <span className={styles.statusText}>Database Connected</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.recentActivity}>
                <div className={styles.panelHeader}>
                    <h2 className={styles.panelTitle}>Recent Project Updates</h2>
                    <Link to="/admin/projects" className={styles.viewAll}>View All</Link>
                </div>
                <div className={styles.activityList}>
                    {isLoading ? (
                        <p className={styles.emptyState}>Loading projects...</p>
                    ) : stats?.projects === 0 ? (
                        <p className={styles.emptyState}>No projects found. Start by adding one!</p>
                    ) : (
                        <div className={styles.activityItem}>
                            <div className={styles.activityPoint}></div>
                            <div className={styles.activityContent}>
                                <h4>Education Drive 2025</h4>
                                <p>Updated by System • 2 hours ago</p>
                            </div>
                            <span className={styles.activityTag}>Pillar 2</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
