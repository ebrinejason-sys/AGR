"use client";

import { useState } from 'react';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';
import styles from './events.module.css';

export default function AdminEvents() {
    const [showForm, setShowForm] = useState(false);

    // Mock data for UI purposes until Supabase is hooked up
    const [events, setEvents] = useState([
        { id: '1', title: 'Fund a Rise Room in Ibanda', goal: 5000000, current: 1500000, status: 'upcoming', date: '2026-05-15' },
        { id: '2', title: 'Scholarship Drive 2026', goal: 2000000, current: 2500000, status: 'completed', date: '2026-01-10' },
    ]);

    const toggleStatus = (id: string, newStatus: string) => {
        // In future: await supabase.from('events').update({ status: newStatus }).eq('id', id);
        setEvents(events.map(ev => ev.id === id ? { ...ev, status: newStatus } : ev));
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
                    <form className={styles.form} onSubmit={(e) => { e.preventDefault(); setShowForm(false); }}>
                        <div className={styles.formRow}>
                            <div className={styles.inputGroup}>
                                <label>Event Title</label>
                                <input type="text" required placeholder="e.g. Annual Gala" />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Event Date</label>
                                <input type="date" required />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Description</label>
                            <textarea rows={3} required placeholder="What is this event for?" />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Funding Goal (UGX)</label>
                            <input type="number" required placeholder="e.g. 5000000" />
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
                        {events.map(ev => (
                            <tr key={ev.id}>
                                <td className={styles.cellTitle}>{ev.title}</td>
                                <td>{ev.date}</td>
                                <td>{ev.goal.toLocaleString()}</td>
                                <td className={styles.cellRaised}>{ev.current.toLocaleString()}</td>
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
                                        <button className={styles.iconBtnThreat} aria-label="Delete"><Trash2 size={16} /></button>
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
