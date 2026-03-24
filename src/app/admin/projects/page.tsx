"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";

import { CORE_PROGRAMS } from "@/app/programs/data";

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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({});

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/projects', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setProjects(data.projects || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData(project);
  };

  const handleSave = async () => {
    if (!editingId) return;
    const isNew = editingId.startsWith('new-');

    try {
      const url = isNew ? '/api/admin/projects' : `/api/admin/projects/${editingId}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchProjects();
        setEditingId(null);
        setFormData({});
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to save project');
      }
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleAddNew = () => {
    const tempId = 'new-' + Date.now();
    const newProject: Project = {
      id: tempId,
      title: "",
      description: "",
      pillar_number: 1,
      status: "draft"
    };
    setProjects([newProject, ...projects]);
    setEditingId(tempId);
    setFormData(newProject);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Projects & Programs</h1>
        <button onClick={handleAddNew} className={styles.btnAdd}>
          <Plus size={20} /> Add New Project
        </button>
      </div>

      <div className={styles.projectsTable}>
        <div className={styles.tableHeader}>
          <div className={styles.colTitle}>Title</div>
          <div className={styles.colDescription}>Description</div>
          <div className={styles.colPillar}>Pillar</div>
          <div className={styles.colStatus}>Status</div>
          <div className={styles.colActions}>Actions</div>
        </div>

        {projects.map(project => (
          <div key={project.id} className={styles.tableRow}>
            {editingId === project.id ? (
              <>
                <div className={styles.colTitle}>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div className={styles.colDescription}>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={styles.textarea}
                  />
                </div>
                <div className={styles.colPillar}>
                  <select
                    value={formData.pillar_number || 1}
                    onChange={(e) => setFormData({ ...formData, pillar_number: parseInt(e.target.value) })}
                    className={styles.select}
                  >
                    <option value="1">1 - Healing</option>
                    <option value="2">2 - Building</option>
                    <option value="3">3 - Reaching</option>
                    <option value="4">4 - Rights</option>
                  </select>
                </div>
                <div className={styles.colStatus}>
                  <select
                    value={formData.status || "draft"}
                    onChange={(e) => {
                      const nextStatus: Project["status"] = e.target.value === "active" ? "active" : "draft";
                      setFormData({ ...formData, status: nextStatus });
                    }}
                    className={styles.select}
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                  </select>
                </div>
                <div className={styles.colActions}>
                  <button onClick={handleSave} className={styles.btnSuccess}>Save</button>
                  <button onClick={() => setEditingId(null)} className={styles.btnCancel}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.colTitle}>{project.title}</div>
                <div className={styles.colDescription}>{project.description}</div>
                <div className={styles.colPillar}>
                  <span className={styles.pillarBadge}>Pillar {project.pillar_number}</span>
                </div>
                <div className={styles.colStatus}>
                  <span className={`${styles.statusBadge} ${styles[project.status]}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
                <div className={styles.colActions}>
                  <button onClick={() => handleEdit(project)} className={styles.btnIcon} title="Edit">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(project.id)} className={styles.btnIcon} title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className={styles.info}>
        <p>
          💡 <strong>Pro Tip:</strong> Edit projects and programs to customize their descriptions,
          images, and pillar assignments. These changes will be reflected across your website.
        </p>
      </div>
    </div>
  );
}
