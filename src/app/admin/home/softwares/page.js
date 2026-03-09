"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Edit2, ArrowLeft, X, Code, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminDepartmentSoftwaresPage() {
    const [softwares, setSoftwares] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Form state
    const [formData, setFormData] = useState({
        id: null,
        project_name: '',
        tagline: '',
        description: '',
        tech_stack: '',
        live_link: '',
        team_member_1: '',
        team_member_2: '',
        team_member_3: '',
        team_member_4: ''
    });

    useEffect(() => {
        fetchSoftwares();
    }, []);

    const fetchSoftwares = async () => {
        try {
            const { data, error } = await supabase
                .from('department_softwares')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSoftwares(data || []);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to fetch softwares: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.project_name.trim()) {
            setMessage({ type: 'error', text: 'Project name is required' });
            return;
        }

        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // Convert comma-separated tech stack to array
            const techStackArray = formData.tech_stack
                .split(',')
                .map(item => item.trim())
                .filter(item => item.length > 0);

            const dataToSave = {
                project_name: formData.project_name.trim(),
                tagline: formData.tagline.trim(),
                description: formData.description.trim(),
                tech_stack: techStackArray,
                live_link: formData.live_link.trim() || null,
                team_member_1: formData.team_member_1.trim() || null,
                team_member_2: formData.team_member_2.trim() || null,
                team_member_3: formData.team_member_3.trim() || null,
                team_member_4: formData.team_member_4.trim() || null,
                updated_at: new Date().toISOString()
            };

            if (formData.id) {
                // Update existing
                const { error } = await supabase
                    .from('department_softwares')
                    .update(dataToSave)
                    .eq('id', formData.id);

                if (error) throw error;
                setMessage({ type: 'success', text: 'Software updated successfully!' });
            } else {
                // Create new
                const { error } = await supabase
                    .from('department_softwares')
                    .insert(dataToSave);

                if (error) throw error;
                setMessage({ type: 'success', text: 'Software added successfully!' });
            }

            // Reset form and refresh
            resetForm();
            fetchSoftwares();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save: ' + error.message });
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (software) => {
        setFormData({
            id: software.id,
            project_name: software.project_name,
            tagline: software.tagline || '',
            description: software.description || '',
            tech_stack: software.tech_stack ? software.tech_stack.join(', ') : '',
            live_link: software.live_link || '',
            team_member_1: software.team_member_1 || '',
            team_member_2: software.team_member_2 || '',
            team_member_3: software.team_member_3 || '',
            team_member_4: software.team_member_4 || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (software) => {
        if (!confirm(`Are you sure you want to delete "${software.project_name}"?`)) return;

        try {
            const { error } = await supabase
                .from('department_softwares')
                .delete()
                .eq('id', software.id);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Software deleted successfully!' });
            fetchSoftwares();
        } catch (error) {
            setMessage({ type: 'error', text: 'Delete failed: ' + error.message });
        }
    };

    const resetForm = () => {
        setFormData({
            id: null,
            project_name: '',
            tagline: '',
            description: '',
            tech_stack: '',
            live_link: '',
            team_member_1: '',
            team_member_2: '',
            team_member_3: '',
            team_member_4: ''
        });
        setShowForm(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            padding: '2rem'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <Link
                        href="/admin/home"
                        style={{
                            color: '#fbbf24',
                            textDecoration: 'none',
                            fontSize: '1rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '1rem'
                        }}
                    >
                        <ArrowLeft size={18} /> Back to Home Management
                    </Link>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 style={{
                                fontSize: '2rem',
                                fontWeight: '700',
                                color: '#fff',
                                margin: 0
                            }}>
                                Department Created Softwares
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>
                                Showcase projects developed by the department
                            </p>
                        </div>
                        {!showForm && (
                            <button
                                onClick={() => setShowForm(true)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 1.5rem',
                                    background: '#fbbf24',
                                    color: '#1a1a2e',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                <Plus size={18} /> Add Software
                            </button>
                        )}
                    </div>
                </div>

                {/* Message */}
                {message.text && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        background: message.type === 'error'
                            ? 'rgba(239, 68, 68, 0.2)'
                            : 'rgba(34, 197, 94, 0.2)',
                        border: `1px solid ${message.type === 'error' ? '#ef4444' : '#22c55e'}`,
                        color: message.type === 'error' ? '#fca5a5' : '#86efac'
                    }}>
                        {message.text}
                    </div>
                )}

                {/* Form */}
                {showForm && (
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '2rem',
                        marginBottom: '2rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ color: '#fff', margin: 0, fontSize: '1.5rem' }}>
                                {formData.id ? 'Edit Software' : 'Add New Software'}
                            </h2>
                            <button
                                onClick={resetForm}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'rgba(255,255,255,0.6)',
                                    cursor: 'pointer',
                                    padding: '0.5rem'
                                }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {/* Project Name */}
                                <div>
                                    <label style={{ color: '#fff', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                        Project Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.project_name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, project_name: e.target.value }))}
                                        placeholder="Enter project name"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'rgba(255,255,255,0.1)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '8px',
                                            color: '#fff',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>

                                {/* Tagline */}
                                <div>
                                    <label style={{ color: '#fff', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                        Tagline
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.tagline}
                                        onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                                        placeholder="Enter tagline"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'rgba(255,255,255,0.1)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '8px',
                                            color: '#fff',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label style={{ color: '#fff', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Enter description"
                                        rows={4}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'rgba(255,255,255,0.1)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '8px',
                                            color: '#fff',
                                            fontSize: '1rem',
                                            resize: 'vertical'
                                        }}
                                    />
                                </div>

                                {/* Tech Stack */}
                                <div>
                                    <label style={{ color: '#fff', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                        Tech Stack (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.tech_stack}
                                        onChange={(e) => setFormData(prev => ({ ...prev, tech_stack: e.target.value }))}
                                        placeholder="React, Node.js, MongoDB, etc."
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'rgba(255,255,255,0.1)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '8px',
                                            color: '#fff',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>

                                {/* Live Project Link */}
                                <div>
                                    <label style={{ color: '#fff', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                        Live Project Link
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.live_link}
                                        onChange={(e) => setFormData(prev => ({ ...prev, live_link: e.target.value }))}
                                        placeholder="https://your-project-url.com"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'rgba(255,255,255,0.1)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '8px',
                                            color: '#fff',
                                            fontSize: '1rem'
                                        }}
                                    />
                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                        Optional. Add the URL of the deployed project to show a &quot;Live&quot; button.
                                    </p>
                                </div>

                                {/* Team Members */}
                                <div>
                                    <label style={{ color: '#fff', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                        Team Members (up to 4)
                                    </label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                        <input
                                            type="text"
                                            value={formData.team_member_1}
                                            onChange={(e) => setFormData(prev => ({ ...prev, team_member_1: e.target.value }))}
                                            placeholder="Team Member 1"
                                            style={{
                                                padding: '0.75rem',
                                                background: 'rgba(255,255,255,0.1)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                borderRadius: '8px',
                                                color: '#fff',
                                                fontSize: '1rem'
                                            }}
                                        />
                                        <input
                                            type="text"
                                            value={formData.team_member_2}
                                            onChange={(e) => setFormData(prev => ({ ...prev, team_member_2: e.target.value }))}
                                            placeholder="Team Member 2"
                                            style={{
                                                padding: '0.75rem',
                                                background: 'rgba(255,255,255,0.1)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                borderRadius: '8px',
                                                color: '#fff',
                                                fontSize: '1rem'
                                            }}
                                        />
                                        <input
                                            type="text"
                                            value={formData.team_member_3}
                                            onChange={(e) => setFormData(prev => ({ ...prev, team_member_3: e.target.value }))}
                                            placeholder="Team Member 3"
                                            style={{
                                                padding: '0.75rem',
                                                background: 'rgba(255,255,255,0.1)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                borderRadius: '8px',
                                                color: '#fff',
                                                fontSize: '1rem'
                                            }}
                                        />
                                        <input
                                            type="text"
                                            value={formData.team_member_4}
                                            onChange={(e) => setFormData(prev => ({ ...prev, team_member_4: e.target.value }))}
                                            placeholder="Team Member 4"
                                            style={{
                                                padding: '0.75rem',
                                                background: 'rgba(255,255,255,0.1)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                borderRadius: '8px',
                                                color: '#fff',
                                                fontSize: '1rem'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    style={{
                                        padding: '0.75rem 2rem',
                                        background: '#fbbf24',
                                        color: '#1a1a2e',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: saving ? 'not-allowed' : 'pointer',
                                        opacity: saving ? 0.7 : 1
                                    }}
                                >
                                    {saving ? 'Saving...' : (formData.id ? 'Update' : 'Add')}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    style={{
                                        padding: '0.75rem 2rem',
                                        background: 'transparent',
                                        color: 'rgba(255,255,255,0.6)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Software List */}
                {loading ? (
                    <div style={{
                        color: 'rgba(255,255,255,0.6)',
                        textAlign: 'center',
                        padding: '4rem'
                    }}>
                        Loading softwares...
                    </div>
                ) : softwares.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        border: '2px dashed rgba(255,255,255,0.2)'
                    }}>
                        <Code size={64} color="rgba(255,255,255,0.3)" />
                        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '1rem' }}>
                            No softwares yet. Add your first project!
                        </p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {softwares.map((software) => (
                            <div
                                key={software.id}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '1.5rem',
                                    transition: 'transform 0.2s'
                                }}
                            >
                                <h3 style={{
                                    color: '#fff',
                                    margin: '0 0 0.5rem 0',
                                    fontSize: '1.25rem'
                                }}>
                                    {software.project_name}
                                    {software.live_link && (
                                        <a
                                            href={software.live_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.25rem',
                                                padding: '0.2rem 0.6rem',
                                                background: 'rgba(34, 197, 94, 0.2)',
                                                border: '1px solid rgba(34, 197, 94, 0.5)',
                                                borderRadius: '12px',
                                                color: '#22c55e',
                                                fontSize: '0.7rem',
                                                fontWeight: '600',
                                                textDecoration: 'none',
                                                marginLeft: '0.5rem',
                                                verticalAlign: 'middle'
                                            }}
                                        >
                                            <ExternalLink size={10} /> Live
                                        </a>
                                    )}
                                </h3>
                                {software.tagline && (
                                    <p style={{
                                        color: '#fbbf24',
                                        margin: '0 0 1rem 0',
                                        fontSize: '0.9rem',
                                        fontStyle: 'italic'
                                    }}>
                                        {software.tagline}
                                    </p>
                                )}
                                {software.description && (
                                    <p style={{
                                        color: 'rgba(255,255,255,0.6)',
                                        margin: '0 0 1rem 0',
                                        fontSize: '0.9rem',
                                        lineHeight: '1.5'
                                    }}>
                                        {software.description}
                                    </p>
                                )}
                                {software.tech_stack && software.tech_stack.length > 0 && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '0.5rem'
                                        }}>
                                            {software.tech_stack.map((tech, idx) => (
                                                <span
                                                    key={idx}
                                                    style={{
                                                        padding: '0.25rem 0.75rem',
                                                        background: 'rgba(251, 191, 36, 0.2)',
                                                        border: '1px solid rgba(251, 191, 36, 0.4)',
                                                        borderRadius: '12px',
                                                        color: '#fbbf24',
                                                        fontSize: '0.75rem'
                                                    }}
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {(software.team_member_1 || software.team_member_2 || software.team_member_3 || software.team_member_4) && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <p style={{
                                            color: 'rgba(255,255,255,0.4)',
                                            fontSize: '0.75rem',
                                            margin: '0 0 0.5rem 0',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            Team
                                        </p>
                                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                                            {[software.team_member_1, software.team_member_2, software.team_member_3, software.team_member_4]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </div>
                                    </div>
                                )}
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                    <button
                                        onClick={() => handleEdit(software)}
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            padding: '0.5rem',
                                            background: 'rgba(59, 130, 246, 0.2)',
                                            border: '1px solid #3b82f6',
                                            borderRadius: '6px',
                                            color: '#60a5fa',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(software)}
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            padding: '0.5rem',
                                            background: 'rgba(239, 68, 68, 0.2)',
                                            border: '1px solid #ef4444',
                                            borderRadius: '6px',
                                            color: '#f87171',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
