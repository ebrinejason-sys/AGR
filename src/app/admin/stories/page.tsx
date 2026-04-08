"use client";

import { useEffect, useState, useMemo, useRef } from 'react';
import type { ComponentProps } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { PenTool, Edit2, ImageIcon, Loader2 } from 'lucide-react';
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
    author: string;
    image_url?: string;
    created_at: string;
};

export default function AdminStories() {
    const [formData, setFormData] = useState({ title: '', author: '', content: '', image_url: '' });
    const [publishing, setPublishing] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [stories, setStories] = useState<Story[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [editId, setEditId] = useState<string | null>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const fetchStories = async () => {
        try {
            const res = await fetch('/api/admin/stories', { cache: 'no-store' });
            if (res.status === 401) {
                window.location.assign('/admin/login');
                return;
            }
            const data = await res.json();
            if (res.ok) {
                setStories(data.stories || []);
                setError(null);
                return;
            }
            setError(data.error || 'Failed to load stories.');
        } catch {
            setError('Network error while loading stories.');
        }
    };

    useEffect(() => {
        fetchStories();
    }, []);

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;
        const file = e.target.files[0];
        setUploadingCover(true);

        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('description', `Cover image for story: ${formData.title || 'Untitled'}`);

        try {
            const res = await fetch('/api/admin/media', { method: 'POST', body: uploadData });
            const data = await res.json();
            if (res.ok && data.media?.url) {
                setFormData(prev => ({ ...prev, image_url: data.media.url }));
            } else {
                alert(data.error || 'Failed to upload cover image.');
            }
        } catch {
            alert('Upload error');
        } finally {
            setUploadingCover(false);
            if (coverInputRef.current) coverInputRef.current.value = '';
        }
    };

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
                [{ 'header': [1, 2, 3, 4, false] }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'align': [] }],
                [{ 'color': [] }, { 'background': [] }],
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

        const method = editId ? 'PUT' : 'POST';
        const body = editId
            ? JSON.stringify({ id: editId, ...formData })
            : JSON.stringify(formData);

        const res = await fetch('/api/admin/stories', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body,
        });

        if (res.status === 401) {
            window.location.assign('/admin/login');
            return;
        }

        const data = await res.json();
        if (!res.ok) {
            alert(data.error || (editId ? 'Failed to update story.' : 'Failed to publish story.'));
            setPublishing(false);
            return;
        }

        setPublishing(false);
        setFormData({ title: '', author: '', content: '', image_url: '' });
        setEditId(null);
        await fetchStories();
    };

    const startEdit = (story: Story) => {
        setEditId(story.id);
        setFormData({ title: story.title, author: story.author || '', content: story.content, image_url: story.image_url || '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditId(null);
        setFormData({ title: '', author: '', content: '', image_url: '' });
    };

    const deleteStory = async (id: string) => {
        if (!confirm('Delete this story?')) return;
        const res = await fetch('/api/admin/stories', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        if (res.status === 401) {
            window.location.assign('/admin/login');
            return;
        }
        if (!res.ok) {
            const data = await res.json().catch(() => ({ error: 'Failed to delete story.' }));
            alert(data.error || 'Failed to delete story.');
            return;
        }
        await fetchStories();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Stories Composer</h1>
                <p className={styles.subtitle}>Write and publish stories of resilience and transformation.</p>
                {error && <p className={styles.subtitle}>{error}</p>}
            </div>

            <div className={styles.composerBox}>
                <h2>
                    <PenTool size={20} className={styles.icon} />
                    {editId ? 'Edit Story' : 'Write a New Story'}
                </h2>
                {editId && (
                    <p className={styles.editNotice}>
                        Editing existing story — save to update it.
                    </p>
                )}
                <form onSubmit={handleSubmit} className={styles.form}>

                    {/* Row: Title + Author */}
                    <div className={styles.formRow}>
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
                            <label>Author Name</label>
                            <input
                                type="text"
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                placeholder="e.g. Grace Akatwijuka"
                            />
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className={styles.inputGroup}>
                        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Cover / Featured Image</span>
                            <button
                                type="button"
                                className={styles.uploadBtn}
                                onClick={() => coverInputRef.current?.click()}
                                disabled={uploadingCover}
                            >
                                {uploadingCover ? <Loader2 size={14} className="spin" /> : <ImageIcon size={14} />}
                                <span>{formData.image_url ? 'Change Cover' : 'Upload Cover'}</span>
                            </button>
                        </label>
                        <input type="file" accept="image/*" ref={coverInputRef} style={{ display: 'none' }} onChange={handleCoverUpload} />
                        {formData.image_url && (
                            <div className={styles.coverPreview}>
                                <Image src={formData.image_url} alt="Cover preview" fill style={{ objectFit: 'cover' }} />
                            </div>
                        )}
                    </div>

                    {/* Content Editor */}
                    <div className={styles.inputGroup}>
                        <label>Story Content</label>
                        <div className={styles.editorWrapper}>
                            <ReactQuill
                                theme="snow"
                                value={formData.content}
                                onChange={(val: string) => setFormData({ ...formData, content: val })}
                                modules={modules}
                                placeholder="Write the full story here... Use the toolbar to format text, add headings, quotes, and images."
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.publishBtn} disabled={publishing || uploadingCover}>
                        {publishing
                            ? (editId ? 'Saving...' : 'Publishing...')
                            : (editId ? 'Save Changes' : 'Publish Story')}
                    </button>
                    {editId && (
                        <button type="button" onClick={cancelEdit} className={styles.cancelEditBtn}>
                            Cancel Edit
                        </button>
                    )}
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
                                {story.image_url && (
                                    <div className={styles.storyThumb}>
                                        <Image src={story.image_url} alt={story.title} fill style={{ objectFit: 'cover' }} />
                                    </div>
                                )}
                                <div className={styles.storyCardContent}>
                                    <h3>{story.title}</h3>
                                    <p>{story.content.replace(/<[^>]+>/g, '').slice(0, 180)}...</p>
                                    <div className={styles.storyMeta}>
                                        <span>{story.author || 'Admin'} · {formatDate(story.created_at)}</span>
                                        <div className={styles.storyActions}>
                                            <button className={styles.editBtn} onClick={() => startEdit(story)}>
                                                <Edit2 size={14} /> Edit
                                            </button>
                                            <button className={styles.deleteBtn} onClick={() => deleteStory(story.id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}


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
    const [error, setError] = useState<string | null>(null);

    // Edit state
    const [editId, setEditId] = useState<string | null>(null);

    const fetchStories = async () => {
        try {
            const res = await fetch('/api/admin/stories', { cache: 'no-store' });
            if (res.status === 401) {
                window.location.assign('/admin/login');
                return;
            }
            const data = await res.json();
            if (res.ok) {
                setStories(data.stories || []);
                setError(null);
                return;
            }
            setError(data.error || 'Failed to load stories.');
        } catch {
            setError('Network error while loading stories.');
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

        const method = editId ? 'PUT' : 'POST';
        const body = editId
            ? JSON.stringify({ id: editId, ...formData })
            : JSON.stringify(formData);

        const res = await fetch('/api/admin/stories', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body,
        });

        if (res.status === 401) {
            window.location.assign('/admin/login');
            return;
        }

        const data = await res.json();
        if (!res.ok) {
            alert(data.error || (editId ? 'Failed to update story.' : 'Failed to publish story.'));
            setPublishing(false);
            return;
        }

        setPublishing(false);
        setFormData({ title: '', content: '' });
        setEditId(null);
        await fetchStories();
    };

    const startEdit = (story: Story) => {
        setEditId(story.id);
        setFormData({ title: story.title, content: story.content });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditId(null);
        setFormData({ title: '', content: '' });
    };

    const deleteStory = async (id: string) => {
        if (!confirm('Delete this story?')) return;
        const res = await fetch('/api/admin/stories', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        if (res.status === 401) {
            window.location.assign('/admin/login');
            return;
        }
        if (!res.ok) {
            const data = await res.json().catch(() => ({ error: 'Failed to delete story.' }));
            alert(data.error || 'Failed to delete story.');
            return;
        }
        await fetchStories();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Stories Composer</h1>
                <p className={styles.subtitle}>Write and publish stories of resilience and transformation.</p>
                {error && <p className={styles.subtitle}>{error}</p>}
            </div>

            <div className={styles.composerBox}>
                <h2>
                    <PenTool size={20} className={styles.icon} />
                    {editId ? 'Edit Story' : 'Write a New Story'}
                </h2>
                {editId && (
                    <p className={styles.editNotice}>
                        Editing existing story — save to update it.
                    </p>
                )}
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
                        <div className={styles.editorWrapper}>
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
                        {publishing
                            ? (editId ? 'Saving...' : 'Publishing...')
                            : (editId ? 'Save Changes' : 'Publish Story')}
                    </button>
                    {editId && (
                        <button type="button" onClick={cancelEdit} className={styles.cancelEditBtn}>
                            Cancel Edit
                        </button>
                    )}
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
                                    <div className={styles.storyActions}>
                                        <button className={styles.editBtn} onClick={() => startEdit(story)}>
                                            <Edit2 size={14} /> Edit
                                        </button>
                                        <button className={styles.deleteBtn} onClick={() => deleteStory(story.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
