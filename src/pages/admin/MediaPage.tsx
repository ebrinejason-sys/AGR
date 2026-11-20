import { useEffect, useState } from 'react';
import { Trash2, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getMediaTypeForUpload, MAX_MEDIA_FILE_BYTES } from '@/lib/media';
import styles from './MediaPage.module.css';

type MediaItem = {
    id: string; url: string; type: 'image' | 'video'; description: string | null;
    event_id?: string | null; created_at?: string;
    events?: { id: string; title: string; status: 'upcoming' | 'completed' | 'cancelled' } | null;
};

export default function AdminMediaPage() {
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [items, setItems] = useState<MediaItem[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [events, setEvents] = useState<{ id: string; title: string }[]>([]);
    const [eventId, setEventId] = useState('');
    const [error, setError] = useState<string | null>(null);

    const fetchMedia = async () => {
        try {
            const res = await fetch('/api/admin/media', { cache: 'no-store' });
            if (res.status === 401) { window.location.assign('/admin/login'); return; }
            const data = await res.json();
            if (res.ok) { setItems(data.media || []); setError(null); }
            else setError(data.error || 'Failed to fetch media items.');
        } catch { setError('Network error while fetching media items.'); }
    };

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/admin?action=events');
            if (res.status === 401) { window.location.assign('/admin/login'); return; }
            const data = await res.json();
            if (res.ok && data.events) setEvents(data.events);
        } catch { /* silent */ }
    };

    useEffect(() => { fetchMedia(); fetchEvents(); }, []);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) { alert('Please choose a file.'); return; }
        setUploading(true);
        try {
            const mediaType = getMediaTypeForUpload(selectedFile.name, selectedFile.type);
            if (!mediaType) {
                alert('Unsupported file. Allowed: JPEG, PNG, GIF, WebP, AVIF images and MP4, WebM, OGG, MOV videos.');
                return;
            }
            if (selectedFile.size > MAX_MEDIA_FILE_BYTES) {
                alert('File too large. Maximum upload size is 25 MB.');
                return;
            }

            const prepareResponse = await fetch('/api/admin/media', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'prepare',
                    fileName: selectedFile.name,
                    contentType: selectedFile.type,
                    size: selectedFile.size,
                }),
                cache: 'no-store',
            });
            if (prepareResponse.status === 401) { window.location.assign('/admin/login'); return; }
            const prepareData = await prepareResponse.json().catch(() => ({}));
            if (!prepareResponse.ok) {
                alert(prepareData.error || 'Unable to prepare upload.');
                return;
            }

            const { error: uploadError } = await supabase.storage
                .from(prepareData.bucket)
                .uploadToSignedUrl(prepareData.path, prepareData.token, selectedFile, {
                    contentType: selectedFile.type,
                });
            if (uploadError) {
                alert(`Storage upload failed: ${uploadError.message}`);
                return;
            }

            const completeResponse = await fetch('/api/admin/media', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'complete',
                    path: prepareData.path,
                    contentType: selectedFile.type,
                    description,
                    event_id: eventId || null,
                }),
                cache: 'no-store',
            });
            if (completeResponse.status === 401) { window.location.assign('/admin/login'); return; }
            const completeData = await completeResponse.json().catch(() => ({}));
            if (!completeResponse.ok) {
                alert(completeData.error || 'Unable to add uploaded file to the media library.');
                return;
            }

            setDescription('');
            setSelectedFile(null);
            setEventId('');
            await fetchMedia();
        } catch {
            alert('Network error while uploading media.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (item: MediaItem) => {
        if (!confirm('Remove this file from the media library and the public site?')) return;
        setDeletingId(item.id);
        try {
            const res = await fetch('/api/admin/media', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: item.id }),
                cache: 'no-store',
            });
            if (res.status === 401) { window.location.assign('/admin/login'); return; }
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                alert(data.error || 'Failed to delete media.');
                return;
            }
            setItems((current) => current.filter((entry) => entry.id !== item.id));
        } catch {
            alert('Network error while deleting media.');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Media Library</h1>
                <p className={styles.subtitle}>Upload images and videos for the public gallery. Deleting a file removes it from the site immediately.</p>
                {error && <p className={styles.subtitle}>{error}</p>}
            </div>
            <div className={styles.uploaderBox}>
                <h2>Upload New Media</h2>
                <form onSubmit={handleUpload} className={styles.uploadForm}>
                    <div className={styles.fileDrop}>
                        <Upload size={40} className={styles.uploadIcon} />
                        <p>{selectedFile ? selectedFile.name : 'Drag and drop or click to select a file (Image / Video, up to 25 MB)'}</p>
                        <input id="media-file" type="file" required title="Select image or video file" aria-label="Select image or video file" className={styles.fileInput} accept="image/*,video/*" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="media-description">Description (Optional, used as caption)</label>
                        <input id="media-description" type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Students inside the new Rise Room" />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="media-event">Associate with Event (Optional)</label>
                        <select id="media-event" title="Associate media with an event" value={eventId} onChange={e => setEventId(e.target.value)} className={styles.selectInput}>
                            <option value="">-- No Event --</option>
                            {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                        </select>
                    </div>
                    <button type="submit" className={styles.submitBtn} disabled={uploading}>{uploading ? 'Uploading...' : 'Upload File'}</button>
                </form>
            </div>
            <div className={styles.mediaGallery}>
                <h2>Existing Media</h2>
                {items.length === 0 ? (
                    <div className={styles.emptyState}>No media library items found.</div>
                ) : (
                    <div className={styles.mediaGrid}>
                        {items.map(item => (
                            <div key={item.id} className={styles.mediaCard}>
                                <div className={styles.previewWrap}>
                                    {item.type === 'image' ? (
                                        <img src={item.url} alt={item.description || 'Media item'} className={styles.previewImage} />
                                    ) : (
                                        <video src={item.url} controls playsInline className={styles.previewImage} />
                                    )}
                                    <button
                                        type="button"
                                        className={styles.deleteBtn}
                                        onClick={() => handleDelete(item)}
                                        disabled={deletingId === item.id}
                                        aria-label={`Delete ${item.description || 'media item'}`}
                                    >
                                        <Trash2 size={16} />
                                        {deletingId === item.id ? 'Removing…' : 'Delete'}
                                    </button>
                                </div>
                                <p>{item.description || 'No description'}</p>
                                {item.events?.title && <p className={styles.mediaMeta}>Event: {item.events.title} ({item.events.status})</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
