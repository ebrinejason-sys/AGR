import { useEffect, useState, useRef } from 'react';
import { 
    FolderKanban, 
    Edit2, 
    Image as ImageIcon, 
    Loader2, 
    UploadCloud, 
    X,
    LayoutGrid,
    CheckCircle2,
    DraftingCompass,
    AlertCircle,
    Save
} from 'lucide-react';
import styles from './ProjectsPage.module.css';

type ProjectItem = { 
    id: string; 
    title: string; 
    description: string; 
    image_url: string; 
    status: 'active' | 'draft'; 
    pillar_number: number;
    created_at: string 
};

const PILLARS = [
    { number: 1, name: 'Rise Sanctuaries (The Rise Room)', icon: LayoutGrid },
    { number: 2, name: 'Academic Rescue & Scholarships', icon: LayoutGrid },
    { number: 3, name: 'Legal Advocacy & Protection', icon: LayoutGrid },
    { number: 4, name: 'The Rise Brothers Program', icon: LayoutGrid },
];

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPillar, setEditingPillar] = useState<number | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ title: '', description: '', image_url: '', status: 'draft' as 'active' | 'draft' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/admin?action=projects');
            if (res.status === 401) { window.location.assign('/admin/login'); return; }
            const data = await res.json();
            if (res.ok) { setProjects(data.projects || []); setError(null); }
            else setError(data.error || 'Failed to load projects.');
        } catch { setError('Network error while loading projects.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchProjects(); }, []);

    const startEditing = (pillarNumber: number) => {
        const project = projects.find(p => p.pillar_number === pillarNumber);
        setEditingPillar(pillarNumber);
        if (project) {
            setFormData({ title: project.title, description: project.description || '', image_url: project.image_url || '', status: project.status });
        } else {
            setFormData({ title: PILLARS.find(p => p.number === pillarNumber)?.name || '', description: '', image_url: '', status: 'draft' });
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploadingImage(true);
        const uploadData = new FormData();
        uploadData.append('file', e.target.files[0]);
        uploadData.append('description', `Project image for pillar ${editingPillar}`);
        try {
            const res = await fetch('/api/admin/media', { method: 'POST', body: uploadData });
            const data = await res.json();
            if (res.ok && data.media?.url) setFormData(prev => ({ ...prev, image_url: data.media.url }));
            else alert(data.error || 'Failed to upload image.');
        } catch { alert('Upload error'); }
        finally { setUploadingImage(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
    };

    const saveProject = async (e: React.FormEvent) => {
        e.preventDefault();
        const existing = projects.find(p => p.pillar_number === editingPillar);
        // The projects API handles POST for both new and existing via unique pillar constraint logic
        // But here we use a general approach
        try {
            const res = await fetch('/api/admin?action=projects', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ ...formData, pillar_number: editingPillar }) 
            });
            if (res.ok) { setEditingPillar(null); fetchProjects(); }
            else { const data = await res.json(); alert(data.error || 'Failed to save project.'); }
        } catch { alert('Network error'); }
    };

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Core Programs & Pillars</h1>
                    <p className={styles.pageSubtitle}>Manage the four central pillars of the African Girl Rise mission.</p>
                </div>
            </div>

            {error && (
                <div className={styles.errorBanner}>
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            <div className={styles.pillarsGrid}>
                {PILLARS.map(pillar => {
                    const project = projects.find(p => p.pillar_number === pillar.number);
                    const isEditing = editingPillar === pillar.number;

                    return (
                        <div key={pillar.number} className={`${styles.pillarCard} ${isEditing ? styles.pillarCardEditing : ''}`}>
                            <div className={styles.pillarBadge}>Pillar {pillar.number}</div>
                            
                            {isEditing ? (
                                <form className={styles.editForm} onSubmit={saveProject}>
                                    <div className={styles.formContent}>
                                        <div className={styles.inputField}>
                                            <label>Program Title</label>
                                            <input 
                                                type="text" 
                                                required 
                                                value={formData.title} 
                                                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} 
                                            />
                                        </div>
                                        <div className={styles.inputField}>
                                            <label>Status</label>
                                            <select value={formData.status} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as any }))}>
                                                <option value="draft">Draft</option>
                                                <option value="active">Active (Visible on Site)</option>
                                            </select>
                                        </div>
                                        <div className={styles.inputField}>
                                            <label>Description</label>
                                            <textarea 
                                                rows={4} 
                                                value={formData.description} 
                                                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} 
                                            />
                                        </div>
                                        <div className={styles.imageEditRow}>
                                            <div className={styles.smallPreview}>
                                                {formData.image_url ? <img src={formData.image_url} alt="Preview" /> : <div className={styles.previewPlaceholder}><ImageIcon size={20} /></div>}
                                            </div>
                                            <button type="button" className={styles.miniUploadBtn} onClick={() => fileInputRef.current?.click()}>
                                                {uploadingImage ? <Loader2 size={14} className={styles.spin} /> : <UploadCloud size={14} />}
                                                Change Image
                                            </button>
                                            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />
                                        </div>
                                    </div>
                                    <div className={styles.formActions}>
                                        <button type="submit" className={styles.saveBtn}><Save size={16} /> Save Changes</button>
                                        <button type="button" className={styles.cancelBtn} onClick={() => setEditingPillar(null)}>Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className={styles.pillarImage}>
                                        {project?.image_url ? <img src={project.image_url} alt={pillar.name} /> : <div className={styles.noImage}><FolderKanban size={48} /></div>}
                                        <div className={`${styles.statusLabel} ${styles[project?.status || 'draft']}`}>
                                            {project?.status === 'active' ? <CheckCircle2 size={12} /> : <DraftingCompass size={12} />}
                                            {project?.status === 'active' ? 'Active' : 'Draft'}
                                        </div>
                                    </div>
                                    <div className={styles.pillarContent}>
                                        <h3 className={styles.pillarTitle}>{project?.title || pillar.name}</h3>
                                        <p className={styles.pillarDesc}>
                                            {project?.description || 'No description provided for this pillar yet. Update it to tell supporters about this program.'}
                                        </p>
                                        <button className={styles.editBtn} onClick={() => startEditing(pillar.number)}>
                                            <Edit2 size={16} />
                                            Edit Pillar Details
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
