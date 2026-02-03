'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function EventsPage() {
    const router = useRouter();
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];

            // Fetch upcoming events
            const { data: upcoming, error: upcomingError } = await supabase
                .from('events')
                .select('*')
                .gte('event_date', today)
                .order('event_date', { ascending: true });

            if (upcomingError) throw upcomingError;

            // Fetch past events
            const { data: past, error: pastError } = await supabase
                .from('events')
                .select('*')
                .lt('event_date', today)
                .order('event_date', { ascending: false });

            if (pastError) throw pastError;

            setUpcomingEvents(upcoming || []);
            setPastEvents(past || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleEventClick = (eventId) => {
        router.push(`/events/${eventId}`);
    };

    return (
        <>
            {/* Page Header */}
            <div className="page-header">
                <div className="container">
                    <h1>Events</h1>
                    <p>Stay updated with our workshops, seminars, and technical events</p>
                </div>
            </div>

            {/* Upcoming Events */}
            <section className="section">
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <motion.h2 variants={fadeInUp} className="section-title">
                            Upcoming Events
                        </motion.h2>
                        <motion.p variants={fadeInUp} className="section-subtitle">
                            Don't miss out on these exciting opportunities to learn and grow.
                        </motion.p>
                    </motion.div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            Loading events...
                        </div>
                    ) : upcomingEvents.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            No upcoming events at the moment.
                        </div>
                    ) : (
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            style={{ display: 'grid', gap: '24px' }}
                        >
                            {upcomingEvents.map((event, index) => (
                                <motion.div
                                    key={event.id}
                                    variants={fadeInUp}
                                    className="card"
                                    onClick={() => handleEventClick(event.id)}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: event.poster_url ? '300px 1fr' : '1fr',
                                        gap: '24px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                    }}
                                    whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                                >
                                    {event.poster_url && (
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            minHeight: '250px',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            background: 'linear-gradient(135deg, rgba(251,191,36,0.1) 0%, rgba(59,130,246,0.1) 100%)'
                                        }}>
                                            <img
                                                src={event.poster_url}
                                                alt={event.event_name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: event.poster_url ? '0' : '0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                            {event.event_type && (
                                                <span style={{
                                                    padding: '6px 16px',
                                                    background: 'linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(251,191,36,0.1) 100%)',
                                                    border: '1px solid rgba(251,191,36,0.3)',
                                                    borderRadius: '50px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 600,
                                                    color: 'var(--accent)',
                                                }}>
                                                    {event.event_type}
                                                </span>
                                            )}

                                        </div>

                                        <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
                                            {event.event_name}
                                        </h3>

                                        {event.description && (
                                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                                                {event.description.length > 200
                                                    ? event.description.substring(0, 200) + '...'
                                                    : event.description}
                                            </p>
                                        )}

                                        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 8 }}>
                                            {event.event_date && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                    <Calendar size={18} color="var(--secondary)" /> {formatDate(event.event_date)}
                                                </span>
                                            )}
                                            {event.venue && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                    <MapPin size={18} color="var(--secondary)" /> {event.venue}
                                                </span>
                                            )}
                                        </div>

                                        <div style={{ marginTop: 'auto' }}>
                                            <button
                                                className="btn btn-primary"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEventClick(event.id);
                                                }}
                                            >
                                                View Details <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Past Events */}
            {pastEvents.length > 0 && (
                <section className="section section-alt">
                    <div className="container">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            <motion.h2 variants={fadeInUp} className="section-title">
                                Past Events
                            </motion.h2>
                            <motion.p variants={fadeInUp} className="section-subtitle">
                                A look back at our successful events and activities.
                            </motion.p>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: '20px'
                            }}
                        >
                            {pastEvents.map((event) => (
                                <motion.div
                                    key={event.id}
                                    variants={fadeInUp}
                                    className="card"
                                    onClick={() => handleEventClick(event.id)}
                                    style={{
                                        padding: '1.5rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1rem',
                                        minHeight: '220px',
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                                    }}
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                                        background: 'linear-gradient(135deg, rgba(251,191,36,0.1) 0%, rgba(59,130,246,0.1) 100%)'
                                    }}
                                >
                                    {/* Header with badge and date */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {event.event_type && (
                                            <span style={{
                                                padding: '4px 12px',
                                                background: 'rgba(251,191,36,0.15)',
                                                border: '1px solid rgba(251,191,36,0.3)',
                                                borderRadius: '50px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                color: 'var(--accent)',
                                            }}>
                                                {event.event_type}
                                            </span>
                                        )}
                                        {event.event_date && (
                                            <span style={{
                                                fontSize: '0.8rem',
                                                color: 'var(--text-muted)',
                                                fontWeight: 500
                                            }}>
                                                {formatDate(event.event_date)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Event Name */}
                                    <h3 style={{
                                        fontSize: '1.15rem',
                                        fontWeight: 600,
                                        color: 'var(--text-primary)',
                                        margin: 0,
                                        lineHeight: 1.3
                                    }}>
                                        {event.event_name}
                                    </h3>

                                    {/* Description */}
                                    {event.description && (
                                        <p style={{
                                            fontSize: '0.875rem',
                                            color: 'var(--text-secondary)',
                                            margin: 0,
                                            lineHeight: 1.5,
                                            flex: 1,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {event.description}
                                        </p>
                                    )}

                                    {/* Venue */}
                                    {event.venue && (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            marginTop: 'auto',
                                            paddingTop: '0.5rem',
                                            borderTop: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            <MapPin size={14} color="var(--secondary)" />
                                            <span style={{
                                                fontSize: '0.85rem',
                                                color: 'var(--text-muted)',
                                                fontWeight: 500
                                            }}>
                                                {event.venue}
                                            </span>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}
        </>
    );
}
