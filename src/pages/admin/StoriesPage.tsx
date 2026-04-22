import { useEffect, useState, useRef } from 'react';
import { 
    PlusCircle, 
    Edit2, 
    Trash2, 
    Image as ImageIcon, 
    Loader2, 
    UploadCloud, 
    X,
    BookOpen,
    User,
    Clock,
    Eye,
    CheckCircle,
    AlertCircle,
    FileText,
    History
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { formatDate } from '@/lib/utils';
import styles from './StoriesPage.module.css';

type StoryItem = { 
    id: string; 
    title: string; 
    content: string; 
    author: string; 
    image_url?: string; 
    created_at: string 
};

const EMPTY_STORY = { 
    title: '', 
    content: '', 
    author: 'Grace Akatwijuka', 
    image_url: '' 
};

export default function AdminStoriesPage() {
    const [showForm, setShowForm] = useState(false);
    const [stories, setStories] = useState<StoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState(EMPTY_STORY);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchStories = async () => {
        try {
            const res = await fetch('/api/admin?action=stories');
            if (res.status === 401) { window.location.assign('/admin/login'); return; }
            const data = await res.json();
            if (res.ok) { setStories(data.stories || []); setError(null); }
            else setError(data.error || 'Failed to load stories.');
        } catch { setError('Network error while loading stories.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchStories(); }, []);

    const handleEdit = (story: StoryItem) => {
        setEditId(story.id);
        setFormData({ 
            title: story.title, 
            content: story.content, 
            author: story.author || 'Grace Akatwijuka', 
            image_url: story.image_url || '' 
        });
        setShowForm(true);
    };

    const handleAddNew = () => { 
        setEditId(null); 
        setFormData(EMPTY_STORY); 
        setShowForm(true); 
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploadingImage(true);
        const uploadData = new FormData();
        uploadData.append('file', e.target.files[0]);
        uploadData.append('description', `Cover image for story: ${formData.title || 'Untitled'}`);
        try {
            const res = await fetch('/api/admin/media', { method: 'POST', body: uploadData });
            const data = await res.json();
            if (res.ok && data.media?.url) setFormData(prev => ({ ...prev, image_url: data.media.url }));
            else alert(data.error || 'Failed to upload image.');
        } catch { alert('Upload error'); }
        finally { setUploadingImage(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
    };

    const saveStory = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editId ? 'PUT' : 'POST';
        const body = { ...formData, ...(editId && { id: editId }) };
        try {
            const res = await fetch('/api/admin?action=stories', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            if (res.status === 401) { window.location.assign('/admin/login'); return; }
            if (res.ok) { setShowForm(false); setEditId(null); setFormData(EMPTY_STORY); setError(null); await fetchStories(); }
            else { const data = await res.json(); alert(data.error || 'Failed to save story.'); }
        } catch { alert('Network error while saving story.'); }
    };

    const deleteStory = async (id: string) => {
        if (!confirm('Delete this story? This action cannot be undone.')) return;
        const res = await fetch('/api/admin?action=stories', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        if (res.status === 401) { window.location.assign('/admin/login'); return; }
        await fetchStories();
    };

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Voices of Resilience</h1>
                    <p className={styles.pageSubtitle}>Publish impactful stories of transformation and community strength.</p>
                </div>
                {!showForm && (
                    <button className={styles.createBtn} onClick={handleAddNew}>
                        <PlusCircle size={20} />
                        <span>New Story</span>
                    </button>
                )}
            </div>

            {error && (
                <div className={styles.errorBanner}>
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {showForm ? (
                <div className={styles.formContainer}>
                    <div className={styles.formHeader}>
                        <h2>{editId ? 'Edit Story' : 'Craft a New Story'}</h2>
                        <button className={styles.closeForm} onClick={() => setShowForm(false)}><X size={24} /></button>
                    </div>
                    
                    <form className={styles.storyForm} onSubmit={saveStory}>
                        <div className={styles.formGrid}>
                            <div className={styles.mainColumn}>
                                <div className={styles.inputField}>
                                    <label>Story Title</label>
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder="e.g. A Journey of Hope: Sarah's Transformation" 
                                        value={formData.title} 
                                        onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} 
                                        className={styles.titleInput}
                                    />
                                </div>
                                
                                <div className={styles.editorWrapper}>
                                    <label>Story Content</label>
                                    <ReactQuill 
                                        theme="snow" 
                                        value={formData.content} 
                                        onChange={content => setFormData(prev => ({ ...prev, content }))}
                                        modules={quillModules}
                                        placeholder="Begin writing your story of resilience..."
                                    />
                                </div>
                            </div>

                            <aside className={styles.sideColumn}>
                                <div className={styles.panel}>
                                    <h3 className={styles.panelTitle}>Publishing Details</h3>
                                    <div className={styles.inputField}>
                                        <label><User size={14} /> Author Name</label>
                                        <input 
                                            type="text" 
                                            value={formData.author} 
                                            onChange={e => setFormData(prev => ({ ...prev, author: e.target.value }))} 
                                        />
                                    </div>
                                </div>

                                <div className={styles.panel}>
                                    <h3 className={styles.panelTitle}>Feature Image</h3>
                                    <div className={styles.imageUploadBox}>
                                        {formData.image_url ? (
                                            <div className={styles.imagePreview}>
                                                <img src={formData.image_url} alt="Preview" />
                                                <button type="button" className={styles.removeImage} onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}><X size={14} /></button>
                                            </div>
                                        ) : (
                                            <div className={styles.imagePlaceholder} onClick={() => fileInputRef.current?.click()}>
                                                <UploadCloud size={32} />
                                                <span>Upload Feature Image</span>
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />
                                    </div>
                                    <button 
                                        type="button" 
                                        className={styles.uploadTrigger} 
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploadingImage}
                                    >
                                        {uploadingImage ? <Loader2 size={14} className={styles.spin} /> : <ImageIcon size={14} />}
                                        {formData.image_url ? 'Change Image' : 'Select File'}
                                    </button>
                                </div>

                                <div className={styles.formActions}>
                                    <button type="submit" className={styles.saveBtn} disabled={uploadingImage}>
                                        {editId ? 'Update Story' : 'Publish Story'}
                                    </button>
                                    <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>Discard</button>
                                </div>
                            </aside>
                        </div>
                    </form>
                </div>
            ) : (
                <div className={styles.storiesGrid}>
                    {loading ? (
                        <div className={styles.loadingState}>
                            <Loader2 size={40} className={styles.spin} />
                            <p>Loading your stories...</p>
                        </div>
                    ) : stories.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}><BookOpen size={48} /></div>
                            <h3>The page is silent</h3>
                            <p>No stories have been published yet. Share a voice of resilience today.</p>
                            <button className={styles.emptyAction} onClick={handleAddNew}>Write First Story</button>
                        </div>
                    ) : (
                        stories.map(story => (
                            <div key={story.id} className={styles.storyCard}>
                                <div className={styles.cardImage}>
                                    {story.image_url ? <img src={story.image_url} alt={story.title} /> : <div className={styles.noImage}><FileText size={32} /></div>}
                                    <div className={styles.cardOverlay}>
                                        <button className={styles.viewBtn} title="Preview on Site"><Eye size={18} /></button>
                                    </div>
                                </div>
                                <div className={styles.cardContent}>
                                    <div className={styles.cardMeta}>
                                        <span className={styles.authorTag}><User size={12} /> {story.author}</span>
                                        <span className={styles.dateTag}><Clock size={12} /> {formatDate(story.created_at)}</span>
                                    </div>
                                    <h3 className={styles.cardTitle}>{story.title}</h3>
                                    <div className={styles.cardFooter}>
                                        <div className={styles.statusInfo}>
                                            <CheckCircle size={14} className={styles.publishedIcon} />
                                            <span>Published</span>
                                        </div>
                                        <div className={styles.cardActions}>
                                            <button className={styles.editBtn} onClick={() => handleEdit(story)}><Edit2 size={16} /></button>
                                            <button className={styles.deleteBtn} onClick={() => deleteStory(story.id)}><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
