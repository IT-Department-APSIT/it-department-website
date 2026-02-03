'use client';

import { motion } from 'framer-motion';
import {
    Users, Target, Calendar, Award, Lightbulb,
    Code, Palette, Megaphone, BookOpen, Rocket,
    ArrowRight, Mail, Instagram, Linkedin, Twitter
} from 'lucide-react';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};


const committeeMembers = [
    { name: "Tharani Velar", role: "President", image: "/assets/itsa-team/tharani-velar.jpg" },
    { name: "Divyashree Bhangle", role: "Vice-President", image: "/assets/itsa-team/divyashree-bhangle.jpg" },
    { name: "Rudranarayan Sahu", role: "Secretary", image: "/assets/itsa-team/Rudranarayan-Sahu.jpg" },
    { name: "Shruti Thakur", role: "Treasurer", image: "/assets/itsa-team/Shruti-Thakur.jpg" },
    { name: "Shrey Nagda", role: "Technical Head", image: "/assets/itsa-team/Shrey-Nagda.jpg" },
    { name: "Tanishq Shelar", role: "Technical Co-Head", image: "/assets/itsa-team/Tanishq-shelar.jpg" },
    { name: "Aditya Chavan", role: "CSI Co-Head", image: "/assets/itsa-team/Aditya-Chavan.jpg" },
    { name: "Mrunmai Dhoble", role: "CSI Head", image: "/assets/itsa-team/Mrunmai-Dhoble.jpg" },
    { name: "Shubham Pawaskar", role: "T&P Head", image: "/assets/itsa-team/Shubham-Pawaskar.jpg" },
    { name: "Aryan Yadav", role: "T&P Co-Head", image: "/assets/itsa-team/Aryan-Yadav.jpg" },
    { name: "Neha Chauhan", role: "Photography Head", image: "/assets/itsa-team/Neha-Chauhan.jpg" },
    { name: "Vaidehi Borekar", role: "Literature Head", image: "/assets/itsa-team/Vaidehi-Borekar.jpg" },
    { name: "Gauri Borse", role: "Photography Co-Head", image: "/assets/itsa-team/Gauri-Borse.jpg" },
    { name: "Khushi Anchalia", role: "Design Head", image: "/assets/itsa-team/Khushi-Anchalia.jpg" },
    { name: "Rinkal Mishra", role: "Publicity Head", image: "/assets/itsa-team/Rinkal-Mishra.jpg" },
    { name: "Rutuja Gujar", role: "Literature Co-Head", image: "/assets/itsa-team/rujuta-gujar.jpg" },
];

const activities = [
    {
        icon: <Code size={28} />,
        title: 'Technical Workshops',
        description: 'Regular hands-on workshops on trending technologies like AI, Web3, and Cloud Computing.',
    },
    {
        icon: <Lightbulb size={28} />,
        title: 'Hackathons',
        description: 'Organizing and participating in inter-college and national-level hackathons.',
    },
    {
        icon: <BookOpen size={28} />,
        title: 'Study Circles',
        description: 'Peer-to-peer learning sessions and doubt-clearing for academic subjects.',
    },
    {
        icon: <Megaphone size={28} />,
        title: 'Guest Lectures',
        description: 'Industry expert talks and webinars on career guidance and latest trends.',
    },
    {
        icon: <Palette size={28} />,
        title: 'Cultural Events',
        description: 'Fun activities, competitions, and celebrations to build department bonding.',
    },
    {
        icon: <Rocket size={28} />,
        title: 'Project Showcases',
        description: 'Platform for students to demonstrate their innovative projects.',
    },
];

const highlights = [
    { number: '12+', label: 'Events per Year' },
    { number: '500+', label: 'Active Members' },
    { number: '25+', label: 'Workshops Conducted' },
    { number: '10+', label: 'Industry Partners' },
];

