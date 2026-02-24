"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Edit2, ArrowLeft, X, Upload, Calendar, MapPin, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminEventsManagePage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Form state
    const [formData, setFormData] = useState({
        id: null,
        event_name: '',
        description: '',
        event_type: '',
        event_date: '',
        venue: '',
        registration_url: '',
        poster_url: '',
        posterFile: null,
        posterPreview: '',
        media_urls: [],
        mediaFiles: [],
        mediaPreviews: []
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('event_date', { ascending: false });

            if (error) throw error;
            setEvents(data || []);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to fetch events: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const handlePosterSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: 'Please select an image file for poster' });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({
                ...prev,
                posterFile: file,
                posterPreview: reader.result
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleMediaSelect = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const validFiles = files.filter(file =>
            file.type.startsWith('image/') || file.type.startsWith('video/')
        );

        if (validFiles.length !== files.length) {
            setMessage({ type: 'error', text: 'Only image and video files are allowed' });
        }

        const previews = [];
        let loadedCount = 0;

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                previews.push({ file, preview: reader.result, type: file.type });
                loadedCount++;

                if (loadedCount === validFiles.length) {
                    setFormData(prev => ({
                        ...prev,
                        mediaFiles: [...prev.mediaFiles, ...validFiles],
                        mediaPreviews: [...prev.mediaPreviews, ...previews]
                    }));
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeMedia = (index) => {
        setFormData(prev => ({
            ...prev,
            mediaFiles: prev.mediaFiles.filter((_, i) => i !== index),
            mediaPreviews: prev.mediaPreviews.filter((_, i) => i !== index)
        }));
    };

    const removeExistingMedia = (index) => {
        setFormData(prev => ({
            ...prev,
            media_urls: prev.media_urls.filter((_, i) => i !== index)
        }));
    };

    const uploadFile = async (file, bucket) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${bucket}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        return urlData.publicUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.event_name.trim()) {
            setMessage({ type: 'error', text: 'Event name is required' });
            return;
        }

        setUploading(true);
        setMessage({ type: '', text: '' });

        try {
            let posterUrl = formData.poster_url;
            let mediaUrls = formData.media_urls;

            // Upload poster if new file selected
            if (formData.posterFile) {
                posterUrl = await uploadFile(formData.posterFile, 'event-posters');
            }

            // Upload media files if any
            if (formData.mediaFiles.length > 0) {
                const uploadedMediaUrls = await Promise.all(
                    formData.mediaFiles.map(file => uploadFile(file, 'event-media'))
                );
                mediaUrls = [...mediaUrls, ...uploadedMediaUrls];
            }

            const dataToSave = {
                event_name: formData.event_name.trim(),
                description: formData.description.trim(),
                event_type: formData.event_type.trim(),
                event_date: formData.event_date || null,
                venue: formData.venue.trim(),
                registration_url: formData.registration_url.trim(),
                poster_url: posterUrl,
                media_urls: mediaUrls,
                updated_at: new Date().toISOString()
            };

            if (formData.id) {
                // Update existing
                const { error } = await supabase
                    .from('events')
                    .update(dataToSave)
                    .eq('id', formData.id);

                if (error) throw error;
                setMessage({ type: 'success', text: 'Event updated successfully!' });
            } else {
                // Create new
                const { error } = await supabase
                    .from('events')
                    .insert(dataToSave);

                if (error) throw error;
                setMessage({ type: 'success', text: 'Event created successfully!' });
            }

            resetForm();
            fetchEvents();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save: ' + error.message });
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (event) => {
        setFormData({
            id: event.id,
            event_name: event.event_name,
            description: event.description || '',
            event_type: event.event_type || '',
            event_date: event.event_date || '',
            venue: event.venue || '',
            registration_url: event.registration_url || '',
            poster_url: event.poster_url || '',
            posterFile: null,
            posterPreview: event.poster_url || '',
            media_urls: event.media_urls || [],
            mediaFiles: [],
            mediaPreviews: []
        });
        setShowForm(true);
    };

    const handleDelete = async (event) => {
        if (!confirm(`Are you sure you want to delete "${event.event_name}"?`)) return;

        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', event.id);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Event deleted successfully!' });
            fetchEvents();
        } catch (error) {
            setMessage({ type: 'error', text: 'Delete failed: ' + error.message });
        }
    };

    const resetForm = () => {
        setFormData({
            id: null,
            event_name: '',
            description: '',
            event_type: '',
            event_date: '',
            venue: '',
            registration_url: '',
            poster_url: '',
            posterFile: null,
            posterPreview: '',
            media_urls: [],
            mediaFiles: [],
            mediaPreviews: []
        });
        setShowForm(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            padding: '2rem'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <Link
                        href="/admin/events"
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
                        <ArrowLeft size={18} /> Back to Events Management
                    </Link>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 style={{
                                fontSize: '2rem',
                                fontWeight: '700',
                                color: '#fff',
                                margin: 0
                            }}>
                                Create/Manage Events
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>
                                Add and manage department events
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
                                <Plus size={18} /> Create Event
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
                                {formData.id ? 'Edit Event' : 'Create New Event'}
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
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                                {/* Left Column */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ color: '#fff', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                            Event Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.event_name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, event_name: e.target.value }))}
                                            placeholder="Enter event name"
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
                                            Event Type
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.event_type}
                                            onChange={(e) => setFormData(prev => ({ ...prev, event_type: e.target.value }))}
                                            placeholder="e.g., Workshop, Seminar, Competition"
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
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.event_date}
                                            onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                background: 'rgba(255,255,255,0.1)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                borderRadius: '8px',
                                                color: '#fff',
                                                fontSize: '1rem',
                                                colorScheme: 'dark'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: '#fff', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                            Venue
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.venue}
                                            onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                                            placeholder="Enter venue"
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
                                            Registration URL (Optional)
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.registration_url}
                                            onChange={(e) => setFormData(prev => ({ ...prev, registration_url: e.target.value }))}
                                            placeholder="https://example.com/register"
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
                                </div>

                                {/* Right Column */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ color: '#fff', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                            Description
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Enter event description"
                                            rows={8}
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
                            </div>

                            {/* Poster Upload */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ color: '#fff', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Event Poster
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
                                    background: formData.posterPreview ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.05)',
                                    overflow: 'hidden'
                                }}
                                    onClick={() => document.getElementById('poster-upload').click()}
                                >
                                    {formData.posterPreview ? (
                                        <img
                                            src={formData.posterPreview}
                                            alt="Poster preview"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain'
                                            }}
                                        />
                                    ) : (
                                        <>
                                            <Upload size={48} color="rgba(255,255,255,0.4)" />
                                            <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '1rem' }}>
                                                Click to upload event poster
                                            </p>
                                        </>
                                    )}
                                    <input
                                        id="poster-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePosterSelect}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>

                            {/* Media Upload */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ color: '#fff', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Event Media (Images/Videos)
                                </label>

                                {/* Existing Uploaded Media */}
                                {formData.media_urls && formData.media_urls.length > 0 && (
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: '0.75rem'
                                        }}>
                                            <p style={{
                                                color: 'rgba(255,255,255,0.7)',
                                                margin: 0,
                                                fontSize: '0.9rem',
                                                fontWeight: '500'
                                            }}>
                                                Uploaded Media ({formData.media_urls.length} file{formData.media_urls.length !== 1 ? 's' : ''})
                                            </p>
                                        </div>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                                            gap: '1rem',
                                            padding: '1rem',
                                            background: 'rgba(255,255,255,0.03)',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255,255,255,0.08)'
                                        }}>
                                            {formData.media_urls.map((url, idx) => {
                                                const isVideo = url.match(/\.(mp4|webm|ogg|mov)$/i);
                                                return (
                                                    <div key={`existing-${idx}`} style={{
                                                        position: 'relative',
                                                        borderRadius: '8px',
                                                        overflow: 'hidden',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                                    }}
                                                        onMouseOver={(e) => {
                                                            e.currentTarget.style.transform = 'scale(1.03)';
                                                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
                                                        }}
                                                        onMouseOut={(e) => {
                                                            e.currentTarget.style.transform = 'scale(1)';
                                                            e.currentTarget.style.boxShadow = 'none';
                                                        }}
                                                    >
                                                        {isVideo ? (
                                                            <video
                                                                src={url}
                                                                style={{
                                                                    width: '100%',
                                                                    height: '150px',
                                                                    objectFit: 'cover',
                                                                    display: 'block'
                                                                }}
                                                            />
                                                        ) : (
                                                            <img
                                                                src={url}
                                                                alt={`Existing media ${idx + 1}`}
                                                                style={{
                                                                    width: '100%',
                                                                    height: '150px',
                                                                    objectFit: 'cover',
                                                                    display: 'block'
                                                                }}
                                                            />
                                                        )}
                                                        {/* Delete overlay */}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeExistingMedia(idx);
                                                            }}
                                                            title="Remove this media"
                                                            style={{
                                                                position: 'absolute',
                                                                top: '0.4rem',
                                                                right: '0.4rem',
                                                                background: 'rgba(239, 68, 68, 0.9)',
                                                                border: 'none',
                                                                borderRadius: '50%',
                                                                width: '28px',
                                                                height: '28px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                cursor: 'pointer',
                                                                color: '#fff',
                                                                transition: 'background 0.2s ease, transform 0.2s ease',
                                                                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                                                            }}
                                                            onMouseOver={(e) => {
                                                                e.currentTarget.style.background = 'rgba(220, 38, 38, 1)';
                                                                e.currentTarget.style.transform = 'scale(1.15)';
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)';
                                                                e.currentTarget.style.transform = 'scale(1)';
                                                            }}
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Upload new media */}
                                <div style={{
                                    width: '100%',
                                    minHeight: '150px',
                                    border: '2px dashed rgba(255,255,255,0.3)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    background: 'rgba(255,255,255,0.05)',
                                    padding: '1rem'
                                }}
                                    onClick={() => document.getElementById('media-upload').click()}
                                >
                                    <Upload size={40} color="rgba(255,255,255,0.4)" />
                                    <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem', textAlign: 'center' }}>
                                        Click to upload {formData.media_urls && formData.media_urls.length > 0 ? 'more' : ''} media files (multiple allowed)
                                    </p>
                                    <input
                                        id="media-upload"
                                        type="file"
                                        accept="image/*,video/*"
                                        multiple
                                        onChange={handleMediaSelect}
                                        style={{ display: 'none' }}
                                    />
                                </div>

                                {/* New Media Previews */}
                                {formData.mediaPreviews.length > 0 && (
                                    <div style={{ marginTop: '1rem' }}>
                                        <p style={{
                                            color: 'rgba(255,255,255,0.7)',
                                            margin: '0 0 0.75rem 0',
                                            fontSize: '0.9rem',
                                            fontWeight: '500'
                                        }}>
                                            New Media to Upload ({formData.mediaPreviews.length} file{formData.mediaPreviews.length !== 1 ? 's' : ''})
                                        </p>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                                            gap: '1rem'
                                        }}>
                                            {formData.mediaPreviews.map((item, idx) => (
                                                <div key={idx} style={{
                                                    position: 'relative',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    border: '1px solid rgba(251, 191, 36, 0.3)'
                                                }}>
                                                    {item.type.startsWith('image/') ? (
                                                        <img
                                                            src={item.preview}
                                                            alt={`Media ${idx + 1}`}
                                                            style={{
                                                                width: '100%',
                                                                height: '150px',
                                                                objectFit: 'cover',
                                                                display: 'block'
                                                            }}
                                                        />
                                                    ) : (
                                                        <video
                                                            src={item.preview}
                                                            style={{
                                                                width: '100%',
                                                                height: '150px',
                                                                objectFit: 'cover',
                                                                display: 'block'
                                                            }}
                                                        />
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeMedia(idx);
                                                        }}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '0.4rem',
                                                            right: '0.4rem',
                                                            background: 'rgba(239, 68, 68, 0.9)',
                                                            border: 'none',
                                                            borderRadius: '50%',
                                                            width: '28px',
                                                            height: '28px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            cursor: 'pointer',
                                                            color: '#fff',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                                                        }}
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
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
                                    {uploading ? 'Saving...' : (formData.id ? 'Update Event' : 'Create Event')}
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

                {/* Events List */}
                {loading ? (
                    <div style={{
                        color: 'rgba(255,255,255,0.6)',
                        textAlign: 'center',
                        padding: '4rem'
                    }}>
                        Loading events...
                    </div>
                ) : events.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        border: '2px dashed rgba(255,255,255,0.2)'
                    }}>
                        <Calendar size={64} color="rgba(255,255,255,0.3)" />
                        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '1rem' }}>
                            No events yet. Create your first event!
                        </p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {events.map((event) => (
                            <div
                                key={event.id}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    overflow: 'hidden'
                                }}
                            >
                                {event.poster_url && (
                                    <div style={{ width: '100%', height: '200px', background: 'rgba(0,0,0,0.3)' }}>
                                        <img
                                            src={event.poster_url}
                                            alt={event.event_name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>
                                )}
                                <div style={{ padding: '1.5rem' }}>
                                    <h3 style={{ color: '#fff', margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>
                                        {event.event_name}
                                    </h3>
                                    {event.event_type && (
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '0.25rem 0.75rem',
                                            background: 'rgba(251, 191, 36, 0.2)',
                                            border: '1px solid rgba(251, 191, 36, 0.4)',
                                            borderRadius: '12px',
                                            color: '#fbbf24',
                                            fontSize: '0.75rem',
                                            marginBottom: '0.75rem'
                                        }}>
                                            {event.event_type}
                                        </span>
                                    )}
                                    {event.description && (
                                        <p style={{
                                            color: 'rgba(255,255,255,0.6)',
                                            margin: '0 0 1rem 0',
                                            fontSize: '0.9rem',
                                            lineHeight: '1.5'
                                        }}>
                                            {event.description}
                                        </p>
                                    )}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                                        {event.event_date && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                                                <Calendar size={16} />
                                                {new Date(event.event_date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        )}
                                        {event.venue && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                                                <MapPin size={16} />
                                                {event.venue}
                                            </div>
                                        )}
                                        {event.media_urls && event.media_urls.length > 0 && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                                                <ImageIcon size={16} />
                                                {event.media_urls.length} media file(s)
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => handleEdit(event)}
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
                                            onClick={() => handleDelete(event)}
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
