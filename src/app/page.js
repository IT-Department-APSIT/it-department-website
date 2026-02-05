'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code,
  BookOpen, Award, Users, Briefcase,
  ArrowRight, Play, Star, Trophy,
  Laptop, GraduationCap, Target, Rocket,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
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
    transition: { staggerChildren: 0.1 }
  }
};

// Slide animation variants
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 1.1
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.5 },
      scale: { duration: 0.5 }
    }
  },
  exit: (direction) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.3 }
    }
  })
};

// Hero Slider Section
function HeroSection() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState({});

  // Fetch images from Supabase
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .from('hero_images')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) throw error;
        setImages(data || []);
      } catch (error) {
        console.error('Error fetching hero images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (images.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  const goToSlide = useCallback((index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  const goToPrevious = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  // Handle image load
  const handleImageLoad = (id) => {
    setImageLoaded(prev => ({ ...prev, [id]: true }));
  };

  // Loading skeleton
  if (loading) {
    return (
      <section className="hero-slider">
        <div className="hero-slider-loading">
          <div className="hero-loading-shimmer"></div>
          <div className="hero-loading-content">
            <div className="hero-loading-spinner"></div>
            <p>Loading amazing moments...</p>
          </div>
        </div>
      </section>
    );
  }

  // Fallback if no images
  if (images.length === 0) {
    return (
      <section className="hero-slider">
        <div className="hero-slider-fallback">
          <div className="hero-fallback-content">
            <GraduationCap size={80} />
            <h1>Department of Information Technology</h1>
            <p>A.P. Shah Institute of Technology</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="hero-slider"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient overlay */}
      <div className="hero-slider-overlay"></div>

      {/* Image slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="hero-slide"
        >
          {/* Skeleton while image loads */}
          {!imageLoaded[images[currentIndex]?.id] && (
            <div className="hero-slide-skeleton">
              <div className="hero-loading-spinner"></div>
            </div>
          )}
          <img
            src={images[currentIndex]?.image_url}
            alt={images[currentIndex]?.alt_text || 'Hero image'}
            className="hero-slide-image"
            onLoad={() => handleImageLoad(images[currentIndex]?.id)}
            style={{ opacity: imageLoaded[images[currentIndex]?.id] ? 1 : 0 }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Content overlay */}
      <div className="hero-slider-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="hero-slider-text"
        >
          <div className="hero-slider-badge">

            <span>NBA Accredited Institution</span>
          </div>
          <h1 className="hero-slider-title">
            Department of <span>Information Technology</span>
          </h1>
          <p className="hero-slider-subtitle">A.P. Shah Institute of Technology</p>
        </motion.div>
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            className="hero-slider-arrow hero-slider-arrow-left"
            onClick={goToPrevious}
            aria-label="Previous slide"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            className="hero-slider-arrow hero-slider-arrow-right"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="hero-slider-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`hero-slider-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              <span className="hero-slider-dot-progress"></span>
            </button>
          ))}
        </div>
      )}

      {/* Progress bar */}
      {images.length > 1 && !isHovered && (
        <motion.div
          className="hero-slider-progress"
          key={currentIndex}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 5, ease: 'linear' }}
        />
      )}
    </section>
  );
}

