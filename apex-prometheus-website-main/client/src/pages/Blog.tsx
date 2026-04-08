import { useEffect } from "react";
import { Link } from "wouter";

const ARTICLES = [
  {
    slug: "contractor-ai-adoption-doubled-2026",
    title: "Contractor AI Adoption Just Doubled — And the Ones Who Wait Are Getting Left Behind",
    excerpt: "38% of contractors now report measurable AI impact, up from 17% last year. The stampede is here — and the window for first-mover advantage is closing fast.",
    date: "March 2026",
    readingTime: "8",
    tags: ["AI Adoption", "Trades", "AEO", "Market Data"],
  },
  {
    slug: "ai-consulting-retainer-contractors-what-you-get",
    title: "AI Consulting Retainer for Contractors: What You Actually Get for $3K a Month",
    excerpt: "Forward-deployed AI for the trades. No chatbot scams. Real deliverables, real math, real ROI in 60 days. Here's exactly what your money buys.",
    date: "March 2026",
    readingTime: "10",
    tags: ["AI Consulting", "Retainer", "Trades", "ROI"],
  },
  {
    slug: "customers-stopped-googling-aeo-revolution",
    title: "Your Customers Stopped Googling You. Here's Where They Went.",
    excerpt: "45% of consumers now use AI search to find local services. Only 1.2% of businesses get recommended. Here's how trades businesses can become the answer.",
    date: "March 2026",
    readingTime: "12",
    tags: ["AEO", "AI Search", "Trades", "Digital Marketing"],
  },
  {
    slug: "ai-data-center-boom-trades-business",
    title: "The AI Data Center Boom: What It Means for Your Trade Business",
    excerpt: "Jensen Huang called it 'the largest infrastructure build-out in human history.' The $50B skilled trades hiring surge is here — and the contractors who position now will build generational wealth.",
    date: "March 2026",
    readingTime: "10",
    tags: ["Data Centers", "Trades", "AEO", "Commercial"],
  },
  {
    slug: "7-ai-tools-every-trades-business-needs-2026",
    title: "7 AI Tools Every Trades Business Needs in 2026 (And What They'll Actually Save You)",
    excerpt: "You're losing $500-$15K per missed call. Here are the seven categories of AI tools saving trades businesses real money — with real prices and real ROI numbers.",
    date: "March 2026",
    readingTime: "8",
    tags: ["AI Tools", "Trades", "Automation", "ROI"],
  },
  {
    slug: "ai-boom-service-businesses-2026",
    title: "The AI Boom Is Coming for Service Businesses — And Most Aren't Ready",
    excerpt: "Global AI spending hits $2.5 trillion in 2026. 68% of small businesses already use AI. Here's why service businesses that don't integrate now will be left behind.",
    date: "March 2026",
    readingTime: "12",
    tags: ["AI Integration", "Service Businesses", "Market Analysis"],
  },
  {
    slug: "aeo-for-service-businesses",
    title: "Your Customers Are Asking AI for Recommendations — Here's How to Be the Answer",
    excerpt: "People now ask ChatGPT, Gemini, and Perplexity to find service providers instead of Googling. If your business isn't optimized for AI search, you're invisible to a growing channel.",
    date: "March 2026",
    readingTime: "14",
    tags: ["AEO", "AI Search", "Digital Marketing"],
  },
  {
    slug: "ai-wont-replace-tradespeople",
    title: "AI Won't Replace Tradespeople — But Tradespeople Who Use AI Will Replace Those Who Don't",
    excerpt: "The trades aren't going away. But the businesses that integrate AI into operations, marketing, and customer service will outcompete those running on pen and paper.",
    date: "March 2026",
    readingTime: "11",
    tags: ["Blue Collar AI", "Trades", "Automation"],
  },
  {
    slug: "geo-strategy-trades-businesses-2026",
    title: "How to Build a GEO Strategy for Your Trades Business in 2026",
    excerpt: "Your customers aren't Googling anymore. They're asking ChatGPT. Generative Engine Optimization is how you fix that — and trades businesses that move first will own their markets.",
    date: "March 2026",
    readingTime: "10",
    tags: ["GEO", "Strategy", "AI Visibility"],
  },
];

