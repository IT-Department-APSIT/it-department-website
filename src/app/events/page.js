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
                                    className="card event-card"
                                    onClick={() => handleEventClick(event.id)}
                                >
                                    {event.poster_url && (
                                        <div className="event-poster-wrapper">
                                            <img
                                                src={event.poster_url}
                                                alt={event.event_name}
                                            />
                                        </div>
                                    )}

                                    <div className="event-card-content">
                                        {event.event_type && (
                                            <span className="event-badge">
                                                {event.event_type}
                                            </span>
                                        )}

                                        <h3 className="event-title">
                                            {event.event_name}
                                        </h3>

                                        {event.description && (
                                            <p className="event-description" style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {event.description}
                                            </p>
                                        )}

                                        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <div className="event-meta">
                                                {event.event_date && (
                                                    <span className="event-meta-item">
                                                        <Calendar size={18} color="var(--secondary)" /> {formatDate(event.event_date)}
                                                    </span>
                                                )}
                                                {event.venue && (
                                                    <span className="event-meta-item">
                                                        <MapPin size={18} color="var(--secondary)" /> {event.venue}
                                                    </span>
                                                )}
                                            </div>

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
                            className="past-events-grid"
                        >
                            {pastEvents.map((event) => (
                                <motion.div
                                    key={event.id}
                                    variants={fadeInUp}
                                    className="card past-event-card"
                                    onClick={() => handleEventClick(event.id)}
                                >
                                    {/* Header with badge and date */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {event.event_type && (
                                            <span className="event-badge" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>
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
                                            borderTop: '1px solid var(--border)'
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
