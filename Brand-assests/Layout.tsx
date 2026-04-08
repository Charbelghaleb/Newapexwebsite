import { useState, useEffect, useCallback, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import FlameLogo from "./FlameLogo";
import SocialIcons from "./SocialIcons";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const isHome = location === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const navLink = (hash: string, label: string) => {
    if (isHome) {
      return <a href={`#${hash}`} onClick={closeMobile}>{label}</a>;
    }
    return <Link href={`/#${hash}`} onClick={closeMobile}>{label}</Link>;
  };

  return (
    <>
      <div className="content">
        <nav className={`nav${scrolled ? " scrolled" : ""}`}>
          <Link href="/" className="nav-brand">
            <FlameLogo size={48} className="nav-logo" />
            <div className="nav-brand-text">
              <div className="nav-brand-name">APEX PROMETHEUS</div>
            </div>
          </Link>
          <ul className="nav-links">
            <li><Link href="/ai-visibility-score" className="nav-score-link">Free AI Score</Link></li>
            <li>{navLink("services", "Services")}</li>
            <li>{navLink("about", "About")}</li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/manifesto">Manifesto</Link></li>
            <li>{navLink("contact", "Contact")}</li>
          </ul>
          <div className="nav-cta-wrap" style={{ display: "flex" }}>
            {isHome ? (
              <a href="#contact" className="nav-cta">Book Consultation →</a>
            ) : (
              <Link href="/#contact" className="nav-cta">Book Consultation →</Link>
            )}
          </div>
          <button className="nav-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? "✕" : "☰"}
          </button>
        </nav>

        <div className={`mob-menu${mobileOpen ? " active" : ""}`}>
          <Link href="/ai-visibility-score" onClick={closeMobile} className="mob-score-link">FREE AI SCORE</Link>
          {isHome ? (
            <>
              <a href="#services" onClick={closeMobile}>SERVICES</a>
              <a href="#about" onClick={closeMobile}>ABOUT</a>
            </>
          ) : (
            <>
              <Link href="/#services" onClick={closeMobile}>SERVICES</Link>
              <Link href="/#about" onClick={closeMobile}>ABOUT</Link>
            </>
          )}
          <Link href="/blog" onClick={closeMobile}>BLOG</Link>
          <Link href="/manifesto" onClick={closeMobile}>MANIFESTO</Link>
          {isHome ? (
            <a href="#contact" onClick={closeMobile}>CONTACT</a>
          ) : (
            <Link href="/#contact" onClick={closeMobile}>CONTACT</Link>
          )}
          {isHome ? (
            <a href="#contact" className="btn-fire" style={{ marginTop: "1rem" }} onClick={closeMobile}>Book Consultation →</a>
          ) : (
            <Link href="/#contact" className="btn-fire" style={{ marginTop: "1rem" }} onClick={closeMobile}>Book Consultation →</Link>
          )}
        </div>

        {children}

        <footer className="footer">
          <div className="footer-inner">
            <Link href="/" className="footer-brand">
              <FlameLogo size={40} className="footer-logo" />
              <div>
                <div className="footer-bn">APEX PROMETHEUS</div>
              </div>
            </Link>
            <div className="footer-links-row">
              <Link href="/blog">Blog</Link>
              <Link href="/manifesto">Manifesto</Link>
              <Link href="/whitepaper">Whitepaper</Link>
            </div>
            <div className="footer-social-row">
              <SocialIcons size="sm" />
            </div>
            <div className="footer-right">
              <div className="footer-copy">© 2026 Apex Prometheus. All rights reserved.</div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: ".6rem", color: "var(--text-dim)" }}>Staten Island, NY | Tampa, FL</div>
              <a href="mailto:info@apexprometheus.ai" className="footer-email">info@apexprometheus.ai</a>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        .footer-links-row{display:flex;gap:1.5rem;align-items:center}
        .footer-links-row a{font-family:'Share Tech Mono',monospace;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--text-dim);text-decoration:none;transition:color .25s}
        .footer-links-row a:hover{color:var(--plasma)}
        .footer-social-row{margin-top:0.75rem}
        .nav-score-link{color:var(--fire)!important;font-weight:700;position:relative}
        .nav-score-link::after{content:'';position:absolute;bottom:-2px;left:0;right:0;height:2px;background:var(--fire);opacity:0;transition:opacity .2s}
        .nav-score-link:hover::after{opacity:1}
        .mob-score-link{color:var(--fire)!important;font-weight:700;border:1px solid var(--fire);padding:8px 16px!important;margin-bottom:8px}
      `}</style>
    </>
  );
}
