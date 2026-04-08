"use client";
import Image from "next/image";

import { useEffect, useState, useRef } from 'react';
import { PlusCircle, Edit2, Trash2, Image as ImageIcon, Loader2, UploadCloud, X } from 'lucide-react';
import { formatDate, safeDate } from '@/lib/utils';
import styles from './events.module.css';

type GalleryImage = {
    id: string;
    url: string;
    description: string;
};

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
    donation_link?: string;
};

export default function AdminEvents() {
    const [showForm, setShowForm] = useState(false);
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Gallery state
    const [gallery, setGallery] = useState<GalleryImage[]>([]);
    const [uploadingGallery, setUploadingGallery] = useState(false);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    // Edit state
    const [editId, setEditId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        event_date: '',
        location: '',
        goal_amount: '',
        goal_text: '',
        donation_link: '',
        status: 'upcoming',
        cover_image: '',
        achievements: '',
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/admin/events', { cache: 'no-store' });
            if (res.status === 401) {
                window.location.assign('/admin/login');
                return;
            }
            const data = await res.json();
            if (res.ok) {
                setEvents(data.events || []);
                setError(null);
                return;
            }
            setError(data.error || 'Failed to load events.');
        } catch {
            setError('Network error while loading events.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchGallery = async (eventId: string) => {
        try {
            const res = await fetch('/api/admin/media', { cache: 'no-store' });
            if (!res.ok) return;
            const data = await res.json();
            const photos = (data.media || []).filter((m: { event_id: string }) => m.event_id === eventId);
            setGallery(photos);
        } catch {
            setGallery([]);
        }
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
            achievements: ev.achievements || '',
        });
        setGallery([]);
        if (ev.status === 'completed') fetchGallery(ev.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAddNew = () => {
        setEditId(null);
        setFormData({
            title: '',
            description: '',
            event_date: '',
            location: '',
            goal_amount: '',
            goal_text: '',
            donation_link: '',
            status: 'upcoming',
            cover_image: '',
            achievements: '',
        });
        setGallery([]);
        setShowForm(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setUploadingImage(true);

        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('description', `Cover image for event: ${formData.title || 'Untitled'}`);

        try {
            const res = await fetch('/api/admin/media', {
                method: 'POST',
                body: uploadData,
            });
            const data = await res.json();
            if (res.ok && data.media?.url) {
                setFormData(prev => ({ ...prev, cover_image: data.media.url }));
            } else {
                alert(data.error || 'Failed to upload image.');
            }
        } catch (error) {
            console.error(error);
            alert('Upload error');
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editId || !e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setUploadingGallery(true);

        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('description', `Gallery photo — ${formData.title}`);
        uploadData.append('event_id', editId);

        try {
            const res = await fetch('/api/admin/media', { method: 'POST', body: uploadData });
            const data = await res.json();
            if (res.ok && data.media) {
                setGallery(prev => [...prev, data.media]);
            } else {
                alert(data.error || 'Failed to upload gallery image.');
            }
        } catch {
            alert('Upload error');
        } finally {
            setUploadingGallery(false);
            if (galleryInputRef.current) galleryInputRef.current.value = '';
        }
    };

    const deleteGalleryImage = async (mediaId: string) => {
        if (!confirm('Remove this photo from the gallery?')) return;
        try {
            const res = await fetch('/api/admin/media', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: mediaId }),
            });
            if (res.ok) {
                setGallery(prev => prev.filter(g => g.id !== mediaId));
            } else {
                const data = await res.json().catch(() => ({}));
                alert(data.error || 'Failed to delete image.');
            }
        } catch {
            alert('Network error.');
        }
    };

    const saveEvent = async (e: React.FormEvent) => {
        e.preventDefault();

        const method = editId ? 'PATCH' : 'POST';
        const body = {
            ...formData,
            goal_amount: formData.goal_amount ? Number(formData.goal_amount) : 0,
            ...(editId && { id: editId })
        };

        try {
            const res = await fetch('/api/admin/events', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.status === 401) {
                window.location.assign('/admin/login');
                return;
            }

            if (res.ok) {
                setShowForm(false);
                setEditId(null);
                setGallery([]);
                setFormData({ title: '', description: '', event_date: '', location: '', goal_amount: '', goal_text: '', donation_link: '', status: 'upcoming', cover_image: '', achievements: '' });
                setError(null);
                await fetchEvents();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to save event.');
            }
        } catch {
            alert('Network error while saving event.');
        }
    };

    const toggleStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/events', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus }),
            });
            if (res.status === 401) {
                window.location.assign('/admin/login');
                return;
            }
            if (!res.ok) {
                const data = await res.json().catch(() => ({ error: 'Failed to update event status.' }));
                alert(data.error || 'Failed to update event status.');
            }
            await fetchEvents();
        } catch {
            alert('Network error while updating status.');
        }
    };

    const deleteEvent = async (id: string) => {
        if (!confirm('Delete this event?')) return;
        try {
            const res = await fetch('/api/admin/events', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (res.status === 401) {
                window.location.assign('/admin/login');
                return;
            }
            if (!res.ok) {
                const data = await res.json().catch(() => ({ error: 'Failed to delete event.' }));
                alert(data.error || 'Failed to delete event.');
            }
            await fetchEvents();
        } catch {
            alert('Network error while deleting event.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Events Management</h1>
                    <p className={styles.subtitle}>Create events, upload cover images, and manage achievements.</p>
                    {error && <p className={styles.subtitle}>{error}</p>}
                </div>
                <button className={styles.createBtn} onClick={handleAddNew}>
                    <PlusCircle size={20} /> New Event
                </button>
            </div>

            {showForm && (
                <div className={styles.formCard}>
                    <h2>{editId ? 'Edit Event' : 'Create New Event'}</h2>
                    <form className={styles.form} onSubmit={saveEvent}>
                        {/* Row 1: title + date */}
                        <div className={styles.formRow}>
                            <div className={styles.inputGroup}>
                                <label>Event Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Annual Empowerment Gala"
                                    value={formData.title}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Event Date</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.event_date}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, event_date: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div className={styles.inputGroup}>
                            <label>Location</label>
                            <input
                                type="text"
                                placeholder="e.g. Kiburara Community Hall, Ibanda District"
                                value={formData.location}
                                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                            />
                        </div>

                        {/* Description */}
                        <div className={styles.inputGroup}>
                            <label>Description</label>
                            <textarea
                                rows={4}
                                required
                                placeholder="What is this event about? Who is it for? What will happen?"
                                value={formData.description}
                                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                            />
                        </div>

                        {/* Row 2: goal amount + goal text */}
                        <div className={styles.formRow}>
                            <div className={styles.inputGroup}>
                                <label>Funding Goal (UGX) — optional</label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="e.g. 5000000 (leave blank if not fundraising)"
                                    value={formData.goal_amount}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, goal_amount: e.target.value }))}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Goal / Target — optional text</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 50 girls trained, 200 sanitary kits distributed"
                                    value={formData.goal_text}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, goal_text: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* Row 3: status + donation link */}
                        <div className={styles.formRow}>
                            <div className={styles.inputGroup}>
                                <label>Event Status</label>
                                <select
                                    className={styles.statusSelect}
                                    value={formData.status}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                                    style={{ padding: '1rem', width: '100%' }}
                                >
                                    <option value="upcoming">Upcoming</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label>External Donation Link — optional</label>
                                <input
                                    type="url"
                                    placeholder="https://give.example.com/event"
                                    value={formData.donation_link}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, donation_link: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* Cover Image Upload */}
                        <div className={styles.inputGroup} style={{ border: '1px dashed var(--border-color)', padding: '1.5rem', borderRadius: '12px' }}>
                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Cover Image</span>
                                <button
                                    type="button"
                                    className={styles.iconBtn}
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadingImage}
                                >
                                    {uploadingImage ? <Loader2 size={16} className="spin" /> : <ImageIcon size={16} />}
                                    <span style={{ marginLeft: '8px' }}>{formData.cover_image ? 'Change Image' : 'Upload Image'}</span>
                                </button>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleImageUpload}
                            />
                            {formData.cover_image && (
                                <div style={{ marginTop: '1rem', position: 'relative', height: '180px', borderRadius: '8px', overflow: 'hidden' }}>
                                    <Image src={formData.cover_image} alt="Cover Preview" fill style={{ objectFit: 'cover' }} />
                                </div>
                            )}
                        </div>

                        {/* Achievements — completed events */}
                        {formData.status === 'completed' && (
                            <div className={styles.inputGroup} style={{ background: 'rgba(76, 175, 80, 0.05)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #4caf50' }}>
                                <label>Achievements (Completed Event)</label>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Describe what was accomplished at this event.</p>
                                <textarea
                                    rows={4}
                                    placeholder="We successfully raised 10 million UGX and built a new Rise Room..."
                                    value={formData.achievements}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, achievements: e.target.value }))}
                                    style={{ background: 'var(--bg-color)' }}
                                />
                            </div>
                        )}

                        {/* Gallery upload — only when editing a completed event */}
                        {editId && formData.status === 'completed' && (
                            <div className={styles.inputGroup} style={{ border: '1px dashed var(--border-color)', padding: '1.5rem', borderRadius: '12px' }}>
                                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <span>Event Gallery ({gallery.length} photos)</span>
                                    <button
                                        type="button"
                                        className={styles.iconBtn}
                                        onClick={() => galleryInputRef.current?.click()}
                                        disabled={uploadingGallery}
                                    >
                                        {uploadingGallery ? <Loader2 size={16} className="spin" /> : <UploadCloud size={16} />}
                                        <span style={{ marginLeft: '8px' }}>Add Photo</span>
                                    </button>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={galleryInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleGalleryUpload}
                                />
                                {gallery.length > 0 && (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
                                        {gallery.map(img => (
                                            <div key={img.id} style={{ position: 'relative', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
                                                <Image src={img.url} alt="gallery" fill style={{ objectFit: 'cover' }} />
                                                <button
                                                    type="button"
                                                    onClick={() => deleteGalleryImage(img.id)}
                                                    style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
                                                    aria-label="Remove photo"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {gallery.length === 0 && !uploadingGallery && (
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No gallery photos yet. Upload photos from this event.</p>
                                )}
                            </div>
                        )}

                        <div className={styles.formActions}>
                            <button type="button" onClick={() => { setShowForm(false); setEditId(null); setGallery([]); }} className={styles.cancelBtn}>Cancel</button>
                            <button type="submit" className={styles.submitBtn} disabled={uploadingImage || uploadingGallery}>
                                {editId ? 'Update Event' : 'Save Event'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Cover</th>
                            <th>Event Title</th>
                            <th>Date</th>
                            <th>Location</th>
                            <th>Goal</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading && events.length === 0 && (
                            <tr>
                                <td colSpan={7}>No events found.</td>
                            </tr>
                        )}
                        {events.map(ev => (
                            <tr key={ev.id}>
                                <td>
                                    {ev.cover_image ? (
                                        <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                                            <Image src={ev.cover_image} alt="cover" fill style={{ objectFit: 'cover' }} />
                                        </div>
                                    ) : (
                                        <div style={{ width: '50px', height: '50px', borderRadius: '8px', background: 'var(--card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                            <ImageIcon size={20} />
                                        </div>
                                    )}
                                </td>
                                <td className={styles.cellTitle}>{ev.title}</td>
                                <td>{formatDate(ev.event_date)}</td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{ev.location || '—'}</td>
                                <td>
                                    {ev.goal_amount > 0 ? `UGX ${Number(ev.goal_amount).toLocaleString()}` : ev.goal_text || '—'}
                                </td>
                                <td>
                                    <select
                                        value={ev.status}
                                        onChange={(e) => toggleStatus(ev.id, e.target.value)}
                                        className={`${styles.statusSelect} ${styles[ev.status]}`}
                                    >
                                        <option value="upcoming">Upcoming</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td>
                                    <div className={styles.actionRow}>
                                        <button className={styles.iconBtn} aria-label="Edit" onClick={() => handleEdit(ev)}><Edit2 size={16} /></button>
                                        <button className={styles.iconBtnThreat} aria-label="Delete" onClick={() => deleteEvent(ev.id)}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


type EventItem = {
    id: string;
    title: string;
    description: string;
    event_date: string;
    goal_amount: number;
    current_amount: number;
    status: 'upcoming' | 'completed' | 'cancelled';
    cover_image?: string;
    achievements?: string;
};

export default function AdminEvents() {
    const [showForm, setShowForm] = useState(false);
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Edit state
    const [editId, setEditId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        event_date: '',
        goal_amount: '',
        status: 'upcoming',
        cover_image: '',
        achievements: '',
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/admin/events', { cache: 'no-store' });
            if (res.status === 401) {
                window.location.assign('/admin/login');
                return;
            }
            const data = await res.json();
            if (res.ok) {
                setEvents(data.events || []);
                setError(null);
                return;
            }
            setError(data.error || 'Failed to load events.');
        } catch {
            setError('Network error while loading events.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleEdit = (ev: EventItem) => {
        setEditId(ev.id);
        setFormData({
            title: ev.title,
            description: ev.description || '',
            event_date: safeDate(ev.event_date).toISOString().split('T')[0], // format for date input
            goal_amount: ev.goal_amount.toString(),
            status: ev.status,
            cover_image: ev.cover_image || '',
            achievements: ev.achievements || '',
        });
        setShowForm(true);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAddNew = () => {
        setEditId(null);
        setFormData({
            title: '',
            description: '',
            event_date: '',
            goal_amount: '',
            status: 'upcoming',
            cover_image: '',
            achievements: '',
        });
        setShowForm(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setUploadingImage(true);

        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('description', `Cover image for event: ${formData.title || 'Untitled'}`);

        try {
            const res = await fetch('/api/admin/media', {
                method: 'POST',
                body: uploadData,
            });
            const data = await res.json();
            if (res.ok && data.media?.url) {
                setFormData(prev => ({ ...prev, cover_image: data.media.url }));
            } else {
                alert(data.error || 'Failed to upload image.');
            }
        } catch (error) {
            console.error(error);
            alert('Upload error');
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const saveEvent = async (e: React.FormEvent) => {
        e.preventDefault();

        const method = editId ? 'PATCH' : 'POST';
        const body = {
            ...formData,
            goal_amount: Number(formData.goal_amount),
            ...(editId && { id: editId })
        };

        try {
            const res = await fetch('/api/admin/events', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.status === 401) {
                window.location.assign('/admin/login');
                return;
            }

            if (res.ok) {
                setShowForm(false);
                setEditId(null);
                setFormData({ title: '', description: '', event_date: '', goal_amount: '', status: 'upcoming', cover_image: '', achievements: '' });
                setError(null);
                await fetchEvents();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to save event.');
            }
        } catch {
            alert('Network error while saving event.');
        }
    };

    const toggleStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/events', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus }),
            });
            if (res.status === 401) {
                window.location.assign('/admin/login');
                return;
            }
            if (!res.ok) {
                const data = await res.json().catch(() => ({ error: 'Failed to update event status.' }));
                alert(data.error || 'Failed to update event status.');
            }
            await fetchEvents();
        } catch {
            alert('Network error while updating status.');
        }
    };

    const deleteEvent = async (id: string) => {
        if (!confirm('Delete this event?')) return;
        try {
            const res = await fetch('/api/admin/events', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (res.status === 401) {
                window.location.assign('/admin/login');
                return;
            }
            if (!res.ok) {
                const data = await res.json().catch(() => ({ error: 'Failed to delete event.' }));
                alert(data.error || 'Failed to delete event.');
            }
            await fetchEvents();
        } catch {
            alert('Network error while deleting event.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Events Management</h1>
                    <p className={styles.subtitle}>Create events, upload cover images, and manage achievements.</p>
                    {error && <p className={styles.subtitle}>{error}</p>}
                </div>
                <button className={styles.createBtn} onClick={handleAddNew}>
                    <PlusCircle size={20} /> New Event
                </button>
            </div>

            {showForm && (
                <div className={styles.formCard}>
                    <h2>{editId ? 'Edit Event' : 'Create New Event'}</h2>
                    <form className={styles.form} onSubmit={saveEvent}>
                        <div className={styles.formRow}>
                            <div className={styles.inputGroup}>
                                <label>Event Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Annual Gala"
                                    value={formData.title}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Event Date</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.event_date}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, event_date: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Description (Goal of the Event)</label>
                            <textarea
                                rows={3}
                                required
                                placeholder="What is this event for?"
                                value={formData.description}
                                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                            />
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.inputGroup}>
                                <label>Funding Goal (UGX)</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="e.g. 5000000"
                                    value={formData.goal_amount}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, goal_amount: e.target.value }))}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Event Status</label>
                                <select
                                    className={styles.statusSelect}
                                    value={formData.status}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                                    style={{ padding: '1rem', width: '100%' }}
                                >
                                    <option value="upcoming">Upcoming</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        {/* Cover Image Upload */}
                        <div className={styles.inputGroup} style={{ border: '1px dashed var(--border-color)', padding: '1.5rem', borderRadius: '12px' }}>
                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Cover Image</span>
                                <button
                                    type="button"
                                    className={styles.iconBtn}
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadingImage}
                                >
                                    {uploadingImage ? <Loader2 size={16} className="spin" /> : <ImageIcon size={16} />}
                                    <span style={{ marginLeft: '8px' }}>{formData.cover_image ? 'Change Image' : 'Upload Image'}</span>
                                </button>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleImageUpload}
                            />
                            {formData.cover_image && (
                                <div style={{ marginTop: '1rem', height: '150px', borderRadius: '8px', overflow: 'hidden' }}>
                                    <Image src={formData.cover_image} alt="Cover Preview" fill style={{ objectFit: 'cover' }} />
                                </div>
                            )}
                        </div>

                        {/* Achievements - Only strictly relevant if completed, but we can allow writing them beforehand */}
                        {formData.status === 'completed' && (
                            <div className={styles.inputGroup} style={{ background: 'rgba(76, 175, 80, 0.05)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #4caf50' }}>
                                <label>Achievements (Completed Event)</label>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Write about the achievements that were accomplished in this event.</p>
                                <textarea
                                    rows={4}
                                    placeholder="We successfully raised 10 million UGX and built a new Rise Room..."
                                    value={formData.achievements}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, achievements: e.target.value }))}
                                    style={{ background: 'var(--bg-color)' }}
                                />
                            </div>
                        )}

                        <div className={styles.formActions}>
                            <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className={styles.cancelBtn}>Cancel</button>
                            <button type="submit" className={styles.submitBtn} disabled={uploadingImage}>
                                {editId ? 'Update Event' : 'Save Event'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Cover</th>
                            <th>Event Title</th>
                            <th>Date</th>
                            <th>Goal (UGX)</th>
                            <th>Raised (UGX)</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading && events.length === 0 && (
                            <tr>
                                <td colSpan={7}>No events found.</td>
                            </tr>
                        )}
                        {events.map(ev => (
                            <tr key={ev.id}>
                                <td>
                                    {ev.cover_image ? (
                                        <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden' }}>
                                            <Image src={ev.cover_image} alt="cover" fill style={{ objectFit: 'cover' }} />
                                        </div>
                                    ) : (
                                        <div style={{ width: '50px', height: '50px', borderRadius: '8px', background: 'var(--card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                            <ImageIcon size={20} />
                                        </div>
                                    )}
                                </td>
                                <td className={styles.cellTitle}>{ev.title}</td>
                                <td>{formatDate(ev.event_date)}</td>
                                <td>{Number(ev.goal_amount || 0).toLocaleString()}</td>
                                <td className={styles.cellRaised}>{Number(ev.current_amount || 0).toLocaleString()}</td>
                                <td>
                                    <select
                                        value={ev.status}
                                        onChange={(e) => toggleStatus(ev.id, e.target.value)}
                                        className={`${styles.statusSelect} ${styles[ev.status]}`}
                                    >
                                        <option value="upcoming">Upcoming</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td>
                                    <div className={styles.actionRow}>
                                        <button className={styles.iconBtn} aria-label="Edit" onClick={() => handleEdit(ev)}><Edit2 size={16} /></button>
                                        <button className={styles.iconBtnThreat} aria-label="Delete" onClick={() => deleteEvent(ev.id)}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
}
