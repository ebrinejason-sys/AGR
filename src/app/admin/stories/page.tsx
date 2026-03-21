"use client";

import { useEffect, useState, useMemo } from 'react';
import type { ComponentProps } from 'react';
import dynamic from 'next/dynamic';
import { PenTool } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import styles from './stories.module.css';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(
    async () => {
        const { default: RQ } = await import("react-quill-new");
        return function ForwardedQuill(props: ComponentProps<typeof RQ>) {
            return <RQ {...props} />;
        };
    },
    { ssr: false, loading: () => <p>Loading editor...</p> }
);

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

    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files ? input.files[0] : null;
            if (!file) return;

            const uploadData = new FormData();
            uploadData.append('file', file);
            uploadData.append('description', 'Story embedded image');

            try {
                const res = await fetch('/api/admin/media', {
                    method: 'POST',
                    body: uploadData
                });
                const data = await res.json();

                if (res.ok && data.media?.url) {
                    setFormData(prev => ({
                        ...prev,
                        content: prev.content + `<br/><img src="${data.media.url}" alt="embedded image" /><br/>`
                    }));
                } else {
                    alert(data.error || 'Upload failed');
                }
            } catch (err) {
                console.error('Image upload err:', err);
                alert('Error uploading story image');
            }
        };
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), []);

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
                        <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)' }}>
                            <ReactQuill
                                theme="snow"
                                value={formData.content}
                                onChange={(val: string) => setFormData({ ...formData, content: val })}
                                modules={modules}
                                placeholder="Write the full story here... Use the image button to upload media."
                            />
                        </div>
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
                                    <p>{story.content.replace(/<[^>]+>/g, '').slice(0, 180)}...</p>
                                </div>
                                <div className={styles.storyMeta}>
                                    <span>{formatDate(story.created_at)}</span>
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
