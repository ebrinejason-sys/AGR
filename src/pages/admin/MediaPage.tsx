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
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState('');
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
        if (selectedFiles.length === 0) { alert('Please choose at least one file.'); return; }
        const invalidFile = selectedFiles.find((file) => !getMediaTypeForUpload(file.name, file.type));
        if (invalidFile) {
            alert(`${invalidFile.name}: unsupported file. Allowed: JPEG, PNG, GIF, WebP, AVIF images and MP4, WebM, OGG, MOV videos.`);
            return;
        }
        const oversizedFile = selectedFiles.find((file) => file.size > MAX_MEDIA_FILE_BYTES);
        if (oversizedFile) {
            alert(`${oversizedFile.name}: file too large. Maximum upload size is 25 MB per file.`);
            return;
        }

        setUploading(true);
        const failedFiles: File[] = [];
        const failures: string[] = [];
        let uploadedCount = 0;

        try {
            for (const [index, file] of selectedFiles.entries()) {
                setUploadProgress(`Uploading ${index + 1} of ${selectedFiles.length}: ${file.name}`);
                try {
                    const prepareResponse = await fetch('/api/admin/media', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'prepare',
                            fileName: file.name,
                            contentType: file.type,
                            size: file.size,
                        }),
                        cache: 'no-store',
                    });
                    if (prepareResponse.status === 401) { window.location.assign('/admin/login'); return; }
                    const prepareData = await prepareResponse.json().catch(() => ({}));
                    if (!prepareResponse.ok) throw new Error(prepareData.error || 'Unable to prepare upload.');

                    const { error: uploadError } = await supabase.storage
                        .from(prepareData.bucket)
                        .uploadToSignedUrl(prepareData.path, prepareData.token, file, {
                            contentType: file.type,
                        });
                    if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);

                    const completeResponse = await fetch('/api/admin/media', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'complete',
                            path: prepareData.path,
                            contentType: file.type,
                            description,
                            event_id: eventId || null,
                        }),
                        cache: 'no-store',
                    });
                    if (completeResponse.status === 401) { window.location.assign('/admin/login'); return; }
                    const completeData = await completeResponse.json().catch(() => ({}));
                    if (!completeResponse.ok) throw new Error(completeData.error || 'Unable to add uploaded file to the media library.');

                    uploadedCount += 1;
                } catch (uploadError) {
                    failedFiles.push(file);
                    failures.push(`${file.name}: ${uploadError instanceof Error ? uploadError.message : 'Upload failed.'}`);
                }
            }

            setSelectedFiles(failedFiles);
            if (uploadedCount > 0) await fetchMedia();
            if (failures.length > 0) {
                alert(`Uploaded ${uploadedCount} of ${selectedFiles.length} files. These files failed:\n${failures.join('\n')}`);
            } else {
                setDescription('');
                setEventId('');
            }
        } finally {
            setUploading(false);
            setUploadProgress('');
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
                        <p>{selectedFiles.length ? `${selectedFiles.length} file${selectedFiles.length === 1 ? '' : 's'} selected: ${selectedFiles.map(file => file.name).join(', ')}` : 'Select one or more images or videos (up to 25 MB each)'}</p>
                        <input
                            id="media-file"
                            type="file"
                            required
                            multiple
                            title="Select one or more image or video files"
                            aria-label="Select one or more image or video files"
                            className={styles.fileInput}
                            accept="image/*,video/*"
                            onChange={e => setSelectedFiles(Array.from(e.target.files || []))}
                        />
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
                    <button type="submit" className={styles.submitBtn} disabled={uploading}>{uploading ? uploadProgress || 'Uploading...' : `Upload ${selectedFiles.length > 1 ? `${selectedFiles.length} Files` : 'File'}`}</button>
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
