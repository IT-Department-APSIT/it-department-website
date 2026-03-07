'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import {
    Target, Eye, Users, BookOpen, Building2,
    GraduationCap, Mail, Phone, Linkedin,
    Monitor, Server, Cpu, Database, ExternalLink, ArrowLeft
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
    { name: "Prof. Rujata Chaudhari", position: "Assistant Professor", qualification: "M.E", experience: "10+ years experience", image: "rujata.png", link: "https://www.apsit.edu.in/prof-rujata-chaudhari" },
    { name: "Prof. Sonia Aneesh", position: "Assistant Professor", qualification: "Pursuing PhD", experience: "15+ years experience", image: "sonia.png", link: "https://www.apsit.edu.in/prof-sonia-aneesh" },
    { name: "Prof. Sonal Balpande", position: "Assistant Professor", qualification: "M.E", experience: "15+ years experience", image: "sonal.png", link: "https://www.apsit.edu.in/prof-sonal-balpande" },
    { name: "Prof. Vishal S. Badgujar", position: "Assistant Professor", qualification: "Pursuing PhD", experience: "10+ years experience", image: "vishal.png", link: "https://www.apsit.edu.in/prof-vishal-s-badgujar" },
    { name: "Prof. Ganesh Gourshete", position: "Assistant Professor", qualification: "Pursuing PhD", experience: "20+ years experience", image: "ganesh.png", link: "https://www.apsit.edu.in/prof-ganesh-gourshete" },
    { name: "Prof. Apeksha Mohite", position: "Assistant Professor", qualification: "M.E", experience: "10+ years experience", image: "apeksha.png", link: "https://www.apsit.edu.in/prof-apeksha-mohite" },
    { name: "Prof. Mandar Ganjapurkar", position: "Assistant Professor", qualification: "Pursuing PhD", experience: "15+ years experience", image: "mandar.jpg", link: "https://www.apsit.edu.in/profmandar-ganjapurkar" },
    { name: "Prof. Yaminee Patil", position: "Assistant Professor", qualification: "M.E", experience: "10+ years experience", image: "yaminee.jpg", link: "https://www.apsit.edu.in/prof-yaminee-patil" },
    { name: "Prof. Sonal Jain", position: "Assistant Professor", qualification: "M.Tech", experience: "5+ years experience", image: "sonalj.png", link: "https://www.apsit.edu.in/prof-sonal-jain-0" },
    { name: "Prof. Manjusha Kashilkar", position: "Assistant Professor", qualification: "M.E", experience: "10+ years experience", image: "manjusha.png", link: "https://www.apsit.edu.in/prof-manjusha-kashilkar" },
    { name: "Prof. Sneha Dalvi", position: "Assistant Professor", qualification: "M.E", experience: "5+ years experience", image: "sneha.png", link: "https://www.apsit.edu.in/prof-sneha-dalvi" },
    { name: "Prof. Jayshree Jha", position: "Assistant Professor", qualification: "M.E", experience: "10+ years experience", image: "jayshree.png", link: "https://www.apsit.edu.in/prof-jayshree-jha" },
    { name: "Prof. Geetanjali Kalme", position: "Assistant Professor", qualification: "Pursuing PhD", experience: "10+ years experience", image: "geetanjali.png", link: "https://www.apsit.edu.in/prof-geetanjali-kalme" },
    { name: "Prof. Roshna Sangle", position: "Assistant Professor", qualification: "M.E", experience: "15+ years experience", image: "roshna.png", link: "https://www.apsit.edu.in/prof-roshna-sangle" },
    { name: "Prof. Shafaque Fatma Syed", position: "Assistant Professor", qualification: "M.E", experience: "10+ years experience", image: "shafaque.png", link: "https://www.apsit.edu.in/prof-shafaque-fatma-syed" },
    { name: "Prof. Charul Singh", position: "Assistant Professor", qualification: "M.E", experience: "3+ years experience", image: "charul.png", link: "https://www.apsit.edu.in/prof-charul-singh" },
    { name: "Prof. Rucha Kulkarni", position: "Assistant Professor", qualification: "M.E", experience: "5+ years experience", image: "rucha.png", link: "https://www.apsit.edu.in/prof-rucha-kulkarni" },
    { name: "Prof. Shital Agrawal", position: "Assistant Professor", qualification: "M.E", experience: "5+ years experience", image: "shital.png", link: "https://www.apsit.edu.in/prof-shital-agrawal" },
    { name: "Prof. Urajashree Patil", position: "Assistant Professor", qualification: "M.E", experience: "10+ years experience", image: "urajashree.png", link: "https://www.apsit.edu.in/prof-urajashree-patil" },
    { name: "Prof. Randeep Kahlon", position: "Assistant Professor", qualification: "M.E", experience: "15+ years experience", image: "randeep.jpg", link: "https://www.apsit.edu.in/prof-randeep-kahlon" },
    { name: "Prof. Sachin S. Kasare", position: "Assistant Professor", qualification: "Pursuing PhD", experience: "10+ years experience", image: "sachin.jpeg", link: "https://www.apsit.edu.in/prof-sachin-s-kasare" },
    { name: "Prof. Sujata Oak", position: "Assistant Professor", qualification: "M.E", experience: "15+ years experience", image: "sujata.jpg", link: "https://www.apsit.edu.in/prof-sujata-oak" },
    { name: "Prof. Seema Jadhav", position: "Assistant Professor", qualification: "M.E", experience: "5+ years experience", image: "seema.jpg", link: "https://www.apsit.edu.in/prof-seema-jadhav" },
    { name: "Prof. Snehal Mali", position: "Assistant Professor", qualification: "M.Tech", experience: "2+ years experience", image: "snehal.png", link: "https://www.apsit.edu.in/prof-snehal-mali" },
    { name: "Prof. Saylee Lapalikar", position: "Assistant Professor", qualification: "M.E", experience: "1+ years experience", image: "saylee.jpeg", link: "https://www.apsit.edu.in/prof-saylee-lapalikar" },
    { name: "Prof. Anupama Singh", position: "Assistant Professor", qualification: "M.E", experience: "1+ years experience", image: "anupama.png", link: "https://www.apsit.edu.in/prof-anupama-singh" },
    { name: "Prof. Shweta Mahajan", position: "Assistant Professor", qualification: "M.E", experience: "3+ years experience", image: "shweta.png", link: "https://www.apsit.edu.in/shweta-mahajan" },
];

