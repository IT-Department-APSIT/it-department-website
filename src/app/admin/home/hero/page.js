"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Upload, Trash2, GripVertical, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Reorder } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

export default function AdminHeroPage() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Fetch hero images on mount
    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const { data, error } = await supabase
                .from('hero_images')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            setImages(data || []);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to fetch images: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: 'Please select an image file' });
            return;
        }

        setUploading(true);
        setMessage({ type: '', text: '' });

        try {
            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `hero_${Date.now()}.${fileExt}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('hero-images')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('hero-images')
                .getPublicUrl(fileName);

            // Get max display order
            const maxOrder = images.length > 0
                ? Math.max(...images.map(img => img.display_order))
                : -1;

            // Insert into database
            const { data: newImage, error: dbError } = await supabase
                .from('hero_images')
                .insert({
                    image_url: urlData.publicUrl,
                    display_order: maxOrder + 1,
                    alt_text: file.name.split('.')[0]
                })
                .select()
                .single();

            if (dbError) throw dbError;

            setImages([...images, newImage]);
            setMessage({ type: 'success', text: 'Image uploaded successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Upload failed: ' + error.message });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (imageToDelete) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            // Extract filename from URL
            const urlParts = imageToDelete.image_url.split('/');
            const fileName = urlParts[urlParts.length - 1];

            // Delete from storage
            const { error: storageError } = await supabase.storage
                .from('hero-images')
                .remove([fileName]);

            if (storageError) console.warn('Storage delete warning:', storageError);

            // Delete from database
            const { error: dbError } = await supabase
                .from('hero_images')
                .delete()
                .eq('id', imageToDelete.id);

            if (dbError) throw dbError;

            setImages(images.filter(img => img.id !== imageToDelete.id));
            setMessage({ type: 'success', text: 'Image deleted successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Delete failed: ' + error.message });
        }
    };

    const handleSaveOrder = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // Update display_order for each image
            const updates = images.map((img, index) =>
                supabase
                    .from('hero_images')
                    .update({ display_order: index })
                    .eq('id', img.id)
            );

            await Promise.all(updates);
            setMessage({ type: 'success', text: 'Order saved successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save order: ' + error.message });
        } finally {
            setSaving(false);
        }
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
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#fff',
                        margin: 0
                    }}>
                        Hero Images
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>
                        Manage homepage hero carousel images. Drag to reorder.
                    </p>
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

                {/* Actions */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '2rem',
                    flexWrap: 'wrap'
                }}>
                    <label style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        background: '#fbbf24',
                        color: '#1a1a2e',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: uploading ? 'not-allowed' : 'pointer',
                        opacity: uploading ? 0.7 : 1
                    }}>
                        <Upload size={18} />
                        {uploading ? 'Uploading...' : 'Upload Image'}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={uploading}
                            style={{ display: 'none' }}
                        />
                    </label>

                    {images.length > 1 && (
                        <button
                            onClick={handleSaveOrder}
                            disabled={saving}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.5rem',
                                background: 'rgba(34, 197, 94, 0.2)',
                                color: '#22c55e',
                                border: '1px solid #22c55e',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                opacity: saving ? 0.7 : 1
                            }}
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save Order'}
                        </button>
                    )}
                </div>

                {/* Image Grid */}
                {loading ? (
                    <div style={{
                        color: 'rgba(255,255,255,0.6)',
                        textAlign: 'center',
                        padding: '4rem'
                    }}>
                        Loading images...
                    </div>
                ) : images.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        border: '2px dashed rgba(255,255,255,0.2)'
                    }}>
                        <ImageIcon size={64} color="rgba(255,255,255,0.3)" />
                        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '1rem' }}>
                            No hero images yet. Upload your first image!
                        </p>
                    </div>
                ) : (
                    <Reorder.Group
                        axis="y"
                        values={images}
                        onReorder={setImages}
                        style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}
                    >
                        {images.map((image) => (
                            <Reorder.Item
                                key={image.id}
                                value={image}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    cursor: 'grab'
                                }}
                                whileDrag={{
                                    scale: 1.02,
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                                    cursor: 'grabbing'
                                }}
                            >
                                <GripVertical
                                    size={24}
                                    color="rgba(255,255,255,0.4)"
                                    style={{ flexShrink: 0 }}
                                />
                                <div style={{
                                    width: '200px',
                                    height: '120px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                    background: 'rgba(0,0,0,0.3)'
                                }}>
                                    <img
                                        src={image.image_url}
                                        alt={image.alt_text || 'Hero image'}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{
                                        color: '#fff',
                                        margin: 0,
                                        fontSize: '0.9rem',
                                        wordBreak: 'break-all'
                                    }}>
                                        {image.alt_text || 'No description'}
                                    </p>
                                    <p style={{
                                        color: 'rgba(255,255,255,0.4)',
                                        margin: '0.25rem 0 0',
                                        fontSize: '0.75rem'
                                    }}>
                                        Order: {image.display_order}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(image)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '40px',
                                        height: '40px',
                                        background: 'rgba(239, 68, 68, 0.2)',
                                        border: '1px solid #ef4444',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        flexShrink: 0
                                    }}
                                >
                                    <Trash2 size={18} color="#ef4444" />
                                </button>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                )}
            </div>
        </div>
    );
}
