import { useEffect, useRef } from "react";
import { Link } from "wouter";
import ListenButton from "./ListenButton";

interface ArticlePageProps {
  title: string;
  subtitle?: string;
  author?: string;
  date?: string;
  readingTime?: string;
  metaDescription?: string;
  metaKeywords?: string;
  backLink?: string;
  backLabel?: string;
  children: React.ReactNode;
}

export default function ArticlePage({
  title,
  subtitle,
  author = "Apex Prometheus",
  date = "March 2026",
  readingTime,
  metaDescription,
  metaKeywords,
  backLink = "/blog",
  backLabel = "← Back to Blog",
  children,
}: ArticlePageProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.title = `${title} | Apex Prometheus`;
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
    
    setMeta('description', metaDescription || subtitle || title);
    setMeta('keywords', metaKeywords || 'AI, service businesses, automation');
    setMeta('og:title', title);
    setMeta('og:description', metaDescription || subtitle || title);
    setMeta('og:type', 'article');
    setMeta('og:url', window.location.href);
    setMeta('article:published_time', date || new Date().toISOString());
    setMeta('article:author', author || 'Apex Prometheus');
  }, [title, metaDescription, metaKeywords, subtitle, date, author]);

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": title,
      "description": metaDescription || subtitle || title,
      "author": {
        "@type": "Organization",
        "name": author || "Apex Prometheus"
      },
      "datePublished": date || new Date().toISOString(),
      "publisher": {
        "@type": "Organization",
        "name": "Apex Prometheus"
      }
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => script.remove();
  }, [title, metaDescription, subtitle, author, date]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const links = document.querySelectorAll('.article-body a');
    links.forEach((link) => {
      if (!link.getAttribute('rel')) {
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }, []);

  return (
    <>
      <div className="article-page">
        <div className="article-header">
          <Link href={backLink} className="article-back">{backLabel}</Link>
          <div className="article-meta-row">
            {author && <span className="article-meta-item">{author}</span>}
            {date && <span className="article-meta-item">{date}</span>}
            {readingTime && <span className="article-meta-item">{readingTime} min read</span>}
          </div>
          <h1 className="article-title">{title}</h1>
          {subtitle && <p className="article-subtitle">{subtitle}</p>}
          <div className="m-div"><div className="m-line"></div><div className="m-dot"></div><div className="m-line r"></div></div>
          <ListenButton containerRef={contentRef} />
        </div>
        <div className="article-body" ref={contentRef}>
          {children}
        </div>
        <div className="article-footer-cta">
          <div className="section-label">next_steps</div>
          <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.4rem", fontWeight: 700, marginBottom: "1rem" }}>Ready to integrate AI into your business?</h3>
          <p style={{ color: "var(--text-dim)", marginBottom: "1.5rem", lineHeight: 1.75 }}>Book a free consultation and let's talk about what's possible for your operation.</p>
          <Link href="/#contact" className="btn-fire">Book Consultation →</Link>
        </div>
      </div>

      <style>{`
        .article-page{max-width:800px;margin:0 auto;padding:120px 2rem 80px;position:relative;z-index:10}
        .article-header{margin-bottom:3rem}
        .article-back{font-family:'Share Tech Mono',monospace;font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;color:var(--plasma);text-decoration:none;display:inline-flex;align-items:center;gap:6px;margin-bottom:2rem;transition:all .25s}
        .article-back:hover{color:var(--fire);transform:translateX(-4px)}
        .article-meta-row{display:flex;gap:1.5rem;flex-wrap:wrap;margin-bottom:1.5rem}
        .article-meta-item{font-family:'Share Tech Mono',monospace;font-size:.7rem;letter-spacing:.1em;color:var(--text-dim);text-transform:uppercase}
        .article-meta-item::before{content:'//';margin-right:6px;color:var(--plasma);opacity:.5}
        .article-title{font-family:'Orbitron',sans-serif;font-size:clamp(1.8rem,4vw,2.8rem);font-weight:800;line-height:1.15;letter-spacing:.01em;margin-bottom:1.5rem}
        .article-subtitle{font-size:1.15rem;color:var(--text-dim);line-height:1.75;max-width:650px;font-weight:400}

        .article-body{font-size:1.05rem;line-height:1.85;color:rgba(224,224,236,0.88);font-weight:400}
        .article-body h2{font-family:'Orbitron',sans-serif;font-size:1.5rem;font-weight:700;margin:3rem 0 1.25rem;padding-top:1rem;border-top:1px solid var(--border-color);color:var(--text)}
        .article-body h3{font-family:'Orbitron',sans-serif;font-size:1.15rem;font-weight:700;margin:2.5rem 0 1rem;color:var(--plasma)}
        .article-body h4{font-family:'Rajdhani',sans-serif;font-size:1rem;font-weight:700;margin:2rem 0 .75rem;color:var(--fire)}
        .article-body p{margin-bottom:1.25rem}
        .article-body strong{color:var(--text);font-weight:600}
        .article-body ul,.article-body ol{margin-bottom:1.25rem;padding-left:1.5rem}
        .article-body li{margin-bottom:.5rem;color:rgba(224,224,236,0.85)}
        .article-body li::marker{color:var(--fire)}
        .article-body blockquote{border-left:3px solid var(--fire);padding:1rem 1.5rem;margin:1.5rem 0;background:var(--panel);font-style:italic;color:rgba(224,224,236,0.75);clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))}
        .article-body a{color:var(--plasma);text-decoration:none;border-bottom:1px solid rgba(0,229,255,0.3);transition:all .2s}
        .article-body a:hover{border-bottom-color:var(--plasma);text-shadow:0 0 8px var(--glow-plasma)}
        .article-body hr{border:none;height:1px;background:var(--border-color);margin:2.5rem 0}
        .article-body code{font-family:'Share Tech Mono',monospace;font-size:.9em;background:var(--panel);padding:2px 8px;border:1px solid var(--border-color);color:var(--plasma)}
        .article-body pre{background:var(--panel);border:1px solid var(--border-color);padding:1.5rem;overflow-x:auto;margin:1.5rem 0;font-family:'Share Tech Mono',monospace;font-size:.85rem;line-height:1.6;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))}

        .article-footer-cta{margin-top:4rem;padding:3rem;background:var(--panel);border:1px solid var(--border-color);border-left:3px solid var(--fire);text-align:center;clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))}

        @media(max-width:768px){
          .article-page{padding:100px 1.25rem 60px}
          .article-title{font-size:1.6rem}
        }
      `}</style>
    </>
  );
}
