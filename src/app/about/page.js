'use client';

import { motion } from 'framer-motion';
import {
    Target, Eye, Award, Users, BookOpen, Building2,
    GraduationCap, Mail, Phone, Linkedin,
    Monitor, Server, Cpu, Database
} from 'lucide-react';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const facultyData = [
    { name: "Prof. Rujata Chaudhari", position: "Assistant Professor", qualification: "M.E", experience: "10+ years experience", image: "rujata.png" },
    { name: "Prof. Sonia Aneesh", position: "Assistant Professor", qualification: "Pursuing PhD", experience: "15+ years experience", image: "sonia.png" },
    { name: "Prof. Sonal Balpande", position: "Assistant Professor", qualification: "M.E", experience: "15+ years experience", image: "sonal.png" },
    { name: "Prof. Vishal S. Badgujar", position: "Assistant Professor", qualification: "Pursuing PhD", experience: "10+ years experience", image: "vishal.png" },
    { name: "Prof. Ganesh Gourshete", position: "Assistant Professor", qualification: "Pursuing PhD", experience: "20+ years experience", image: "ganesh.png" },
    { name: "Prof. Apeksha Mohite", position: "Assistant Professor", qualification: "M.E", experience: "10+ years experience", image: "apeksha.png" },
    { name: "Prof. Mandar Ganjapurkar", position: "Assistant Professor", qualification: "Pursuing PhD", experience: "15+ years experience", image: "mandar.jpg" },
    { name: "Prof. Yaminee Patil", position: "Assistant Professor", qualification: "M.E", experience: "10+ years experience", image: "yaminee.jpg" },
    { name: "Prof. Sonal Jain", position: "Assistant Professor", qualification: "M.Tech", experience: "5+ years experience", image: "sonalj.png" },
    { name: "Prof. Manjusha Kashilkar", position: "Assistant Professor", qualification: "M.E", experience: "10+ years experience", image: "manjusha.png" },
    { name: "Prof. Sneha Dalvi", position: "Assistant Professor", qualification: "M.E", experience: "5+ years experience", image: "sneha.png" },
    { name: "Prof. Jayshree Jha", position: "Assistant Professor", qualification: "M.E", experience: "10+ years experience", image: "jayshree.png" },
    { name: "Prof. Geetanjali Kalme", position: "Assistant Professor", qualification: "Pursuing PhD", experience: "10+ years experience", image: "geetanjali.png" },
    { name: "Prof. Roshna Sangle", position: "Assistant Professor", qualification: "M.E", experience: "15+ years experience", image: "roshna.png" },
    { name: "Prof. Shafaque Fatma Syed", position: "Assistant Professor", qualification: "M.E", experience: "10+ years experience", image: "shafaque.png" },
    { name: "Prof. Charul Singh", position: "Assistant Professor", qualification: "M.E", experience: "3+ years experience", image: "charul.png" },
    { name: "Prof. Rucha Kulkarni", position: "Assistant Professor", qualification: "M.E", experience: "5+ years experience", image: "rucha.png" },
    { name: "Prof. Shital Agrawal", position: "Assistant Professor", qualification: "M.E", experience: "5+ years experience", image: "shital.png" },
    { name: "Prof. Urajashree Patil", position: "Assistant Professor", qualification: "M.E", experience: "10+ years experience", image: "urajashree.png" },
    { name: "Prof. Randeep Kahlon", position: "Assistant Professor", qualification: "M.E", experience: "15+ years experience", image: "randeep.jpg" },
    { name: "Prof. Sachin S. Kasare", position: "Assistant Professor", qualification: "Pursuing PhD", experience: "10+ years experience", image: "sachin.jpeg" },
    { name: "Prof. Sujata Oak", position: "Assistant Professor", qualification: "M.E", experience: "15+ years experience", image: "sujata.jpg" },
    { name: "Prof. Seema Jadhav", position: "Assistant Professor", qualification: "M.E", experience: "5+ years experience", image: "seema.jpg" },
    { name: "Prof. Snehal Mali", position: "Assistant Professor", qualification: "M.Tech", experience: "2+ years experience", image: "snehal.png" },
    { name: "Prof. Saylee Lapalikar", position: "Assistant Professor", qualification: "M.E", experience: "1+ years experience", image: "saylee.jpeg" },
    { name: "Prof. Anupama Singh", position: "Assistant Professor", qualification: "M.E", experience: "1+ years experience", image: "anupama.png" },
    { name: "Prof. Shweta Mahajan", position: "Assistant Professor", qualification: "M.E", experience: "3+ years experience", image: "shweta.png" },
];

const labs = [
    { name: 'Advanced Computing Lab', icon: <Cpu size={32} />, systems: 60, description: 'High-performance workstations for advanced computing and AI projects' },
    { name: 'Network & Security Lab', icon: <Server size={32} />, systems: 40, description: 'Equipped with network simulation tools and security testing environments' },
    { name: 'Software Development Lab', icon: <Monitor size={32} />, systems: 50, description: 'Modern IDE setups for full-stack development and project work' },
    { name: 'Database Lab', icon: <Database size={32} />, systems: 40, description: 'Dedicated lab for database design, management, and big data analytics' },
];