// About Section
function AboutSection() {
  const features = [
    { icon: <BookOpen size={20} />, text: 'Industry Curriculum' },
    { icon: <Users size={20} />, text: 'Expert Faculty' },
    { icon: <Laptop size={20} />, text: 'Modern Labs' },
    { icon: <Briefcase size={20} />, text: 'Internship Support' },
  ];

  return (
    <section id="about" className="section">
      <div className="container">
        <motion.div
          className="about-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div className="about-content" variants={fadeInUp}>
            <h2 className="section-title">About Our Department</h2>
            <p className="section-subtitle">
              Shaping tomorrow's technology leaders through excellence in education and innovation.
            </p>

            <h3>Vision for the Future</h3>
            <p>
              The Department of Information Technology at APSIT is committed to providing
              world-class education that bridges the gap between academic knowledge and
              industry requirements. Our programs are designed to nurture creative thinking,
              technical expertise, and entrepreneurial mindset.
            </p>
            <p>
              With state-of-the-art laboratories, experienced faculty, and strong industry
              partnerships, we prepare our students to excel in the ever-evolving field of
              Information Technology.
            </p>

            <div className="about-features">
              {features.map((feature, index) => (
                <div key={index} className="about-feature">
                  <div className="about-feature-icon">{feature.icon}</div>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="about-image" variants={fadeInUp}>
            <div style={{
              width: '100%',
              height: '400px',
              borderRadius: 'var(--radius-xl)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <img
                src="/assets/teaching.jpeg"
                alt="Teaching at IT Department"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </div>
            <div className="about-stats-card">
              <div className="about-stat">
                <div className="about-stat-value">20+</div>
                <div className="about-stat-label">Faculty</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-value">180+</div>
                <div className="about-stat-label">Students</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-value">10+</div>
                <div className="about-stat-label">Labs</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Value Addition Programs Section
function ProgramsSection() {
  const programs = [
    {
      logo: '/assets/it-logos/nptel.jpg',
      title: 'NPTEL',
      description: 'National Programme on Technology Enhanced Learning - Free online courses from IITs and IISc with certification.',
    },
    {
      logo: '/assets/it-logos/swayam.png',
      title: 'SWAYAM',
      description: 'Free online education platform by Govt. of India offering courses from school to post-graduate level.',
    },
    {
      logo: '/assets/it-logos/oracle-academy.png',
      title: 'Oracle Academy',
      description: 'Industry-recognized database and programming courses with Oracle certification opportunities.',
    },
    {
      logo: '/assets/it-logos/cisco-networking.png',
      title: 'Cisco Networking Academy',
      description: 'Comprehensive networking curriculum covering routing, switching, and cybersecurity fundamentals.',
    },
    {
      logo: '/assets/it-logos/nvidea-deep-learning.png',
      title: 'NVIDIA Deep Learning',
      description: 'Hands-on training in AI, deep learning, and GPU computing with NVIDIA DLI certification.',
    },
    {
      logo: '/assets/it-logos/spoken-tutorial.jpg',
      title: 'Spoken Tutorial',
      description: 'IIT Bombay initiative providing free software training through audio-video tutorials.',
    },
    {
      logo: '/assets/it-logos/eyantra.png',
      title: 'e-Yantra',
      description: 'IIT Bombay robotics and embedded systems learning initiative with hands-on projects.',
    },
    {
      logo: '/assets/it-logos/apsit-skills.jpg',
      title: 'APSIT Skills',
      description: 'In-house skill development programs tailored for IT students with industry-relevant training.',
    },
  ];

  return (
    <section className="section section-alt" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Decorative Background Graphic - Success Stairs */}
      <div style={{
        position: 'absolute',
        right: '-5%',
        bottom: '5%',
        width: '400px',
        height: '400px',
        opacity: 0.12,
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <img
          src="/assets/success-stairs.png"
          alt=""
          aria-hidden="true"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Decorative Gradient Orb - Top Left */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        left: '-100px',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Decorative Gradient Orb - Bottom Right */}
      <div style={{
        position: 'absolute',
        bottom: '-50px',
        right: '20%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Decorative floating shapes */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '15%',
          left: '8%',
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(251, 191, 36, 0.1) 100%)',
          borderRadius: '12px',
          transform: 'rotate(15deg)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{
          position: 'absolute',
          top: '60%',
          left: '3%',
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <motion.div
        animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{
          position: 'absolute',
          top: '25%',
          right: '5%',
          width: '30px',
          height: '30px',
          border: '3px solid rgba(249, 115, 22, 0.2)',
          borderRadius: '8px',
          transform: 'rotate(45deg)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          style={{ textAlign: 'center' }}
        >
          <motion.h2 variants={fadeInUp} className="section-title center">
            Value Addition Programs
          </motion.h2>
          <motion.p variants={fadeInUp} className="section-subtitle center">
            Enhance your skills with industry-aligned courses and certifications designed
            to give you a competitive edge.
          </motion.p>
        </motion.div>

        <motion.div
          className="programs-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {programs.map((program, index) => (
            <motion.div key={index} className="program-card" variants={fadeInUp}>
              <div className="program-image">
                <img
                  src={program.logo}
                  alt={program.title}
                  className="program-logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    padding: '20px',
                    background: 'white',
                    borderRadius: 'inherit'
                  }}
                />
              </div>
              <div className="program-content">
                <h3 className="program-title">{program.title}</h3>
                <p className="program-description">{program.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Hall of Fame Section
function HallOfFameSection() {
  const [honorees, setHonorees] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Fetch hall of fame data from Supabase
  useEffect(() => {
    const fetchHonorees = async () => {
      try {
        const { data, error } = await supabase
          .from('hall_of_fame')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setHonorees(data || []);
      } catch (error) {
        console.error('Error fetching hall of fame:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHonorees();
  }, []);

  // Auto-play slider
  useEffect(() => {
    if (honorees.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % honorees.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [honorees.length, isHovered]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  // Don't render if loading or no data
  if (loading) {
    return (
      <section className="section hall-of-fame-section">
        <div className="container">
          <div className="hof-loading">
            <div className="hof-loading-spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  if (honorees.length === 0) {
    return null; // Don't show section if no entries
  }

  const currentHonoree = honorees[currentIndex];

  return (
    <section
      className="section hall-of-fame-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="hof-content"
        >
          {/* Congratulations Header */}
          <motion.div variants={fadeInUp} className="hof-congrats">
            <Trophy size={32} className="hof-trophy-icon" />
            <span>Congratulations!</span>
          </motion.div>

          {/* Honoree Name */}
          <AnimatePresence mode="wait">
            <motion.h2
              key={`name-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="hof-name"
            >
              {currentHonoree.name}
            </motion.h2>
          </AnimatePresence>

          {/* Honoree Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`image-${currentIndex}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="hof-image-container"
            >
              {currentHonoree.image_url && (
                <img
                  src={currentHonoree.image_url}
                  alt={currentHonoree.name}
                  className="hof-image"
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Honoree Description */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`desc-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hof-description"
            >
              {currentHonoree.description}
            </motion.p>
          </AnimatePresence>

          {/* Navigation Dots */}
          {honorees.length > 1 && (
            <div className="hof-dots">
              {honorees.map((_, index) => (
                <button
                  key={index}
                  className={`hof-dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Progress Bar */}
          {honorees.length > 1 && !isHovered && (
            <motion.div
              className="hof-progress"
              key={currentIndex}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}

// Media Gallery Section - Pinterest Masonry Grid
function GallerySection() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Number of items to show in preview
  const PREVIEW_COUNT = 8;

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

  // Don't render if loading or no data
  if (loading) {
    return (
      <section id="gallery" className="section section-alt">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div className="loading-spinner"></div>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Loading gallery...</p>
        </div>
      </section>
    );
  }

  if (galleryImages.length === 0) {
    return null;
  }

  const previewImages = galleryImages.slice(0, PREVIEW_COUNT);
  const hasMore = galleryImages.length > PREVIEW_COUNT;

  // Render a gallery item
  const renderGalleryItem = (item, index, isModal = false) => {
    const isVideo = item.media_type === 'video' || isVideoUrl(item.image_url);

    return (
      <motion.div
        key={item.id}
        className="masonry-item"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: isModal ? 0 : index * 0.05 }}
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
          <img
            src={item.image_url}
            alt={item.alt_text || 'Gallery image'}
            className="masonry-media"
            loading="lazy"
          />
        )}
      </motion.div>
    );
  };

  return (
    <section id="gallery" className="section section-alt">
      <div className="container">
        {/* Header with View More button */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="gallery-header"
        >
          <div style={{ textAlign: 'center', flex: 1 }}>
            <motion.h2 variants={fadeInUp} className="section-title center">
              Media Gallery
            </motion.h2>
            <motion.p variants={fadeInUp} className="section-subtitle center">
              Glimpses of our vibrant department life, events, and achievements.
            </motion.p>
          </div>
        </motion.div>

        {/* Pinterest Masonry Grid - Preview */}
        <motion.div
          className="masonry-grid"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {previewImages.map((item, index) => renderGalleryItem(item, index))}
        </motion.div>

        {/* View Full Gallery Link */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="gallery-view-more-center"
          >
            <Link href="/gallery" className="btn btn-secondary">
              View Full Gallery
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        )}
      </div>

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
                ✕
              </button>
              {(selectedMedia.media_type === 'video' || isVideoUrl(selectedMedia.image_url)) ? (
                <video
                  src={selectedMedia.image_url}
                  className="gallery-lightbox-media"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={selectedMedia.image_url}
                  alt={selectedMedia.alt_text || 'Gallery image'}
                  className="gallery-lightbox-media"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}


// Software Section
function SoftwareSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchSoftwares = async () => {
      try {
        const { data, error } = await supabase
          .from('department_softwares')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform Supabase data to match UI component structure
        const formattedProjects = (data || []).map(item => {
          // specific team members
          const members = [
            item.team_member_1,
            item.team_member_2,
            item.team_member_3,
            item.team_member_4
          ].filter(Boolean); // remove null/empty

          // Get initials
          const teamInitials = members.map(name => {
            return name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()
              .substring(0, 2);
          });

          // Infer type from tech stack
          const techLower = (item.tech_stack || []).map(t => t.toLowerCase().trim());
          let projectType = 'Web App'; // Default

          if (techLower.some(t => t.includes('react native') || t.includes('flutter') || t.includes('android') || t.includes('ios') || t.includes('mobile'))) {
            projectType = 'Mobile App';
          } else if (techLower.some(t => t.includes('arduino') || t.includes('raspberry') || t.includes('iot') || t.includes('hardware') || t.includes('mqtt'))) {
            projectType = 'IoT Project';
          } else if (techLower.some(t => t.includes('python') || t.includes('ai') || t.includes('ml') || t.includes('data science'))) {
            projectType = 'AI/ML Project';
          }

          return {
            title: item.project_name,
            type: projectType,
            tagline: item.tagline,
            description: item.description,
            tech: item.tech_stack || [],
            team: teamInitials,
            teamNames: members,
            teamCount: members.length
          };
        });

        setProjects(formattedProjects);
      } catch (error) {
        console.error('Error fetching department softwares:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSoftwares();
  }, []);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (loading) return null;

  return (
    <section className="section">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          style={{ textAlign: 'center' }}
        >
          <motion.h2 variants={fadeInUp} className="section-title center">
            <Code size={36} style={{ display: 'inline', marginRight: 12, verticalAlign: 'middle', color: 'var(--secondary)' }} />
            Department Software
          </motion.h2>
          <motion.p variants={fadeInUp} className="section-subtitle center">
            Innovative software solutions developed by our talented students and faculty.
          </motion.p>
        </motion.div>

        {projects.length > 0 ? (
          <motion.div
            className="software-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {projects.map((project, index) => (
              <motion.div
                key={index}
                className="software-card"
                variants={fadeInUp}
                onClick={() => setSelectedProject(project)}
              >
                <div className="software-header">
                  <h3 className="software-title">
                    {project.title}
                    <span className="software-type">{project.type}</span>
                  </h3>
                  <p className="software-tagline">{project.tagline}</p>
                </div>
                <div className="software-body">
                  <p className="software-description">{project.description}</p>
                  <div className="software-tech">
                    {project.tech.slice(0, 3).map((tech, i) => (
                      <span key={i} className="software-tech-tag">{tech}</span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="software-tech-tag">+{project.tech.length - 3}</span>
                    )}
                  </div>
                  <div className="software-team">
                    <div className="software-avatars">
                      {project.team.slice(0, 3).map((initial, i) => (
                        <span key={i} className="software-avatar">{initial}</span>
                      ))}
                    </div>
                    <span className="software-team-info">
                      {project.teamCount} member{project.teamCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="software-view-more">
                    <span>View Details</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}
          >
            <p>No projects showcased yet.</p>
          </motion.div>
        )}

        {/* Software Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              className="software-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                className="software-modal"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="software-modal-header">
                  <button
                    className="software-modal-close"
                    onClick={() => setSelectedProject(null)}
                    aria-label="Close modal"
                  >
                    ✕
                  </button>
                  <h2 className="software-modal-title">{selectedProject.title}</h2>
                  <span className="software-modal-type">{selectedProject.type}</span>
                  <p className="software-modal-tagline">{selectedProject.tagline}</p>
                </div>
                <div className="software-modal-body">
                  <div className="software-modal-section">
                    <h4 className="software-modal-section-title">Description</h4>
                    <p className="software-modal-description">{selectedProject.description}</p>
                  </div>
                  <div className="software-modal-section">
                    <h4 className="software-modal-section-title">Tech Stack</h4>
                    <div className="software-modal-tech">
                      {selectedProject.tech.map((tech, i) => (
                        <span key={i} className="software-modal-tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                  <div className="software-modal-section">
                    <h4 className="software-modal-section-title">Team Members</h4>
                    <div className="software-modal-team">
                      {selectedProject.teamNames.map((name, i) => (
                        <div key={i} className="software-modal-member">
                          <div className="software-modal-member-avatar">
                            {selectedProject.team[i]}
                          </div>
                          <span className="software-modal-member-name">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// Main Home Page
export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProgramsSection />
      <HallOfFameSection />
      <GallerySection />
      <SoftwareSection />
    </>
  );
}
