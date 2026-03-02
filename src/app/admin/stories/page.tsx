"use client";

import { useEffect, useState } from 'react';
import { PenTool } from 'lucide-react';
import styles from './stories.module.css';

type Story = {
    id: string;
    title: string;
    content: string;
    created_at: string;
};

export default function AdminStories() {
    const [formData, setFormData] = useState({ title: '', content: '' });
    const [publishing, setPublishing] = useState(false);
    const [stories, setStories] = useState<Story[]>([]);

    const fetchStories = async () => {
        const res = await fetch('/api/admin/stories', { cache: 'no-store' });
        const data = await res.json();
        if (res.ok) {
            setStories(data.stories || []);
        }
    };

    useEffect(() => {
        fetchStories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPublishing(true);

        const res = await fetch('/api/admin/stories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok) {
            alert(data.error || 'Failed to publish story.');
            setPublishing(false);
            return;
        }

        setPublishing(false);
        setFormData({ title: '', content: '' });
        await fetchStories();
    };

    const deleteStory = async (id: string) => {
        if (!confirm('Delete this story?')) return;
        await fetch('/api/admin/stories', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        await fetchStories();
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
                {stories.length === 0 ? (
                    <div className={styles.emptyState}>No stories have been published yet.</div>
                ) : (
                    <div className={styles.storyList}>
                        {stories.map((story) => (
                            <article key={story.id} className={styles.storyCard}>
                                <div>
                                    <h3>{story.title}</h3>
                                    <p>{story.content.slice(0, 180)}...</p>
                                </div>
                                <div className={styles.storyMeta}>
                                    <span>{new Date(story.created_at).toLocaleDateString()}</span>
                                    <button className={styles.deleteBtn} onClick={() => deleteStory(story.id)}>
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
