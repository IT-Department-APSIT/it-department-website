'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

export default function GalleryPage() {
    const [galleryImages, setGalleryImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMedia, setSelectedMedia] = useState(null);

    // Fetch gallery images from Supabase
    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const { data, error } = await supabase
                    .from('gallery_images')
                    .select('*')
                    .order('display_order', { ascending: true });

                if (error) throw error;
                setGalleryImages(data || []);
            } catch (error) {
                console.error('Error fetching gallery:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, []);

    // Helper to detect if URL is video
    const isVideoUrl = (url) => {
        return /\.(mp4|webm|mov|avi|mkv)$/i.test(url);
    };

    // Close lightbox on ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && selectedMedia) {
                setSelectedMedia(null);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [selectedMedia]);

    // Render a gallery item
    const renderGalleryItem = (item, index) => {
        const isVideo = item.media_type === 'video' || isVideoUrl(item.image_url);

        return (
            <motion.div
                key={item.id}
                className="masonry-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedMedia(item)}
            >
                {isVideo ? (
                    <video
                        src={item.image_url}
                        className="masonry-media"
                        autoPlay
                        muted
                        playsInline
                        loop
                    />
                ) : (
                    <Image
                        src={item.image_url}
                        alt={item.alt_text || 'Gallery image'}
                        className="masonry-media"
                        width={400}
                        height={300}
                        sizes="(max-width: 768px) 50vw, 25vw"
                        loading="lazy"
                        style={{ width: '100%', height: 'auto' }}
                    />
                )}
            </motion.div>
        );
    };

    return (
        <main className="gallery-page">
            {/* Minimal Header Section */}
            <section className="gallery-page-header">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="gallery-page-header-content"
                    >
                        <h1 className="gallery-page-title">Gallery</h1>
                    </motion.div>
                </div>
            </section>

            {/* Gallery Grid Section */}
            <section className="gallery-grid-section">
                <div className="container">
                    {loading ? (
                        <div className="gallery-loading">
                            <div className="loading-spinner"></div>
                            <p>Loading gallery...</p>
                        </div>
                    ) : galleryImages.length === 0 ? (
                        <div className="gallery-empty">
                            <p>No images in the gallery yet.</p>
                        </div>
                    ) : (
                        <motion.div
                            className="masonry-grid masonry-grid-full"
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                        >
                            {galleryImages.map((item, index) => renderGalleryItem(item, index))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Lightbox Modal for Individual Media */}
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        className="gallery-lightbox-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedMedia(null)}
                    >
                        <motion.div
                            className="gallery-lightbox-content"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="gallery-lightbox-close"
                                onClick={() => setSelectedMedia(null)}
                                aria-label="Close"
                            >
                                <X size={24} />
                            </button>
                            {(selectedMedia.media_type === 'video' || isVideoUrl(selectedMedia.image_url)) ? (
                                <video
                                    src={selectedMedia.image_url}
                                    className="gallery-lightbox-media"
                                    controls
                                    autoPlay
                                />
                            ) : (
                                <Image
                                    src={selectedMedia.image_url}
                                    alt={selectedMedia.alt_text || 'Gallery image'}
                                    className="gallery-lightbox-media"
                                    width={1200}
                                    height={800}
                                    sizes="90vw"
                                    style={{ width: '100%', height: 'auto', maxHeight: '90vh', objectFit: 'contain' }}
                                />
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
