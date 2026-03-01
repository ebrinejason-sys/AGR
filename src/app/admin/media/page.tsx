"use client";

import { useState } from 'react';
import { Upload } from 'lucide-react';
import styles from './media.module.css';

export default function AdminMedia() {

    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        // Process File Upload via Supabase Storage here in the future
        setTimeout(() => {
            alert("Media Uploaded Successfully!");
            setUploading(false);
            setDescription('');
        }, 1500);
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
                        <p>Drag and drop or click to select a file (Image / Video)</p>
                        <input type="file" required className={styles.fileInput} accept="image/*,video/*" />
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
                <div className={styles.emptyState}>No media library items found.</div>
            </div>
        </div>
    );
}
