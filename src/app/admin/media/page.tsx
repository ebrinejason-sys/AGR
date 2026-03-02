"use client";

import { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import styles from './media.module.css';

type MediaItem = {
    id: string;
    url: string;
    type: 'image' | 'video';
    description: string | null;
};

export default function AdminMedia() {

    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [items, setItems] = useState<MediaItem[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const fetchMedia = async () => {
        const res = await fetch('/api/admin/media', { cache: 'no-store' });
        const data = await res.json();
        if (res.ok) {
            setItems(data.media || []);
        }
    };

    useEffect(() => {
        fetchMedia();
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
                            type="file"
                            required
                            className={styles.fileInput}
                            accept="image/*,video/*"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Description (Optional, used as caption)</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Students inside the new Rise Room"
                        />
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
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
