"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Trash2, ArrowLeft, X, Upload, GripVertical, Image as ImageIcon, Download, Film } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export default function ManageGalleryPage() {
    const [galleryImages, setGalleryImages] = useState([]);
    const [eventImages, setEventImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [importing, setImporting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [draggedIndex, setDraggedIndex] = useState(null);

    // Form state for new files
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);

    useEffect(() => {
        fetchGalleryImages();
        fetchEventImages();
    }, []);

    const fetchGalleryImages = async () => {
        try {
            const { data, error } = await supabase
                .from('gallery_images')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) {
                if (error.code === '42P01') {
                    setMessage({
                        type: 'error',
                        text: 'Gallery table not found. Please run supabase_gallery.sql first.'
                    });
                } else {
                    throw error;
                }
            }
            setGalleryImages(data || []);
        } catch (error) {
            console.error('Error fetching gallery images:', error);
            setMessage({ type: 'error', text: 'Failed to fetch gallery: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const fetchEventImages = async () => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('id, event_name, media_urls, poster_url')
                .order('event_date', { ascending: false });

            if (error) throw error;

            const images = [];
            (data || []).forEach(event => {
                if (event.media_urls && Array.isArray(event.media_urls)) {
                    event.media_urls.forEach((url) => {
                        if (url !== event.poster_url) {
                            // Detect if it's a video based on extension
                            const isVideo = /\.(mp4|webm|mov|avi|mkv)$/i.test(url);
                            images.push({
                                url,
                                event_name: event.event_name,
                                media_type: isVideo ? 'video' : 'image'
                            });
                        }
                    });
                }
            });
            setEventImages(images);
        } catch (error) {
            console.error('Error fetching event images:', error);
        }
    };

    const handleImportFromEvents = async () => {
        if (eventImages.length === 0) {
            setMessage({ type: 'error', text: 'No event media to import' });
            return;
        }

        setImporting(true);
        setMessage({ type: '', text: '' });

        try {
            const existingUrls = new Set(galleryImages.map(img => img.image_url));
            const newImages = eventImages.filter(img => !existingUrls.has(img.url));

            if (newImages.length === 0) {
                setMessage({ type: 'info', text: 'All event media is already in the gallery!' });
                setShowImportModal(false);
                setImporting(false);
                return;
            }

            const maxOrder = galleryImages.length > 0
                ? Math.max(...galleryImages.map(img => img.display_order || 0))
                : 0;

            const imagesToInsert = newImages.map((img, index) => ({
                image_url: img.url,
                media_type: img.media_type,
                display_order: maxOrder + index + 1
            }));

            const { error } = await supabase
                .from('gallery_images')
                .insert(imagesToInsert);

            if (error) throw error;

            setMessage({ type: 'success', text: `Imported ${newImages.length} item(s) from events!` });
            setShowImportModal(false);
            fetchGalleryImages();
        } catch (error) {
            setMessage({ type: 'error', text: 'Import failed: ' + error.message });
        } finally {
            setImporting(false);
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const validFiles = [];
        const errors = [];

        files.forEach(file => {
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');

            if (!isImage && !isVideo) {
                errors.push(`${file.name}: Only images and videos allowed`);
                return;
            }

            if (file.size > MAX_FILE_SIZE) {
                errors.push(`${file.name}: File too large (max 15MB)`);
                return;
            }

            validFiles.push(file);
        });

        if (errors.length > 0) {
            setMessage({ type: 'error', text: errors.join('. ') });
        }

        if (validFiles.length === 0) return;

        const previews = [];
        let loadedCount = 0;

        validFiles.forEach(file => {
            const isVideo = file.type.startsWith('video/');
            const reader = new FileReader();
            reader.onloadend = () => {
                previews.push({
                    file,
                    preview: reader.result,
                    isVideo,
                    name: file.name
                });
                loadedCount++;

                if (loadedCount === validFiles.length) {
                    setSelectedFiles(prev => [...prev, ...validFiles]);
                    setFilePreviews(prev => [...prev, ...previews]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeSelectedFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setFilePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const uploadFile = async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `gallery_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('gallery-images')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
            .from('gallery-images')
            .getPublicUrl(fileName);

        return {
            url: urlData.publicUrl,
            isVideo: file.type.startsWith('video/')
        };
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setMessage({ type: 'error', text: 'Please select at least one file' });
            return;
        }

        setUploading(true);
        setMessage({ type: '', text: '' });

        try {
            const uploadedFiles = await Promise.all(
                selectedFiles.map(file => uploadFile(file))
            );

            const maxOrder = galleryImages.length > 0
                ? Math.max(...galleryImages.map(img => img.display_order || 0))
                : 0;

            const itemsToInsert = uploadedFiles.map((item, index) => ({
                image_url: item.url,
                media_type: item.isVideo ? 'video' : 'image',
                display_order: maxOrder + index + 1
            }));

            const { error } = await supabase
                .from('gallery_images')
                .insert(itemsToInsert);

            if (error) throw error;

            setMessage({ type: 'success', text: `Added ${uploadedFiles.length} item(s) to gallery!` });
            setSelectedFiles([]);
            setFilePreviews([]);
            setShowUploadForm(false);
            fetchGalleryImages();
        } catch (error) {
            setMessage({ type: 'error', text: 'Upload failed: ' + error.message });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (image) => {
        if (!confirm('Remove this from gallery? (Original file will not be deleted)')) return;

        try {
            const { error } = await supabase
                .from('gallery_images')
                .delete()
                .eq('id', image.id);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Removed from gallery!' });
            fetchGalleryImages();
        } catch (error) {
            setMessage({ type: 'error', text: 'Delete failed: ' + error.message });
        }
    };

    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (dropIndex) => {
        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            return;
        }

        const newImages = [...galleryImages];
        const [draggedItem] = newImages.splice(draggedIndex, 1);
        newImages.splice(dropIndex, 0, draggedItem);

        const reorderedImages = newImages.map((img, index) => ({
            ...img,
            display_order: index + 1
        }));

        setGalleryImages(reorderedImages);
        setDraggedIndex(null);

        try {
            for (const img of reorderedImages) {
                await supabase
                    .from('gallery_images')
                    .update({ display_order: img.display_order })
                    .eq('id', img.id);
            }
            setMessage({ type: 'success', text: 'Order updated!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save order: ' + error.message });
            fetchGalleryImages();
        }
    };

    // Helper to detect if URL is video
    const isVideoUrl = (url) => {
        return /\.(mp4|webm|mov|avi|mkv)$/i.test(url);
    };

    const existingUrls = new Set(galleryImages.map(img => img.image_url));
    const newEventImagesCount = eventImages.filter(img => !existingUrls.has(img.url)).length;

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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h1 style={{
                                fontSize: '2rem',
                                fontWeight: '700',
                                color: '#fff',
                                margin: 0
                            }}>
                                Manage Gallery
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>
                                Images & videos (up to 15MB) • Drag to reorder • Remove only hides from gallery
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {newEventImagesCount > 0 && (
                                <button
                                    onClick={() => setShowImportModal(true)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem 1.25rem',
                                        background: 'rgba(59, 130, 246, 0.2)',
                                        color: '#60a5fa',
                                        border: '1px solid #3b82f6',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Download size={18} /> Import from Events ({newEventImagesCount})
                                </button>
                            )}
                            {!showUploadForm && (
                                <button
                                    onClick={() => setShowUploadForm(true)}
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
                                    <Plus size={18} /> Add Media
                                </button>
                            )}
                        </div>
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
                            : message.type === 'info'
                                ? 'rgba(59, 130, 246, 0.2)'
                                : 'rgba(34, 197, 94, 0.2)',
                        border: `1px solid ${message.type === 'error' ? '#ef4444' : message.type === 'info' ? '#3b82f6' : '#22c55e'}`,
                        color: message.type === 'error' ? '#fca5a5' : message.type === 'info' ? '#93c5fd' : '#86efac'
                    }}>
                        {message.text}
                    </div>
                )}

                {/* Import Modal */}
                {showImportModal && (
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '2rem',
                        marginBottom: '2rem'
                    }}>
                        <h2 style={{ color: '#fff', margin: '0 0 1rem 0', fontSize: '1.5rem' }}>
                            Import from Events
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
                            This will add {newEventImagesCount} item(s) from your events to the gallery.
                            Already imported items will be skipped.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={handleImportFromEvents}
                                disabled={importing}
                                style={{
                                    padding: '0.75rem 2rem',
                                    background: '#3b82f6',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: importing ? 'not-allowed' : 'pointer',
                                    opacity: importing ? 0.7 : 1
                                }}
                            >
                                {importing ? 'Importing...' : 'Import All'}
                            </button>
                            <button
                                onClick={() => setShowImportModal(false)}
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
                    </div>
                )}

                {/* Upload Form */}
                {showUploadForm && (
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '2rem',
                        marginBottom: '2rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ color: '#fff', margin: 0, fontSize: '1.5rem' }}>
                                Add Images & Videos
                            </h2>
                            <button
                                onClick={() => {
                                    setShowUploadForm(false);
                                    setSelectedFiles([]);
                                    setFilePreviews([]);
                                }}
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

                        <div style={{
                            width: '100%',
                            minHeight: '200px',
                            border: '2px dashed rgba(255,255,255,0.3)',
                            borderRadius: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '2rem',
                            marginBottom: '1.5rem'
                        }}
                            onClick={() => document.getElementById('gallery-upload').click()}
                        >
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <ImageIcon size={40} color="rgba(255,255,255,0.4)" />
                                <Film size={40} color="rgba(255,255,255,0.4)" />
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
                                Click to select images or videos
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                Max file size: 15MB per file
                            </p>
                            <input
                                id="gallery-upload"
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                            />
                        </div>

                        {filePreviews.length > 0 && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                                gap: '1rem',
                                marginBottom: '1.5rem'
                            }}>
                                {filePreviews.map((item, idx) => (
                                    <div key={idx} style={{ position: 'relative' }}>
                                        {item.isVideo ? (
                                            <div style={{
                                                width: '100%',
                                                height: '150px',
                                                borderRadius: '8px',
                                                background: 'rgba(0,0,0,0.5)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'rgba(255,255,255,0.7)'
                                            }}>
                                                <Film size={40} />
                                                <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', padding: '0 0.5rem', textAlign: 'center', wordBreak: 'break-all' }}>
                                                    {item.name}
                                                </span>
                                            </div>
                                        ) : (
                                            <img
                                                src={item.preview}
                                                alt={`Preview ${idx + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '150px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                        )}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeSelectedFile(idx);
                                            }}
                                            style={{
                                                position: 'absolute',
                                                top: '0.5rem',
                                                right: '0.5rem',
                                                background: 'rgba(239, 68, 68, 0.9)',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '24px',
                                                height: '24px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                color: '#fff'
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={handleUpload}
                                disabled={uploading || selectedFiles.length === 0}
                                style={{
                                    padding: '0.75rem 2rem',
                                    background: '#fbbf24',
                                    color: '#1a1a2e',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: (uploading || selectedFiles.length === 0) ? 'not-allowed' : 'pointer',
                                    opacity: (uploading || selectedFiles.length === 0) ? 0.5 : 1
                                }}
                            >
                                {uploading ? 'Uploading...' : `Add ${selectedFiles.length} Item(s)`}
                            </button>
                            <button
                                onClick={() => {
                                    setShowUploadForm(false);
                                    setSelectedFiles([]);
                                    setFilePreviews([]);
                                }}
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
                    </div>
                )}

                {/* Gallery Grid */}
                {loading ? (
                    <div style={{
                        color: 'rgba(255,255,255,0.6)',
                        textAlign: 'center',
                        padding: '4rem'
                    }}>
                        Loading gallery...
                    </div>
                ) : galleryImages.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        border: '2px dashed rgba(255,255,255,0.2)'
                    }}>
                        <ImageIcon size={64} color="rgba(255,255,255,0.3)" />
                        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '1rem' }}>
                            No media in gallery yet.
                        </p>
                        {newEventImagesCount > 0 && (
                            <button
                                onClick={() => setShowImportModal(true)}
                                style={{
                                    marginTop: '1rem',
                                    padding: '0.75rem 1.5rem',
                                    background: '#3b82f6',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Import {newEventImagesCount} items from Events
                            </button>
                        )}
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {galleryImages.map((image, index) => {
                            const isVideo = image.media_type === 'video' || isVideoUrl(image.image_url);

                            return (
                                <div
                                    key={image.id}
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={handleDragOver}
                                    onDrop={() => handleDrop(index)}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        overflow: 'hidden',
                                        cursor: 'move',
                                        transition: 'all 0.3s ease',
                                        opacity: draggedIndex === index ? 0.5 : 1,
                                        transform: draggedIndex === index ? 'scale(1.02)' : 'scale(1)'
                                    }}
                                >
                                    <div style={{
                                        padding: '0.5rem 0.75rem',
                                        background: 'rgba(0,0,0,0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)' }}>
                                            <GripVertical size={16} />
                                            <span style={{ fontSize: '0.75rem' }}>#{image.display_order}</span>
                                            {isVideo && <Film size={14} color="#60a5fa" />}
                                        </div>
                                        <button
                                            onClick={() => handleDelete(image)}
                                            style={{
                                                background: 'rgba(239, 68, 68, 0.2)',
                                                border: '1px solid #ef4444',
                                                borderRadius: '4px',
                                                color: '#f87171',
                                                cursor: 'pointer',
                                                padding: '0.25rem 0.5rem',
                                                fontSize: '0.75rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.25rem'
                                            }}
                                        >
                                            <Trash2 size={12} /> Remove
                                        </button>
                                    </div>

                                    <div style={{ width: '100%', height: '200px', background: 'rgba(0,0,0,0.3)' }}>
                                        {isVideo ? (
                                            <video
                                                src={image.image_url}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                                muted
                                                playsInline
                                                onMouseEnter={(e) => e.target.play()}
                                                onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                                            />
                                        ) : (
                                            <img
                                                src={image.image_url}
                                                alt="Gallery image"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
