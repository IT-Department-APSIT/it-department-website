"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Edit2, ArrowLeft, X, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminHallOfFamePage() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Form state
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        description: '',
        image_url: '',
        imageFile: null,
        imagePreview: ''
    });

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const { data, error } = await supabase
                .from('hall_of_fame')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setEntries(data || []);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to fetch entries: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: 'Please select an image file' });
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({
                ...prev,
                imageFile: file,
                imagePreview: reader.result
            }));
        };
        reader.readAsDataURL(file);
    };

    const uploadImage = async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `hof_${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('hall-of-fame')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
            .from('hall-of-fame')
            .getPublicUrl(fileName);

        return urlData.publicUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setMessage({ type: 'error', text: 'Name is required' });
            return;
        }

        setUploading(true);
        setMessage({ type: '', text: '' });

        try {
            let imageUrl = formData.image_url;

            // Upload new image if selected
            if (formData.imageFile) {
                imageUrl = await uploadImage(formData.imageFile);
            }

            const dataToSave = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                image_url: imageUrl,
                updated_at: new Date().toISOString()
            };

            if (formData.id) {
                // Update existing
                const { error } = await supabase
                    .from('hall_of_fame')
                    .update(dataToSave)
                    .eq('id', formData.id);

                if (error) throw error;
                setMessage({ type: 'success', text: 'Entry updated successfully!' });
            } else {
                // Create new
                const { error } = await supabase
                    .from('hall_of_fame')
                    .insert(dataToSave);

                if (error) throw error;
                setMessage({ type: 'success', text: 'Entry added successfully!' });
            }

            // Reset form and refresh
            resetForm();
            fetchEntries();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save: ' + error.message });
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (entry) => {
        setFormData({
            id: entry.id,
            name: entry.name,
            description: entry.description || '',
            image_url: entry.image_url || '',
            imageFile: null,
            imagePreview: entry.image_url || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (entry) => {
        if (!confirm(`Are you sure you want to delete "${entry.name}"?`)) return;

        try {
            // Delete from database
            const { error } = await supabase
                .from('hall_of_fame')
                .delete()
                .eq('id', entry.id);

            if (error) throw error;

            // Try to delete image from storage
            if (entry.image_url) {
                const urlParts = entry.image_url.split('/');
                const fileName = urlParts[urlParts.length - 1];
                await supabase.storage.from('hall-of-fame').remove([fileName]);
            }

            setMessage({ type: 'success', text: 'Entry deleted successfully!' });
            fetchEntries();
        } catch (error) {
            setMessage({ type: 'error', text: 'Delete failed: ' + error.message });
        }
    };

    const resetForm = () => {
        setFormData({
            id: null,
            name: '',
            description: '',
            image_url: '',
            imageFile: null,
            imagePreview: ''
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
                                Hall of Fame
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>
                                Manage notable achievements and people
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
                                <Plus size={18} /> Add Entry
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
                                {formData.id ? 'Edit Entry' : 'Add New Entry'}
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
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                                {/* Left: Form fields */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ color: '#fff', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                            Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="Enter name"
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

                                    <div>
                                        <label style={{ color: '#fff', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                            Description
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Enter description"
                                            rows={6}
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
                                </div>

                                {/* Right: Image upload */}
                                <div>
                                    <label style={{ color: '#fff', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                        Image
                                    </label>
                                    <div style={{
                                        width: '100%',
                                        height: '300px',
                                        border: '2px dashed rgba(255,255,255,0.3)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        background: formData.imagePreview ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.05)',
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}
                                        onClick={() => document.getElementById('image-upload').click()}
                                    >
                                        {formData.imagePreview ? (
                                            <img
                                                src={formData.imagePreview}
                                                alt="Preview"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        ) : (
                                            <>
                                                <Upload size={48} color="rgba(255,255,255,0.4)" />
                                                <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '1rem', textAlign: 'center' }}>
                                                    Click to upload image
                                                </p>
                                            </>
                                        )}
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    style={{
                                        padding: '0.75rem 2rem',
                                        background: '#fbbf24',
                                        color: '#1a1a2e',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: uploading ? 'not-allowed' : 'pointer',
                                        opacity: uploading ? 0.7 : 1
                                    }}
                                >
                                    {uploading ? 'Saving...' : (formData.id ? 'Update' : 'Add')}
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

                {/* Entries List */}
                {loading ? (
                    <div style={{
                        color: 'rgba(255,255,255,0.6)',
                        textAlign: 'center',
                        padding: '4rem'
                    }}>
                        Loading entries...
                    </div>
                ) : entries.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        border: '2px dashed rgba(255,255,255,0.2)'
                    }}>
                        <ImageIcon size={64} color="rgba(255,255,255,0.3)" />
                        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '1rem' }}>
                            No entries yet. Add your first Hall of Fame entry!
                        </p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {entries.map((entry) => (
                            <div
                                key={entry.id}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    overflow: 'hidden',
                                    transition: 'transform 0.2s',
                                }}
                            >
                                {entry.image_url && (
                                    <div style={{
                                        width: '100%',
                                        height: '200px',
                                        background: 'rgba(0,0,0,0.3)'
                                    }}>
                                        <img
                                            src={entry.image_url}
                                            alt={entry.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>
                                )}
                                <div style={{ padding: '1.5rem' }}>
                                    <h3 style={{
                                        color: '#fff',
                                        margin: '0 0 0.5rem 0',
                                        fontSize: '1.25rem'
                                    }}>
                                        {entry.name}
                                    </h3>
                                    {entry.description && (
                                        <p style={{
                                            color: 'rgba(255,255,255,0.6)',
                                            margin: '0 0 1rem 0',
                                            fontSize: '0.9rem',
                                            lineHeight: '1.5'
                                        }}>
                                            {entry.description}
                                        </p>
                                    )}
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => handleEdit(entry)}
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
                                            onClick={() => handleDelete(entry)}
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
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