export default function ITSAPage() {
    return (
        <>
            {/* Page Header */}
            <div className="page-header itsa-banner">
                <div className="container">
                </div>
            </div>

            {/* About ITSA */}
            <section className="section" style={{ background: '#2d3990' }}>
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 48,
                            alignItems: 'center'
                        }}
                    >
                        <motion.div variants={fadeInUp}>
                            <h2 className="section-title" style={{ color: 'white' }}>What is ITSA?</h2>
                            <p className="section-subtitle" style={{ marginBottom: 24, color: 'rgba(255,255,255,0.9)' }}>
                                The bridge between academic learning and professional excellence.
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, marginBottom: 16 }}>
                                The Information Technology Students Association (ITSA) is the official
                                student body of the IT Department at APSIT. We are a vibrant community
                                of tech enthusiasts dedicated to fostering innovation, collaboration,
                                and professional growth among IT students.
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, marginBottom: 24 }}>
                                Through workshops, hackathons, guest lectures, and cultural events,
                                we create opportunities for students to learn beyond the classroom,
                                network with industry professionals, and develop essential soft skills.
                            </p>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <a
                                    href="#"
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.15)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)';
                                        e.currentTarget.style.transform = 'scale(1.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    <Instagram size={22} />
                                </a>
                                <a
                                    href="#"
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.15)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#0077b5';
                                        e.currentTarget.style.transform = 'scale(1.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    <Linkedin size={22} />
                                </a>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <img
                                src="/assets/posters/forward.png"
                                alt="ITSA Forward"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: '16px',
                                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
                                }}
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Activities */}
            <section className="section section-alt">
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        style={{ textAlign: 'center' }}
                    >
                        <motion.h2 variants={fadeInUp} className="section-title center">
                            <Calendar size={32} style={{ display: 'inline', marginRight: 12, verticalAlign: 'middle', color: 'var(--secondary)' }} />
                            What We Do
                        </motion.h2>
                        <motion.p variants={fadeInUp} className="section-subtitle center">
                            From technical workshops to fun events, there's always something happening at ITSA.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: 24
                        }}
                    >
                        {activities.map((activity, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="card"
                                style={{
                                    display: 'flex',
                                    gap: 20,
                                    padding: 24,
                                }}
                            >
                                <div style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 'var(--radius-md)',
                                    background: 'linear-gradient(135deg, var(--background) 0%, var(--border) 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--secondary)',
                                    flexShrink: 0,
                                }}>
                                    {activity.icon}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                                        {activity.title}
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                        {activity.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Note from HOD's Desk */}
            <section style={{
                background: '#142445',
                padding: '80px 0'
            }}>
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1.2fr 1fr',
                            gap: 60,
                            alignItems: 'center'
                        }}
                    >
                        <motion.div variants={fadeInUp}>
                            <div style={{
                                position: 'relative',
                                padding: '40px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '20px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '20px',
                                    left: '20px',
                                    fontSize: '60px',
                                    color: 'rgba(249,115,22,0.3)',
                                    fontFamily: 'Georgia, serif',
                                    lineHeight: 1
                                }}>
                                    "
                                </div>
                                <h2 style={{
                                    fontSize: '2rem',
                                    fontWeight: 700,
                                    color: 'white',
                                    marginBottom: 24,
                                    paddingTop: 20
                                }}>
                                    Note from HOD's Desk
                                </h2>
                                <p style={{
                                    color: 'rgba(255,255,255,0.9)',
                                    fontSize: '1.1rem',
                                    lineHeight: 1.8,
                                    fontStyle: 'italic',
                                    marginBottom: 24
                                }}>
                                    ITSA continues to be a shining example of student-led excellence. Their initiatives not only complement our academic vision but also empower students to lead, innovate, and grow. ITSA efforts reflected the spirit of ITSA's guiding philosophy: 'By the Students, For the Students.'
                                </p>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    paddingTop: 16,
                                    borderTop: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    <div>
                                        <div style={{
                                            color: 'white',
                                            fontWeight: 600,
                                            fontSize: '1.1rem'
                                        }}>
                                            Dr. Kiran Deshpande
                                        </div>
                                        <div style={{
                                            color: 'rgba(249,115,22,0.9)',
                                            fontSize: '0.9rem',
                                            marginTop: 4
                                        }}>
                                            Head of Department, IT
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={fadeInUp}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <div style={{
                                position: 'relative',
                                width: '100%',
                                maxWidth: '400px'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    inset: '-8px',
                                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                    borderRadius: '24px',
                                    opacity: 0.3,
                                    filter: 'blur(20px)'
                                }} />
                                <img
                                    src="/facultyimages/kbd.jpg"
                                    alt="Dr. K. B. Deshpande - HOD IT"
                                    style={{
                                        position: 'relative',
                                        width: '100%',
                                        height: 'auto',
                                        borderRadius: '20px',
                                        border: '3px solid rgba(249,115,22,0.5)',
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                                        display: 'block'
                                    }}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Committee Members */}
            <section className="section section-alt">
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        style={{ textAlign: 'center' }}
                    >
                        <motion.h2 variants={fadeInUp} className="section-title center">
                            <Users size={32} style={{ display: 'inline', marginRight: 12, verticalAlign: 'middle', color: 'var(--secondary)' }} />
                            ITSA Committee 2025-26
                        </motion.h2>
                        <motion.p variants={fadeInUp} className="section-subtitle center">
                            Meet the passionate team driving ITSA forward this year.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: 24
                        }}
                    >
                        {committeeMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover={{
                                    y: -10,
                                    transition: { duration: 0.3 }
                                }}
                                style={{
                                    textAlign: 'center',
                                    padding: '32px 20px 28px',
                                    borderRadius: 20,
                                    background: 'var(--surface)',
                                    border: '1px solid var(--border)',
                                    position: 'relative',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                    transition: 'box-shadow 0.3s ease',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.12)'}
                                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'}
                            >
                                {/* Decorative Background Gradient */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: 80,
                                    background: index < 4
                                        ? 'linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(251,191,36,0.05) 100%)'
                                        : 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(168,85,247,0.05) 100%)',
                                    borderRadius: '20px 20px 50% 50%',
                                }} />

                                {/* Circular Photo with Gradient Ring */}
                                <div style={{
                                    position: 'relative',
                                    width: 130,
                                    height: 130,
                                    margin: '0 auto 20px',
                                    borderRadius: '50%',
                                    padding: 4,
                                    background: index < 4
                                        ? 'linear-gradient(135deg, #f97316 0%, #fbbf24 50%, #f59e0b 100%)'
                                        : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #a855f7 100%)',
                                    boxShadow: index < 4
                                        ? '0 8px 30px rgba(249,115,22,0.35)'
                                        : '0 8px 30px rgba(139,92,246,0.35)',
                                }}>
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        background: 'var(--surface)',
                                    }}>
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                objectPosition: 'top center',
                                                transition: 'transform 0.4s ease',
                                            }}
                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                        />
                                    </div>
                                </div>

                                {/* Name */}
                                <h3 style={{
                                    fontSize: '1.15rem',
                                    fontWeight: 700,
                                    color: 'var(--text-primary)',
                                    marginBottom: 10,
                                    letterSpacing: '0.2px'
                                }}>
                                    {member.name}
                                </h3>

                                {/* Role Badge */}
                                <div style={{
                                    display: 'inline-block',
                                    padding: '8px 18px',
                                    background: index < 4
                                        ? 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)'
                                        : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                    borderRadius: 25,
                                    color: 'white',
                                    fontSize: '0.78rem',
                                    fontWeight: 600,
                                    letterSpacing: '0.5px',
                                    textTransform: 'uppercase',
                                    boxShadow: index < 4
                                        ? '0 4px 15px rgba(249,115,22,0.3)'
                                        : '0 4px 15px rgba(139,92,246,0.3)',
                                }}>
                                    {member.role}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Podcast Section with Instagram Reels */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{
                    width: '100%',
                    position: 'relative',
                    backgroundColor: '#4a7c8a',
                    overflow: 'hidden'
                }}
            >
                {/* Full Poster Image */}
                <img
                    src="/assets/posters/podcast-poster.png"
                    alt="ITSA Podcast"
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                    }}
                />

                {/* Instagram Reels Overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    padding: '0 5%'
                }}>
                    <div style={{
                        display: 'flex',
                        gap: 24,
                        alignItems: 'center'
                    }}>
                        {/* Instagram Reel Embed 1 */}
                        <div style={{
                            width: '320px',
                            height: '420px',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <iframe
                                src="https://www.instagram.com/reel/DHTCNOQITVt/embed/"
                                width="320"
                                height="420"
                                frameBorder="0"
                                scrolling="no"
                                allowtransparency="true"
                                allow="encrypted-media"
                                style={{
                                    border: 'none',
                                    borderRadius: '16px'
                                }}
                            />
                        </div>

                        {/* Instagram Reel Embed 2 */}
                        <div style={{
                            width: '320px',
                            height: '420px',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <iframe
                                src="https://www.instagram.com/reel/DGxgUroIFgV/embed/"
                                width="320"
                                height="420"
                                frameBorder="0"
                                scrolling="no"
                                allowtransparency="true"
                                allow="encrypted-media"
                                style={{
                                    border: 'none',
                                    borderRadius: '16px'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* MPR ITSA Poster - Full Width Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{
                    width: '100%',
                    padding: 0,
                    margin: 0,
                    lineHeight: 0
                }}
            >
                <img
                    src="/assets/posters/mpr-itsa.jpg"
                    alt="MPR ITSA"
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                    }}
                />
            </motion.section>

            {/* Blueback Section with Overlay */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{
                    width: '100%',
                    padding: '80px 0',
                    margin: 0,
                    position: 'relative',
                    backgroundImage: 'url(/assets/posters/blueback.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    minHeight: '600px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {/* Blue Tinted Transparent Panel */}
                <div className="container" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 20px'
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '1000px',
                        background: 'rgba(30, 58, 138, 0.85)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '24px',
                        padding: '48px 56px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            style={{
                                fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)',
                                fontWeight: 700,
                                color: 'white',
                                marginBottom: 24,
                                textAlign: 'center',
                                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                                fontFamily: 'var(--font-playfair), Georgia, serif',
                                fontStyle: 'italic',
                                letterSpacing: '1px'
                            }}
                        >
                            Why Choose ITSA?
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            style={{
                                color: 'rgba(255, 255, 255, 0.95)',
                                fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
                                lineHeight: 1.8,
                                textAlign: 'justify'
                            }}
                        >
                            <p style={{ marginBottom: 20 }}>
                                What you've seen in this page is just a glimpse of who we are — a journey built from the students, by the students.
                            </p>

                            <p style={{ marginBottom: 20 }}>
                                Every initiative, every achievement, and every event reflects the dedication, teamwork, and innovation that define ITSA. At ITSA, we don't just conduct events — we create experiences that inspire and empower.
                            </p>

                            <p style={{ marginBottom: 20 }}>
                                From our very own flagship celebration <strong>"IT Week"</strong>, to the grand technical fest <strong>"EXALT"</strong>, and the national-level hackathon <strong>"HACKSCRIPT"</strong>, we bring together the brightest minds from across the college to collaborate, compete, and create.
                            </p>

                            <p style={{ marginBottom: 20 }}>
                                Beyond events, ITSA focuses on continuous learning. We host expert sessions on emerging technologies and real-world challenges — helping students overcome the roadblocks they might face in the future. Every session, workshop, and initiative is crafted to bridge the gap between classroom learning and industry expectations.
                            </p>

                            <p style={{ marginBottom: 20 }}>
                                And still, what you've seen here is only a fraction of what ITSA truly is. There's so much more behind the scenes — moments of teamwork, creativity, and discovery waiting to unfold.
                            </p>

                            <p style={{
                                marginBottom: 0,
                                fontSize: 'clamp(1.3rem, 2vw, 1.6rem)',
                                fontWeight: 700,
                                textAlign: 'center',
                                color: '#fbbf24',
                                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                                fontFamily: 'var(--font-dancing), cursive',
                                letterSpacing: '1.5px',
                                marginTop: 24
                            }}>
                                So come, be a part of ITSA and level yourself up!
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.section>
        </>
    );
}
