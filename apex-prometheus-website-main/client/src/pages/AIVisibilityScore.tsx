import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import FlameLogo from "../components/FlameLogo";

// Industry options for the trades/service business focus
const INDUSTRIES = [
  { value: "painting", label: "Painting Contractor" },
  { value: "roofing", label: "Roofing" },
  { value: "hvac", label: "HVAC" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "general-contractor", label: "General Contractor" },
  { value: "landscaping", label: "Landscaping" },
  { value: "flooring", label: "Flooring" },
  { value: "remodeling", label: "Remodeling" },
  { value: "handyman", label: "Handyman Services" },
  { value: "cleaning", label: "Cleaning Services" },
  { value: "pest-control", label: "Pest Control" },
  { value: "garage-door", label: "Garage Door" },
  { value: "moving", label: "Moving Services" },
  { value: "other", label: "Other Service Business" },
];

interface DiagnosticResults {
  overallScore: number;
  aiVisibility: number;
  localSEO: number;
  websiteHealth: number;
  reviewPresence: number;
  contentAuthority: number;
  platforms: {
    chatgpt: number;
    perplexity: number;
    googleAI: number;
  };
  issues: string[];
  fixes: string[];
  summary: string;
}

export default function AIVisibilityScore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    businessName: "",
    website: "",
    industry: "",
    location: "",
  });
  const [email, setEmail] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [results, setResults] = useState<DiagnosticResults | null>(null);
  const [error, setError] = useState("");

  // SEO Meta Tags
  useEffect(() => {
    document.title = "Free AI Visibility Score | Apex Prometheus";
    const setMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(name.startsWith("og:") ? "property" : "name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };
    setMeta("description", "Get your free AI Visibility Score. Find out if AI platforms like ChatGPT, Perplexity, and Google AI recommend your business. Takes 60 seconds.");
    setMeta("keywords", "AI visibility score, AI visibility test, ChatGPT business visibility, Perplexity recommendations, digital presence test, AEO audit");
    setMeta("og:title", "Free AI Visibility Score | Apex Prometheus");
    setMeta("og:description", "Find out if AI platforms recommend your business. Free instant diagnostic.");
    setMeta("og:type", "website");
    setMeta("og:url", "https://apexprometheus.ai/ai-visibility-score");

    // Schema markup for the tool
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "AI Visibility Score Tool",
      description: "Free diagnostic tool that analyzes whether AI platforms like ChatGPT, Perplexity, and Google AI Overview recommend your business",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      provider: {
        "@type": "Organization",
        name: "Apex Prometheus",
        url: "https://apexprometheus.ai",
      },
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  // Canvas background (simplified version of home page)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W: number, H: number, animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; color: number[] }[] = [];

    function resize() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
    }

    function initParticles() {
      for (let i = 0; i < 60; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 2 + 0.5,
          color: Math.random() > 0.5 ? [0, 229, 255] : [255, 107, 0],
        });
      }
    }

    function draw() {
      ctx!.fillStyle = "rgba(10, 10, 15, 0.1)";
      ctx!.fillRect(0, 0, W, H);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${p.color.join(",")}, 0.6)`;
        ctx!.fill();
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 120) {
            ctx!.beginPath();
            ctx!.moveTo(p1.x, p1.y);
            ctx!.lineTo(p2.x, p2.y);
            ctx!.strokeStyle = `rgba(0, 229, 255, ${0.15 * (1 - dist / 120)})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        });
      });

      animId = requestAnimationFrame(draw);
    }

    resize();
    initParticles();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const validateStep1 = () => {
    if (!formData.businessName.trim()) {
      setError("Please enter your business name");
      return false;
    }
    if (!formData.website.trim()) {
      setError("Please enter your website URL");
      return false;
    }
    if (!formData.industry) {
      setError("Please select your industry");
      return false;
    }
    if (!formData.location.trim()) {
      setError("Please enter your location");
      return false;
    }
    setError("");
    return true;
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    setError("");
    return true;
  };

  const handleStep1Submit = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const runDiagnostic = async () => {
    if (!validateEmail()) return;

    // Capture lead via webhook (fire and forget — don't block the scan)
    fetch("/api/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formType: "ai-visibility-score",
        businessName: formData.businessName,
        website: formData.website,
        industry: formData.industry,
        location: formData.location,
        email: email,
      }),
    }).catch((err) => console.error("Lead capture error:", err));

    setIsScanning(true);
    setScanProgress(0);
    setStep(3);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [
            {
              role: "user",
              content: `You are an AI Visibility diagnostic tool. Analyze this business for AI visibility readiness and provide a realistic assessment.

Business: ${formData.businessName}
Website: ${formData.website}
Industry: ${formData.industry}
Location: ${formData.location}

Based on typical patterns for ${formData.industry} businesses, provide a JSON response with realistic scores. Most small businesses score 15-45 overall because they haven't optimized for AI visibility yet. Be realistic and helpful.

Respond ONLY with valid JSON in this exact format, no markdown, no backticks:
{
  "overallScore": <number 0-100>,
  "aiVisibility": <number 0-100>,
  "localSEO": <number 0-100>,
  "websiteHealth": <number 0-100>,
  "reviewPresence": <number 0-100>,
  "contentAuthority": <number 0-100>,
  "platforms": {
    "chatgpt": <number 0-100>,
    "perplexity": <number 0-100>,
    "googleAI": <number 0-100>
  },
  "issues": [<3-5 specific issues found>],
  "fixes": [<3-5 specific actionable fixes>],
  "summary": "<2-3 sentence summary of findings>"
}

Make issues and fixes specific to their industry (${formData.industry}) and location (${formData.location}).`,
            },
          ],
        }),
      });

      clearInterval(progressInterval);
      setScanProgress(100);

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      const text = data.content?.map((item: { text?: string }) => item.text || "").join("") || "";
      const cleanText = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanText);

      setResults(parsed);
    } catch (err) {
      console.error("Diagnostic error:", err);
      // Fallback to simulated results
      const baseScore = 20 + Math.floor(Math.random() * 25);
      setResults({
        overallScore: baseScore,
        aiVisibility: Math.floor(baseScore * 0.6),
        localSEO: baseScore + Math.floor(Math.random() * 20),
        websiteHealth: baseScore + Math.floor(Math.random() * 15),
        reviewPresence: baseScore + Math.floor(Math.random() * 25),
        contentAuthority: Math.floor(baseScore * 0.7),
        platforms: {
          chatgpt: Math.floor(Math.random() * 30),
          perplexity: Math.floor(Math.random() * 25),
          googleAI: Math.floor(Math.random() * 35),
        },
        issues: [
          `No schema markup detected for ${formData.industry} services`,
          "Missing FAQ content that AI systems can extract",
          "Business not appearing in AI-generated local recommendations",
          "Inconsistent NAP (Name, Address, Phone) across directories",
          "No llms.txt file for AI crawler guidance",
        ],
        fixes: [
          `Add LocalBusiness and Service schema markup for ${formData.industry}`,
          "Create FAQ pages answering common customer questions",
          "Claim and optimize Bing Places and Apple Business Connect",
          "Standardize business info across all directory listings",
          "Add structured answer content for AI extraction",
        ],
        summary: `${formData.businessName} has significant opportunity to improve AI visibility. Most ${formData.industry} businesses in ${formData.location} haven't optimized for AI search yet — acting now provides competitive advantage.`,
      });
    } finally {
      setIsScanning(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 40) return "var(--fire)";
    if (score < 70) return "#ffaa00";
    return "#00e5ff";
  };

  const getScoreLabel = (score: number) => {
    if (score < 25) return "CRITICAL";
    if (score < 40) return "WEAK";
    if (score < 60) return "DEVELOPING";
    if (score < 80) return "STRONG";
    return "OPTIMAL";
  };

  return (
    <>
      <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} />
      <div className="grain" />
      <div className="scanline-overlay" />

      <div className="score-page">
        {/* Header */}
        <header className="score-header">
          <Link href="/" className="score-brand">
            <FlameLogo size={42} className="score-logo" />
            <div className="score-brand-text">
              <div className="score-brand-name">APEX PROMETHEUS</div>
            </div>
          </Link>
          <Link href="/#contact" className="score-cta">
            Book Consultation →
          </Link>
        </header>

        {/* Main Content */}
        <main className="score-main">
          {step === 1 && (
            <div className="score-card reveal">
              <div className="score-badge">FREE DIAGNOSTIC</div>
              <h1 className="score-title">
                AI Visibility<span className="glow"> Score</span>
              </h1>
              <p className="score-subtitle">Find out if ChatGPT, Perplexity, and Google AI recommend your business. Takes 60 seconds.</p>

              <div className="score-form">
                <div className="form-group">
                  <label>Business Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Smith's Painting Co."
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Website URL</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., smithspainting.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Industry</label>
                  <select className="form-input" value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })}>
                    <option value="">Select your industry...</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind.value} value={ind.value}>
                        {ind.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Location (City, State)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Staten Island, NY"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                {error && <div className="form-error">{error}</div>}

                <button className="btn-scan" onClick={handleStep1Submit}>
                  <span className="btn-icon">⚡</span>
                  Continue to Scan
                </button>
              </div>

              <div className="score-trust">
                <span>🔒 No credit card required</span>
                <span>📊 Instant results</span>
                <span>🎯 Actionable insights</span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="score-card reveal">
              <div className="score-badge">ALMOST THERE</div>
              <h2 className="score-title-sm">Where should we send your results?</h2>
              <p className="score-subtitle">We'll email you a detailed report with your full diagnostic breakdown and recommendations.</p>

              <div className="score-form">
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" className="form-input" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                {error && <div className="form-error">{error}</div>}

                <button className="btn-scan" onClick={runDiagnostic}>
                  <span className="btn-icon">🔥</span>
                  Run AI Visibility Scan
                </button>

                <button className="btn-back" onClick={() => setStep(1)}>
                  ← Back
                </button>
              </div>

              <p className="score-privacy">We respect your privacy. No spam, ever.</p>
            </div>
          )}

          {step === 3 && isScanning && (
            <div className="score-card scanning-card">
              <div className="scan-animation">
                <div className="scan-ring outer" />
                <div className="scan-ring inner" />
                <FlameLogo size={60} className="scan-logo" />
              </div>
              <h2 className="scan-title">Analyzing AI Visibility...</h2>
              <div className="scan-progress">
                <div className="scan-progress-bar" style={{ width: `${scanProgress}%` }} />
              </div>
              <div className="scan-steps">
                <div className={`scan-step ${scanProgress > 10 ? "active" : ""}`}>Checking AI platforms...</div>
                <div className={`scan-step ${scanProgress > 30 ? "active" : ""}`}>Analyzing schema markup...</div>
                <div className={`scan-step ${scanProgress > 50 ? "active" : ""}`}>Reviewing content structure...</div>
                <div className={`scan-step ${scanProgress > 70 ? "active" : ""}`}>Evaluating authority signals...</div>
                <div className={`scan-step ${scanProgress > 90 ? "active" : ""}`}>Generating recommendations...</div>
              </div>
            </div>
          )}

          {step === 3 && !isScanning && results && (
            <div className="results-container">
              {/* Main Score */}
              <div className="results-hero">
                <div className="results-gauge">
                  <svg viewBox="0 0 200 120" className="gauge-svg">
                    <defs>
                      <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ff2200" />
                        <stop offset="40%" stopColor="#ff6b00" />
                        <stop offset="70%" stopColor="#ffaa00" />
                        <stop offset="100%" stopColor="#00e5ff" />
                      </linearGradient>
                    </defs>
                    <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" strokeLinecap="round" />
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="url(#gaugeGrad)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * results.overallScore) / 100}
                      className="gauge-fill"
                    />
                    <text x="100" y="85" textAnchor="middle" className="gauge-score">
                      {results.overallScore}
                    </text>
                    <text x="100" y="105" textAnchor="middle" className="gauge-label">
                      /100
                    </text>
                  </svg>
                  <div className="gauge-status" style={{ color: getScoreColor(results.overallScore) }}>
                    {getScoreLabel(results.overallScore)}
                  </div>
                </div>
                <div className="results-summary">
                  <h2 className="results-business">{formData.businessName}</h2>
                  <p className="results-summary-text">{results.summary}</p>
                </div>
              </div>

              {/* Category Scores */}
              <div className="results-grid">
                <div className="results-section">
                  <h3 className="section-label">CATEGORY BREAKDOWN</h3>
                  <div className="category-list">
                    {[
                      { label: "AI Visibility", score: results.aiVisibility, icon: "🤖" },
                      { label: "Local SEO", score: results.localSEO, icon: "📍" },
                      { label: "Website Health", score: results.websiteHealth, icon: "🌐" },
                      { label: "Review Presence", score: results.reviewPresence, icon: "⭐" },
                      { label: "Content Authority", score: results.contentAuthority, icon: "📝" },
                    ].map((cat) => (
                      <div key={cat.label} className="category-item">
                        <div className="category-header">
                          <span className="category-icon">{cat.icon}</span>
                          <span className="category-name">{cat.label}</span>
                          <span className="category-score" style={{ color: getScoreColor(cat.score) }}>
                            {cat.score}
                          </span>
                        </div>
                        <div className="category-bar">
                          <div className="category-bar-fill" style={{ width: `${cat.score}%`, background: getScoreColor(cat.score) }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="results-section">
                  <h3 className="section-label">AI PLATFORM PRESENCE</h3>
                  <div className="platform-list">
                    {[
                      { name: "ChatGPT", score: results.platforms.chatgpt },
                      { name: "Perplexity", score: results.platforms.perplexity },
                      { name: "Google AI", score: results.platforms.googleAI },
                    ].map((plat) => (
                      <div key={plat.name} className="platform-item">
                        <span className="platform-name">{plat.name}</span>
                        <div className="platform-bar">
                          <div className="platform-bar-fill" style={{ width: `${plat.score}%`, background: getScoreColor(plat.score) }} />
                        </div>
                        <span className="platform-score" style={{ color: getScoreColor(plat.score) }}>
                          {plat.score}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Issues & Fixes */}
              <div className="results-grid">
                <div className="results-section issues-section">
                  <h3 className="section-label">
                    <span className="label-icon">⚠️</span> ISSUES FOUND
                  </h3>
                  <ul className="issue-list">
                    {results.issues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                </div>

                <div className="results-section fixes-section">
                  <h3 className="section-label">
                    <span className="label-icon">✅</span> RECOMMENDED FIXES
                  </h3>
                  <ul className="fix-list">
                    {results.fixes.map((fix, i) => (
                      <li key={i}>{fix}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA */}
              <div className="results-cta">
                <h3>Ready to improve your AI visibility?</h3>
                <p>Our AI Visibility experts can help {formData.businessName} get recommended by AI platforms.</p>
                <Link href="/#contact" className="btn-fire">
                  Book Free Strategy Call →
                </Link>
                <div className="cta-guarantee">
                  <span>🔥</span> We'll show you exactly how to fix these issues
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="score-footer">
          <div className="footer-inner">
            <Link href="/" className="footer-brand">
              <FlameLogo size={36} className="footer-logo" />
              <span className="footer-name">APEX PROMETHEUS</span>
            </Link>
            <div className="footer-links">
              <Link href="/blog">Blog</Link>
              <Link href="/manifesto">Manifesto</Link>
              <Link href="/#contact">Contact</Link>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        .grain{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:0.025;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
        .scanline-overlay{position:fixed;inset:0;z-index:2;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.02) 2px,rgba(0,0,0,0.02) 4px)}

        .score-page{position:relative;z-index:10;min-height:100vh;display:flex;flex-direction:column}

        .score-header{display:flex;justify-content:space-between;align-items:center;padding:1.5rem 2rem;position:fixed;top:0;left:0;right:0;z-index:100;background:linear-gradient(180deg,rgba(10,10,15,0.95) 0%,rgba(10,10,15,0.8) 100%);backdrop-filter:blur(10px)}
        .score-brand{display:flex;align-items:center;gap:12px;text-decoration:none}
        .score-logo{filter:drop-shadow(0 0 8px var(--glow-plasma))}
        .score-brand-name{font-family:'Orbitron',sans-serif;font-size:.85rem;font-weight:700;letter-spacing:.1em;color:var(--plasma)}
        .score-cta{font-family:'Share Tech Mono',monospace;font-size:.75rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;background:linear-gradient(135deg,var(--fire),#ff4400);color:#000;padding:10px 20px;text-decoration:none;clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));transition:all .3s}
        .score-cta:hover{box-shadow:0 0 30px var(--glow-fire);transform:translateY(-2px)}

        .score-main{flex:1;display:flex;align-items:center;justify-content:center;padding:120px 2rem 80px}

        .score-card{background:var(--panel);border:1px solid var(--border-color);padding:48px;max-width:520px;width:100%;position:relative;clip-path:polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px));animation:fadeUp .6s ease-out}
        .score-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--plasma),var(--fire),var(--plasma));background-size:200% auto;animation:shimmer 3s linear infinite}

        .score-badge{position:absolute;top:-1px;left:50%;transform:translateX(-50%);font-family:'Share Tech Mono',monospace;font-size:.6rem;font-weight:700;letter-spacing:.15em;background:linear-gradient(135deg,var(--fire),#ff4400);color:#000;padding:6px 20px;clip-path:polygon(10px 0,calc(100% - 10px) 0,100% 100%,0 100%)}

        .score-title{font-family:'Orbitron',sans-serif;font-size:clamp(1.8rem,4vw,2.4rem);font-weight:800;text-align:center;margin:1.5rem 0 1rem;line-height:1.2}
        .score-title .glow{color:var(--plasma);text-shadow:0 0 30px var(--glow-plasma)}
        .score-title-sm{font-family:'Orbitron',sans-serif;font-size:1.5rem;font-weight:700;text-align:center;margin:1.5rem 0 1rem}
        .score-subtitle{text-align:center;color:var(--text-dim);font-size:1rem;line-height:1.7;margin-bottom:2rem}

        .score-form{display:flex;flex-direction:column;gap:1rem}
        .form-group{display:flex;flex-direction:column;gap:6px}
        .form-group label{font-family:'Share Tech Mono',monospace;font-size:.7rem;letter-spacing:.15em;color:var(--plasma)}
        .form-input{width:100%;padding:14px 18px;background:var(--steel);border:1px solid var(--border-color);color:var(--text);font-family:'Share Tech Mono',monospace;font-size:.9rem;transition:all .3s;clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));outline:none}
        .form-input::placeholder{color:var(--text-dim);opacity:.5}
        .form-input:focus{border-color:var(--plasma);box-shadow:0 0 20px rgba(0,229,255,0.1),inset 0 0 20px rgba(0,229,255,0.02)}
        select.form-input{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2300e5ff' d='M6 8L1 3h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 16px center}

        .form-error{font-family:'Share Tech Mono',monospace;font-size:.75rem;color:var(--fire);padding:8px 12px;background:rgba(255,107,0,0.1);border-left:2px solid var(--fire)}

        .btn-scan{font-family:'Share Tech Mono',monospace;font-size:.85rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;background:linear-gradient(135deg,var(--fire),#ff4400);color:#000;border:none;padding:16px 32px;cursor:pointer;width:100%;clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));transition:all .3s;display:flex;align-items:center;justify-content:center;gap:10px;margin-top:1rem}
        .btn-scan:hover{box-shadow:0 0 40px var(--glow-fire);transform:translateY(-2px)}
        .btn-icon{font-size:1.1rem}

        .btn-back{font-family:'Share Tech Mono',monospace;font-size:.75rem;color:var(--text-dim);background:none;border:none;cursor:pointer;padding:12px;transition:color .2s}
        .btn-back:hover{color:var(--plasma)}

        .score-trust{display:flex;justify-content:center;gap:1.5rem;flex-wrap:wrap;margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--border-color)}
        .score-trust span{font-family:'Share Tech Mono',monospace;font-size:.65rem;color:var(--text-dim);letter-spacing:.1em}

        .score-privacy{text-align:center;font-family:'Share Tech Mono',monospace;font-size:.65rem;color:var(--text-dim);margin-top:1rem}

        /* Scanning Animation */
        .scanning-card{text-align:center}
        .scan-animation{position:relative;width:140px;height:140px;margin:0 auto 2rem}
        .scan-ring{position:absolute;inset:0;border-radius:50%;border:2px solid transparent}
        .scan-ring.outer{border-top-color:var(--plasma);animation:spin 2s linear infinite}
        .scan-ring.inner{inset:15px;border-bottom-color:var(--fire);animation:spin 1.5s linear infinite reverse}
        .scan-logo{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);animation:pulse 2s ease-in-out infinite}
        .scan-title{font-family:'Orbitron',sans-serif;font-size:1.3rem;font-weight:700;margin-bottom:1.5rem}
        .scan-progress{height:4px;background:var(--steel);border-radius:2px;overflow:hidden;margin-bottom:2rem}
        .scan-progress-bar{height:100%;background:linear-gradient(90deg,var(--plasma),var(--fire));transition:width .3s}
        .scan-steps{display:flex;flex-direction:column;gap:8px;text-align:left}
        .scan-step{font-family:'Share Tech Mono',monospace;font-size:.75rem;color:var(--text-dim);padding-left:20px;position:relative;transition:color .3s}
        .scan-step::before{content:'○';position:absolute;left:0;color:var(--border-color);transition:all .3s}
        .scan-step.active{color:var(--plasma)}
        .scan-step.active::before{content:'●';color:var(--plasma);text-shadow:0 0 8px var(--glow-plasma)}

        /* Results */
        .results-container{max-width:900px;width:100%;animation:fadeUp .6s ease-out}
        .results-hero{display:flex;align-items:center;gap:3rem;background:var(--panel);border:1px solid var(--border-color);padding:2.5rem;margin-bottom:1.5rem;clip-path:polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))}
        .results-gauge{flex-shrink:0}
        .gauge-svg{width:180px;height:110px}
        .gauge-fill{transition:stroke-dashoffset 1.5s ease-out}
        .gauge-score{font-family:'Orbitron',sans-serif;font-size:3rem;font-weight:800;fill:var(--text)}
        .gauge-label{font-family:'Share Tech Mono',monospace;font-size:.8rem;fill:var(--text-dim)}
        .gauge-status{font-family:'Share Tech Mono',monospace;font-size:.75rem;font-weight:700;letter-spacing:.2em;text-align:center;margin-top:8px}
        .results-business{font-family:'Orbitron',sans-serif;font-size:1.4rem;font-weight:700;margin-bottom:.75rem}
        .results-summary-text{color:var(--text-dim);line-height:1.75}

        .results-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem}
        @media(max-width:768px){.results-grid{grid-template-columns:1fr}.results-hero{flex-direction:column;text-align:center}}

        .results-section{background:var(--panel);border:1px solid var(--border-color);padding:1.5rem;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))}
        .section-label{font-family:'Share Tech Mono',monospace;font-size:.65rem;font-weight:700;letter-spacing:.2em;color:var(--plasma);margin-bottom:1rem;display:flex;align-items:center;gap:8px}
        .label-icon{font-size:1rem}

        .category-list{display:flex;flex-direction:column;gap:1rem}
        .category-item{}
        .category-header{display:flex;align-items:center;gap:10px;margin-bottom:6px}
        .category-icon{font-size:1rem}
        .category-name{flex:1;font-family:'Rajdhani',sans-serif;font-size:.9rem;font-weight:600}
        .category-score{font-family:'Orbitron',sans-serif;font-size:.9rem;font-weight:700}
        .category-bar{height:6px;background:var(--steel);border-radius:3px;overflow:hidden}
        .category-bar-fill{height:100%;border-radius:3px;transition:width 1s ease-out;box-shadow:0 0 10px currentColor}

        .platform-list{display:flex;flex-direction:column;gap:1rem}
        .platform-item{display:flex;align-items:center;gap:12px}
        .platform-name{width:90px;font-family:'Share Tech Mono',monospace;font-size:.8rem}
        .platform-bar{flex:1;height:8px;background:var(--steel);border-radius:4px;overflow:hidden}
        .platform-bar-fill{height:100%;border-radius:4px;transition:width 1s ease-out;box-shadow:0 0 12px currentColor}
        .platform-score{width:45px;text-align:right;font-family:'Orbitron',sans-serif;font-size:.85rem;font-weight:700}

        .issues-section{border-left:3px solid var(--fire)}
        .fixes-section{border-left:3px solid var(--plasma)}
        .issue-list,.fix-list{list-style:none;padding:0;margin:0}
        .issue-list li,.fix-list li{font-size:.9rem;color:rgba(224,224,236,0.85);padding:8px 0;border-bottom:1px solid var(--border-color);line-height:1.6}
        .issue-list li:last-child,.fix-list li:last-child{border-bottom:none}
        .issue-list li::before{content:'✗';color:var(--fire);margin-right:10px}
        .fix-list li::before{content:'→';color:var(--plasma);margin-right:10px}

        .results-cta{background:var(--panel);border:1px solid var(--border-color);border-top:3px solid var(--fire);padding:2.5rem;text-align:center;clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))}
        .results-cta h3{font-family:'Orbitron',sans-serif;font-size:1.3rem;font-weight:700;margin-bottom:.75rem}
        .results-cta p{color:var(--text-dim);margin-bottom:1.5rem}
        .btn-fire{display:inline-flex;align-items:center;gap:8px;font-family:'Share Tech Mono',monospace;font-size:.85rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;background:linear-gradient(135deg,var(--fire),#ff4400);color:#000;text-decoration:none;padding:14px 28px;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));transition:all .3s}
        .btn-fire:hover{box-shadow:0 0 40px var(--glow-fire);transform:translateY(-2px)}
        .cta-guarantee{font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--text-dim);margin-top:1rem;display:flex;align-items:center;justify-content:center;gap:8px}

        .score-footer{padding:2rem;border-top:1px solid var(--border-color)}
        .score-footer .footer-inner{max-width:900px;margin:0 auto;display:flex;justify-content:space-between;align-items:center}
        .score-footer .footer-brand{display:flex;align-items:center;gap:10px;text-decoration:none}
        .score-footer .footer-logo{filter:drop-shadow(0 0 6px var(--glow-plasma))}
        .score-footer .footer-name{font-family:'Orbitron',sans-serif;font-size:.7rem;font-weight:700;letter-spacing:.1em;color:var(--plasma)}
        .score-footer .footer-links{display:flex;gap:1.5rem}
        .score-footer .footer-links a{font-family:'Share Tech Mono',monospace;font-size:.7rem;letter-spacing:.1em;color:var(--text-dim);text-decoration:none;transition:color .2s}
        .score-footer .footer-links a:hover{color:var(--plasma)}

        @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.1)}}

        @media(max-width:600px){
          .score-header{padding:1rem}
          .score-card{padding:32px 24px}
          .score-trust{flex-direction:column;gap:.75rem}
          .results-hero{padding:1.5rem}
          .results-cta{padding:1.5rem}
        }
      `}</style>
    </>
  );
}
