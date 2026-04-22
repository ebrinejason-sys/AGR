import { useEffect, useState } from 'react';
import { 
    Users, 
    Send, 
    Mail, 
    CheckCircle, 
    AlertCircle, 
    Loader2, 
    Download, 
    Trash2,
    Calendar,
    Search,
    Filter,
    SendHorizonal
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import styles from './SubscriptionsPage.module.css';

type Subscriber = { id: string; email: string; name?: string; created_at: string };

export default function AdminSubscriptionsPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Broadcast State
    const [showBroadcast, setShowBroadcast] = useState(false);
    const [broadcastData, setBroadcastData] = useState({ subject: '', message: '' });
    const [sending, setSending] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const fetchSubscribers = async () => {
        try {
            const res = await fetch('/api/admin?action=subscriptions');
            if (res.status === 401) { window.location.assign('/admin/login'); return; }
            const data = await res.json();
            if (res.ok) { setSubscribers(data.subscribers || []); setError(null); }
            else setError(data.error || 'Failed to load subscribers.');
        } catch { setError('Network error while loading subscribers.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchSubscribers(); }, []);

    const handleBroadcast = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const res = await fetch('/api/admin?action=email_broadcast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(broadcastData),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccessMessage(`Broadcast successfully sent to ${data.sent} subscribers.`);
                setBroadcastData({ subject: '', message: '' });
                setTimeout(() => setShowBroadcast(false), 3000);
            } else {
                setError(data.error || 'Failed to send broadcast.');
            }
        } catch {
            setError('Network error while sending broadcast.');
        } finally {
            setSending(false);
        }
    };

    const filteredSubscribers = subscribers.filter(s => 
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const exportCSV = () => {
        const headers = ['Email', 'Name', 'Joined Date'];
        const rows = filteredSubscribers.map(s => [s.email, s.name || '', formatDate(s.created_at)]);
        const csvContent = "data:text/csv;charset=utf-8," + 
            headers.join(",") + "\n" + 
            rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "agr_subscribers.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Community Subscribers</h1>
                    <p className={styles.pageSubtitle}>Manage your newsletter list and engage your supporters directly.</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.exportBtn} onClick={exportCSV}>
                        <Download size={18} />
                        Export CSV
                    </button>
                    <button className={styles.broadcastTrigger} onClick={() => setShowBroadcast(true)}>
                        <Send size={18} />
                        Broadcast Email
                    </button>
                </div>
            </div>

            {successMessage && (
                <div className={styles.successBanner}>
                    <CheckCircle size={20} />
                    <span>{successMessage}</span>
                </div>
            )}

            {error && (
                <div className={styles.errorBanner}>
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            <div className={styles.mainContent}>
                {showBroadcast && (
                    <div className={styles.broadcastPanel}>
                        <div className={styles.panelHeader}>
                            <h2 className={styles.panelTitle}>Send Community Broadcast</h2>
                            <button className={styles.closePanel} onClick={() => setShowBroadcast(false)}><X size={20} /></button>
                        </div>
                        <form className={styles.broadcastForm} onSubmit={handleBroadcast}>
                            <div className={styles.inputField}>
                                <label>Subject Line</label>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="e.g. Important Update from African Girl Rise" 
                                    value={broadcastData.subject} 
                                    onChange={e => setBroadcastData(prev => ({ ...prev, subject: e.target.value }))} 
                                />
                            </div>
                            <div className={styles.inputField}>
                                <label>Message Content</label>
                                <textarea 
                                    rows={8} 
                                    required 
                                    placeholder="Write your message here... HTML is not supported, but line breaks are preserved." 
                                    value={broadcastData.message} 
                                    onChange={e => setBroadcastData(prev => ({ ...prev, message: e.target.value }))} 
                                />
                            </div>
                            <div className={styles.broadcastInfo}>
                                <AlertCircle size={14} />
                                <span>This email will be sent to all <strong>{subscribers.length}</strong> verified subscribers.</span>
                            </div>
                            <div className={styles.formActions}>
                                <button type="submit" className={styles.sendBtn} disabled={sending}>
                                    {sending ? <Loader2 size={18} className={styles.spin} /> : <SendHorizonal size={18} />}
                                    {sending ? 'Sending Broadcast...' : 'Send to Everyone'}
                                </button>
                                <button type="button" className={styles.cancelBtn} onClick={() => setShowBroadcast(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className={styles.tableCard}>
                    <div className={styles.tableHeader}>
                        <div className={styles.searchBar}>
                            <Search size={18} />
                            <input 
                                type="text" 
                                placeholder="Search by email or name..." 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className={styles.subscriberCount}>
                            <strong>{filteredSubscribers.length}</strong> {filteredSubscribers.length === 1 ? 'Subscriber' : 'Subscribers'} found
                        </div>
                    </div>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Subscriber</th>
                                    <th>Joined Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className={styles.loadingCell}>
                                            <Loader2 size={32} className={styles.spin} />
                                            <p>Syncing subscriber list...</p>
                                        </td>
                                    </tr>
                                ) : filteredSubscribers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className={styles.emptyCell}>
                                            {searchQuery ? 'No subscribers match your search.' : 'No subscribers found yet.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSubscribers.map(sub => (
                                        <tr key={sub.id}>
                                            <td>
                                                <div className={styles.subscriberInfo}>
                                                    <div className={styles.avatar}>{sub.email[0].toUpperCase()}</div>
                                                    <div>
                                                        <div className={styles.subEmail}>{sub.email}</div>
                                                        <div className={styles.subName}>{sub.name || 'Anonymous'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={styles.dateCell}>
                                                <Calendar size={14} />
                                                {formatDate(sub.created_at)}
                                            </td>
                                            <td>
                                                <span className={styles.activeBadge}>Active</span>
                                            </td>
                                            <td>
                                                <button className={styles.deleteBtn} title="Remove Subscriber">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
