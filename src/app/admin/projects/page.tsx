"use client";
import Image from "next/image";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2, X } from "lucide-react";

type Project = {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  status: 'active' | 'draft';
  pillar_number: number;
};

export default function ProjectsManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: "",
    description: "",
    pillar_number: 1,
    status: "draft",
    image_url: ""
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/projects");
      if (response.status === 401) {
        window.location.assign('/admin/login');
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
        setError(null);
      } else {
        const data = await response.json().catch(() => ({ error: 'Failed to load projects.' }));
        setError(data.error || 'Failed to load projects.');
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError('Network error while loading projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      description: project.description || "",
      pillar_number: project.pillar_number,
      status: project.status,
      image_url: project.image_url || ""
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      pillar_number: 1,
      status: "draft",
      image_url: ""
    });
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingImage(true);

    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('description', `Cover image for project: ${formData.title || 'Untitled'}`);

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (res.ok && data.media?.url) {
        setFormData(prev => ({ ...prev, image_url: data.media.url }));
      } else {
        alert(data.error || 'Failed to upload image.');
      }
    } catch (error) {
      console.error(error);
      alert('Upload error');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingId ? `/api/admin/projects/${editingId}` : "/api/admin/projects";
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.status === 401) {
        window.location.assign('/admin/login');
        return;
      }

      if (response.ok) {
        setShowForm(false);
        setEditingId(null);
        setError(null);
        fetchProjects();
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to save project.");
      }
    } catch (error) {
      console.error("Error saving project:", error);
      alert("An error occurred while saving.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE"
      });

      if (response.status === 401) {
        window.location.assign('/admin/login');
        return;
      }

      if (response.ok) {
        fetchProjects();
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to delete project.");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
            <h1 className={styles.title}>Projects & Programs</h1>
            <p className={styles.subtitle}>Manage core initiatives and pillars of African Girl Rise.</p>
          {error && <p className={styles.subtitle}>{error}</p>}
        </div>
        <button onClick={handleAddNew} className={styles.btnAdd}>
          <Plus size={20} /> Add New Project
        </button>
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2>{editingId ? "Edit Project" : "Create New Project"}</h2>
            <button onClick={() => setShowForm(false)} className={styles.closeBtn}><X size={20} /></button>
          </div>
          <form className={styles.form} onSubmit={handleSave}>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label>Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Rise Room Initiative"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Pillar Assignment</label>
                <select
                  value={formData.pillar_number}
                  onChange={(e) => setFormData({ ...formData, pillar_number: parseInt(e.target.value) })}
                >
                  <option value="1">Pillar 1 - Healing the Ground</option>
                  <option value="2">Pillar 2 - Building the Ladder</option>
                  <option value="3">Pillar 3 - Reaching New Altitudes</option>
                  <option value="4">Pillar 4 - Knowing Your Rights</option>
                </select>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Description</label>
              <textarea
                rows={4}
                required
                placeholder="Describe the initiative and its impact..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'draft' })}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                 <label>Cover Image</label>
                 <div className={styles.imageUploadBox}>
                    <button
                        type="button"
                        className={styles.uploadBtn}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                    >
                        {uploadingImage ? <Loader2 size={18} className="spin" /> : <ImageIcon size={18} />}
                        <span>{formData.image_url ? 'Change Image' : 'Upload Image'}</span>
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                    />
                    {formData.image_url && (
                        <div className={styles.imagePreview}>
                            <Image src={formData.image_url} alt="Preview" width={200} height={150} style={{ objectFit: 'cover' }} />
                        </div>
                    )}
                 </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" onClick={() => setShowForm(false)} className={styles.btnCancel}>Cancel</button>
              <button type="submit" className={styles.btnSuccess}>
                {editingId ? "Update Project" : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.tableCard}>
        <div className={styles.tableResponsive}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title & Description</th>
                        <th>Pillar</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={5} className={styles.loadingCell}>
                                <Loader2 size={24} className="spin" /> Loading projects...
                            </td>
                        </tr>
                    ) : projects.length === 0 ? (
                        <tr>
                            <td colSpan={5} className={styles.emptyCell}>No projects found. Create one to get started.</td>
                        </tr>
                    ) : (
                        projects.map(project => (
                            <tr key={project.id}>
                                <td className={styles.imageCell}>
                                    {project.image_url ? (
                                        <Image src={project.image_url} alt={project.title} width={40} height={40} className={styles.tableThumb} style={{ objectFit: 'cover' }} />
                                    ) : (
                                        <div className={styles.thumbPlaceholder}><ImageIcon size={20} /></div>
                                    )}
                                </td>
                                <td className={styles.contentCell}>
                                    <strong>{project.title}</strong>
                                    <p>{project.description?.slice(0, 100)}{project.description?.length > 100 ? '...' : ''}</p>
                                </td>
                                <td>
                                    <span className={styles.pillarBadge}>Pillar {project.pillar_number}</span>
                                </td>
                                <td>
                                    <span className={`${styles.statusBadge} ${styles[project.status]}`}>
                                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actionButtons}>
                                        <button onClick={() => handleEdit(project)} className={styles.btnIcon} title="Edit">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(project.id)} className={styles.btnIconDelete} title="Delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      <div className={styles.info}>
        <p>
          💡 <strong>Pro Tip:</strong> Active projects and programs are displayed on the public Programs page.
          Use high-quality images and clear descriptions to engage supporters.
        </p>
      </div>
    </div>
  );
}
