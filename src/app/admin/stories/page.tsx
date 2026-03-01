"use client";

import { useState } from 'react';
import { PenTool } from 'lucide-react';
import styles from './stories.module.css';

export default function AdminStories() {
    const [formData, setFormData] = useState({ title: '', content: '' });
    const [publishing, setPublishing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPublishing(true);
        // In future, save to Supabase 'stories' table
        setTimeout(() => {
            alert("Story Published Successfully!");
            setPublishing(false);
            setFormData({ title: '', content: '' });
        }, 1500);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Stories Composer</h1>
                <p className={styles.subtitle}>Write and publish stories of resilience and transformation.</p>
            </div>

            <div className={styles.composerBox}>
                <h2><PenTool size={20} className={styles.icon} /> Write a New Story</h2>
                <form onSubmit={handleSubmit} className={styles.form}>

                    <div className={styles.inputGroup}>
                        <label>Story Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. My Journey from the Village"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Story Content</label>
                        <textarea
                            required
                            rows={15}
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Write the full story here..."
                        />
                    </div>

                    <button type="submit" className={styles.publishBtn} disabled={publishing}>
                        {publishing ? 'Publishing...' : 'Publish Story'}
                    </button>
                </form>
            </div>

            <div className={styles.publishedList}>
                <h2>Published Stories</h2>
                <div className={styles.emptyState}>No stories have been published yet.</div>
            </div>
        </div>
    );
}
