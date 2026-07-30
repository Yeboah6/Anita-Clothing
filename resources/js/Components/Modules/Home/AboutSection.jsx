import React, { useEffect } from "react";

// ─── Fonts ───────────────────────────────────────────────────────────────────
const injectFonts = () => {
  const id = "anita-fonts";
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
  }
};

// ─── Design tokens ───────────────────────────────────────────────────────────
const tokens = {
  fontDisplay: "'Cormorant Garamond', serif",
  fontBody: "'Inter', sans-serif",
  foreground: "#141414",
  mutedForeground: "#737373",
};

// ─── AboutSection ────────────────────────────────────────────────────────────
const AboutSection = ({ collections }) => {
  const [isDesktop, setIsDesktop] = React.useState(false);

  useEffect(() => {
    injectFonts();
    
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      id="about"
      style={{
        padding: isDesktop ? "6rem 0" : "4rem 0",
        fontFamily: tokens.fontBody,
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
            gap: isDesktop ? "4rem" : "2.5rem",
            alignItems: "center",
          }}
        >
          {/* Image */}
          <div style={{ position: "relative" }}>
            <img
              src="images/user.jpeg"
              alt="CuteBloom atelier"
              loading="lazy"
              style={{
                height: "auto",
                width: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>

          {/* Content */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h2
              style={{
                fontFamily: tokens.fontDisplay,
                fontSize: "clamp(1.875rem, 4vw, 3rem)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                margin: 0,
                color: tokens.foreground,
              }}
            >
              About CuteBloom
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                color: tokens.mutedForeground,
                fontSize: "1rem",
                lineHeight: 1.7,
              }}
            >
              <p style={{ margin: 0 }}>
                CuteBloom is made for the girlies 💕  
                We create ready-to-wear and official outfits that are cute, comfortable, and affordable — because looking good at 
                work or on a normal day shouldn’t cost a fortune.
              </p>
              <p style={{ margin: 0 }}>
                Every piece is designed to help you walk into any room and feel confident. 
                No stress, no overthinking. Just outfits that fit your life, your budget, and your vibe.
              </p>
              <p style={{ margin: 0 }}>
                Cute. Affordable. Confidence.
              </p>
            </div>

            {/* Stats */}
            <div
              style={{
                display: "flex",
                gap: "2rem",
                paddingTop: "1rem",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: tokens.fontDisplay,
                    fontSize: "1.875rem",
                    fontWeight: 500,
                    margin: "0 0 0.25rem",
                    color: tokens.foreground,
                  }}
                >
                  100+
                </p>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: tokens.mutedForeground,
                    margin: 0,
                  }}
                >
                  Unique Pieces
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: tokens.fontDisplay,
                    fontSize: "1.875rem",
                    fontWeight: 500,
                    margin: "0 0 0.25rem",
                    color: tokens.foreground,
                  }}
                >
                  {collections}
                </p>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: tokens.mutedForeground,
                    margin: 0,
                  }}
                >
                  Collections
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: tokens.fontDisplay,
                    fontSize: "1.875rem",
                    fontWeight: 500,
                    margin: "0 0 0.25rem",
                    color: tokens.foreground,
                  }}
                >
                  ∞
                </p>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: tokens.mutedForeground,
                    margin: 0,
                  }}
                >
                  Possibilities
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;