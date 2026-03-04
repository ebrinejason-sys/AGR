"use client";

import { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import styles from './media.module.css';

type MediaItem = {
    id: string;
    url: string;
    type: 'image' | 'video';
    description: string | null;
    event_id?: string | null;
    created_at?: string;
    events?: {
        id: string;
        title: string;
        status: 'upcoming' | 'completed' | 'cancelled';
    } | null;
};

export default function AdminMedia() {

    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [items, setItems] = useState<MediaItem[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [events, setEvents] = useState<{ id: string, title: string }[]>([]);
    const [eventId, setEventId] = useState('');

    const fetchMedia = async () => {
        try {
            const res = await fetch('/api/admin/media', { cache: 'no-store' });
            const data = await res.json();
            if (res.ok) {
                setItems(data.media || []);
                return;
            }
            alert(data.error || 'Failed to fetch media items.');
        } catch {
            alert('Network error while fetching media items.');
        }
    };

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/admin/events', { cache: 'no-store' });
            const data = await res.json();
            if (res.ok && data.events) {
                setEvents(data.events);
                return;
            }
            alert(data.error || 'Failed to fetch events.');
        } catch {
            alert('Network error while fetching events.');
        }
    };

    useEffect(() => {
        fetchMedia();
        fetchEvents();
    }, []);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            alert('Please choose a file.');
            return;
        }
        setUploading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('description', description);
        if (eventId) formData.append('event_id', eventId);

        const res = await fetch('/api/admin/media', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
            alert(data.error || 'Upload failed.');
            setUploading(false);
            return;
        }

        setUploading(false);
        setDescription('');
        setSelectedFile(null);
        setEventId('');
        await fetchMedia();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Media Library</h1>
                <p className={styles.subtitle}>Upload images and videos with descriptions for the public gallery.</p>
            </div>

            <div className={styles.uploaderBox}>
                <h2>Upload New Media</h2>
                <form onSubmit={handleUpload} className={styles.uploadForm}>

                    <div className={styles.fileDrop}>
                        <Upload size={40} className={styles.uploadIcon} />
                        <p>{selectedFile ? selectedFile.name : 'Drag and drop or click to select a file (Image / Video)'}</p>
                        <input
                            id="media-file"
                            type="file"
                            required
                            title="Select image or video file"
                            aria-label="Select image or video file"
                            className={styles.fileInput}
                            accept="image/*,video/*"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="media-description">Description (Optional, used as caption)</label>
                        <input
                            id="media-description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Students inside the new Rise Room"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="media-event">Associate with Event (Optional)</label>
                        <select
                            id="media-event"
                            title="Associate media with an event"
                            value={eventId}
                            onChange={(e) => setEventId(e.target.value)}
                            className={styles.selectInput}
                        >
                            <option value="">-- No Event --</option>
                            {events.map(ev => (
                                <option key={ev.id} value={ev.id}>{ev.title}</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload File'}
                    </button>
                </form>
            </div>

            <div className={styles.mediaGallery}>
                <h2>Existing Media</h2>
                {items.length === 0 ? (
                    <div className={styles.emptyState}>No media library items found.</div>
                ) : (
                    <div className={styles.mediaGrid}>
                        {items.map((item) => (
                            <div key={item.id} className={styles.mediaCard}>
                                {item.type === 'image' ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={item.url} alt={item.description || 'Media item'} className={styles.previewImage} />
                                ) : (
                                    <video src={item.url} controls className={styles.previewImage} />
                                )}
                                <p>{item.description || 'No description'}</p>
                                {item.events?.title && (
                                    <p className={styles.mediaMeta}>
                                        Event: {item.events.title} ({item.events.status})
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