export default function Blog() {
  useEffect(() => {
    document.title = "Blog | Apex Prometheus — AI Insights for Service Businesses";
    window.scrollTo(0, 0);
    
    const setMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    setMeta('description', 'AI insights, strategies, and real-world playbooks for service businesses. Learn how to integrate AI, optimize for AEO, and dominate your market.');
    setMeta('keywords', 'AI for service businesses, AI integration, AEO, generative engine optimization, trades AI, blue collar AI');
    setMeta('og:title', 'Apex Prometheus Blog');
    setMeta('og:description', 'Strategies for integrating AI into service businesses.');
    setMeta('og:type', 'website');
    setMeta('og:url', 'https://apexprometheus.ai/blog');
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Apex Prometheus Blog",
      "description": "AI insights for service businesses",
      "url": "https://apexprometheus.ai/blog"
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  useEffect(() => {
    const links = document.querySelectorAll('.blog-card');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && !link.getAttribute('rel')) {
        link.setAttribute('rel', 'article');
      }
    });
  }, []);

  return (
    <>
      <div className="blog-page">
        <div className="blog-header reveal">
          <div className="section-label">knowledge_base</div>
          <h1 className="blog-page-title">Blog</h1>
          <div className="m-div"><div className="m-line"></div><div className="m-dot"></div><div className="m-line r"></div></div>
          <p className="blog-page-desc">AI insights, strategies, and real-world playbooks for service businesses ready to integrate and dominate.</p>
        </div>

        <div className="blog-grid">
          {ARTICLES.map((article, idx) => (
            <Link key={idx} href={`/blog/${article.slug}`} className="blog-card reveal">
              <div className="blog-card-inner">
                <div className="blog-card-meta">
                  <span className="blog-card-date">{article.date}</span>
                  <span className="blog-card-read">{article.readingTime} min read</span>
                </div>
                <h2 className="blog-card-title">{article.title}</h2>
                <p className="blog-card-excerpt">{article.excerpt}</p>
                <div className="blog-card-tags">
                  {article.tags.map((tag, i) => (
                    <span key={i} className="blog-card-tag">{tag}</span>
                  ))}
                </div>
                <div className="blog-card-cta">Read Article →</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="blog-resources reveal">
          <div className="section-label">resources</div>
          <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: "1rem" }}>More from Apex Prometheus</h3>
          <div className="blog-resources-grid">
            <Link href="/manifesto" className="resource-link">
              <span className="resource-icon">🔥</span>
              <div>
                <div className="resource-title">The Blue Collar AI Manifesto</div>
                <div className="resource-desc">Our founding declaration — why the trades will take AI over, not the other way around.</div>
              </div>
            </Link>
            <Link href="/whitepaper" className="resource-link">
              <span className="resource-icon">📄</span>
              <div>
                <div className="resource-title">AI Discovery Whitepaper</div>
                <div className="resource-desc">Why traditional SEO is no longer enough and how AEO changes the game for service businesses.</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .blog-page{max-width:1100px;margin:0 auto;padding:120px 2rem 80px;position:relative;z-index:10}
        .blog-header{margin-bottom:3rem}
        .blog-page-title{font-family:'Orbitron',sans-serif;font-size:clamp(2.2rem,5vw,3.5rem);font-weight:800;letter-spacing:.02em;margin-bottom:1.5rem;line-height:1.1}
        .blog-page-desc{font-size:1.15rem;color:var(--text-dim);max-width:600px;line-height:1.75;font-weight:400}

        .blog-grid{display:grid;gap:20px;margin-bottom:4rem}
        .blog-card{text-decoration:none;color:inherit;display:block;background:var(--panel);border:1px solid var(--border-color);position:relative;overflow:hidden;clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px));transition:all .35s cubic-bezier(.22,1,.36,1)}
        .blog-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--plasma) 0%,var(--plasma) 30%,transparent 30%,transparent 35%,var(--fire) 35%,var(--fire) 50%,transparent 50%);opacity:.3;transition:opacity .3s}
        .blog-card:hover{transform:translateY(-4px);border-color:rgba(0,229,255,0.4);box-shadow:0 16px 50px rgba(0,0,0,0.5),0 0 30px rgba(0,229,255,0.06)}
        .blog-card:hover::before{opacity:.8}
        .blog-card-inner{padding:36px 40px}
        .blog-card-meta{display:flex;gap:1.5rem;margin-bottom:1rem}
        .blog-card-date,.blog-card-read{font-family:'Share Tech Mono',monospace;font-size:.7rem;letter-spacing:.1em;color:var(--text-dim);text-transform:uppercase}
        .blog-card-title{font-family:'Orbitron',sans-serif;font-size:1.2rem;font-weight:700;line-height:1.3;margin-bottom:12px;letter-spacing:.01em;transition:color .25s}
        .blog-card:hover .blog-card-title{color:var(--plasma)}
        .blog-card-excerpt{font-size:.95rem;color:var(--text-dim);line-height:1.7;margin-bottom:16px;font-weight:400}
        .blog-card-tags{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}
        .blog-card-tag{font-family:'Share Tech Mono',monospace;font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;color:var(--plasma);padding:3px 10px;border:1px solid var(--border-color);transition:all .25s}
        .blog-card:hover .blog-card-tag{border-color:rgba(0,229,255,0.3)}
        .blog-card-cta{font-family:'Share Tech Mono',monospace;font-size:.75rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--fire);transition:all .25s}
        .blog-card:hover .blog-card-cta{color:var(--fire-hot);transform:translateX(4px)}

        .blog-resources{padding:3rem 0}
        .blog-resources-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        @media(max-width:768px){.blog-resources-grid{grid-template-columns:1fr}}
        .resource-link{display:flex;gap:16px;padding:24px 28px;background:var(--panel);border:1px solid var(--border-color);text-decoration:none;color:inherit;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));transition:all .3s}
        .resource-link:hover{border-color:rgba(0,229,255,0.4);transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,0,0,0.4)}
        .resource-icon{font-size:1.5rem;flex-shrink:0;margin-top:2px}
        .resource-title{font-family:'Orbitron',sans-serif;font-size:.9rem;font-weight:700;margin-bottom:4px;transition:color .25s}
        .resource-link:hover .resource-title{color:var(--plasma)}
        .resource-desc{font-size:.85rem;color:var(--text-dim);line-height:1.6}

        @media(max-width:768px){
          .blog-page{padding:100px 1.25rem 60px}
          .blog-card-inner{padding:24px}
        }
      `}</style>
    </>
  );
}
