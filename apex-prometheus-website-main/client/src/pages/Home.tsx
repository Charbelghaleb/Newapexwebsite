import { useEffect, useRef, useState, useCallback } from "react";
import FlameLogo from "../components/FlameLogo";
import FloatingContactBar from "../components/FloatingContactBar";
import SocialIcons from "../components/SocialIcons";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formSent, setFormSent] = useState(false);

  // ═══ SEO ═══
  useEffect(() => {
    document.title = "Apex Prometheus | AI Consulting for Small Business";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'AI consulting for small and mid-size businesses. From basic AI tools to full agentic workflows. Lean operations, proven results.');
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) metaKeywords.setAttribute('content', 'AI consulting, business automation, AI implementation, lean operations, workflow automation, agentic AI, Staten Island');
  }, []);

  // ═══ CANVAS BACKGROUND ═══
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W: number, H: number, time = 0;
    let gridNodes: any[] = [], traces: any[] = [], pulses: any[] = [];
    let animId: number;

    function resize() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
      initGrid();
    }

    function initGrid() {
      gridNodes = []; traces = []; pulses = [];
      const sp = 70;
      const cols = Math.ceil(W / sp) + 1, rows = Math.ceil(H / sp) + 1;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          if (Math.random() > 0.6) {
            gridNodes.push({
              x: c * sp, y: r * sp, ox: c * sp, oy: r * sp,
              r: Math.random() * 2 + 0.8,
              color: Math.random() > 0.55 ? [0, 229, 255] : [255, 107, 0],
              pulse: Math.random() * Math.PI * 2,
              speed: Math.random() * 0.02 + 0.008
            });
          }
        }
      }

      for (let i = 0; i < 50; i++) {
        const sx = Math.round(Math.random() * cols) * sp;
        const sy = Math.round(Math.random() * rows) * sp;
        const path = [{ x: sx, y: sy }];
        let cx = sx, cy = sy;
        const steps = Math.floor(Math.random() * 5) + 2;
        for (let s = 0; s < steps; s++) {
          const horiz = Math.random() > 0.5;
          const dist = (Math.floor(Math.random() * 4) + 1) * sp * (Math.random() > 0.5 ? 1 : -1);
          if (horiz) cx += dist; else cy += dist;
          cx = Math.max(0, Math.min(W, cx));
          cy = Math.max(0, Math.min(H, cy));
          path.push({ x: cx, y: cy });
        }
        const isPlasma = Math.random() > 0.45;
        traces.push({ path, color: isPlasma ? [0, 229, 255] : [255, 107, 0], alpha: Math.random() * 0.05 + 0.015 });
      }

      for (let r = 0; r < rows; r += 4) {
        if (Math.random() > 0.5) {
          const y = r * sp;
          const path: any[] = [];
          const keySize = sp;
          let x = 0;
          while (x < W) {
            path.push({ x, y });
            path.push({ x: x + keySize, y });
            path.push({ x: x + keySize, y: y - keySize / 2 });
            path.push({ x: x + keySize * 2, y: y - keySize / 2 });
            path.push({ x: x + keySize * 2, y });
            x += keySize * 3;
          }
          traces.push({ path, color: [0, 229, 255], alpha: 0.025 });
        }
      }

      for (let i = 0; i < 15; i++) {
        const t = traces[Math.floor(Math.random() * traces.length)];
        if (t && t.path.length >= 2) {
          pulses.push({ trace: t, pos: Math.random(), speed: Math.random() * 0.004 + 0.001, size: Math.random() * 2.5 + 1.5 });
        }
      }
    }

    function drawBg() {
      time += 0.008;
      ctx!.fillStyle = "rgba(10,10,15,0.1)";
      ctx!.fillRect(0, 0, W, H);

      for (const t of traces) {
        if (t.path.length < 2) continue;
        ctx!.beginPath();
        ctx!.moveTo(t.path[0].x, t.path[0].y);
        for (let i = 1; i < t.path.length; i++) ctx!.lineTo(t.path[i].x, t.path[i].y);
        ctx!.strokeStyle = `rgba(${t.color[0]},${t.color[1]},${t.color[2]},${t.alpha})`;
        ctx!.lineWidth = 0.7;
        ctx!.stroke();
      }

      const m = mouseRef.current;
      for (const n of gridNodes) {
        n.pulse += n.speed;
        const dx = m.x - n.x, dy = m.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const boost = Math.max(0, 1 - dist / 220);
        const a = Math.sin(n.pulse) * 0.25 + 0.35 + boost * 0.5;

        n.x += (n.ox + Math.sin(time + n.ox * 0.008) * 2 - n.x) * 0.03;
        n.y += (n.oy + Math.cos(time + n.oy * 0.008) * 2 - n.y) * 0.03;
        if (boost > 0) { n.x += dx * boost * 0.008; n.y += dy * boost * 0.008; }

        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r + boost * 3, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${Math.min(1, a)})`;
        ctx!.fill();

        if (boost > 0.25) {
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, n.r + boost * 10, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${boost * 0.12})`;
          ctx!.fill();

          for (const mn of gridNodes) {
            if (mn === n) continue;
            const d2 = Math.sqrt((n.x - mn.x) ** 2 + (n.y - mn.y) ** 2);
            const mb = Math.max(0, 1 - Math.sqrt((m.x - mn.x) ** 2 + (m.y - mn.y) ** 2) / 220);
            if (d2 < 140 && mb > 0.2) {
              ctx!.beginPath();
              ctx!.moveTo(n.x, n.y);
              ctx!.lineTo(mn.x, n.y);
              ctx!.lineTo(mn.x, mn.y);
              ctx!.strokeStyle = `rgba(0,229,255,${boost * mb * 0.15})`;
              ctx!.lineWidth = 0.5;
              ctx!.stroke();
            }
          }
        }
      }

      for (const p of pulses) {
        p.pos += p.speed;
        if (p.pos > 1) p.pos = 0;
        const path = p.trace.path;
        if (path.length < 2) continue;
        let totalLen = 0;
        const segs: any[] = [];
        for (let i = 1; i < path.length; i++) {
          const len = Math.sqrt((path[i].x - path[i - 1].x) ** 2 + (path[i].y - path[i - 1].y) ** 2);
          segs.push({ len, start: totalLen }); totalLen += len;
        }
        const target = p.pos * totalLen;
        let px = path[0].x, py = path[0].y;
        for (let i = 0; i < segs.length; i++) {
          if (target >= segs[i].start && target <= segs[i].start + segs[i].len) {
            const t = (target - segs[i].start) / segs[i].len;
            px = path[i].x + (path[i + 1].x - path[i].x) * t;
            py = path[i].y + (path[i + 1].y - path[i].y) * t;
            break;
          }
        }
        const c = p.trace.color;
        ctx!.beginPath(); ctx!.arc(px, py, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},0.6)`;
        ctx!.fill();
        ctx!.beginPath(); ctx!.arc(px, py, p.size * 3.5, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},0.08)`;
        ctx!.fill();
      }

      animId = requestAnimationFrame(drawBg);
    }

    const handleMouseMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const handleTouchMove = (e: TouchEvent) => { mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    resize();
    drawBg();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // ═══ SCROLL REVEAL ═══
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add("visible"), i * 80);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ═══ NAV SCROLL ═══
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const [formSubmitting, setFormSubmitting] = useState(false);

  const submitForm = async () => {
    if (!formData.name.trim() || !formData.email.trim()) return;
    setFormSubmitting(true);
    try {
      const response = await fetch("/api/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, formType: "contact" }),
      });
      if (response.ok) {
        setFormSent(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setFormSent(false), 6000);
      }
    } catch (err) {
      console.error("Form submission error:", err);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <>
      <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} />
      <div className="grain" />
      <div className="scanline" />
      <div className="content">

        {/* ═══ NAV ═══ */}
        <nav className={`nav${scrolled ? " scrolled" : ""}`}>
          <a href="#" className="nav-brand" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            <FlameLogo size={48} className="nav-logo" />
            <div className="nav-brand-text">
              <div className="nav-brand-name">APEX PROMETHEUS</div>

            </div>
          </a>
          <ul className="nav-links">
            <li><a href="/ai-visibility-score" className="nav-score-link">Free Package</a></li>
            <li><a href="#problem">Problem</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#who-for">Who For</a></li>
            <li><a href="#industries">Industries</a></li>
            <li><a href="#social-media">Social Media</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className="nav-cta-wrap" style={{ display: "flex" }}>
            <a href="#contact" className="nav-cta">Book Consultation →</a>
          </div>
          <button className="nav-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? "✕" : "☰"}
          </button>
        </nav>

        <div className={`mob-menu${mobileOpen ? " active" : ""}`}>
          <a href="/ai-visibility-score" onClick={closeMobile} className="mob-score-link">FREE PACKAGE</a>
          <a href="#problem" onClick={closeMobile}>PROBLEM</a>
          <a href="#services" onClick={closeMobile}>SERVICES</a>
          <a href="#who-for" onClick={closeMobile}>WHO FOR</a>
          <a href="#industries" onClick={closeMobile}>INDUSTRIES</a>
          <a href="#social-media" onClick={closeMobile}>SOCIAL MEDIA</a>
          <a href="#about" onClick={closeMobile}>ABOUT</a>
          <a href="/blog" onClick={closeMobile}>BLOG</a>
          <a href="#contact" onClick={closeMobile}>CONTACT</a>
          <a href="#contact" className="btn-fire" style={{ marginTop: "1rem" }} onClick={closeMobile}>Book Consultation →</a>
        </div>

        {/* ═══ HERO ═══ */}
        <section className="hero">
          <div className="digi-flame">
            <svg viewBox="0 0 500 600" fill="none" style={{ width: "100%", height: "100%" }}>
              <defs>
                <linearGradient id="fg1" x1="250" y1="580" x2="250" y2="50" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ff2200" /><stop offset="30%" stopColor="#ff6b00" />
                  <stop offset="60%" stopColor="#ffaa00" /><stop offset="100%" stopColor="#00e5ff" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="fg2" x1="250" y1="550" x2="250" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#c44200" /><stop offset="50%" stopColor="#ff6b00" /><stop offset="100%" stopColor="#ffaa00" />
                </linearGradient>
                <linearGradient id="cg" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00e5ff" /><stop offset="100%" stopColor="#ff6b00" />
                </linearGradient>
                <filter id="fg"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                <filter id="fg2f"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              <path d="M250 40 C250 40,100 200,100 340 C100 440,165 530,250 530 C335 530,400 440,400 340 C400 200,250 40,250 40Z" stroke="url(#fg1)" strokeWidth="2" fill="none" opacity=".4" filter="url(#fg)">
                <animate attributeName="d" values="M250 40 C250 40,100 200,100 340 C100 440,165 530,250 530 C335 530,400 440,400 340 C400 200,250 40,250 40Z;M250 30 C250 30,95 195,95 335 C95 438,162 535,250 535 C338 535,405 438,405 335 C405 195,250 30,250 30Z;M250 40 C250 40,100 200,100 340 C100 440,165 530,250 530 C335 530,400 440,400 340 C400 200,250 40,250 40Z" dur="4s" repeatCount="indefinite" />
              </path>
              <path d="M250 120 C250 120,140 250,140 350 C140 420,190 490,250 490 C310 490,360 420,360 350 C360 250,250 120,250 120Z" stroke="url(#fg2)" strokeWidth="1.5" fill="none" opacity=".5">
                <animate attributeName="d" values="M250 120 C250 120,140 250,140 350 C140 420,190 490,250 490 C310 490,360 420,360 350 C360 250,250 120,250 120Z;M250 110 C250 110,135 245,135 345 C135 418,188 495,250 495 C312 495,365 418,365 345 C365 245,250 110,250 110Z;M250 120 C250 120,140 250,140 350 C140 420,190 490,250 490 C310 490,360 420,360 350 C360 250,250 120,250 120Z" dur="3s" repeatCount="indefinite" />
              </path>
              <path d="M250 480 L250 180" stroke="url(#cg)" strokeWidth="1.5" opacity=".6" filter="url(#fg2f)" strokeDasharray="6 3"><animate attributeName="stroke-dashoffset" values="0;-54" dur="2s" repeatCount="indefinite" /></path>
              <path d="M250 420 L210 400 L180 400 L180 360 L200 340" stroke="url(#cg)" strokeWidth="1" opacity=".4" strokeDasharray="4 4"><animate attributeName="stroke-dashoffset" values="0;-48" dur="3s" repeatCount="indefinite" /></path>
              <path d="M250 350 L220 330 L190 290" stroke="url(#cg)" strokeWidth="1" opacity=".35" strokeDasharray="4 4"><animate attributeName="stroke-dashoffset" values="0;-48" dur="2.5s" repeatCount="indefinite" /></path>
              <path d="M250 280 L220 260 L200 230" stroke="url(#cg)" strokeWidth="1" opacity=".3" strokeDasharray="3 3"><animate attributeName="stroke-dashoffset" values="0;-36" dur="2s" repeatCount="indefinite" /></path>
              <path d="M250 420 L290 400 L320 400 L320 360 L300 340" stroke="url(#cg)" strokeWidth="1" opacity=".4" strokeDasharray="4 4"><animate attributeName="stroke-dashoffset" values="0;48" dur="3s" repeatCount="indefinite" /></path>
              <path d="M250 350 L280 330 L310 290" stroke="url(#cg)" strokeWidth="1" opacity=".35" strokeDasharray="4 4"><animate attributeName="stroke-dashoffset" values="0;48" dur="2.5s" repeatCount="indefinite" /></path>
              <path d="M250 280 L280 260 L300 230" stroke="url(#cg)" strokeWidth="1" opacity=".3" strokeDasharray="3 3"><animate attributeName="stroke-dashoffset" values="0;36" dur="2s" repeatCount="indefinite" /></path>
              <circle cx="250" cy="480" r="4" fill="#ff6b00" opacity=".7"><animate attributeName="opacity" values=".7;.3;.7" dur="2s" repeatCount="indefinite" /></circle>
              <circle cx="250" cy="380" r="3" fill="#00e5ff" opacity=".6"><animate attributeName="opacity" values=".6;.2;.6" dur="1.5s" repeatCount="indefinite" /></circle>
              <circle cx="250" cy="180" r="5" fill="#00e5ff" opacity=".8" filter="url(#fg)"><animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" /><animate attributeName="opacity" values=".8;.4;.8" dur="2s" repeatCount="indefinite" /></circle>
              <circle cx="180" cy="400" r="2.5" fill="#ff6b00" opacity=".5"><animate attributeName="opacity" values=".5;.2;.5" dur="3s" repeatCount="indefinite" /></circle>
              <circle cx="320" cy="400" r="2.5" fill="#ff6b00" opacity=".5"><animate attributeName="opacity" values=".5;.2;.5" dur="3s" repeatCount="indefinite" /></circle>
              <circle r="3" fill="#00e5ff" filter="url(#fg2f)"><animateMotion path="M250,480 L250,380 L250,300 L250,180" dur="2.5s" repeatCount="indefinite" /><animate attributeName="opacity" values="1;.3;1;0" dur="2.5s" repeatCount="indefinite" /></circle>
              <circle r="2" fill="#ff6b00" filter="url(#fg2f)"><animateMotion path="M250,480 L210,400 L180,400 L180,360 L200,340" dur="3s" repeatCount="indefinite" /><animate attributeName="opacity" values=".8;.2;.8;0" dur="3s" repeatCount="indefinite" /></circle>
              <circle r="2" fill="#ffaa00"><animateMotion path="M250,480 L290,400 L320,400 L320,360 L300,340" dur="3s" repeatCount="indefinite" /><animate attributeName="opacity" values=".7;.2;.7;0" dur="3s" repeatCount="indefinite" /></circle>
            </svg>
          </div>

          <div className="hero-inner">
            <div className="hero-flame-wrap">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663387224517/jub4jdiQA2cL5JLPsWtMq2/digital-flame-circle-transparent_b225caae.png" alt="Apex Prometheus" className="hero-flame-img" />
            </div>
            <div className="hero-mdiv"><div className="m-div"><div className="m-line"></div><div className="m-dot"></div><div className="m-line r"></div></div></div>
            <h1 className="hero-headline">Survive &amp; Thrive<br /><span className="glow">with AI</span></h1>
            <p className="hero-sub">We help small and mid-size businesses adopt AI tools and build lean operations. From basic implementations to full agentic workflows — we've done it in our own business, and we know how to do it in yours.</p>
            <div className="hero-actions">
              <a href="#contact" className="btn-fire">Book Consultation →</a>
              <a href="#services" className="btn-outline">Explore Services</a>
            </div>
          </div>
        </section>

        {/* ═══ PROBLEM ═══ */}
        <section id="problem" className="section">
          <div className="section-inner">
            <div className="reveal">
              <div className="section-label">problem_statement</div>
              <h2 className="section-title">The Problem</h2>
              <div className="m-div"><div className="m-line"></div><div className="m-dot"></div><div className="m-line r"></div></div>
              <p className="section-desc">AI isn't a luxury anymore — it's a necessity. Businesses that don't adopt AI now will struggle to compete tomorrow.</p>
            </div>
            <div className="problem-grid">
              {[
                { icon: "⚡", title: "You're Losing Time (and Money)", desc: "Manual processes drain your team's productivity. While competitors automate, you're stuck in the old way of doing things." },
                { icon: "👥", title: "Your Team is Overwhelmed", desc: "Without lean operations, you need more staff to handle the same workload. AI can do the heavy lifting — if you know how to use it." },
                { icon: "📉", title: "You're Falling Behind", desc: "The AI adoption gap is real. Large companies are already reaping the benefits. SMBs that wait will find themselves at a serious disadvantage." },
                { icon: "🛡", title: "You Don't Know Where to Start", desc: "There's too much hype, too many tools, and too many consultants selling snake oil. You need someone who's actually done it." },
              ].map((item, idx) => (
                <div key={idx} className="cc problem-card reveal">
                  <div className="problem-icon">{item.icon}</div>
                  <div>
                    <div className="problem-title">{item.title}</div>
                    <div className="problem-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="callout reveal">
              <span className="callout-prefix">&gt; reality_check</span>
              <p className="callout-text">Businesses that adopt AI now will dominate their markets. Those that wait will become irrelevant. The question isn't "should we adopt AI?" — it's <strong>"how quickly can we get started?"</strong></p>
            </div>
          </div>
        </section>

        {/* ═══ IRRESISTIBLE OFFER ═══ */}
        <section className="section offer-section">
          <div className="section-inner">
            <div className="offer-card reveal">
              <div className="offer-content">
                <div className="offer-badge">FREE PACKAGE</div>
                <h2 className="offer-title">Here's What We'll Do for Your Business — Before You Pay Us a Dime</h2>
                <p className="offer-desc">Most AI consultants show up with a slideshow. We show up with finished work.</p>
                
                <div className="offer-gifts">
                  <div className="offer-gift reveal">
                    <div className="gift-icon">🎁</div>
                    <div className="gift-content">
                      <div className="gift-title">1. Scan Your Business (Free)</div>
                      <div className="gift-desc">We run your website through our Brand DNA system. In 3 minutes, we extract your colors, your voice, your imagery, and your market positioning.</div>
                    </div>
                  </div>
                  
                  <div className="offer-gift reveal">
                    <div className="gift-icon">🎁</div>
                    <div className="gift-content">
                      <div className="gift-title">2. Build You 2 Weeks of Social Content (Free)</div>
                      <div className="gift-desc">Using your Brand DNA, we generate **14 days of ready-to-post social media content** — branded graphics, captions in your voice, hashtags targeting your local market.</div>
                    </div>
                  </div>
                  
                  <div className="offer-gift reveal">
                    <div className="gift-icon">🎁</div>
                    <div className="gift-content">
                      <div className="gift-title">3. Show You What AI Says About Your Business (Free)</div>
                      <div className="gift-desc">We run your business through ChatGPT, Perplexity, Google AI Overviews, and Claude. You'll see exactly what AI recommends when customers ask about businesses like yours.</div>
                    </div>
                  </div>
                  
                  <div className="offer-gift reveal">
                    <div className="gift-icon">🎁</div>
                    <div className="gift-content">
                      <div className="gift-title">4. Give You Your AI Visibility Score (Free)</div>
                      <div className="gift-desc">A detailed report showing where you rank in AI search, what's helping you, what's hurting you, and the specific steps to become the #1 AI recommendation in your market.</div>
                    </div>
                  </div>
                </div>
                
                <div className="offer-value reveal">
                  <div className="offer-value-text">
                    <span className="offer-value-label">Total value of this package:</span>
                    <span className="offer-value-amount">$2,500+</span>
                  </div>
                  <div className="offer-cost">
                    <span className="offer-cost-label">Your cost:</span>
                    <span className="offer-cost-amount">$0</span>
                  </div>
                </div>
                
                <div className="offer-actions reveal">
                  <a href="/ai-visibility-score" className="btn-fire">Get My Free Package →</a>
                  <a href="#contact" className="btn-outline">Book a 15-Min Call</a>
                </div>
              </div>
              
              <div className="offer-visual">
                <div className="offer-preview">
                  <div className="offer-preview-ring">
                    <span className="offer-preview-text">FREE<br />PACKAGE</span>
                  </div>
                  <div className="offer-preview-label">WORTH $2,500+</div>
                </div>
              </div>
            </div>
            
            <div className="offer-guarantee reveal">
              <div className="guarantee-prefix">&gt; the_churchill_guarantee</div>
              <div className="guarantee-text">We run a real business — Churchill Painting Corp in NYC. Every system we offer is running in our company right now. <strong>If we can't identify at least $10,000 in annual savings for your business, the consultation is completely free.</strong></div>
            </div>
          </div>
        </section>

        {/* ═══ SERVICES ═══ */}
        <section id="services" className="section services-bg">
          <div className="section-inner" style={{ position: "relative", zIndex: 5 }}>
            <div className="reveal">
              <div className="section-label">service_tiers</div>
              <h2 className="section-title">Services</h2>
              <div className="m-div"><div className="m-line"></div><div className="m-dot"></div><div className="m-line r"></div></div>
              <p className="section-desc">Three tiers designed to meet you where you are in your AI journey.</p>
            </div>
            <div className="tier-grid">
              {/* Tier 1 */}
              <div className="tier-card reveal">
                <div className="tier-num">TIER_01</div>
                <div className="tier-name">AI Foundations</div>
                <div className="tier-desc">Perfect for businesses new to AI. We introduce you to the basics and help you implement immediate wins.</div>
                <div className="tier-price">$1.5K–$3K</div>
                <div className="tier-timeline">2–4 weeks</div>
                <ul className="tier-features">
                  <li>AI readiness assessment</li>
                  <li>Tool recommendations</li>
                  <li>Custom SOPs</li>
                  <li>Team training</li>
                </ul>
                <div className="tier-roi">ROI: 2–3x / Year 1</div>
                <button className="btn-tier" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>Get Started</button>
              </div>

              {/* Tier 2 — Featured */}
              <div className="tier-card featured reveal">
                <div className="tier-badge">★ MOST POPULAR</div>
                <div className="tier-num" style={{ color: "var(--fire)", marginTop: 12 }}>TIER_02</div>
                <div className="tier-name">Workflow Automation</div>
                <div className="tier-desc">Ready to scale? We automate your core workflows and integrate your systems for seamless operations.</div>
                <div className="tier-price">$3K–$10K</div>
                <div className="tier-timeline">4–8 weeks</div>
                <ul className="tier-features">
                  <li>Workflow analysis &amp; optimization</li>
                  <li>System integrations (CRM, PM, etc.)</li>
                  <li>Custom automation (3 processes)</li>
                  <li>AI-assisted operations</li>
                </ul>
                <div className="tier-roi">ROI: 3–5x / Year 1</div>
                <button className="btn-tier" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>Get Started</button>
              </div>

              {/* Tier 3 */}
              <div className="tier-card reveal">
                <div className="tier-num">TIER_03</div>
                <div className="tier-name">Agentic AI</div>
                <div className="tier-desc">Full transformation. We design and deploy custom AI agents to create a truly lean, autonomous operation.</div>
                <div className="tier-price">$10K–$30K+</div>
                <div className="tier-timeline">8–16 weeks</div>
                <ul className="tier-features">
                  <li>Business process re-engineering</li>
                  <li>Custom AI agent development</li>
                  <li>Autonomous workflows</li>
                  <li>Lean-office transformation</li>
                </ul>
                <div className="tier-roi">ROI: 5–10x / Year 1</div>
                <button className="btn-tier" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>Get Started</button>
              </div>
            </div>

            {/* Retainer */}
            <div className="retainer-card reveal">
              <div>
                <div className="retainer-label">[ ongoing_support ]</div>
                <div className="retainer-title">Ongoing Support &amp; Advisory</div>
                <div className="retainer-desc">After your project, keep us on retainer for ongoing support, maintenance, and advisory services. Priority access, monthly strategy sessions, and early access to new tools.</div>
              </div>
              <div>
                <div className="retainer-price"><span className="retainer-starting">Starting at</span>$980</div>
                <div className="retainer-unit">/month</div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ WHO IS THIS FOR ═══ */}
        <section id="who-for" className="section who-for-bg">
          <div className="section-inner">
            <div className="reveal">
              <div className="section-label">target_audience</div>
              <h2 className="section-title">Who Is This For?</h2>
              <div className="m-div"><div className="m-line"></div><div className="m-dot"></div><div className="m-line r"></div></div>
              <p className="section-desc">If you own a local business and you're reading this at 10 PM because that's the only time you're not working — <strong>this is for you.</strong></p>
            </div>
            
            <div className="who-for-intro reveal">
              <div className="intro-text">We built these systems for a painting company. But the problems we solved aren't unique to painters:</div>
            </div>
            
            <div className="who-for-grid">
              {[
                { icon: "🔧", business: "Contractors", problem: "who lose jobs because they were on a ladder when the phone rang" },
                { icon: "✂️", business: "Barber shops", problem: "booked solid Saturday, dead on Tuesday" },
                { icon: "🍕", business: "Restaurants", problem: "where one-time diners never come back" },
                { icon: "🏥", business: "Medical offices", problem: "losing $200 per no-show, 15 times a month" },
                { icon: "🧺", business: "Laundromats", problem: "with empty machines from 2-5 PM every day" },
                { icon: "🚗", business: "Auto shops", problem: "whose customers forget their 6-month service reminder" },
                { icon: "💪", business: "Fitness studios", problem: "where 40% of new members ghost after month one" },
                { icon: "🛒", business: "Retail stores", problem: "with an Instagram page that hasn't posted since last year" },
                { icon: "🎥", business: "Content creators", problem: "spending more time scheduling than creating" }
              ].map((item, idx) => (
                <div key={idx} className="who-for-item reveal">
                  <div className="who-icon">{item.icon}</div>
                  <div className="who-content">
                    <span className="who-business">{item.business}</span>
                    <span className="who-problem">{item.problem}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="who-for-callout reveal">
              <div className="callout-text"><strong>Same problems. Same AI. Different industry.</strong></div>
              <div className="callout-subtext">Whether you're a plumber, a barber, a restaurant owner, or a dentist — if you're grinding 60 hours a week and know there's a better way — <strong>we built the better way. And we use it every day.</strong></div>
              <div className="who-for-cta">
                <a href="#industries" className="btn-outline">See All Industries We Serve →</a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ INDUSTRIES WE WORK WITH ═══ */}
        <section id="industries" className="section">
          <div className="section-inner">
            <div className="reveal">
              <div className="section-label">who_we_serve</div>
              <h2 className="section-title">AI Systems Built by People Who Run Real Businesses</h2>
              <div className="m-div"><div className="m-line"></div><div className="m-dot"></div><div className="m-line r"></div></div>
              <p className="section-desc">We built our first AI system to save a painting company. Then the plumber next door asked how we did it. Then the electrician down the street. They all had the same problems.</p>
            </div>
            
            <div className="industry-tiers">
              
              {/* Tier 1: Trades & Construction */}
              <div className="tier-section reveal">
                <div className="tier-header">
                  <div className="tier-label">TIER 1</div>
                  <h3 className="tier-title">Trades & Construction — Where We Proved It</h3>
                  <p className="tier-desc">These are our people. We ARE a trades business. Every system was battle-tested here first.</p>
                </div>
                
                <div className="tier-industries">
                  {[
                    { icon: "🔧", name: "Contractors & Builders", problem: "Stop losing jobs to the guy who answered first" },
                    { icon: "🎨", name: "Painters", problem: "Same-day estimates that close, not 3-day quotes that don't" },
                    { icon: "🔌", name: "Electricians", problem: "Emergency calls routed and booked while you're on a panel" },
                    { icon: "🔧", name: "Plumbers", problem: "24/7 lead capture that never misses a burst pipe at 2 AM" },
                    { icon: "❄️", name: "HVAC", problem: "Seasonal demand automation — pack the schedule before competitors wake up" },
                    { icon: "🏠", name: "Roofers", problem: "Storm response campaigns that deploy automatically when weather hits" },
                    { icon: "🌿", name: "Landscaping & Lawn Care", problem: "Route optimization + automated upsells for recurring service" },
                    { icon: "🐛", name: "Pest Control", problem: "Seasonal campaign automation + review generation on autopilot" }
                  ].map((industry, idx) => (
                    <div key={idx} className="tier-industry">
                      <div className="tier-industry-icon">{industry.icon}</div>
                      <div className="tier-industry-content">
                        <div className="tier-industry-name">{industry.name}</div>
                        <div className="tier-industry-problem">{industry.problem}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Tier 2: Local Service */}
              <div className="tier-section reveal">
                <div className="tier-header">
                  <div className="tier-label">TIER 2</div>
                  <h3 className="tier-title">Local Service Businesses — Same Pain, Same Fix</h3>
                  <p className="tier-desc">If you have a fixed location and local customers, we have your system.</p>
                </div>
                
                <div className="tier-industries">
                  {[
                    { icon: "✂️", name: "Barber Shops & Hair Salons", problem: "Fill every chair, every hour, automatically" },
                    { icon: "🚗", name: "Auto Repair & Detailing", problem: "Service reminders that bring customers back before they forget" },
                    { icon: "🧺", name: "Laundromats & Dry Cleaners", problem: "Loyalty programs + off-peak promotions that fill machines" },
                    { icon: "🍕", name: "Restaurants & Cafes", problem: "Turn one-time diners into regulars on autopilot" },
                    { icon: "🏥", name: "Medical & Dental Practices", problem: "No-shows down 60%. Patient reviews up 300%." },
                    { icon: "🐕", name: "Veterinary Clinics", problem: "Wellness check campaigns that keep pets (and revenue) coming back" },
                    { icon: "💪", name: "Fitness Studios & Trainers", problem: "Class booking, retention sequences, and social proof machines" },
                    { icon: "🐾", name: "Pet Grooming & Daycare", problem: "Automated rebooking + photo content that markets itself" }
                  ].map((industry, idx) => (
                    <div key={idx} className="tier-industry">
                      <div className="tier-industry-icon">{industry.icon}</div>
                      <div className="tier-industry-content">
                        <div className="tier-industry-name">{industry.name}</div>
                        <div className="tier-industry-problem">{industry.problem}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Tier 3: Digital & Hybrid */}
              <div className="tier-section reveal">
                <div className="tier-header">
                  <div className="tier-label">TIER 3</div>
                  <h3 className="tier-title">Digital & Hybrid Businesses</h3>
                  <p className="tier-desc">Local brands going online. Online operators going local. Either way, AI runs the backend.</p>
                </div>
                
                <div className="tier-industries">
                  {[
                    { icon: "🛒", name: "Local E-Commerce & Online Stores", problem: "AI product descriptions, email sequences, and customer service that never sleeps" },
                    { icon: "🎥", name: "Content Creators", problem: "Automate your posting, engagement, and brand deals pipeline" },
                    { icon: "📦", name: "Small E-Commerce Operators", problem: "Inventory marketing, abandoned cart recovery, and review automation" }
                  ].map((industry, idx) => (
                    <div key={idx} className="tier-industry">
                      <div className="tier-industry-icon">{industry.icon}</div>
                      <div className="tier-industry-content">
                        <div className="tier-industry-name">{industry.name}</div>
                        <div className="tier-industry-problem">{industry.problem}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="industries-universal reveal">
              <div className="universal-header">
                <h3 className="universal-title">What Every Business Gets</h3>
                <p className="universal-desc">No matter your industry, our AI systems handle the same core problems:</p>
              </div>
              
              <div className="universal-grid">
                {[
                  { icon: "📞", title: "Never Miss a Lead Again", desc: "AI captures and qualifies every inquiry — phone, web, text, social — 24 hours a day. Response time: under 60 seconds." },
                  { icon: "📱", title: "Social Media That Actually Posts", desc: "20-30 branded posts per month, scheduled and posted automatically. No more guilt. No more agencies." },
                  { icon: "⭐", title: "Reviews That Build Themselves", desc: "Automatic review requests after every job. Personalized. Perfectly timed. Your rating climbs on autopilot." },
                  { icon: "📅", title: "Scheduling That Runs Itself", desc: "Appointments booked automatically. Reminders sent. No-shows reduced 40-60%. Your calendar fills without you." },
                  { icon: "🔍", title: "AI Search Visibility", desc: "When customers ask ChatGPT 'Who's the best [business] near me?' — your name comes up first." },
                  { icon: "📧", title: "Follow-Up That Never Forgets", desc: "Automated sequences that nurture leads, retain customers, and request referrals. Nothing falls through the cracks." }
                ].map((feature, idx) => (
                  <div key={idx} className="universal-feature cc">
                    <div className="universal-icon">{feature.icon}</div>
                    <div className="universal-content">
                      <div className="universal-feature-title">{feature.title}</div>
                      <div className="universal-feature-desc">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="industries-position reveal">
              <div className="position-prefix">&gt; the_niche</div>
              <div className="position-heading">Local. Service. Owner-Operated.</div>
              <div className="position-text">The tech industry builds for online businesses. <strong>We build for brick-and-mortar service businesses.</strong> Because we ARE one. Whether you're cutting hair, cutting pipe, or cutting through the competition — we've got your system.</div>
            </div>
          </div>
        </section>

        {/* ═══ SOCIAL MEDIA SERVICES ═══ */}
        <section id="social-media" className="section social-bg">
          <div className="section-inner">
            <div className="reveal">
              <div className="section-label">content_automation</div>
              <h2 className="section-title">Your Social Media Isn't Dead. It's Just Running on Manual.</h2>
              <div className="m-div"><div className="m-line"></div><div className="m-dot"></div><div className="m-line r"></div></div>
              <p className="section-desc">You haven't posted in 3 months. Maybe 6. Your competitors who DO post consistently are getting the calls you're not.</p>
            </div>
            
            <div className="social-flow reveal">
              <div className="flow-step">
                <div className="flow-number">01</div>
                <div className="flow-content">
                  <div className="flow-title">Brand DNA Extraction</div>
                  <div className="flow-desc">We scan your website, pull your colors, your voice, your best images, and build a complete brand profile in minutes — not weeks. No questionnaires.</div>
                </div>
              </div>
              
              <div className="flow-arrow">→</div>
              
              <div className="flow-step">
                <div className="flow-number">02</div>
                <div className="flow-content">
                  <div className="flow-title">Content Production at Scale</div>
                  <div className="flow-desc">20-30 branded social posts monthly — custom graphics, captions in your voice, strategic hashtags, posting calendar — all automated.</div>
                </div>
              </div>
              
              <div className="flow-arrow">→</div>
              
              <div className="flow-step">
                <div className="flow-number">03</div>
                <div className="flow-content">
                  <div className="flow-title">Automated Posting & Optimization</div>
                  <div className="flow-desc">Content posts automatically while you're on the job site. We monitor performance and adjust. More of what works, less of what doesn't.</div>
                </div>
              </div>
            </div>
            
            <div className="social-results reveal">
              <div className="results-before">
                <div className="results-label">BEFORE APEX PROMETHEUS:</div>
                <ul className="results-list negative">
                  <li>Last post: 4 months ago</li>
                  <li>Followers: 487 (stagnant)</li>
                  <li>Social leads: 0-1 per month</li>
                  <li>Time spent: 0 hours (gave up) or 8+ hours/week</li>
                </ul>
              </div>
              
              <div className="results-after">
                <div className="results-label">AFTER APEX PROMETHEUS:</div>
                <ul className="results-list positive">
                  <li>Posts: 5-7 per week, every week</li>
                  <li>Followers: Growing 15-25% monthly</li>
                  <li>Social leads: 8-12 per month</li>
                  <li>Your time: 30 minutes reviewing our content</li>
                </ul>
              </div>
            </div>
            
            <div className="social-packages reveal">
              <div className="social-package">
                <div className="package-name">Content Starter</div>
                <div className="package-price">$500/month</div>
                <ul className="package-features">
                  <li>12 branded posts per month</li>
                  <li>Custom graphics and captions</li>
                  <li>Monthly posting calendar</li>
                  <li>Basic analytics report</li>
                </ul>
              </div>
              
              <div className="social-package featured">
                <div className="package-badge">MOST POPULAR</div>
                <div className="package-name">Content Pro</div>
                <div className="package-price">$1,000/month</div>
                <ul className="package-features">
                  <li>20 branded posts per month</li>
                  <li>Automated scheduling and posting</li>
                  <li>Stories/Reels concepts</li>
                  <li>Bi-weekly optimization</li>
                  <li>Local hashtag strategy</li>
                </ul>
              </div>
              
              <div className="social-package">
                <div className="package-name">Content Domination</div>
                <div className="package-price">$2,000/month</div>
                <ul className="package-features">
                  <li>30+ posts across all platforms</li>
                  <li>Full video content (Reels, TikTok, Shorts)</li>
                  <li>Automated engagement monitoring</li>
                  <li>Weekly strategy calls</li>
                  <li>Competitor social monitoring</li>
                </ul>
              </div>
            </div>
            
            <div className="social-stats reveal">
              <div className="stat-card">
                <div className="stat-number">67%</div>
                <div className="stat-label">more leads from consistent posting</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">78%</div>
                <div className="stat-label">of customers check social media before hiring</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">6-8hrs</div>
                <div className="stat-label">average weekly time spent on social (or gave up)</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">30min</div>
                <div className="stat-label">your monthly time with our system</div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ ABOUT ═══ */}
        <section id="about" className="section">
          <div className="section-inner" style={{ maxWidth: 900 }}>
            <div className="reveal">
              <div className="section-label">about_us</div>
              <h2 className="section-title">Why Apex Prometheus?</h2>
              <div className="m-div"><div className="m-line"></div><div className="m-dot"></div><div className="m-line r"></div></div>
            </div>
            <div className="about-card reveal">
              <div className="about-prefix">&gt; not_theorists</div>
              <div className="about-heading">We're Practitioners, Not Theorists</div>
              <p className="about-text">Our founder runs a successful construction and painting company in Staten Island. He's built a lean operation by implementing AI and agentic workflows in his own business. We're not consultants who read about AI — we're business owners who live it every day.</p>
              <p className="about-text" style={{ marginBottom: 0 }}>Apex Prometheus brings fire to your business — not as a gimmick, not as a pitch — as a tool we've already forged in the real world.</p>
              <div className="about-features">
                {[
                  { icon: "🛡", title: "Real-World Experience", desc: "We've implemented AI in a blue-collar business. We understand your challenges because we've faced them ourselves." },
                  { icon: "📈", title: "Proven Results", desc: "We've reduced our own office staff by 60% while scaling revenue. We know what works because we've done it." },
                  { icon: "⚡", title: "Practical Solutions", desc: "No fluff, no buzzwords. We focus on tools and workflows that deliver tangible ROI for your business." },
                  { icon: "📍", title: "Local & Accessible", desc: "Based in Staten Island, NY and Tampa, FL. We understand the local business landscape and the unique needs of SMBs." },
                ].map((item, idx) => (
                  <div key={idx} className="about-feature">
                    <div className="af-icon">{item.icon}</div>
                    <div>
                      <div className="af-title">{item.title}</div>
                      <div className="af-desc">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="founder-card reveal">
              <FlameLogo size={52} className="founder-logo" />
              <div>
                <div className="founder-text">Founded by a hands-on business owner who built his construction company lean with AI before anyone told him to.</div>
                <div className="founder-tags">
                  <span className="founder-tag">Staten Island, NY</span>
                  <span className="founder-tag">Tampa, FL</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CONTACT ═══ */}
        <section id="contact" className="section">
          <div className="section-inner" style={{ maxWidth: 900 }}>
            <div className="reveal">
              <div className="section-label">contact_us</div>
              <h2 className="section-title">Ready to Get Started?</h2>
              <div className="m-div"><div className="m-line"></div><div className="m-dot"></div><div className="m-line r"></div></div>
              <p className="section-desc">Let's talk about how AI can transform your business. No pitch, no pressure — just a straight conversation about what's possible.</p>
            </div>
            <div className="contact-grid">
              <div className="reveal">
                <div className="contact-item">
                  <div className="ci-icon">📍</div>
                  <div><div className="ci-label">LOCATIONS</div><div className="ci-val">Staten Island, NY<br />Tampa, FL</div></div>
                </div>
                <div className="contact-item">
                  <div className="ci-icon">✉</div>
                  <div><div className="ci-label">EMAIL</div><div className="ci-val"><a href="mailto:info@apexprometheus.ai">info@apexprometheus.ai</a></div></div>
                </div>
                <div className="contact-item">
                  <div className="ci-icon">☎</div>
                  <div><div className="ci-label">PHONE</div><div className="ci-val"><a href="tel:+17186031726">(718) 603-1726</a></div></div>
                </div>
                <div className="contact-item">
                  <div className="ci-icon">💬</div>
                  <div><div className="ci-label">TEXT / SMS</div><div className="ci-val"><a href="sms:+17186031726">(718) 603-1726</a></div></div>
                </div>
                <div className="contact-channels" style={{ display: "flex", gap: "10px", marginTop: "4px", flexWrap: "wrap" }}>
                  <a href="https://t.me/ApexPrometheus" target="_blank" rel="noopener noreferrer" className="contact-channel-btn" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.2)", borderRadius: "4px", color: "#29b6f6", textDecoration: "none", fontFamily: "'Share Tech Mono', monospace", fontSize: ".7rem", letterSpacing: ".1em", textTransform: "uppercase" as const, transition: "all .25s" }}>
                    <span>✈️</span> Telegram
                  </a>
                  <a href="https://wa.me/17186031726" target="_blank" rel="noopener noreferrer" className="contact-channel-btn" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.2)", borderRadius: "4px", color: "#25d366", textDecoration: "none", fontFamily: "'Share Tech Mono', monospace", fontSize: ".7rem", letterSpacing: ".1em", textTransform: "uppercase" as const, transition: "all .25s" }}>
                    <span>📱</span> WhatsApp
                  </a>
                </div>
                <div style={{ marginTop: "16px" }}>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: ".65rem", letterSpacing: ".15em", color: "var(--text-dim)", marginBottom: "8px", textTransform: "uppercase" as const }}>FOLLOW US</div>
                  <SocialIcons size="sm" />
                </div>
                <div className="callout" style={{ borderLeftColor: "var(--plasma)", marginTop: "12px" }}>
                  <span className="callout-prefix">&gt; response_time</span>
                  <p style={{ fontSize: ".85rem", color: "var(--text-dim)", lineHeight: 1.6 }}>We typically respond within 24 hours.</p>
                </div>
              </div>
              <div className="reveal">
                {formSent && (
                  <div className="form-success" style={{ marginBottom: 12 }}>&gt; message_sent // we'll be in touch shortly</div>
                )}
                <div className="contact-form">
                  <input type="text" className="fi" placeholder="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  <input type="email" className="fi" placeholder="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  <textarea className="fi" placeholder="tell us about your business and what you're looking for..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required />
                  <button className="form-submit" onClick={submitForm} disabled={formSubmitting}>{formSubmitting ? "Sending..." : "Send Message →"}</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="footer">
          <div className="footer-inner">
            <a href="#" className="footer-brand" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              <FlameLogo size={40} className="footer-logo" />
              <div>
                <div className="footer-bn">APEX PROMETHEUS</div>

              </div>
            </a>
            <div style={{ marginTop: "0.5rem" }}>
              <SocialIcons size="sm" />
            </div>
            <div className="footer-right">
              <div className="footer-copy">© 2026 Apex Prometheus. All rights reserved.</div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: ".6rem", color: "var(--text-dim)" }}>Staten Island, NY | Tampa, FL</div>
              <a href="mailto:info@apexprometheus.ai" className="footer-email">info@apexprometheus.ai</a>
            </div>
          </div>
        </footer>

        {/* ═══ FLOATING CONTACT BAR ═══ */}
        <FloatingContactBar config={{
          phone: "+17186031726",
          telegram: "https://t.me/ApexPrometheus",
          whatsapp: "+17186031726",
        }} />
      </div>

      {/* ═══ ALL STYLES ═══ */}
      <style>{`
        .grain{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:0.025;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
        .scanline{position:fixed;inset:0;z-index:2;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.02) 2px,rgba(0,0,0,0.02) 4px)}
        .content{position:relative;z-index:10}

        .m-div{display:flex;align-items:center;gap:14px;margin-bottom:2rem}
        .m-line{flex:1;height:1px;background:linear-gradient(90deg,var(--plasma),rgba(0,229,255,0.05))}
        .m-line.r{background:linear-gradient(90deg,rgba(255,107,0,0.05),var(--fire))}
        .m-dot{width:26px;height:26px;border:1px solid var(--plasma);display:flex;align-items:center;justify-content:center;transform:rotate(45deg);flex-shrink:0;animation:mPulse 3s ease-in-out infinite}
        .m-dot::after{content:'';width:7px;height:7px;background:var(--fire);transform:rotate(-45deg);box-shadow:0 0 8px var(--glow-fire)}
        @keyframes mPulse{0%,100%{border-color:rgba(0,229,255,0.2);box-shadow:none}50%{border-color:var(--plasma);box-shadow:0 0 12px rgba(0,229,255,0.12)}}

        .nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 2rem;height:72px;display:flex;align-items:center;justify-content:space-between;background:rgba(10,10,15,0.85);backdrop-filter:blur(20px) saturate(1.5);border-bottom:1px solid var(--border-color);transition:all .3s}
        .nav::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:1px;background:repeating-linear-gradient(90deg,var(--plasma) 0px,var(--plasma) 6px,transparent 6px,transparent 10px,var(--fire) 10px,var(--fire) 14px,transparent 14px,transparent 22px);opacity:0.12;transition:opacity .3s}
        .nav.scrolled{height:60px;background:rgba(10,10,15,0.95)}
        .nav.scrolled::after{opacity:0.35}
        .nav-brand{display:flex;align-items:center;gap:14px;text-decoration:none;color:inherit}
        .nav-logo{width:48px;height:48px;object-fit:contain;filter:drop-shadow(0 0 8px rgba(0,229,255,0.3)) drop-shadow(0 0 16px rgba(255,107,0,0.12));animation:logoGlow 3s ease-in-out infinite;transition:all .3s}
        .nav-brand:hover .nav-logo{filter:drop-shadow(0 0 14px rgba(0,229,255,0.6)) drop-shadow(0 0 28px rgba(255,107,0,0.25));transform:scale(1.08)}
        @keyframes logoGlow{0%,100%{filter:drop-shadow(0 0 8px rgba(0,229,255,0.3)) drop-shadow(0 0 16px rgba(255,107,0,0.12))}50%{filter:drop-shadow(0 0 14px rgba(0,229,255,0.5)) drop-shadow(0 0 24px rgba(255,107,0,0.2))}}
        .nav-brand-text{display:flex;flex-direction:column;gap:2px}
        .nav-brand-name{font-family:'Orbitron',sans-serif;font-weight:800;font-size:.8rem;letter-spacing:.12em;color:var(--plasma);text-shadow:0 0 20px var(--glow-plasma)}
        .nav-brand-tag{font-family:'Share Tech Mono',monospace;font-size:.6rem;font-weight:700;letter-spacing:.2em;background:linear-gradient(90deg,var(--fire),var(--fire-hot),var(--fire));background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite}
        .nav-links{display:flex;align-items:center;gap:2rem;list-style:none}
        .nav-links a{font-family:'Share Tech Mono',monospace;font-size:.7rem;letter-spacing:.15em;text-transform:uppercase;color:var(--text-dim);text-decoration:none;position:relative;padding:4px 0;transition:color .25s}
        .nav-links a::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:var(--plasma);box-shadow:0 0 6px var(--glow-plasma);transition:width .3s cubic-bezier(.22,1,.36,1)}
        .nav-links a:hover{color:var(--plasma)}
        .nav-links a:hover::after{width:100%}
        .nav-cta{font-family:'Share Tech Mono',monospace;font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;background:linear-gradient(135deg,var(--fire),#ff4400);color:#000;border:none;padding:10px 24px;cursor:pointer;text-decoration:none;clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));transition:all .25s}
        .nav-cta:hover{box-shadow:0 0 30px var(--glow-fire);transform:translateY(-1px)}
        .nav-toggle{display:none;background:none;border:1px solid var(--border-color);color:var(--text);width:44px;height:44px;cursor:pointer;font-size:1.4rem;align-items:center;justify-content:center}
        .mob-menu{display:none;position:fixed;top:72px;left:0;right:0;bottom:0;background:rgba(10,10,15,0.98);backdrop-filter:blur(30px);z-index:99;flex-direction:column;align-items:center;justify-content:center;gap:2rem}
        .mob-menu.active{display:flex}
        .mob-menu a{font-family:'Orbitron',sans-serif;font-size:1.2rem;letter-spacing:.15em;color:var(--text);text-decoration:none;transition:color .2s}
        .mob-menu a:hover{color:var(--plasma)}
        @media(max-width:900px){.nav-links,.nav-cta-wrap{display:none!important}.nav-toggle{display:flex}}

        .hero{min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;padding:120px 2rem 80px;overflow:hidden}
        .hero-inner{text-align:center;max-width:900px;position:relative;z-index:5}
        
        .dp{position:absolute;border-radius:50%;z-index:4;top:50%;left:50%}
        .dp1{width:6px;height:6px;background:var(--plasma);box-shadow:0 0 12px var(--plasma),0 0 24px rgba(0,229,255,0.3);animation:orb1 5s linear infinite}
        .dp2{width:4px;height:4px;background:var(--fire);box-shadow:0 0 10px var(--fire),0 0 20px rgba(255,107,0,0.3);animation:orb2 7s linear infinite}
        .dp3{width:3px;height:3px;background:var(--fire-hot);box-shadow:0 0 8px var(--fire-hot);animation:orb3 4.5s linear infinite}
        .dp4{width:5px;height:5px;background:var(--plasma);box-shadow:0 0 14px var(--plasma);animation:orb4 6s linear infinite}
        .dp5{width:7px;height:7px;background:rgba(255,107,0,0.6);box-shadow:0 0 16px var(--fire);animation:orb5 9s linear infinite}
        .dp6{width:3px;height:3px;background:#fff;box-shadow:0 0 6px #fff,0 0 12px var(--plasma);animation:orb6 8s linear infinite}
        @keyframes orb1{from{transform:translate(-50%,-50%) rotate(0deg) translateX(158px)}to{transform:translate(-50%,-50%) rotate(360deg) translateX(158px)}}
        @keyframes orb2{from{transform:translate(-50%,-50%) rotate(60deg) rotate(0deg) translateX(165px)}to{transform:translate(-50%,-50%) rotate(60deg) rotate(-360deg) translateX(165px)}}
        @keyframes orb3{from{transform:translate(-50%,-50%) rotate(140deg) rotate(0deg) translateX(148px)}to{transform:translate(-50%,-50%) rotate(140deg) rotate(360deg) translateX(148px)}}
        @keyframes orb4{from{transform:translate(-50%,-50%) rotate(220deg) rotate(0deg) translateX(172px)}to{transform:translate(-50%,-50%) rotate(220deg) rotate(-360deg) translateX(172px)}}
        @keyframes orb5{from{transform:translate(-50%,-50%) rotate(300deg) rotate(0deg) translateX(180px) scale(1)}to{transform:translate(-50%,-50%) rotate(300deg) rotate(360deg) translateX(180px) scale(1)}}
        @keyframes orb6{from{transform:translate(-50%,-50%) rotate(0deg) translateX(190px)}to{transform:translate(-50%,-50%) rotate(-360deg) translateX(190px)}}
        .digi-flame{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;height:600px;z-index:0;opacity:.12;pointer-events:none}
        .hero-flame-wrap{margin:0 auto 2.5rem;width:368px;height:368px;position:relative;display:flex;align-items:center;justify-content:center}
        .hero-flame-img{width:100%;height:100%;object-fit:contain;position:relative;z-index:5;filter:drop-shadow(0 0 25px rgba(255,107,0,0.5)) drop-shadow(0 0 50px rgba(255,107,0,0.25)) drop-shadow(0 0 80px rgba(0,229,255,0.15));animation:flameFloat 5s ease-in-out infinite,flameGlow 3s ease-in-out infinite}
        @keyframes flameFloat{0%,100%{transform:translateY(0) scale(1)}25%{transform:translateY(-8px) scale(1.01)}50%{transform:translateY(-14px) scale(1.02)}75%{transform:translateY(-6px) scale(1.01)}}
        @keyframes flameGlow{0%,100%{filter:drop-shadow(0 0 25px rgba(255,107,0,0.5)) drop-shadow(0 0 50px rgba(255,107,0,0.25)) drop-shadow(0 0 80px rgba(0,229,255,0.15))}50%{filter:drop-shadow(0 0 40px rgba(255,107,0,0.7)) drop-shadow(0 0 70px rgba(255,107,0,0.4)) drop-shadow(0 0 120px rgba(0,229,255,0.25)) drop-shadow(0 0 6px rgba(255,170,0,0.9))}}
        
        .hero-headline{font-family:'Orbitron',sans-serif;font-size:clamp(2.8rem,8vw,6rem);font-weight:900;line-height:.95;letter-spacing:-.02em;margin-bottom:2rem;opacity:0;animation:fadeUp .8s .65s cubic-bezier(.16,1,.3,1) forwards}
        .hero-headline .glow{color:var(--plasma);text-shadow:0 0 60px var(--glow-plasma),0 0 120px rgba(0,229,255,0.15)}
        .hero-sub{font-size:clamp(1.05rem,2.1vw,1.3rem);color:var(--text-dim);max-width:620px;margin:0 auto 3rem;font-weight:400;line-height:1.75;opacity:0;animation:fadeUp .8s .8s cubic-bezier(.16,1,.3,1) forwards}
        .hero-actions{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;opacity:0;animation:fadeUp .8s .95s cubic-bezier(.16,1,.3,1) forwards}
        .hero-mdiv{opacity:0;animation:fadeUp .8s .55s cubic-bezier(.16,1,.3,1) forwards}

        .btn-fire{font-family:'Share Tech Mono',monospace;font-size:.8rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;background:linear-gradient(135deg,var(--fire),#ff4400);color:#000;border:none;padding:14px 36px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:8px;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));transition:all .3s}
        .btn-fire:hover{box-shadow:0 0 40px var(--glow-fire),0 8px 32px rgba(255,107,0,0.2);transform:translateY(-2px)}
        .btn-outline{font-family:'Share Tech Mono',monospace;font-size:.8rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;background:transparent;color:var(--plasma);border:1px solid rgba(0,229,255,0.4);padding:14px 36px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:8px;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));transition:all .3s}
        .btn-outline:hover{background:rgba(0,229,255,0.08);border-color:var(--plasma);box-shadow:0 0 25px rgba(0,229,255,0.15)}

        .section{padding:100px 2rem;position:relative}
        .section-inner{max-width:1100px;margin:0 auto}
        .section-label{font-family:'Share Tech Mono',monospace;font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:var(--plasma);margin-bottom:1rem;display:flex;align-items:center;gap:12px}
        .section-label::before{content:'';width:30px;height:1px;background:var(--plasma);box-shadow:0 0 6px var(--glow-plasma)}
        .section-title{font-family:'Orbitron',sans-serif;font-size:clamp(2rem,5vw,3.2rem);font-weight:800;letter-spacing:.02em;margin-bottom:1.5rem;line-height:1.1}
        .section-desc{font-size:1.15rem;color:var(--text-dim);max-width:600px;line-height:1.75;margin-bottom:3rem;font-weight:400}

        .cc{background:var(--panel);border:1px solid var(--border-color);padding:28px 32px;position:relative;overflow:hidden;clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));transition:all .35s cubic-bezier(.22,1,.36,1)}
        .cc::before{content:'';position:absolute;top:0;left:0;width:40px;height:100%;background:linear-gradient(180deg,var(--plasma) 0px,var(--plasma) 18px,transparent 18px,transparent 26px,var(--plasma) 26px,var(--plasma) 30px,transparent 30px) 0 0/2px 100% no-repeat,radial-gradient(circle 3px,var(--plasma) 100%,transparent 100%) 1px 18px/6px 6px no-repeat,linear-gradient(90deg,var(--plasma) 0px,var(--plasma) 18px,transparent 18px) 0 30px/100% 2px no-repeat,radial-gradient(circle 2px,var(--fire) 100%,transparent 100%) 18px 29px/4px 4px no-repeat;opacity:.2;transition:opacity .35s}
        .cc:hover{border-color:rgba(0,229,255,0.4);transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,0.5),0 0 30px rgba(0,229,255,0.05)}
        .cc:hover::before{opacity:.45}
        .problem-grid{display:grid;gap:16px}
        .problem-card{display:flex;gap:20px}
        .problem-icon{width:44px;height:44px;border:1px solid rgba(0,229,255,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--fire);font-size:1.2rem;clip-path:polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px));transition:all .3s}
        .cc:hover .problem-icon{border-color:var(--plasma);background:rgba(0,229,255,0.05)}
        .problem-title{font-family:'Orbitron',sans-serif;font-size:1rem;font-weight:700;margin-bottom:6px;letter-spacing:.02em}
        .problem-desc{font-size:.95rem;color:var(--text-dim);line-height:1.7;font-weight:400}
        .callout{background:var(--panel);border:1px solid var(--border-color);border-left:3px solid var(--fire);padding:36px 40px;margin-top:2.5rem;clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));position:relative}
        .callout::after{content:'';position:absolute;bottom:12px;right:12px;width:50px;height:50px;background:linear-gradient(0deg,rgba(255,107,0,0.15) 0px,rgba(255,107,0,0.15) 2px,transparent 2px) 0 0/100% 8px,linear-gradient(90deg,rgba(255,107,0,0.15) 0px,rgba(255,107,0,0.15) 2px,transparent 2px) 0 0/8px 100%;opacity:.5}
        .callout-prefix{font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--plasma);margin-bottom:12px;display:block}
        .callout-text{font-size:1.2rem;line-height:1.75;font-weight:400}
        .callout-text strong{background:linear-gradient(90deg,var(--fire),var(--fire-hot));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:600}

        .services-bg{position:relative}
        .services-bg::before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,var(--void),rgba(18,18,30,0.5),var(--void));pointer-events:none}
        .tier-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        @media(max-width:900px){.tier-grid{grid-template-columns:1fr}}
        .tier-card{background:var(--panel);border:1px solid var(--border-color);padding:36px 32px;display:flex;flex-direction:column;transition:all .35s cubic-bezier(.22,1,.36,1);position:relative;overflow:hidden;clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))}
        .tier-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--plasma) 0%,var(--plasma) 30%,transparent 30%,transparent 35%,var(--fire) 35%,var(--fire) 50%,transparent 50%);opacity:.4;transition:opacity .3s}
        .tier-card::after{content:'';position:absolute;top:3px;right:0;width:3px;height:30px;background:linear-gradient(180deg,var(--fire),transparent);opacity:.3}
        .tier-card:hover{transform:translateY(-6px);border-color:rgba(0,229,255,0.3);box-shadow:0 20px 60px rgba(0,0,0,0.5),0 0 40px rgba(0,229,255,0.05)}
        .tier-card:hover::before{opacity:.8}
        .tier-card.featured{border-color:rgba(0,229,255,0.3);box-shadow:0 0 40px rgba(0,229,255,0.06)}
        .tier-card.featured::before{opacity:.8;background:linear-gradient(90deg,var(--plasma),var(--fire),var(--plasma));background-size:200% auto;animation:shimmer 3s linear infinite}
        .tier-badge{position:absolute;top:-1px;left:50%;transform:translateX(-50%);font-family:'Share Tech Mono',monospace;font-size:.55rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;background:linear-gradient(135deg,var(--fire),#ff4400);color:#000;padding:6px 18px;clip-path:polygon(8px 0,calc(100% - 8px) 0,100% 100%,0 100%)}
        .tier-num{font-family:'Share Tech Mono',monospace;font-size:.65rem;color:var(--plasma);letter-spacing:.2em;margin-bottom:10px}
        .tier-name{font-family:'Orbitron',sans-serif;font-size:1.2rem;font-weight:700;margin-bottom:12px}
        .tier-desc{font-size:.9rem;color:var(--text-dim);line-height:1.65;margin-bottom:20px;font-weight:400}
        .tier-price{font-family:'Orbitron',sans-serif;font-size:1.6rem;font-weight:800;color:var(--plasma);text-shadow:0 0 15px rgba(0,229,255,0.2);margin-bottom:4px}
        .tier-timeline{font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--text-dim);margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid var(--border-color)}
        .tier-features{list-style:none;margin-bottom:24px;flex:1;padding:0}
        .tier-features li{display:flex;gap:10px;font-size:.9rem;color:rgba(224,224,236,0.85);margin-bottom:10px;align-items:flex-start;font-weight:400}
        .tier-features li::before{content:'▸';color:var(--fire);font-size:.8rem;flex-shrink:0;margin-top:2px}
        .tier-roi{font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--fire);margin-bottom:20px}
        .btn-tier{font-family:'Share Tech Mono',monospace;font-size:.75rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;background:rgba(0,229,255,0.1);color:var(--plasma);border:1px solid rgba(0,229,255,0.3);padding:12px 24px;cursor:pointer;width:100%;clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));transition:all .3s}
        .btn-tier:hover{background:rgba(0,229,255,0.2);box-shadow:0 0 20px rgba(0,229,255,0.15)}
        .tier-card.featured .btn-tier{background:linear-gradient(135deg,var(--fire),#ff4400);color:#000;border:none}
        .tier-card.featured .btn-tier:hover{box-shadow:0 0 30px var(--glow-fire)}
        .retainer-card{background:var(--panel);border:1px solid var(--border-color);border-left:3px solid var(--fire);padding:36px 40px;margin-top:2rem;display:flex;align-items:center;justify-content:space-between;gap:2rem;flex-wrap:wrap;clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))}
        .retainer-label{font-family:'Share Tech Mono',monospace;font-size:.65rem;color:var(--plasma);letter-spacing:.2em;margin-bottom:8px}
        .retainer-title{font-family:'Orbitron',sans-serif;font-size:1.1rem;font-weight:700;margin-bottom:8px}
        .retainer-desc{font-size:.9rem;color:var(--text-dim);max-width:500px;line-height:1.65;font-weight:400}
        .retainer-starting{display:block;font-family:'Share Tech Mono',monospace;font-size:.55rem;font-weight:400;letter-spacing:.15em;color:var(--text-dim);-webkit-text-fill-color:var(--text-dim);background:none;animation:none;margin-bottom:2px;text-align:right}
        .retainer-price{font-family:'Orbitron',sans-serif;font-size:2.8rem;font-weight:900;background:linear-gradient(90deg,var(--fire),var(--fire-hot),var(--fire));background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite;text-align:right}
        .retainer-unit{font-family:'Share Tech Mono',monospace;font-size:.8rem;color:var(--text-dim);text-align:right}

        .about-card{background:var(--panel);border:1px solid var(--border-color);padding:48px;position:relative;clip-path:polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))}
        .about-card::before{content:'';position:absolute;top:0;left:0;width:100px;height:60px;background:linear-gradient(90deg,var(--plasma) 0px,var(--plasma) 60px,transparent 60px) 0 0/100% 2px no-repeat,linear-gradient(180deg,var(--plasma) 0px,var(--plasma) 40px,transparent 40px) 0 0/2px 100% no-repeat,radial-gradient(circle 3px,var(--plasma) 100%,transparent 100%) 58px -1px/6px 6px no-repeat;opacity:.3}
        .about-card::after{content:'';position:absolute;bottom:0;right:0;width:80px;height:50px;background:linear-gradient(90deg,transparent,var(--fire) 20px,var(--fire) 80px) 0 calc(100% - 2px)/100% 2px no-repeat,linear-gradient(180deg,transparent,var(--fire) 10px,var(--fire) 50px) calc(100% - 2px) 0/2px 100% no-repeat;opacity:.25}
        .about-prefix{font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--plasma);margin-bottom:16px}
        .about-heading{font-family:'Orbitron',sans-serif;font-size:1.5rem;font-weight:700;margin-bottom:20px}
        .about-text{font-size:1.05rem;color:rgba(224,224,236,0.85);line-height:1.8;margin-bottom:16px;font-weight:400}
        .about-features{margin-top:2rem;display:grid;gap:20px}
        .about-feature{display:flex;gap:16px;padding-bottom:20px;border-bottom:1px solid var(--border-color)}
        .about-feature:last-child{border-bottom:none;padding-bottom:0}
        .af-icon{width:38px;height:38px;border:1px solid rgba(0,229,255,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--fire);font-size:1rem;clip-path:polygon(0 0,calc(100% - 5px) 0,100% 5px,100% 100%,5px 100%,0 calc(100% - 5px));transition:all .3s}
        .about-feature:hover .af-icon{border-color:var(--fire);background:rgba(255,107,0,0.05)}
        .af-title{font-family:'Orbitron',sans-serif;font-size:.85rem;font-weight:700;margin-bottom:4px}
        .af-desc{font-size:.9rem;color:var(--text-dim);line-height:1.7;font-weight:400}
        .founder-card{background:var(--panel);border:1px solid var(--border-color);padding:24px 32px;margin-top:1.5rem;display:flex;align-items:center;gap:20px;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))}
        .founder-logo{width:52px;height:52px;object-fit:contain;flex-shrink:0;filter:drop-shadow(0 0 8px rgba(0,229,255,0.2));animation:logoGlow 4s ease-in-out infinite;transition:transform .3s}
        .founder-card:hover .founder-logo{transform:scale(1.1) rotate(3deg)}
        .founder-text{font-size:.95rem;color:rgba(224,224,236,0.8);line-height:1.65;font-weight:400}
        .founder-name{font-weight:600;color:var(--text)}
        .founder-tags{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap}
        .founder-tag{font-family:'Share Tech Mono',monospace;font-size:.6rem;color:var(--plasma);padding:3px 10px;border:1px solid var(--border-color)}

        .contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:3rem}
        @media(max-width:768px){.contact-grid{grid-template-columns:1fr}}
        .contact-item{display:flex;gap:16px;margin-bottom:2rem}
        .ci-icon{width:40px;height:40px;border:1px solid rgba(0,229,255,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--plasma);font-size:1rem;clip-path:polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px));transition:all .3s}
        .contact-item:hover .ci-icon{border-color:var(--plasma);background:rgba(0,229,255,0.05);transform:scale(1.1)}
        .ci-label{font-family:'Share Tech Mono',monospace;font-size:.65rem;letter-spacing:.15em;color:var(--plasma);margin-bottom:4px}
        .ci-val{font-size:.9rem;color:rgba(224,224,236,0.8)}
        .ci-val a{color:var(--plasma);text-decoration:none;transition:all .2s}
        .ci-val a:hover{text-shadow:0 0 8px var(--glow-plasma)}
        .contact-form{display:grid;gap:12px}
        .fi{width:100%;padding:14px 18px;background:var(--panel);border:1px solid var(--border-color);color:var(--text);font-family:'Share Tech Mono',monospace;font-size:.85rem;transition:all .3s;clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));outline:none}
        .fi::placeholder{color:var(--text-dim);opacity:.5}
        .fi:focus{border-color:var(--plasma);box-shadow:0 0 20px rgba(0,229,255,0.1),inset 0 0 20px rgba(0,229,255,0.02)}
        textarea.fi{resize:none;min-height:120px}
        .form-submit{font-family:'Share Tech Mono',monospace;font-size:.8rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;background:linear-gradient(135deg,var(--fire),#ff4400);color:#000;border:none;padding:16px 32px;cursor:pointer;width:100%;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));transition:all .3s;display:flex;align-items:center;justify-content:center;gap:8px}
        .form-submit:hover{box-shadow:0 0 40px var(--glow-fire);transform:translateY(-2px)}
        .form-success{background:var(--panel);border:1px solid var(--fire);padding:12px 18px;font-family:'Share Tech Mono',monospace;font-size:.75rem;color:var(--fire)}

        .footer{border-top:1px solid var(--border-color);padding:3rem 2rem;position:relative;z-index:10}
        .footer::before{content:'';position:absolute;top:-1px;left:0;right:0;height:1px;background:repeating-linear-gradient(90deg,var(--plasma) 0px,var(--plasma) 6px,transparent 6px,transparent 10px,var(--fire) 10px,var(--fire) 14px,transparent 14px,transparent 22px);opacity:.2}
        .footer-inner{max-width:1100px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1.5rem}
        .footer-brand{display:flex;align-items:center;gap:12px;text-decoration:none;color:inherit}
        .footer-logo{width:40px;height:40px;object-fit:contain;filter:drop-shadow(0 0 6px rgba(0,229,255,0.2));transition:all .3s}
        .footer-brand:hover .footer-logo{filter:drop-shadow(0 0 12px rgba(0,229,255,0.4));transform:scale(1.1)}
        .footer-bn{font-family:'Orbitron',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:.1em;color:var(--plasma)}
        .footer-bt{font-family:'Share Tech Mono',monospace;font-size:.6rem;font-weight:700;letter-spacing:.15em;background:linear-gradient(90deg,var(--fire),var(--fire-hot));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .footer-right{text-align:right}
        .footer-copy{font-family:'Share Tech Mono',monospace;font-size:.65rem;color:var(--text-dim);margin-bottom:4px}
        .footer-email{font-family:'Share Tech Mono',monospace;font-size:.65rem;color:var(--plasma);text-decoration:none}
        .footer-email:hover{text-shadow:0 0 8px var(--glow-plasma)}

        @keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes pulseGlow{0%,100%{box-shadow:0 0 20px var(--glow-fire)}50%{box-shadow:0 0 40px var(--glow-fire),0 0 60px rgba(255,107,0,0.3)}}
        @keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .reveal{opacity:0;transform:translateY(50px);transition:all .8s cubic-bezier(.16,1,.3,1)}
        .reveal.visible{opacity:1;transform:translateY(0)}

        .nav-score-link{color:var(--fire)!important;font-weight:700;position:relative}
        .nav-score-link::after{content:'';position:absolute;bottom:-2px;left:0;right:0;height:2px;background:var(--fire);opacity:0;transition:opacity .2s}
        .nav-score-link:hover::after{opacity:1}
        .mob-score-link{color:var(--fire)!important;font-weight:700;border:1px solid var(--fire);padding:8px 16px!important;margin-bottom:8px;text-align:center}

        .score-cta-section{background:linear-gradient(180deg,var(--void) 0%,rgba(255,107,0,0.03) 50%,var(--void) 100%);position:relative;overflow:hidden}
        .score-cta-section::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 50% at 50% 50%,rgba(255,107,0,0.08) 0%,transparent 70%);pointer-events:none}
        .score-cta-card{display:flex;align-items:center;gap:4rem;background:var(--panel);border:1px solid var(--border-color);padding:3rem 4rem;position:relative;clip-path:polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))}
        .score-cta-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--fire),var(--fire-hot),var(--fire));background-size:200% auto;animation:shimmer 3s linear infinite}
        .score-cta-card::after{content:'';position:absolute;top:3px;right:0;width:3px;height:40px;background:linear-gradient(180deg,var(--fire),transparent);opacity:.4}
        .score-cta-content{flex:1}
        .score-cta-badge{display:inline-block;font-family:'Share Tech Mono',monospace;font-size:.6rem;font-weight:700;letter-spacing:.2em;background:linear-gradient(135deg,var(--fire),#ff4400);color:#000;padding:5px 14px;margin-bottom:1rem;clip-path:polygon(6px 0,calc(100% - 6px) 0,100% 100%,0 100%)}
        .score-cta-title{font-family:'Orbitron',sans-serif;font-size:clamp(1.4rem,3vw,1.8rem);font-weight:800;margin-bottom:1rem;line-height:1.25}
        .score-cta-desc{color:var(--text-dim);font-size:1rem;line-height:1.75;margin-bottom:1.25rem;max-width:540px}
        .score-cta-features{display:flex;gap:1.5rem;flex-wrap:wrap;margin-bottom:1.5rem}
        .score-cta-features span{font-family:'Share Tech Mono',monospace;font-size:.75rem;color:var(--plasma);letter-spacing:.05em}
        .score-cta-btn{display:inline-flex;align-items:center;gap:8px;font-family:'Share Tech Mono',monospace;font-size:.85rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;background:linear-gradient(135deg,var(--fire),#ff4400);color:#000;text-decoration:none;padding:14px 28px;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));transition:all .3s;animation:pulseGlow 3s ease-in-out infinite}
        .score-cta-btn:hover{transform:translateY(-3px);box-shadow:0 0 50px var(--glow-fire)}
        .score-cta-visual{flex-shrink:0}
        .score-preview{text-align:center;animation:floatUp 4s ease-in-out infinite}
        .score-preview-ring{width:140px;height:140px;border-radius:50%;border:4px solid var(--border-color);display:flex;align-items:center;justify-content:center;position:relative;background:radial-gradient(circle,rgba(255,107,0,0.1) 0%,transparent 70%)}
        .score-preview-ring::before{content:'';position:absolute;inset:-4px;border-radius:50%;border:4px solid transparent;border-top-color:var(--fire);border-right-color:var(--fire-hot);animation:spin 3s linear infinite}
        .score-preview-num{font-family:'Orbitron',sans-serif;font-size:3rem;font-weight:800;color:var(--fire);text-shadow:0 0 20px var(--glow-fire)}
        .score-preview-label{font-family:'Share Tech Mono',monospace;font-size:.65rem;letter-spacing:.2em;color:var(--text-dim);margin-top:12px}
        @keyframes spin{to{transform:rotate(360deg)}}

        .offer-section{background:linear-gradient(180deg,var(--void) 0%,rgba(255,107,0,0.04) 50%,var(--void) 100%);position:relative}
        .offer-section::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 40% at 50% 50%,rgba(255,107,0,0.08) 0%,transparent 70%);pointer-events:none}
        .offer-card{display:flex;align-items:stretch;gap:4rem;background:var(--panel);border:1px solid var(--border-color);padding:3rem 4rem;position:relative;clip-path:polygon(0 0,calc(100% - 24px) 0,100% 24px,100% 100%,24px 100%,0 calc(100% - 24px))}
        .offer-card::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--fire),var(--fire-hot),var(--fire),var(--plasma));background-size:300% auto;animation:shimmer 4s linear infinite}
        .offer-content{flex:1}
        .offer-badge{display:inline-block;font-family:'Share Tech Mono',monospace;font-size:.65rem;font-weight:700;letter-spacing:.25em;background:linear-gradient(135deg,var(--fire),#ff4400);color:#000;padding:6px 16px;margin-bottom:1.25rem;clip-path:polygon(8px 0,calc(100% - 8px) 0,100% 100%,0 100%)}
        .offer-title{font-family:'Orbitron',sans-serif;font-size:clamp(1.5rem,3.5vw,2rem);font-weight:800;margin-bottom:1rem;line-height:1.2}
        .offer-desc{color:var(--text-dim);font-size:1.1rem;line-height:1.6;margin-bottom:2rem;max-width:580px}
        .offer-gifts{display:grid;gap:1.5rem;margin-bottom:2rem}
        .offer-gift{display:flex;gap:20px;padding:20px;background:rgba(0,229,255,0.02);border:1px solid var(--border-color);clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));transition:all .3s}
        .offer-gift:hover{background:rgba(0,229,255,0.04);border-color:rgba(0,229,255,0.2)}
        .gift-icon{width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0}
        .gift-title{font-family:'Orbitron',sans-serif;font-size:.95rem;font-weight:700;margin-bottom:6px;color:var(--plasma)}
        .gift-desc{font-size:.9rem;color:var(--text-dim);line-height:1.65}
        .offer-value{background:var(--panel);border:1px solid var(--fire);padding:20px 24px;margin-bottom:2rem;display:flex;justify-content:space-between;align-items:center;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))}
        .offer-value-text{display:flex;flex-direction:column;gap:4px}
        .offer-value-label{font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--text-dim)}
        .offer-value-amount{font-family:'Orbitron',sans-serif;font-size:1.4rem;font-weight:800;color:var(--fire)}
        .offer-cost{display:flex;flex-direction:column;gap:4px;text-align:right}
        .offer-cost-label{font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--text-dim)}
        .offer-cost-amount{font-family:'Orbitron',sans-serif;font-size:1.8rem;font-weight:900;color:var(--plasma);text-shadow:0 0 15px var(--glow-plasma)}
        .offer-actions{display:flex;gap:1rem;flex-wrap:wrap}
        .offer-visual{flex-shrink:0;display:flex;align-items:center}
        .offer-preview{text-align:center;animation:floatUp 5s ease-in-out infinite}
        .offer-preview-ring{width:160px;height:160px;border-radius:50%;border:3px solid var(--border-color);display:flex;align-items:center;justify-content:center;position:relative;background:radial-gradient(circle,rgba(255,107,0,0.12) 0%,transparent 70%)}
        .offer-preview-ring::before{content:'';position:absolute;inset:-3px;border-radius:50%;border:3px solid transparent;border-top-color:var(--fire);border-right-color:var(--fire-hot);border-bottom-color:var(--plasma);animation:spin 4s linear infinite}
        .offer-preview-text{font-family:'Orbitron',sans-serif;font-size:1.1rem;font-weight:800;color:var(--fire);text-shadow:0 0 15px var(--glow-fire);text-align:center;line-height:1.2}
        .offer-preview-label{font-family:'Share Tech Mono',monospace;font-size:.65rem;letter-spacing:.2em;color:var(--text-dim);margin-top:16px}
        .offer-guarantee{background:var(--panel);border:1px solid var(--border-color);border-left:3px solid var(--plasma);padding:28px 32px;margin-top:2rem;clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))}
        .guarantee-prefix{font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--plasma);margin-bottom:12px}
        .guarantee-text{font-size:1rem;line-height:1.75;color:var(--text-dim)}

        .industries-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-bottom:3rem}
        @media(max-width:900px){.industries-grid{grid-template-columns:1fr}}
        .industry-card{padding:32px;background:var(--panel);border:1px solid var(--border-color);transition:all .35s;clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))}
        .industry-card::before{content:'';position:absolute;top:0;left:0;width:60px;height:60px;background:linear-gradient(135deg,var(--plasma),transparent 70%);opacity:.1;transition:opacity .3s}
        .industry-card:hover{border-color:rgba(0,229,255,0.3);transform:translateY(-3px)}
        .industry-card:hover::before{opacity:.2}
        .industry-header{display:flex;gap:16px;margin-bottom:16px;align-items:flex-start}
        .industry-icon{width:44px;height:44px;border:1px solid rgba(0,229,255,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1.3rem;clip-path:polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px));transition:all .3s}
        .industry-card:hover .industry-icon{border-color:var(--fire);background:rgba(255,107,0,0.05)}
        .industry-info{flex:1}
        .industry-title{font-family:'Orbitron',sans-serif;font-size:1.1rem;font-weight:700;margin-bottom:4px}
        .industry-subtitle{font-size:.8rem;color:var(--text-dim);line-height:1.5}
        .industry-desc{font-size:.95rem;color:rgba(224,224,236,0.85);line-height:1.7;margin-bottom:16px}
        .industry-highlight{font-style:italic;color:var(--plasma);font-size:.9rem;margin-bottom:16px;padding:12px;background:rgba(0,229,255,0.05);border-left:2px solid var(--plasma);clip-path:polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px))}
        .industry-features-title{font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--plasma);margin-bottom:8px}
        .industry-features-list{list-style:none;padding:0;font-size:.85rem;color:var(--text-dim)}
        .industry-features-list li{margin-bottom:4px;padding-left:12px;position:relative}
        .industry-features-list li::before{content:'▸';position:absolute;left:0;color:var(--fire)}
        .industries-callout{background:var(--panel);border:1px solid var(--border-color);border-left:3px solid var(--fire);padding:32px;clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))}
        .callout-heading{font-family:'Orbitron',sans-serif;font-size:1.3rem;font-weight:700;margin-bottom:12px}
        .callout-cta{margin-top:12px;color:var(--text);font-weight:500}

        .social-bg{background:linear-gradient(180deg,var(--void) 0%,rgba(18,18,30,0.6) 50%,var(--void) 100%);position:relative}
        .social-bg::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 30% at 50% 50%,rgba(0,229,255,0.06) 0%,transparent 70%);pointer-events:none}
        .social-flow{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:2rem;align-items:center;margin-bottom:3rem;padding:2rem;background:var(--panel);border:1px solid var(--border-color);clip-path:polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))}
        @media(max-width:900px){.social-flow{grid-template-columns:1fr;gap:1rem}.flow-arrow{display:none}}
        .flow-step{text-align:center}
        .flow-number{font-family:'Orbitron',sans-serif;font-size:1.2rem;font-weight:800;color:var(--fire);width:50px;height:50px;border:2px solid var(--fire);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))}
        .flow-title{font-family:'Orbitron',sans-serif;font-size:.95rem;font-weight:700;margin-bottom:8px}
        .flow-desc{font-size:.85rem;color:var(--text-dim);line-height:1.6}
        .flow-arrow{font-size:1.5rem;color:var(--plasma);animation:pulse 2s ease-in-out infinite}
        @keyframes pulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.1)}}
        .social-results{display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-bottom:3rem}
        @media(max-width:768px){.social-results{grid-template-columns:1fr}}
        .results-before,.results-after{padding:24px;border:1px solid var(--border-color);clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))}
        .results-before{background:rgba(255,50,50,0.05);border-left-color:#ff3232}
        .results-after{background:rgba(0,229,255,0.05);border-left-color:var(--plasma)}
        .results-label{font-family:'Share Tech Mono',monospace;font-size:.7rem;margin-bottom:12px;font-weight:700}
        .results-before .results-label{color:#ff5555}
        .results-after .results-label{color:var(--plasma)}
        .results-list{list-style:none;padding:0;font-size:.9rem}
        .results-list li{margin-bottom:8px;padding-left:16px;position:relative}
        .negative li::before{content:'✗';position:absolute;left:0;color:#ff5555}
        .positive li::before{content:'✓';position:absolute;left:0;color:var(--plasma)}
        .social-packages{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:3rem}
        @media(max-width:900px){.social-packages{grid-template-columns:1fr}}
        .social-package{background:var(--panel);border:1px solid var(--border-color);padding:28px 24px;position:relative;clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));transition:all .3s}
        .social-package:hover{transform:translateY(-3px);border-color:rgba(0,229,255,0.3)}
        .social-package.featured{border-color:rgba(0,229,255,0.4);box-shadow:0 0 30px rgba(0,229,255,0.08)}
        .social-package.featured::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--plasma),var(--fire),var(--plasma));background-size:200% auto;animation:shimmer 3s linear infinite}
        .package-badge{position:absolute;top:-1px;left:50%;transform:translateX(-50%);font-family:'Share Tech Mono',monospace;font-size:.55rem;font-weight:700;letter-spacing:.15em;background:var(--fire);color:#000;padding:4px 12px;clip-path:polygon(6px 0,calc(100% - 6px) 0,100% 100%,0 100%)}
        .package-name{font-family:'Orbitron',sans-serif;font-size:1rem;font-weight:700;margin-bottom:8px}
        .package-price{font-family:'Orbitron',sans-serif;font-size:1.4rem;font-weight:800;color:var(--plasma);margin-bottom:16px}
        .package-features{list-style:none;padding:0;font-size:.85rem}
        .package-features li{margin-bottom:8px;padding-left:12px;position:relative;color:var(--text-dim)}
        .package-features li::before{content:'▸';position:absolute;left:0;color:var(--fire)}
        .social-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
        @media(max-width:768px){.social-stats{grid-template-columns:repeat(2,1fr)}}
        .stat-card{text-align:center;padding:24px 16px;background:var(--panel);border:1px solid var(--border-color);clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))}
        .stat-number{font-family:'Orbitron',sans-serif;font-size:1.8rem;font-weight:800;color:var(--fire);display:block;margin-bottom:8px}
        .stat-label{font-size:.75rem;color:var(--text-dim);line-height:1.4}

        .who-for-bg{background:linear-gradient(180deg,var(--void) 0%,rgba(0,229,255,0.03) 50%,var(--void) 100%);position:relative}
        .who-for-bg::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 40% at 50% 50%,rgba(0,229,255,0.06) 0%,transparent 70%);pointer-events:none}
        .who-for-intro{text-align:center;margin-bottom:2.5rem}
        .intro-text{font-size:1.1rem;color:var(--text-dim);font-style:italic;max-width:600px;margin:0 auto}
        .who-for-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:3rem}
        @media(max-width:900px){.who-for-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:600px){.who-for-grid{grid-template-columns:1fr}}
        .who-for-item{display:flex;gap:16px;align-items:flex-start;padding:20px;background:var(--panel);border:1px solid var(--border-color);clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));transition:all .3s}
        .who-for-item:hover{border-color:rgba(0,229,255,0.3);transform:translateY(-2px)}
        .who-icon{width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0}
        .who-content{flex:1}
        .who-business{font-family:'Orbitron',sans-serif;font-weight:700;font-size:.9rem;display:block;margin-bottom:4px;color:var(--text)}
        .who-problem{font-size:.85rem;color:var(--text-dim);line-height:1.5}
        .who-for-callout{text-align:center;background:var(--panel);border:1px solid var(--border-color);border-top:3px solid var(--plasma);padding:2.5rem;clip-path:polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))}
        .who-for-callout .callout-text{font-size:1.3rem;margin-bottom:1rem;font-weight:600}
        .who-for-callout .callout-subtext{font-size:1rem;color:var(--text-dim);line-height:1.7;margin-bottom:1.5rem;max-width:700px;margin-left:auto;margin-right:auto}
        .who-for-cta{margin-top:1.5rem}

        .industry-tiers{margin-bottom:3rem}
        .tier-section{margin-bottom:3.5rem;background:var(--panel);border:1px solid var(--border-color);padding:2.5rem;clip-path:polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px));position:relative}
        .tier-section::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--plasma),var(--fire),var(--plasma));opacity:.6}
        .tier-header{margin-bottom:2rem}
        .tier-label{font-family:'Share Tech Mono',monospace;font-size:.7rem;letter-spacing:.2em;color:var(--plasma);margin-bottom:8px}
        .tier-title{font-family:'Orbitron',sans-serif;font-size:1.4rem;font-weight:800;margin-bottom:8px}
        .tier-desc{color:var(--text-dim);font-size:1rem;line-height:1.6}
        .tier-industries{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
        @media(max-width:768px){.tier-industries{grid-template-columns:1fr}}
        .tier-industry{display:flex;gap:14px;align-items:flex-start;padding:16px;background:rgba(0,229,255,0.02);border:1px solid var(--border-color);clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));transition:all .3s}
        .tier-industry:hover{background:rgba(0,229,255,0.04);border-color:rgba(0,229,255,0.2)}
        .tier-industry-icon{width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0}
        .tier-industry-content{flex:1}
        .tier-industry-name{font-family:'Orbitron',sans-serif;font-weight:700;font-size:.85rem;margin-bottom:4px;color:var(--text)}
        .tier-industry-problem{font-size:.8rem;color:var(--text-dim);line-height:1.5}

        .industries-universal{margin-bottom:3rem}
        .universal-header{text-align:center;margin-bottom:2.5rem}
        .universal-title{font-family:'Orbitron',sans-serif;font-size:1.6rem;font-weight:800;margin-bottom:12px}
        .universal-desc{color:var(--text-dim);font-size:1rem;max-width:600px;margin:0 auto}
        .universal-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        @media(max-width:900px){.universal-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:600px){.universal-grid{grid-template-columns:1fr}}
        .universal-feature{padding:28px 24px;display:flex;flex-direction:column;align-items:center;text-align:center}
        .universal-icon{width:48px;height:48px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin-bottom:16px;border:1px solid rgba(0,229,255,0.2);clip-path:polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px));transition:all .3s}
        .universal-feature:hover .universal-icon{border-color:var(--fire);background:rgba(255,107,0,0.05)}
        .universal-feature-title{font-family:'Orbitron',sans-serif;font-weight:700;font-size:.9rem;margin-bottom:8px}
        .universal-feature-desc{font-size:.85rem;color:var(--text-dim);line-height:1.6}

        .industries-position{background:var(--panel);border:1px solid var(--border-color);border-left:3px solid var(--fire);padding:28px 32px;clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))}
        .position-prefix{font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--plasma);margin-bottom:12px}
        .position-heading{font-family:'Orbitron',sans-serif;font-size:1.4rem;font-weight:700;margin-bottom:12px}
        .position-text{font-size:1rem;line-height:1.75;color:var(--text-dim)}

        @media(max-width:768px){
          .section{padding:60px 1.25rem}
          .about-card{padding:28px 24px}
          .retainer-card{flex-direction:column;text-align:center}
          .retainer-price{text-align:center}
          .retainer-desc{max-width:none}
          .hero{padding:100px 1.25rem 60px}
          .hero-flame-wrap{width:276px;height:276px}
          .digi-flame{width:350px;height:420px}
          .offer-card{flex-direction:column;padding:2rem 1.5rem;gap:2rem;text-align:center}
          .offer-value{flex-direction:column;text-align:center;gap:12px}
          .offer-desc{max-width:none}
          .industries-grid{grid-template-columns:1fr}
          .social-packages{grid-template-columns:1fr}
        }
      `}</style>
    </>
  );
}