const FacultyCard = ({ member }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className="faculty-card-wrapper"
            variants={fadeInUp}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className="faculty-card-inner"
                style={{
                    transform: isHovered ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                {/* Front of Card */}
                <div className="card faculty-card-face faculty-card-front">
                    <div>
                        <div className="faculty-avatar">
                            <Image
                                src={`/facultyimages/${member.image}`}
                                alt={member.name}
                                width={120}
                                height={120}
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
                        <h3 className="faculty-name">{member.name}</h3>
                        <p className="faculty-position">{member.position}</p>
                        <p className="faculty-qualification">{member.qualification}</p>
                        <p className="faculty-experience">{member.experience}</p>
                    </div>
                </div>

                {/* Back of Card */}
                <div className="card faculty-card-face faculty-card-back">
                    <div>
                        <h3 className="faculty-back-name">{member.name}</h3>
                        <div className="faculty-back-details">
                            <p><strong>Position:</strong> {member.position}</p>
                            <p><strong>Qualification:</strong> {member.qualification}</p>
                            <p><strong>Experience:</strong> {member.experience}</p>
                        </div>
                        <p className="faculty-back-cta">Click below to view detailed profile, publications, and research areas.</p>
                    </div>
                    <div>
                        <a
                            href={member.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="faculty-profile-btn"
                        >
                            View Full Profile <ExternalLink size={16} />
                        </a>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const labs = [
    { name: 'Advanced Computing Lab', icon: <Cpu size={32} />, systems: 60, description: 'High-performance workstations for advanced computing and AI projects' },
    { name: 'Network & Security Lab', icon: <Server size={32} />, systems: 40, description: 'Equipped with network simulation tools and security testing environments' },
    { name: 'Software Development Lab', icon: <Monitor size={32} />, systems: 50, description: 'Modern IDE setups for full-stack development and project work' },
    { name: 'Database Lab', icon: <Database size={32} />, systems: 40, description: 'Dedicated lab for database design, management, and big data analytics' },
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
                            <Image
                                src="/assets/posters/it-dept-highlights.jpg"
                                alt="IT Department Highlights"
                                width={1920}
                                height={1080}
                                sizes="100vw"
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
                            <Image
                                src="/assets/posters/it-dept-poster.jpeg"
                                alt="IT Department Poster"
                                width={1920}
                                height={1080}
                                sizes="100vw"
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
                        className="faculty-grid"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        {facultyData.map((member, index) => (
                            <FacultyCard key={index} member={member} />
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


        </>
    );
}
