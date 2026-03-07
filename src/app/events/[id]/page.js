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

    const formatDateShort = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <>
            {/* ===== MOBILE EVENT DETAIL VIEW ===== */}
            <div className="event-detail-mobile-view">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="event-mobile-card"
                >
                    {/* Poster */}
                    <div className="event-mobile-poster-section">
                        {event.poster_url ? (
                            <img
                                src={event.poster_url}
                                alt={event.event_name}
                                className="event-mobile-poster-img"
                            />
                        ) : (
                            <div className="event-mobile-poster-placeholder">
                                <ImageIcon size={48} color="var(--text-muted)" />
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="event-mobile-body">
                        <h1 className="event-mobile-title">{event.event_name}</h1>

                        {event.event_type && (
                            <span className="event-mobile-type-badge">{event.event_type}</span>
                        )}

                        <div className="event-mobile-meta-row">
                            {event.event_date && (
                                <div className="event-mobile-meta-chip">
                                    <Calendar size={14} color="var(--secondary)" />
                                    <span>{formatDateShort(event.event_date)}</span>
                                </div>
                            )}
                            {event.venue && (
                                <div className="event-mobile-meta-chip">
                                    <MapPin size={14} color="var(--accent)" />
                                    <span>{event.venue}</span>
                                </div>
                            )}
                        </div>

                        {event.description && (
                            <div className="event-mobile-about-section">
                                <h2 className="event-mobile-about-heading">About Event</h2>
                                <p className="event-mobile-about-text">{event.description}</p>
                            </div>
                        )}

                        {/* Mobile Gallery */}
                        {event.media_urls && event.media_urls.length > 0 && (
                            <div className="event-mobile-gallery-section">
                                <div className="event-mobile-gallery-header">
                                    <ImageIcon size={18} color="var(--accent)" />
                                    <h2 className="event-mobile-gallery-title">Event Gallery</h2>
                                </div>
                                <div className="event-mobile-gallery-grid">
                                    {event.media_urls.map((url, index) => {
                                        const isVideo = url.includes('.mp4') || url.includes('.webm') || url.includes('.mov');
                                        return (
                                            <div
                                                key={index}
                                                className="event-mobile-gallery-item"
                                                onClick={() => openLightbox(index)}
                                            >
                                                {isVideo ? (
                                                    <video src={url} className="event-mobile-gallery-media" />
                                                ) : (
                                                    <img src={url} alt={`Event media ${index + 1}`} className="event-mobile-gallery-media" />
                                                )}
                                                <div className="event-mobile-gallery-overlay">
                                                    <ImageIcon size={20} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Floating Footer - only for upcoming events */}
                {(!event.event_date || new Date(event.event_date) >= new Date(new Date().toDateString())) && (
                    <div className="event-mobile-floating-footer">
                        <div className="event-mobile-footer-inner">
                            {event.registration_url ? (
                                <a
                                    href={event.registration_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="event-mobile-footer-register-btn"
                                >
                                    Register Now
                                </a>
                            ) : (
                                <span className="event-mobile-footer-closed-badge">Registration Closed</span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ===== DESKTOP EVENT DETAIL VIEW ===== */}
            <section className="section event-detail-desktop-view" style={{ paddingTop: '120px' }}>
                <div className="container">
                    {/* Back Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push('/events');
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            marginBottom: '1.5rem',
                            padding: '0.5rem 0',
                            outline: 'none',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.color = 'var(--primary)';
                            e.currentTarget.style.transform = 'translateX(-4px)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.color = 'var(--secondary)';
                            e.currentTarget.style.transform = 'translateX(0)';
                        }}
                    >
                        <ArrowLeft size={18} /> Back to Events
                    </button>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="event-detail-compact"
                        style={{
                            gridTemplateColumns: event.poster_url ? '240px 1fr' : '1fr'
                        }}
                    >
                        {/* Poster - compact */}
                        {event.poster_url && (
                            <div style={{
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                border: '1px solid var(--border)',
                                lineHeight: 0
                            }}>
                                <img
                                    src={event.poster_url}
                                    alt={event.event_name}
                                    style={{ width: '100%', height: 'auto', display: 'block' }}
                                />
                            </div>
                        )}

                        {/* Event Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {/* Event Name */}
                            <h1 style={{
                                fontSize: '1.35rem',
                                fontWeight: 700,
                                color: 'var(--primary)',
                                margin: 0,
                                lineHeight: 1.3
                            }}>
                                {event.event_name}
                            </h1>

                            {/* Event Type Badge */}
                            {event.event_type && (
                                <span style={{
                                    display: 'inline-block',
                                    padding: '3px 12px',
                                    background: 'linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(251,191,36,0.08) 100%)',
                                    border: '1px solid rgba(251,191,36,0.25)',
                                    borderRadius: '50px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    color: 'var(--accent)',
                                    width: 'fit-content'
                                }}>
                                    {event.event_type}
                                </span>
                            )}

                            {/* Date & Venue - compact inline */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {event.event_date && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        padding: '6px 12px',
                                        background: 'rgba(59,130,246,0.08)',
                                        border: '1px solid rgba(59,130,246,0.15)',
                                        borderRadius: '8px',
                                        fontSize: '0.82rem',
                                        color: 'var(--text-primary)',
                                        fontWeight: 500
                                    }}>
                                        <Calendar size={14} color="var(--secondary)" />
                                        {formatDate(event.event_date)}
                                    </div>
                                )}
                                {event.venue && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        padding: '6px 12px',
                                        background: 'rgba(251,191,36,0.08)',
                                        border: '1px solid rgba(251,191,36,0.15)',
                                        borderRadius: '8px',
                                        fontSize: '0.82rem',
                                        color: 'var(--text-primary)',
                                        fontWeight: 500
                                    }}>
                                        <MapPin size={14} color="var(--accent)" />
                                        {event.venue}
                                    </div>
                                )}
                            </div>

                            {/* Register Button - compact */}
                            {event.registration_url && (
                                <a
                                    href={event.registration_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '0.6rem 1.5rem',
                                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                        color: '#1a1a2e',
                                        textDecoration: 'none',
                                        borderRadius: '10px',
                                        fontSize: '0.9rem',
                                        fontWeight: 700,
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 3px 10px rgba(251,191,36,0.25)',
                                        width: 'fit-content'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 5px 16px rgba(251,191,36,0.35)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 3px 10px rgba(251,191,36,0.25)';
                                    }}
                                >
                                    Register Now
                                </a>
                            )}

                            {/* Description - compact */}
                            {event.description && (
                                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                                    <h2 style={{
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        color: 'var(--primary)',
                                        marginBottom: '0.4rem'
                                    }}>
                                        About This Event
                                    </h2>
                                    <p style={{
                                        color: 'var(--text-secondary)',
                                        lineHeight: 1.65,
                                        fontSize: '0.88rem',
                                        whiteSpace: 'pre-wrap',
                                        margin: 0
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
                                gap: '0.6rem',
                                marginBottom: '1.25rem'
                            }}>
                                <ImageIcon size={22} color="var(--accent)" />
                                <h2 style={{
                                    fontSize: '1.15rem',
                                    fontWeight: 600,
                                    color: 'var(--primary)',
                                    margin: 0
                                }}>
                                    Event Gallery
                                </h2>
                            </div>

                            <div className="masonry-grid">
                                {event.media_urls.map((url, index) => {
                                    const isVideo = url.includes('.mp4') || url.includes('.webm') || url.includes('.mov');
                                    return (
                                        <div
                                            key={index}
                                            className="masonry-item"
                                            onClick={() => openLightbox(index)}
                                        >
                                            {isVideo ? (
                                                <video
                                                    src={url}
                                                    className="masonry-media"
                                                />
                                            ) : (
                                                <img
                                                    src={url}
                                                    alt={`Event media ${index + 1}`}
                                                    className="masonry-media"
                                                />
                                            )}
                                            <div className="masonry-overlay">
                                                <div className="masonry-view-icon">
                                                    <ImageIcon size={24} />
                                                </div>
                                            </div>
                                        </div>
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
