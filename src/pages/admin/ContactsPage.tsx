import { useEffect, useState } from 'react';
import { 
    MessageSquare, 
    Trash2, 
    Loader2, 
    Mail, 
    User, 
    Calendar, 
    Phone, 
    Briefcase, 
    Info,
    AlertCircle,
    CheckCircle,
    Search,
    ChevronRight,
    Tag,
    Clock
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import styles from './ContactsPage.module.css';

type Contact = { 
    id: string; 
    name: string; 
    email: string; 
    message: string; 
    type: 'general' | 'mentor' | 'sponsor' | 'donate';
    extra_fields: Record<string, any>;
    created_at: string 
};

export default function AdminContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchContacts = async () => {
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

    const deleteContact = async (id: string) => {
        if (!confirm('Delete this message permanently?')) return;
        try {
            const res = await fetch('/api/admin?action=contacts', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                setContacts(prev => prev.filter(c => c.id !== id));
                if (selectedContact?.id === id) setSelectedContact(null);
            } else {
                alert('Failed to delete message.');
            }
        } catch { alert('Network error'); }
    };

    const filteredContacts = contacts.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'mentor': return styles.typeMentor;
            case 'sponsor': return styles.typeSponsor;
            case 'donate': return styles.typeDonate;
            default: return styles.typeGeneral;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Inbox & Inquiries</h1>
                    <p className={styles.pageSubtitle}>Review and respond to messages from your global community.</p>
                </div>
                <div className={styles.searchBar}>
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Search messages..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {error && (
                <div className={styles.errorBanner}>
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            <div className={styles.layout}>
                <aside className={styles.messageList}>
                    <div className={styles.listHeader}>
                        <span>{filteredContacts.length} Messages</span>
                    </div>
                    <div className={styles.scrollArea}>
                        {loading ? (
                            <div className={styles.loadingState}>
                                <Loader2 size={32} className={styles.spin} />
                                <p>Checking inbox...</p>
                            </div>
                        ) : filteredContacts.length === 0 ? (
                            <div className={styles.emptyState}>
                                <MessageSquare size={32} />
                                <p>No messages found.</p>
                            </div>
                        ) : (
                            filteredContacts.map(c => (
                                <div 
                                    key={c.id} 
                                    className={`${styles.messageItem} ${selectedContact?.id === c.id ? styles.messageItemActive : ''}`}
                                    onClick={() => setSelectedContact(c)}
                                >
                                    <div className={styles.itemHeader}>
                                        <span className={styles.itemName}>{c.name}</span>
                                        <span className={styles.itemDate}>{new Date(c.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className={styles.itemSubject}>{c.message.slice(0, 50)}...</div>
                                    <div className={styles.itemMeta}>
                                        <span className={`${styles.typeBadge} ${getTypeColor(c.type)}`}>{c.type}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </aside>

                <main className={styles.messageView}>
                    {selectedContact ? (
                        <div className={styles.viewContent}>
                            <header className={styles.viewHeader}>
                                <div className={styles.viewIdentity}>
                                    <div className={styles.largeAvatar}>{selectedContact.name[0].toUpperCase()}</div>
                                    <div>
                                        <h2 className={styles.viewName}>{selectedContact.name}</h2>
                                        <p className={styles.viewEmail}>{selectedContact.email}</p>
                                    </div>
                                </div>
                                <div className={styles.viewActions}>
                                    <a href={`mailto:${selectedContact.email}`} className={styles.replyBtn}>
                                        <Mail size={18} />
                                        Reply via Email
                                    </a>
                                    <button className={styles.deleteBtn} onClick={() => deleteContact(selectedContact.id)}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </header>

                            <div className={styles.viewBody}>
                                <div className={styles.messageSection}>
                                    <h3 className={styles.sectionTitle}><MessageSquare size={16} /> Message Content</h3>
                                    <div className={styles.messageText}>{selectedContact.message}</div>
                                </div>

                                <div className={styles.metaSection}>
                                    <div className={styles.metaGrid}>
                                        <div className={styles.metaItem}>
                                            <Tag size={16} />
                                            <div>
                                                <label>Inquiry Type</label>
                                                <span className={`${styles.typeBadge} ${getTypeColor(selectedContact.type)}`}>
                                                    {selectedContact.type}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={styles.metaItem}>
                                            <Clock size={16} />
                                            <div>
                                                <label>Received At</label>
                                                <span>{formatDate(selectedContact.created_at)}</span>
                                            </div>
                                        </div>
                                        {selectedContact.extra_fields?.phone && (
                                            <div className={styles.metaItem}>
                                                <Phone size={16} />
                                                <div>
                                                    <label>Phone Number</label>
                                                    <span>{selectedContact.extra_fields.phone}</span>
                                                </div>
                                            </div>
                                        )}
                                        {selectedContact.extra_fields?.profession && (
                                            <div className={styles.metaItem}>
                                                <Briefcase size={16} />
                                                <div>
                                                    <label>Profession</label>
                                                    <span>{selectedContact.extra_fields.profession}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {selectedContact.extra_fields && Object.keys(selectedContact.extra_fields).length > 2 && (
                                    <div className={styles.extraSection}>
                                        <h3 className={styles.sectionTitle}><Info size={16} /> Additional Details</h3>
                                        <div className={styles.extraGrid}>
                                            {Object.entries(selectedContact.extra_fields).map(([key, val]) => (
                                                !['phone', 'profession'].includes(key) && (
                                                    <div key={key} className={styles.extraItem}>
                                                        <label>{key.replace(/_/g, ' ')}</label>
                                                        <span>{String(val)}</span>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className={styles.noSelection}>
                            <div className={styles.noSelectionIcon}><MessageSquare size={64} /></div>
                            <h2>Select a message</h2>
                            <p>Choose a message from the list on the left to read its full content and view details.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
