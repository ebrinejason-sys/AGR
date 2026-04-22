import { useEffect, useState, useRef } from 'react';
import { 
    PlusCircle, 
    Edit2, 
    Trash2, 
    Image as ImageIcon, 
    Loader2, 
    UploadCloud, 
    X,
    Calendar,
    MapPin,
    Target,
    Link as LinkIcon,
    CheckCircle2,
    AlertCircle,
    Clock
} from 'lucide-react';
import { formatDate, safeDate } from '@/lib/utils';
import styles from './EventsPage.module.css';

type GalleryImage = { id: string; url: string; description: string };
type EventItem = { 
    id: string; 
    title: string; 
    description: string; 
    event_date: string; 
    goal_amount: number; 
    goal_text: string; 
    current_amount: number; 
    status: 'upcoming' | 'completed' | 'cancelled'; 
    cover_image?: string; 
    achievements?: string; 
    location?: string; 
    donation_link?: string 
};

const EMPTY_FORM = { 
    title: '', 
    description: '', 
    event_date: '', 
    location: '', 
    goal_amount: '', 
    goal_text: '', 
    donation_link: '', 
    status: 'upcoming' as const, 
    cover_image: '', 
    achievements: '' 
};

export default function AdminEventsPage() {
    const [showForm, setShowForm] = useState(false);
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [gallery, setGallery] = useState<GalleryImage[]>([]);
    const [uploadingGallery, setUploadingGallery] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/admin?action=events');
            if (res.status === 401) { window.location.assign('/admin/login'); return; }
            const data = await res.json();
            if (res.ok) { setEvents(data.events || []); setError(null); }
            else setError(data.error || 'Failed to load events.');
        } catch { setError('Network error while loading events.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchEvents(); }, []);

    const fetchGallery = async (eventId: string) => {
        try {
            const res = await fetch('/api/admin/media');
            if (!res.ok) return;
            const data = await res.json();
            setGallery((data.media || []).filter((m: { event_id: string }) => m.event_id === eventId));
        } catch { setGallery([]); }
    };

    const handleEdit = (ev: EventItem) => {
        setEditId(ev.id);
        setFormData({ 
            title: ev.title, 
            description: ev.description || '', 
            event_date: safeDate(ev.event_date).toISOString().split('T')[0], 
            location: ev.location || '', 
            goal_amount: ev.goal_amount ? ev.goal_amount.toString() : '', 
            goal_text: ev.goal_text || '', 
            donation_link: ev.donation_link || '', 
            status: ev.status, 
            cover_image: ev.cover_image || '', 
            achievements: ev.achievements || '' 
        });
        setGallery([]);
        if (ev.status === 'completed') fetchGallery(ev.id);
        setShowForm(true);
    };

    const handleAddNew = () => { 
        setEditId(null); 
        setFormData(EMPTY_FORM); 
        setGallery([]); 
        setShowForm(true); 
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploadingImage(true);
        const uploadData = new FormData();
        uploadData.append('file', e.target.files[0]);
        uploadData.append('description', `Cover image for event: ${formData.title || 'Untitled'}`);
        try {
            const res = await fetch('/api/admin/media', { method: 'POST', body: uploadData });
            const data = await res.json();
            if (res.ok && data.media?.url) setFormData(prev => ({ ...prev, cover_image: data.media.url }));
            else alert(data.error || 'Failed to upload image.');
        } catch { alert('Upload error'); }
        finally { setUploadingImage(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editId || !e.target.files || e.target.files.length === 0) return;
        setUploadingGallery(true);
        const uploadData = new FormData();
        uploadData.append('file', e.target.files[0]);
        uploadData.append('description', `Gallery photo — ${formData.title}`);
        uploadData.append('event_id', editId);
        try {
            const res = await fetch('/api/admin/media', { method: 'POST', body: uploadData });
            const data = await res.json();
            if (res.ok && data.media) setGallery(prev => [...prev, data.media]);
            else alert(data.error || 'Failed to upload gallery image.');
        } catch { alert('Upload error'); }
        finally { setUploadingGallery(false); if (galleryInputRef.current) galleryInputRef.current.value = ''; }
    };

    const deleteGalleryImage = async (mediaId: string) => {
        if (!confirm('Remove this photo from the gallery?')) return;
        const res = await fetch('/api/admin/media', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: mediaId }) });
        if (res.ok) setGallery(prev => prev.filter(g => g.id !== mediaId));
        else { const data = await res.json().catch(() => ({})); alert(data.error || 'Failed to delete image.'); }
    };

    const saveEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editId ? 'PATCH' : 'POST';
        const body = { ...formData, goal_amount: formData.goal_amount ? Number(formData.goal_amount) : 0, ...(editId && { id: editId }) };
        try {
            const res = await fetch('/api/admin?action=events', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            if (res.status === 401) { window.location.assign('/admin/login'); return; }
            if (res.ok) { setShowForm(false); setEditId(null); setGallery([]); setFormData(EMPTY_FORM); setError(null); await fetchEvents(); }
            else { const data = await res.json(); alert(data.error || 'Failed to save event.'); }
        } catch { alert('Network error while saving event.'); }
    };

    const deleteEvent = async (id: string) => {
        if (!confirm('Delete this event?')) return;
        const res = await fetch('/api/admin?action=events', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        if (res.status === 401) { window.location.assign('/admin/login'); return; }
        await fetchEvents();
    };

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Events Management</h1>
                    <p className={styles.pageSubtitle}>Schedule, update, and showcase your community events.</p>
                </div>
                {!showForm && (
                    <button className={styles.createBtn} onClick={handleAddNew}>
                        <PlusCircle size={20} />
                        <span>Create Event</span>
                    </button>
                )}
            </div>

            {error && (
                <div className={styles.errorBanner}>
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {showForm ? (
                <div className={styles.formContainer}>
                    <div className={styles.formHeader}>
                        <h2>{editId ? 'Edit Event' : 'New Event Details'}</h2>
                        <button className={styles.closeForm} onClick={() => setShowForm(false)}><X size={24} /></button>
                    </div>
                    
                    <form className={styles.eventForm} onSubmit={saveEvent}>
                        <div className={styles.formSection}>
                            <div className={styles.formGrid}>
                                <div className={styles.inputField}>
                                    <label><Calendar size={14} /> Event Title</label>
                                    <input type="text" required placeholder="e.g. Education Drive 2025" value={formData.title} onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} />
                                </div>
                                <div className={styles.inputField}>
                                    <label><Clock size={14} /> Event Date</label>
                                    <input type="date" required value={formData.event_date} onChange={e => setFormData(prev => ({ ...prev, event_date: e.target.value }))} />
                                </div>
                                <div className={styles.inputFieldFull}>
                                    <label><MapPin size={14} /> Location</label>
                                    <input type="text" placeholder="e.g. Kampala Central Square" value={formData.location} onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))} />
                                </div>
                                <div className={styles.inputFieldFull}>
                                    <label>Description</label>
                                    <textarea rows={4} required placeholder="Tell the community about this event..." value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} />
                                </div>
                            </div>
                        </div>

                        <div className={styles.formSection}>
                            <h3 className={styles.sectionTitle}>Goals & Status</h3>
                            <div className={styles.formGrid}>
                                <div className={styles.inputField}>
                                    <label><Target size={14} /> Funding Goal (UGX)</label>
                                    <input type="number" placeholder="5,000,000" value={formData.goal_amount} onChange={e => setFormData(prev => ({ ...prev, goal_amount: e.target.value }))} />
                                </div>
                                <div className={styles.inputField}>
                                    <label>Status</label>
                                    <select value={formData.status} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as any }))}>
                                        <option value="upcoming">Upcoming</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <div className={styles.inputFieldFull}>
                                    <label><LinkIcon size={14} /> Donation Link</label>
                                    <input type="url" placeholder="https://flutterwave.com/pay/..." value={formData.donation_link} onChange={e => setFormData(prev => ({ ...prev, donation_link: e.target.value }))} />
                                </div>
                            </div>
                        </div>

                        <div className={styles.formSection}>
                            <h3 className={styles.sectionTitle}>Media & Coverage</h3>
                            <div className={styles.mediaUploadArea}>
                                <div className={styles.coverUpload}>
                                    <div className={styles.coverPreview}>
                                        {formData.cover_image ? (
                                            <img src={formData.cover_image} alt="Preview" />
                                        ) : (
                                            <div className={styles.imagePlaceholder}><ImageIcon size={48} /></div>
                                        )}
                                    </div>
                                    <div className={styles.uploadControls}>
                                        <button type="button" className={styles.uploadBtn} onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}>
                                            {uploadingImage ? <Loader2 size={16} className={styles.spin} /> : <UploadCloud size={16} />}
                                            {formData.cover_image ? 'Replace Cover' : 'Upload Cover'}
                                        </button>
                                        <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />
                                        <p className={styles.uploadHint}>JPG or PNG. Max 5MB.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {formData.status === 'completed' && (
                            <div className={`${styles.formSection} ${styles.highlightSection}`}>
                                <h3 className={styles.sectionTitle}>Post-Event Achievements</h3>
                                <div className={styles.inputFieldFull}>
                                    <textarea rows={4} placeholder="Describe the impact achieved..." value={formData.achievements} onChange={e => setFormData(prev => ({ ...prev, achievements: e.target.value }))} />
                                </div>
                                
                                {editId && (
                                    <div className={styles.galleryArea}>
                                        <div className={styles.galleryHeader}>
                                            <h4>Event Gallery ({gallery.length})</h4>
                                            <button type="button" className={styles.addGalleryBtn} onClick={() => galleryInputRef.current?.click()} disabled={uploadingGallery}>
                                                {uploadingGallery ? <Loader2 size={14} className={styles.spin} /> : <PlusCircle size={14} />}
                                                Add Photos
                                            </button>
                                            <input type="file" accept="image/*" ref={galleryInputRef} style={{ display: 'none' }} onChange={handleGalleryUpload} />
                                        </div>
                                        <div className={styles.galleryGrid}>
                                            {gallery.map(img => (
                                                <div key={img.id} className={styles.galleryItem}>
                                                    <img src={img.url} alt="Gallery" />
                                                    <button type="button" className={styles.removeImg} onClick={() => deleteGalleryImage(img.id)}><X size={12} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className={styles.formActions}>
                            <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>Discard</button>
                            <button type="submit" className={styles.saveBtn} disabled={uploadingImage || uploadingGallery}>
                                {editId ? 'Update Event' : 'Publish Event'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className={styles.eventsGrid}>
                    {loading ? (
                        <div className={styles.loadingState}>
                            <Loader2 size={40} className={styles.spin} />
                            <p>Loading events...</p>
                        </div>
                    ) : events.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}><Calendar size={48} /></div>
                            <h3>No events yet</h3>
                            <p>Start by creating your first community event.</p>
                            <button className={styles.emptyAction} onClick={handleAddNew}>Add New Event</button>
                        </div>
                    ) : (
                        events.map(event => (
                            <div key={event.id} className={styles.eventCard}>
                                <div className={styles.cardImage}>
                                    {event.cover_image ? <img src={event.cover_image} alt={event.title} /> : <div className={styles.noImage}><ImageIcon size={32} /></div>}
                                    <div className={`${styles.statusBadge} ${styles[event.status]}`}>
                                        {event.status === 'upcoming' && <Clock size={12} />}
                                        {event.status === 'completed' && <CheckCircle2 size={12} />}
                                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                    </div>
                                </div>
                                <div className={styles.cardContent}>
                                    <div className={styles.cardMeta}>
                                        <span className={styles.cardDate}>{formatDate(event.event_date)}</span>
                                        {event.location && (
                                            <span className={styles.cardLocation}>
                                                <MapPin size={12} /> {event.location.split(',')[0]}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className={styles.cardTitle}>{event.title}</h3>
                                    <p className={styles.cardDesc}>{event.description?.slice(0, 80)}...</p>
                                    
                                    <div className={styles.cardFooter}>
                                        <div className={styles.cardGoal}>
                                            <Target size={14} />
                                            <span>{event.goal_amount > 0 ? `UGX ${Number(event.goal_amount).toLocaleString()}` : event.goal_text || 'No goal set'}</span>
                                        </div>
                                        <div className={styles.cardActions}>
                                            <button className={styles.editIcon} onClick={() => handleEdit(event)} title="Edit"><Edit2 size={18} /></button>
                                            <button className={styles.deleteIcon} onClick={() => deleteEvent(event.id)} title="Delete"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
