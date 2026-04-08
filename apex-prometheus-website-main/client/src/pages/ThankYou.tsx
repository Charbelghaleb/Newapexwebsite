import { useEffect } from "react";
import FlameLogo from "../components/FlameLogo";

export default function ThankYou() {
  useEffect(() => {
    document.title = "Thank You | Apex Prometheus";
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--void, #0a0a0f)",
      color: "#e0e0ec",
      fontFamily: "'Inter', sans-serif",
      padding: "2rem",
    }}>
      <div style={{ textAlign: "center", maxWidth: 600 }}>
        <FlameLogo size={80} className="hero-flame" style={{ margin: "0 auto 2rem", display: "block" }} />
        <h1 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 800,
          marginBottom: "1.5rem",
          color: "#00e5ff",
          textShadow: "0 0 40px rgba(0,229,255,0.3)",
        }}>
          Thank You!
        </h1>
        <p style={{
          fontSize: "1.2rem",
          color: "rgba(224,224,236,0.8)",
          lineHeight: 1.8,
          marginBottom: "2rem",
        }}>
          We've received your message and will be in touch within 24 hours.
          <br />
          In the meantime, feel free to explore our services.
        </p>
        <a
          href="/"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: ".85rem",
            fontWeight: 700,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            background: "linear-gradient(135deg, #ff6b00, #ff4400)",
            color: "#000",
            border: "none",
            padding: "14px 36px",
            cursor: "pointer",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
            transition: "all .3s",
          }}
        >
          ← Back to Home
        </a>
      </div>
    </div>
  );
}
