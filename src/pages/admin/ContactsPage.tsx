import { useEffect, useState } from 'react';
import { Mail, Trash2, Search, RefreshCw, MessageSquare } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import styles from './ContactsPage.module.css';

type ContactType = 'general' | 'mentor' | 'sponsor' | 'donate';
type ContactMessage = { id: string; name: string; email: string; message: string; type: ContactType; extra_fields: Record<string, string> | null; created_at: string };

const TYPE_LABELS: Record<ContactType, string> = { general: 'General', mentor: 'Mentor', sponsor: 'Sponsor', donate: 'Donate' };
const TYPE_COLORS: Record<ContactType, string> = { general: '#6b7280', mentor: '#2563eb', sponsor: '#7c3aed', donate: '#059669' };
const EXTRA_FIELD_LABELS: Record<string, string> = { phone: 'Phone', profession: 'Profession', organization: 'Organisation', contributionArea: 'Contribution Area', mentorCapacity: 'Mentoring Capacity', orgName: 'Organisation', contactPerson: 'Contact Person', sponsorType: 'Sponsorship Type', budgetRange: 'Budget Range', donationType: 'Donor Type', donationIntent: 'Area of Giving' };

export default function AdminContactsPage() {
    const [contacts, setContacts] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState<ContactType | 'all'>('all');
    const [expanded, setExpanded] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin?action=contacts');
            if (res.status === 401) { window.location.assign('/admin/login'); return; }
            const data = await res.json();
            if (res.ok) { setContacts(data.contacts || []); setError(null); }
            else setError(data.error || 'Failed to load messages.');
        } catch { setError('Network error while loading messages.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchContacts(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this message permanently?')) return;
        setDeleting(id);
        try {
            const res = await fetch('/api/admin?action=contacts', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
            if (res.ok) { setContacts(prev => prev.filter(c => c.id !== id)); if (expanded === id) setExpanded(null); }
            else { const data = await res.json(); alert(data.error || 'Failed to delete.'); }
        } catch { alert('Network error.'); }
        finally { setDeleting(null); }
    };

    const filtered = contacts.filter(c => {
        const term = search.trim().toLowerCase();
        const typeMatch = filterType === 'all' || c.type === filterType;
        if (!typeMatch) return false;
        if (!term) return true;
        return c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term) || c.message.toLowerCase().includes(term);
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Contact Messages</h1>
                    <p className={styles.subtitle}>{contacts.length} message{contacts.length !== 1 ? 's' : ''} received</p>
                </div>
                <div className={styles.headerActions}>
                    <div className={styles.filterBar}>
                        {(['all', 'general', 'mentor', 'sponsor', 'donate'] as const).map(t => (
                            <button key={t} className={`${styles.filterBtn} ${filterType === t ? styles.filterBtnActive : ''}`} style={filterType === t && t !== 'all' ? { borderColor: TYPE_COLORS[t as ContactType], color: TYPE_COLORS[t as ContactType] } : {}} onClick={() => setFilterType(t)}>
                                {t === 'all' ? 'All' : TYPE_LABELS[t as ContactType]}
                            </button>
                        ))}
                    </div>
                    <div className={styles.searchBox}>
                        <Search size={16} className={styles.searchIcon} />
                        <input className={styles.searchInput} type="text" placeholder="Search messages..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <button className={styles.refreshBtn} onClick={fetchContacts} title="Refresh"><RefreshCw size={16} /></button>
                </div>
            </div>
            {error && <div className={styles.errorBanner}>⚠️ {error}</div>}
            {loading ? (
                <div className={styles.loading}>Loading messages…</div>
            ) : filtered.length === 0 ? (
                <div className={styles.empty}><MessageSquare size={40} className={styles.emptyIcon} /><p>{search ? 'No messages match your search.' : 'No contact messages yet.'}</p></div>
            ) : (
                <div className={styles.messageList}>
                    {filtered.map(contact => (
                        <div key={contact.id} className={`${styles.messageCard} ${expanded === contact.id ? styles.expanded : ''}`}>
                            <div className={styles.messageHeader} onClick={() => setExpanded(expanded === contact.id ? null : contact.id)}>
                                <div className={styles.avatarWrap}><div className={styles.avatar}>{contact.name.charAt(0).toUpperCase()}</div></div>
                                <div className={styles.messageMeta}>
                                    <div className={styles.senderName}>{contact.name}<span className={styles.typeBadge} style={{ background: TYPE_COLORS[contact.type] || '#6b7280' }}>{TYPE_LABELS[contact.type] || contact.type}</span></div>
                                    <div className={styles.senderEmail}>{contact.email}</div>
                                    <div className={styles.messagePreview}>{contact.message.slice(0, 80)}{contact.message.length > 80 ? '…' : ''}</div>
                                </div>
                                <div className={styles.messageRight}>
                                    <span className={styles.messageDate}>{formatDate(contact.created_at)}</span>
                                    <div className={styles.messageActions}>
                                        <a href={`mailto:${contact.email}?subject=Re: Your message to African Girl Rise`} className={styles.replyBtn} onClick={e => e.stopPropagation()} title="Reply via email"><Mail size={15} /></a>
                                        <button className={styles.deleteBtn} onClick={e => { e.stopPropagation(); handleDelete(contact.id); }} disabled={deleting === contact.id} title="Delete"><Trash2 size={15} /></button>
                                    </div>
                                </div>
                            </div>
                            {expanded === contact.id && (
                                <div className={styles.messageBody}>
                                    {contact.extra_fields && Object.keys(contact.extra_fields).length > 0 && (
                                        <div className={styles.extraFields}>
                                            {Object.entries(contact.extra_fields).map(([key, val]) => (
                                                <div key={key} className={styles.extraRow}><span className={styles.extraLabel}>{EXTRA_FIELD_LABELS[key] || key}</span><span className={styles.extraValue}>{val}</span></div>
                                            ))}
                                        </div>
                                    )}
                                    <p className={styles.fullMessage}>{contact.message}</p>
                                    <a href={`mailto:${contact.email}?subject=Re: Your message to African Girl Rise`} className={styles.replyFullBtn}><Mail size={14} /> Reply to {contact.name}</a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
