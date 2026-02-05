'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowLeft, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function EventDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

    useEffect(() => {
        if (params?.id) {
            fetchEvent();
        }
    }, [params?.id]);

    const fetchEvent = async () => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('id', params.id)
                .single();

            if (error) throw error;
            setEvent(data);
        } catch (error) {
            console.error('Error fetching event:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const openLightbox = (index) => {
        setCurrentMediaIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextMedia = () => {
        if (event?.media_urls) {
            setCurrentMediaIndex((prev) => (prev + 1) % event.media_urls.length);
        }
    };

    const prevMedia = () => {
        if (event?.media_urls) {
            setCurrentMediaIndex((prev) => (prev - 1 + event.media_urls.length) % event.media_urls.length);
        }
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)'
            }}>
                Loading event details...
            </div>
        );
    }

    if (!event) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem'
            }}>
                <p style={{ color: 'var(--text-muted)' }}>Event not found</p>
                <button className="btn btn-primary" onClick={() => router.push('/events')}>
                    <ArrowLeft size={18} /> Back to Events
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Page Header */}
            <div className="page-header">
                <div className="container">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push('/events');
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--accent)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '1rem',
                            marginBottom: '1rem',
                            padding: '0.5rem 0',
                            outline: 'none',
                            position: 'relative',
                            zIndex: 10,
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.color = 'var(--primary)';
                            e.target.style.transform = 'translateX(-2px)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.color = 'var(--accent)';
                            e.target.style.transform = 'translateX(0)';
                        }}
                    >
                        <ArrowLeft size={20} /> Back to Events
                    </button>
                    <h1>{event.event_name}</h1>
                    {event.event_type && (
                        <span style={{
                            display: 'inline-block',
                            padding: '8px 20px',
                            background: 'linear-gradient(135deg, rgba(251,191,36,0.3) 0%, rgba(251,191,36,0.2) 100%)',
                            border: '1px solid rgba(251,191,36,0.5)',
                            borderRadius: '50px',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: 'var(--accent)',
                            marginTop: '1rem'
                        }}>
                            {event.event_type}
                        </span>
                    )}
                </div>
            </div>

            {/* Event Details */}
            <section className="section">
                <div className="container">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="card event-detail-grid"
                    >
                        {/* Right Column - Poster (appears first on mobile) */}
                        {event.poster_url && (
                            <div className="event-poster-sticky">
                                <div className="event-poster-container">
                                    <img
                                        src={event.poster_url}
                                        alt={event.event_name}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Left Column - Event Details */}
                        <div className="event-detail-content">
                            {/* Date and Venue */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {event.event_date && (
                                    <div className="event-info-card" style={{
                                        background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 100%)',
                                        border: '1px solid rgba(59,130,246,0.2)'
                                    }}>
                                        <Calendar size={24} color="var(--secondary)" />
                                        <div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                                Event Date
                                            </div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                                {formatDate(event.event_date)}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {event.venue && (
                                    <div className="event-info-card" style={{
                                        background: 'linear-gradient(135deg, rgba(251,191,36,0.1) 0%, rgba(245,158,11,0.1) 100%)',
                                        border: '1px solid rgba(251,191,36,0.2)'
                                    }}>
                                        <MapPin size={24} color="var(--accent)" />
                                        <div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                                Venue
                                            </div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                                {event.venue}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {event.description && (
                                <div>
                                    <h2 style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 700,
                                        color: 'var(--primary)',
                                        marginBottom: '1rem'
                                    }}>
                                        About This Event
                                    </h2>
                                    <p style={{
                                        color: 'var(--text-secondary)',
                                        lineHeight: 1.8,
                                        fontSize: '1.05rem',
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {event.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Media Gallery */}
                    {event.media_urls && event.media_urls.length > 0 && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            style={{ marginTop: '3rem' }}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '2rem'
                            }}>
                                <ImageIcon size={32} color="var(--accent)" />
                                <h2 style={{
                                    fontSize: '1.75rem',
                                    fontWeight: 700,
                                    color: 'var(--primary)',
                                    margin: 0
                                }}>
                                    Event Gallery
                                </h2>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: '1.5rem'
                            }}>
                                {event.media_urls.map((url, index) => {
                                    const isVideo = url.includes('.mp4') || url.includes('.webm') || url.includes('.mov');
                                    return (
                                        <motion.div
                                            key={index}
                                            whileHover={{ scale: 1.05 }}
                                            style={{
                                                borderRadius: '12px',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onClick={() => openLightbox(index)}
                                        >
                                            {isVideo ? (
                                                <video
                                                    src={url}
                                                    style={{
                                                        width: '100%',
                                                        height: '250px',
                                                        objectFit: 'cover',
                                                        display: 'block'
                                                    }}
                                                />
                                            ) : (
                                                <img
                                                    src={url}
                                                    alt={`Event media ${index + 1}`}
                                                    style={{
                                                        width: '100%',
                                                        height: '250px',
                                                        objectFit: 'cover',
                                                        display: 'block'
                                                    }}
                                                />
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Lightbox */}
            {lightboxOpen && event.media_urls && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.95)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem'
                    }}
                    onClick={closeLightbox}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        style={{
                            position: 'absolute',
                            top: '2rem',
                            right: '2rem',
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#fff',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <X size={24} />
                    </button>

                    {/* Previous Button */}
                    {event.media_urls.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                prevMedia();
                            }}
                            style={{
                                position: 'absolute',
                                left: '2rem',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '50%',
                                width: '50px',
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#fff',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <ChevronLeft size={24} />
                        </button>
                    )}

                    {/* Next Button */}
                    {event.media_urls.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                nextMedia();
                            }}
                            style={{
                                position: 'absolute',
                                right: '2rem',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '50%',
                                width: '50px',
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#fff',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <ChevronRight size={24} />
                        </button>
                    )}

                    {/* Media Content */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {event.media_urls[currentMediaIndex]?.includes('.mp4') ||
                            event.media_urls[currentMediaIndex]?.includes('.webm') ||
                            event.media_urls[currentMediaIndex]?.includes('.mov') ? (
                            <video
                                src={event.media_urls[currentMediaIndex]}
                                controls
                                autoPlay
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '90vh',
                                    borderRadius: '8px'
                                }}
                            />
                        ) : (
                            <img
                                src={event.media_urls[currentMediaIndex]}
                                alt={`Event media ${currentMediaIndex + 1}`}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '90vh',
                                    borderRadius: '8px'
                                }}
                            />
                        )}
                    </div>

                    {/* Counter */}
                    {event.media_urls.length > 1 && (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '2rem',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '50px',
                                padding: '0.5rem 1.5rem',
                                color: '#fff',
                                fontSize: '0.9rem',
                                fontWeight: 600
                            }}
                        >
                            {currentMediaIndex + 1} / {event.media_urls.length}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
