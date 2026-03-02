"use client";

import { useEffect, useState } from 'react';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';
import styles from './events.module.css';

type EventItem = {
    id: string;
    title: string;
    description: string;
    event_date: string;
    goal_amount: number;
    current_amount: number;
    status: 'upcoming' | 'completed' | 'cancelled';
};

export default function AdminEvents() {
    const [showForm, setShowForm] = useState(false);
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        event_date: '',
        goal_amount: '',
    });

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/admin/events', { cache: 'no-store' });
            const data = await res.json();
            if (res.ok) {
                setEvents(data.events || []);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const createEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/admin/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...formData,
                goal_amount: Number(formData.goal_amount),
            }),
        });

        if (res.ok) {
            setShowForm(false);
            setFormData({ title: '', description: '', event_date: '', goal_amount: '' });
            await fetchEvents();
        } else {
            const data = await res.json();
            alert(data.error || 'Failed to create event.');
        }
    };

    const toggleStatus = (id: string, newStatus: string) => {
        fetch('/api/admin/events', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: newStatus }),
        }).then(() => fetchEvents());
    };

    const deleteEvent = async (id: string) => {
        if (!confirm('Delete this event?')) return;
        await fetch('/api/admin/events', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        await fetchEvents();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Events Management</h1>
                    <p className={styles.subtitle}>Create events, monitor contributions, and manage their status.</p>
                </div>
                <button className={styles.createBtn} onClick={() => setShowForm(!showForm)}>
                    <PlusCircle size={20} /> New Event
                </button>
            </div>

            {showForm && (
                <div className={styles.formCard}>
                    <h2>Create New Event</h2>
                    <form className={styles.form} onSubmit={createEvent}>
                        <div className={styles.formRow}>
                            <div className={styles.inputGroup}>
                                <label>Event Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Annual Gala"
                                    value={formData.title}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Event Date</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.event_date}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, event_date: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Description</label>
                            <textarea
                                rows={3}
                                required
                                placeholder="What is this event for?"
                                value={formData.description}
                                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Funding Goal (UGX)</label>
                            <input
                                type="number"
                                required
                                placeholder="e.g. 5000000"
                                value={formData.goal_amount}
                                onChange={(e) => setFormData((prev) => ({ ...prev, goal_amount: e.target.value }))}
                            />
                        </div>

                        <div className={styles.formActions}>
                            <button type="button" onClick={() => setShowForm(false)} className={styles.cancelBtn}>Cancel</button>
                            <button type="submit" className={styles.submitBtn}>Save Event</button>
                        </div>
                    </form>
                </div>
            )}

            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Event Title</th>
                            <th>Date</th>
                            <th>Goal (UGX)</th>
                            <th>Raised (UGX)</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading && events.length === 0 && (
                            <tr>
                                <td colSpan={6}>No events found.</td>
                            </tr>
                        )}
                        {events.map(ev => (
                            <tr key={ev.id}>
                                <td className={styles.cellTitle}>{ev.title}</td>
                                <td>{new Date(ev.event_date).toLocaleDateString()}</td>
                                <td>{Number(ev.goal_amount || 0).toLocaleString()}</td>
                                <td className={styles.cellRaised}>{Number(ev.current_amount || 0).toLocaleString()}</td>
                                <td>
                                    <select
                                        value={ev.status}
                                        onChange={(e) => toggleStatus(ev.id, e.target.value)}
                                        className={`${styles.statusSelect} ${styles[ev.status]}`}
                                    >
                                        <option value="upcoming">Upcoming</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td>
                                    <div className={styles.actionRow}>
                                        <button className={styles.iconBtn} aria-label="Edit"><Edit2 size={16} /></button>
                                        <button className={styles.iconBtnThreat} aria-label="Delete" onClick={() => deleteEvent(ev.id)}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
}
