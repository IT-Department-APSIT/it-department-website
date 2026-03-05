import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand-section">
                        <div className="footer-brand">
                            <img src="/logo.jpg" alt="IT Department" />
                            <span className="footer-brand-text">IT Department</span>
                        </div>
                        <p className="footer-description">
                            Building future-ready IT professionals through excellence in education,
                            innovation, and industry collaboration.
                        </p>
                        <div className="footer-social">
                            <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
                            <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
                            <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
                            <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
                            <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
                        </div>
                    </div>

                    <div className="footer-links-section">
                        <h4 className="footer-title">Quick Links</h4>
                        <nav className="footer-links">
                            <Link href="/" className="footer-link">Home</Link>
                            <Link href="/events" className="footer-link">Events</Link>
                            <Link href="/gallery" className="footer-link">Gallery</Link>
                            <Link href="/about" className="footer-link">About Us</Link>
                            <Link href="/itsa" className="footer-link">ITSA</Link>
                            <Link href="/admin" className="footer-link">Admin</Link>
                        </nav>
                    </div>

                    <div className="footer-contact-section">
                        <h4 className="footer-title">Contact</h4>
                        <div className="footer-links">
                            <a href="mailto:it@apsit.edu.in" className="footer-link footer-contact-item">
                                <Mail size={16} /> it@apsit.edu.in
                            </a>
                            <a href="tel:+912225974747" className="footer-link footer-contact-item">
                                <Phone size={16} /> +91 22 2597 4747
                            </a>
                            <span className="footer-link footer-contact-item footer-address">
                                <MapPin size={16} />
                                Kasarvadavali, Ghodbunder Road, Thane (W) - 400615
                            </span>
                        </div>
                    </div>
                </div>

                <p className="footer-copyright">&copy; {new Date().getFullYear()} Department of Information Technology, A.P. Shah Institute of Technology. All rights reserved.</p>
                <div className="footer-bottom">
                    <p>Designed &amp; Developed by Tanishq Shelar</p>
                </div>
            </div>
        </footer>
    );
}
