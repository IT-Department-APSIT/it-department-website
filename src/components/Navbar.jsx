'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/itsa', label: 'ITSA' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);

      // Only hide/show after scrolling past the navbar height
      if (currentScrollY > 80) {
        setIsHidden(currentScrollY > lastScrollY.current);
      } else {
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navVisible = !isHidden || isHovered || isOpen;

  return (
    <>
      {/* Invisible hover zone at the top of the viewport */}
      <div
        className="navbar-hover-zone"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      <nav
        className={`navbar ${isScrolled ? 'scrolled' : ''} ${navVisible ? '' : 'navbar-hidden'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="container navbar-container">
          <Link href="/" className="navbar-logo">
            <img src="/logo.jpg" alt="IT Department Logo" />
            <div className="navbar-logo-text">
              Department of Information Technology
              <span>A.P. Shah Institute of Technology</span>
            </div>
          </Link>

          <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`navbar-link ${pathname === link.href ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            className={`navbar-toggle ${isOpen ? 'active' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.3)',
                zIndex: 999,
              }}
            />
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