const achievements = [
    { year: '2024', title: 'NAAC A+ Accreditation', description: 'Department contributed significantly to institutional accreditation' },
    { year: '2024', title: 'Smart India Hackathon Winners', description: '3 teams qualified for national finals, 1 team won' },
    { year: '2023', title: '100% Placement Record', description: 'All eligible students placed in top companies' },
    { year: '2023', title: 'Research Excellence Award', description: '15+ papers published in Scopus-indexed journals' },
    { year: '2022', title: 'Best IT Department Award', description: 'Recognized by University of Mumbai' },
];

export default function AboutPage() {
    return (
        <>
            {/* Page Header */}
            <div className="page-header">
                <div className="container">
                    <h1>About Us</h1>
                    <p>Learn about our department, faculty, and infrastructure</p>
                </div>
            </div>

            {/* IT Department Posters */}
            <section style={{ padding: 0, margin: 0 }}>
                <div style={{ maxWidth: '100%', margin: 0, padding: 0 }}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0
                        }}
                    >
                        {/* IT Department Highlights */}
                        <motion.div
                            variants={fadeInUp}
                            whileHover={{ scale: 1.01 }}
                            style={{
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                        >
                            <img
                                src="/assets/posters/it-dept-highlights.jpg"
                                alt="IT Department Highlights"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block',
                                    objectFit: 'cover'
                                }}
                            />
                        </motion.div>

                        {/* IT Department Poster */}
                        <motion.div
                            variants={fadeInUp}
                            whileHover={{ scale: 1.01 }}
                            style={{
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                        >
                            <img
                                src="/assets/posters/it-dept-poster.jpeg"
                                alt="IT Department Poster"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block',
                                    objectFit: 'cover'
                                }}
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Faculty */}
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
                            Our Faculty
                        </motion.h2>
                        <motion.p variants={fadeInUp} className="section-subtitle center">
                            Experienced educators and researchers dedicated to shaping future IT leaders.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                            gap: 24
                        }}
                    >
                        {facultyData.map((member, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="card"
                                style={{ textAlign: 'center', padding: 28 }}
                                whileHover={{ scale: 1.03, boxShadow: '0 15px 40px rgba(0,0,0,0.2)' }}
                            >
                                <div style={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    margin: '0 auto 16px',
                                    border: '4px solid var(--secondary)',
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                                }}>
                                    <img
                                        src={`/facultyimages/${member.image}`}
                                        alt={member.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:white;font-size:2rem;font-weight:700;">${member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>`;
                                        }}
                                    />
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                                    {member.name}
                                </h3>
                                <p style={{ color: 'var(--secondary)', fontWeight: 600, fontSize: '0.85rem', marginBottom: 8 }}>
                                    {member.position}
                                </p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 4 }}>
                                    {member.qualification}
                                </p>
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.75rem',
                                    padding: '6px 14px',
                                    background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 100%)',
                                    border: '1px solid rgba(59,130,246,0.2)',
                                    borderRadius: '50px',
                                    display: 'inline-block',
                                    marginTop: 8,
                                    fontWeight: 500
                                }}>
                                    {member.experience}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Infrastructure */}
            <section className="section">
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        style={{ textAlign: 'center' }}
                    >
                        <motion.h2 variants={fadeInUp} className="section-title center">
                            <Building2 size={32} style={{ display: 'inline', marginRight: 12, verticalAlign: 'middle', color: 'var(--secondary)' }} />
                            Infrastructure
                        </motion.h2>
                        <motion.p variants={fadeInUp} className="section-subtitle center">
                            State-of-the-art laboratories equipped with the latest technology.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: 24
                        }}
                    >
                        {labs.map((lab, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="card"
                                style={{ padding: 28 }}
                            >
                                <div style={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: 'var(--radius-md)',
                                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    marginBottom: 20,
                                }}>
                                    {lab.icon}
                                </div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                                    {lab.name}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 16, lineHeight: 1.6 }}>
                                    {lab.description}
                                </p>
                                <div style={{
                                    padding: '8px 16px',
                                    background: 'var(--background)',
                                    borderRadius: 'var(--radius-sm)',
                                    display: 'inline-block',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    color: 'var(--secondary)'
                                }}>
                                    {lab.systems} Systems
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Achievements Timeline */}
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
                            <Award size={32} style={{ display: 'inline', marginRight: 12, verticalAlign: 'middle', color: 'var(--accent)' }} />
                            Achievements
                        </motion.h2>
                        <motion.p variants={fadeInUp} className="section-subtitle center">
                            Milestones that mark our journey of excellence.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        style={{ maxWidth: 800, margin: '0 auto' }}
                    >
                        {achievements.map((item, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                style={{
                                    display: 'flex',
                                    gap: 24,
                                    marginBottom: 24,
                                    position: 'relative',
                                }}
                            >
                                <div style={{
                                    width: 80,
                                    flexShrink: 0,
                                    textAlign: 'right',
                                    paddingTop: 4,
                                }}>
                                    <span style={{
                                        fontWeight: 800,
                                        fontSize: '1.25rem',
                                        color: 'var(--primary)',
                                    }}>
                                        {item.year}
                                    </span>
                                </div>
                                <div style={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    background: 'var(--secondary)',
                                    flexShrink: 0,
                                    marginTop: 8,
                                    position: 'relative',
                                }}>
                                    {index !== achievements.length - 1 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: 16,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: 2,
                                            height: 80,
                                            background: 'var(--border)',
                                        }} />
                                    )}
                                </div>
                                <div className="card" style={{ flex: 1, padding: 20 }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                                        {item.title}
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </>
    );
}
