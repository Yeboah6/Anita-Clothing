import React, { useState, useEffect } from 'react';

const fonts = {
  display: "'Cormorant Garamond', serif",
  body: "'Inter', sans-serif",
};

const colors = {
  white: '#ffffff',
  whiteAlpha90: 'rgba(255,255,255,0.9)',
  whiteAlpha30: 'rgba(255,255,255,0.3)',
  black: '#000000',
  blackAlpha30: 'rgba(0,0,0,0.30)',
  mainColor: '#ff6bb3', // Example main color, adjust as needed
};

const styles = {
  section: {
    position: 'relative',
    height: '85vh',
    minHeight: '600px',
    width: '100%',
    overflow: 'hidden',
    fontFamily: fonts.body,
  },
  bgWrapper: {
    position: 'absolute',
    inset: 0,
  },
  bgImage: {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  bgOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: colors.blackAlpha30,
  },
  container: {
    position: 'relative',
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    padding: '0 1rem',
  },
  content: {
    maxWidth: '560px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    color: colors.white,
  },
  heading: {
    fontFamily: fonts.display,
    fontSize: 'clamp(3rem, 6vw, 4.5rem)',
    fontWeight: 500,
    lineHeight: 1.15,
    letterSpacing: '-0.02em',
    margin: 0,
    color: colors.white,
  },
  paragraph: {
    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
    color: colors.whiteAlpha90,
    lineHeight: 1.6,
    margin: 0,
  },
  buttonRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    backgroundColor: colors.white,
    color: colors.black,
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    fontWeight: 500,
    fontFamily: fonts.body,
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    whiteSpace: 'nowrap',
  },
  btnOutline: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    color: colors.white,
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    fontWeight: 500,
    fontFamily: fonts.body,
    textDecoration: 'none',
    border: `2px solid ${colors.white}`,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, color 0.2s ease',
    whiteSpace: 'nowrap',
  },
};

const HeroSection = () => {
  const [primaryHovered, setPrimaryHovered] = useState(false);
  const [outlineHovered, setOutlineHovered] = useState(false);

  // Inject Google Fonts
  useEffect(() => {
    const id = 'anita-fonts';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <section style={styles.section}>

      {/* Background Image */}
      <div style={styles.bgWrapper}>
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80"
          alt="Elegant fashion model wearing minimalist clothing"
          style={styles.bgImage}
        />
        <div style={styles.bgOverlay} />
      </div>

      {/* Content */}
      <div style={styles.container}>
        <div style={styles.content}>

          <h1 style={styles.heading}>
            Timeless
            <br />
            Elegance
          </h1>

          <p style={styles.paragraph}>
            Discover our curated collection of refined essentials designed for the modern woman.
          </p>

          <div style={styles.buttonRow}>
            <a
              href="/collections"
              style={{
                ...styles.btnPrimary,
                backgroundColor: primaryHovered
                  ? 'rgba(255,255,255,0.9)'
                  : colors.white,
              }}
              onMouseEnter={() => setPrimaryHovered(true)}
              onMouseLeave={() => setPrimaryHovered(false)}
            >
              Explore Collections
            </a>

            <a
              href="/collections?filter=new"
              style={{
                ...styles.btnOutline,
                backgroundColor: outlineHovered ? colors.white : 'transparent',
                color: outlineHovered ? colors.black : colors.white,
              }}
              onMouseEnter={() => setOutlineHovered(true)}
              onMouseLeave={() => setOutlineHovered(false)}
            >
              New Arrivals
            </a>
          </div>

        </div>
      </div>

    </section>
  );
};

export default HeroSection;