/**
 * SEO Pre-rendering Middleware
 * 
 * Serves fully rendered HTML to search engine crawlers and social media bots.
 * Regular users get the normal SPA experience.
 * 
 * This ensures Googlebot, Bingbot, and other crawlers see complete page content,
 * meta tags, schema markup, and text — not an empty <div id="root"> shell.
 */

import type { Request, Response, NextFunction } from "express";

// Crawler user agents to detect
const CRAWLER_USER_AGENTS = [
  "googlebot",
  "bingbot",
  "slurp",
  "duckduckbot",
  "baiduspider",
  "yandexbot",
  "facebot",
  "facebookexternalhit",
  "twitterbot",
  "linkedinbot",
  "whatsapp",
  "telegrambot",
  "applebot",
  "discordbot",
  "oai-searchbot",
  "claude-searchbot",
  "perplexitybot",
  "google-extended",
  "mistrala-user",
  "ia_archiver",
  "semrushbot",
  "ahrefsbot",
  "mj12bot",
  "petalbot",
  "sogou",
  "bytespider",
];

function isCrawler(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some(bot => ua.includes(bot));
}

// ═══════════════════════════════════════════════════════════════
// Page content definitions — all the actual text content
// ═══════════════════════════════════════════════════════════════

interface PageMeta {
  title: string;
  description: string;
  keywords: string;
  ogType: string;
  canonicalPath: string;
  schema: object;
  content: string; // Full HTML content for the page body
}

const SITE_URL = "https://apexprometheus.ai";
const SITE_NAME = "Apex Prometheus";

function getPages(): Record<string, PageMeta> {
  return {
    "/": {
      title: "Apex Prometheus | AI Consulting for Small Business",
      description: "AI consulting for small and mid-size businesses. From basic AI tools to full agentic workflows. Lean operations, proven results.",
      keywords: "AI consulting, business automation, AI implementation, lean operations, workflow automation, agentic AI, Staten Island",
      ogType: "website",
      canonicalPath: "/",
      schema: {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Apex Prometheus",
        "url": SITE_URL,
        "description": "AI consulting for small and mid-size businesses. From basic AI tools to full agentic workflows.",
        "address": [
          { "@type": "PostalAddress", "addressLocality": "Staten Island", "addressRegion": "NY", "addressCountry": "US" },
          { "@type": "PostalAddress", "addressLocality": "Tampa", "addressRegion": "FL", "addressCountry": "US" }
        ],
        "telephone": "+17186031726",
        "email": "info@apexprometheus.ai",
        "founder": { "@type": "Person", "name": "Stan LoMonaco" },
        "sameAs": [],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+17186031726",
          "contactType": "sales",
          "email": "info@apexprometheus.ai"
        }
      },
      content: `
        <header>
          <nav aria-label="Main navigation">
            <a href="/">APEX PROMETHEUS</a>
            <ul>
              <li><a href="/#problem">Problem</a></li>
              <li><a href="/#services">Services</a></li>
              <li><a href="/#about">About</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/#contact">Contact</a></li>
            </ul>
          </nav>
        </header>

        <main>
          <section id="hero">
            <h1>Survive &amp; Thrive with AI</h1>
            <p>We help small and mid-size businesses adopt AI tools and build lean operations. From basic implementations to full agentic workflows — we've done it in our own business, and we know how to do it in yours.</p>
            <a href="/#contact">Book Consultation</a>
            <a href="/#services">Explore Services</a>
          </section>

          <section id="problem">
            <h2>The Problem</h2>
            <p>AI isn't a luxury anymore — it's a necessity. Businesses that don't adopt AI now will struggle to compete tomorrow.</p>
            <article>
              <h3>You're Losing Time (and Money)</h3>
              <p>Manual processes drain your team's productivity. While competitors automate, you're stuck in the old way of doing things.</p>
            </article>
            <article>
              <h3>Your Team is Overwhelmed</h3>
              <p>Without lean operations, you need more staff to handle the same workload. AI can do the heavy lifting — if you know how to use it.</p>
            </article>
            <article>
              <h3>You're Falling Behind</h3>
              <p>The AI adoption gap is real. Large companies are already reaping the benefits. SMBs that wait will find themselves at a serious disadvantage.</p>
            </article>
            <article>
              <h3>You Don't Know Where to Start</h3>
              <p>There's too much hype, too many tools, and too many consultants selling snake oil. You need someone who's actually done it.</p>
            </article>
            <blockquote>
              <p>Businesses that adopt AI now will dominate their markets. Those that wait will become irrelevant. The question isn't "should we adopt AI?" — it's <strong>"how quickly can we get started?"</strong></p>
            </blockquote>
          </section>

          <section id="services">
            <h2>Services</h2>
            <p>Three tiers designed to meet you where you are in your AI journey.</p>

            <article>
              <h3>Tier 1: AI Foundations — $1.5K–$3K (2–4 weeks)</h3>
              <p>Perfect for businesses new to AI. We introduce you to the basics and help you implement immediate wins.</p>
              <ul>
                <li>AI readiness assessment</li>
                <li>Tool recommendations</li>
                <li>Custom SOPs</li>
                <li>Team training</li>
              </ul>
              <p>ROI: 2–3x / Year 1</p>
            </article>

            <article>
              <h3>Tier 2: Workflow Automation — $3K–$10K (4–8 weeks) — Most Popular</h3>
              <p>Ready to scale? We automate your core workflows and integrate your systems for seamless operations.</p>
              <ul>
                <li>Workflow analysis &amp; optimization</li>
                <li>System integrations (CRM, PM, etc.)</li>
                <li>Custom automation (3 processes)</li>
                <li>AI-assisted operations</li>
              </ul>
              <p>ROI: 3–5x / Year 1</p>
            </article>

            <article>
              <h3>Tier 3: Agentic AI — $10K–$30K+ (8–16 weeks)</h3>
              <p>Full transformation. We design and deploy custom AI agents to create a truly lean, autonomous operation.</p>
              <ul>
                <li>Business process re-engineering</li>
                <li>Custom AI agent development</li>
                <li>Autonomous workflows</li>
                <li>Lean-office transformation</li>
              </ul>
              <p>ROI: 5–10x / Year 1</p>
            </article>

            <article>
              <h3>Ongoing Support &amp; Advisory — Starting at $980/month</h3>
              <p>After your project, keep us on retainer for ongoing support, maintenance, and advisory services. Priority access, monthly strategy sessions, and early access to new tools.</p>
            </article>
          </section>

          <section id="about">
            <h2>Why Apex Prometheus?</h2>
            <h3>We're Practitioners, Not Theorists</h3>
            <p>Our founder runs a successful construction and painting company in Staten Island. He's built a lean operation by implementing AI and agentic workflows in his own business. We're not consultants who read about AI — we're business owners who live it every day.</p>
            <p>Apex Prometheus brings fire to your business — not as a gimmick, not as a pitch — as a tool we've already forged in the real world.</p>
            <ul>
              <li><strong>Real-World Experience:</strong> We've implemented AI in a blue-collar business. We understand your challenges because we've faced them ourselves.</li>
              <li><strong>Proven Results:</strong> We've reduced our own office staff by 60% while scaling revenue. We know what works because we've done it.</li>
              <li><strong>Practical Solutions:</strong> No fluff, no buzzwords. We focus on tools and workflows that deliver tangible ROI for your business.</li>
              <li><strong>Local &amp; Accessible:</strong> Based in Staten Island, NY and Tampa, FL. We understand the local business landscape and the unique needs of SMBs.</li>
            </ul>
            <p>Founded by <strong>Stan LoMonaco</strong> — a hands-on business owner who built his construction company lean with AI before anyone told him to.</p>
          </section>

          <section id="contact">
            <h2>Ready to Get Started?</h2>
            <p>Let's talk about how AI can transform your business. No pitch, no pressure — just a straight conversation about what's possible.</p>
            <address>
              <p><strong>Locations:</strong> Staten Island, NY | Tampa, FL</p>
              <p><strong>Email:</strong> <a href="mailto:info@apexprometheus.ai">info@apexprometheus.ai</a></p>
              <p><strong>Phone:</strong> <a href="tel:+17186031726">(718) 603-1726</a></p>
            </address>
            <p>We typically respond within 24 hours.</p>
          </section>
        </main>

        <footer>
          <p>APEX PROMETHEUS</p>
          <p>&copy; 2026 Apex Prometheus. All rights reserved.</p>
          <p>Staten Island, NY | Tampa, FL</p>
          <a href="mailto:info@apexprometheus.ai">info@apexprometheus.ai</a>
          <nav aria-label="Footer navigation">
            <a href="/blog">Blog</a>
            <a href="/manifesto">Manifesto</a>
            <a href="/whitepaper">Whitepaper</a>
          </nav>
        </footer>
      `,
    },

    "/blog": {
      title: "Blog | Apex Prometheus — AI Insights for Service Businesses",
      description: "AI insights, strategies, and real-world playbooks for service businesses. Learn how to integrate AI, optimize for AEO, and dominate your market.",
      keywords: "AI for service businesses, AI integration, AEO, generative engine optimization, trades AI, blue collar AI",
      ogType: "website",
      canonicalPath: "/blog",
      schema: {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "Apex Prometheus Blog",
        "description": "AI insights for service businesses",
        "url": `${SITE_URL}/blog`,
        "publisher": { "@type": "Organization", "name": "Apex Prometheus" }
      },
      content: `
        <header>
          <nav aria-label="Main navigation">
            <a href="/">APEX PROMETHEUS</a>
            <a href="/blog">Blog</a>
          </nav>
        </header>
        <main>
          <h1>Blog</h1>
          <p>AI insights, strategies, and real-world playbooks for service businesses ready to integrate and dominate.</p>

          <article>
            <h2><a href="/blog/ai-boom-service-businesses-2026">The AI Boom Is Coming for Service Businesses — And Most Aren't Ready</a></h2>
            <p>March 2026 — 12 min read</p>
            <p>Global AI spending hits $2.5 trillion in 2026. 68% of small businesses already use AI. Here's why service businesses that don't integrate now will be left behind.</p>
          </article>

          <article>
            <h2><a href="/blog/aeo-for-service-businesses">Your Customers Are Asking AI for Recommendations — Here's How to Be the Answer</a></h2>
            <p>March 2026 — 14 min read</p>
            <p>People now ask ChatGPT, Gemini, and Perplexity to find service providers instead of Googling. If your business isn't optimized for AI search, you're invisible to a growing channel.</p>
          </article>

          <article>
            <h2><a href="/blog/ai-wont-replace-tradespeople">AI Won't Replace Tradespeople — But Tradespeople Who Use AI Will Replace Those Who Don't</a></h2>
            <p>March 2026 — 11 min read</p>
            <p>The trades aren't going away. But the businesses that integrate AI into operations, marketing, and customer service will outcompete those running on pen and paper.</p>
          </article>

          <article>
            <h2><a href="/blog/geo-strategy-trades-businesses-2026">How to Build a GEO Strategy for Your Trades Business in 2026</a></h2>
            <p>March 2026 — 10 min read</p>
            <p>Your customers aren't Googling anymore. They're asking ChatGPT. Generative Engine Optimization is how you fix that — and trades businesses that move first will own their markets.</p>
          </article>

          <h3>More from Apex Prometheus</h3>
          <ul>
            <li><a href="/manifesto">The Blue Collar AI Manifesto</a> — Our founding declaration — why the trades will take AI over, not the other way around.</li>
            <li><a href="/whitepaper">AI Discovery Whitepaper</a> — Why traditional SEO is no longer enough and how AEO changes the game for service businesses.</li>
          </ul>
        </main>
        <footer>
          <p>&copy; 2026 Apex Prometheus. All rights reserved.</p>
          <a href="mailto:info@apexprometheus.ai">info@apexprometheus.ai</a>
        </footer>
      `,
    },

    "/blog/ai-boom-service-businesses-2026": {
      title: "The AI Boom Is Coming for Service Businesses — And Most Aren't Ready | Apex Prometheus",
      description: "Global AI spending hits $2.5 trillion in 2026. 68% of small businesses already use AI. Here's why service businesses that don't integrate now will be left behind — and what to do about it.",
      keywords: "AI for service businesses, AI integration small business, AI boom 2026, AI for contractors, AI adoption SMB",
      ogType: "article",
      canonicalPath: "/blog/ai-boom-service-businesses-2026",
      schema: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "The AI Boom Is Coming for Service Businesses — And Most Aren't Ready",
        "description": "Global AI spending hits $2.5 trillion in 2026. 68% of small businesses already use AI. Here's why service businesses that don't integrate now will be left behind.",
        "author": { "@type": "Organization", "name": "Apex Prometheus AI" },
        "datePublished": "2026-03",
        "publisher": { "@type": "Organization", "name": "Apex Prometheus" },
        "url": `${SITE_URL}/blog/ai-boom-service-businesses-2026`
      },
      content: `
        <header><nav aria-label="Main navigation"><a href="/">APEX PROMETHEUS</a><a href="/blog">Blog</a></nav></header>
        <main>
          <article>
            <a href="/blog">← Back to Blog</a>
            <p>Apex Prometheus AI — March 2026 — 12 min read</p>
            <h1>The AI Boom Is Coming for Service Businesses — And Most Aren't Ready</h1>
            <p>Global AI spending hits $2.5 trillion in 2026. 68% of small businesses already use AI. Here's why service businesses that don't integrate now will be left behind — and what to do about it.</p>

            <p>There's a $2.5 trillion wave building right now. That's not a projection from some optimistic startup pitch deck — that's Gartner's forecast for worldwide AI spending in 2026 alone. By 2027, it climbs to $3.3 trillion.</p>
            <p>Most of that money is flowing into enterprise tech, cloud infrastructure, and Silicon Valley. But here's what nobody's talking about: the biggest untapped opportunity isn't in tech companies adopting more AI. It's in the millions of service businesses — painters, plumbers, electricians, HVAC techs, roofers, landscapers, general contractors — who haven't even started.</p>
            <p>And the ones who move first will dominate their markets for the next decade.</p>

            <h2>The Numbers Are Screaming</h2>
            <p>A QuickBooks survey found that <strong>68% of U.S. small businesses now use AI regularly</strong> — up from 48% in mid-2024. That's a 42% jump in under two years. Generative AI usage among small firms jumped from 40% in 2024 to over 58% in 2025.</p>
            <p>But dig into those numbers and you'll find a massive gap. The businesses adopting AI are overwhelmingly in e-commerce, professional services, and tech-adjacent industries. The trades? The service businesses that actually keep buildings standing, homes livable, and infrastructure functioning? They're barely in the game.</p>
            <p>Only <strong>5.8% of very small businesses</strong> (1-4 employees) have adopted AI, according to Census Bureau data.</p>

            <h2>Why Service Businesses Are the Perfect AI Use Case</h2>
            <p>Service businesses are actually better suited for AI integration than most tech companies. Because their problems are repeatable and well-defined.</p>
            <ul>
              <li><strong>Getting leads</strong> — finding customers who need the service right now</li>
              <li><strong>Qualifying leads</strong> — figuring out which ones are worth pursuing</li>
              <li><strong>Estimating</strong> — pricing jobs accurately without leaving money on the table</li>
              <li><strong>Scheduling</strong> — managing crews, routes, and timelines efficiently</li>
              <li><strong>Follow-up</strong> — staying in touch with past customers for repeat business</li>
              <li><strong>Marketing</strong> — showing up where customers are looking</li>
              <li><strong>Reputation</strong> — building and managing reviews that drive more business</li>
              <li><strong>Administration</strong> — invoicing, payroll, compliance, and paperwork</li>
            </ul>
            <p>Every single one of these can be partially or fully automated with AI tools that exist right now.</p>

            <h2>What AI Integration Actually Looks Like</h2>
            <h3>Lead Generation &amp; Capture</h3>
            <ul>
              <li>AI-powered chatbots answering questions and booking estimates 24/7</li>
              <li>AI content engines writing blog posts, social media content, and Google Business Profile posts</li>
              <li>AI-optimized landing pages that convert visitors into leads at 2-3x the rate</li>
            </ul>
            <h3>Estimating &amp; Pricing</h3>
            <ul>
              <li>Photo and video estimates — customer sends pictures, AI generates a preliminary quote in minutes</li>
              <li>Dynamic pricing models factoring in material costs, crew availability, and seasonal demand</li>
              <li>Historical data analysis showing which job types are most profitable</li>
            </ul>
            <h3>Operations &amp; Scheduling</h3>
            <ul>
              <li>Route optimization reducing drive time, fuel costs, and wasted hours</li>
              <li>Predictive scheduling accounting for weather, material delivery, and crew skill sets</li>
              <li>Automated job status updates to customers</li>
            </ul>
            <h3>Marketing &amp; Reputation</h3>
            <ul>
              <li>AI-generated review request sequences sent at the perfect moment</li>
              <li>Automated social media content creation from before/after photos</li>
              <li>SEO and AEO optimization — showing up when someone asks ChatGPT "who's the best painter near me?"</li>
            </ul>

            <h2>The First-Mover Advantage Is Massive</h2>
            <p>In local service businesses, being first matters enormously. Most trades businesses in any given market are operationally identical. Same tools, same suppliers, same basic skill set. The differentiator is almost always marketing, responsiveness, and customer experience.</p>
            <p>AI amplifies all three simultaneously.</p>
            <p>AI search is creating an entirely new channel that most service businesses don't even know exists. When someone asks ChatGPT "who's the best plumber in Ocean County, NJ?" — the AI gives ONE answer. If your business isn't structured to be that answer, you don't exist in that channel.</p>

            <h2>The "I'm Not a Tech Person" Objection</h2>
            <p>You don't need to be a tech person. The AI tools available in 2026 are designed for people who aren't technical. If you can use a smartphone and send a text message, you can use most AI business tools.</p>

            <h2>What Happens to Businesses That Don't Adapt</h2>
            <p>The home services market in the US is worth over $600 billion. That market isn't shrinking. But the businesses that capture that demand will change.</p>
            <ol>
              <li>New tools emerge</li>
              <li>Early adopters gain an edge</li>
              <li>The edge becomes the standard</li>
              <li>Late adopters can't compete on cost or quality</li>
              <li>Market consolidation — fewer, better-equipped businesses capture more share</li>
            </ol>
            <p>We're between stages 2 and 3 right now. The window to become an early adopter is still open — but it's closing.</p>

            <h2>Where to Start</h2>
            <p><strong>Start with one thing.</strong> Don't try to overhaul everything at once. Pick the area that causes you the most pain.</p>

            <h2>Frequently Asked Questions</h2>
            <h3>How much does AI cost for a small service business?</h3>
            <p>Most AI tools cost between $0 and $200 per month. Many have free tiers. The ROI typically pays for itself within the first month.</p>
            <h3>Will AI replace tradespeople?</h3>
            <p>No. AI can't swing a hammer, diagnose a furnace, or paint a straight line. AI handles the business side so tradespeople can spend more time doing skilled work.</p>
            <h3>What's AEO and why should service businesses care?</h3>
            <p>AEO stands for Answer Engine Optimization — structuring your online presence so AI platforms like ChatGPT, Gemini, and Perplexity recommend your business.</p>
            <h3>How long does it take to see results from AI integration?</h3>
            <p>Some results are immediate. Others take 3-6 months. AI tools compound over time.</p>
            <h3>I'm not technical — can I still use AI?</h3>
            <p>Absolutely. The most popular AI tools in 2026 are designed for non-technical users.</p>
          </article>
        </main>
        <footer><p>&copy; 2026 Apex Prometheus. All rights reserved.</p></footer>
      `,
    },

    "/blog/aeo-for-service-businesses": {
      title: "Your Customers Are Asking AI for Recommendations — Here's How to Be the Answer | Apex Prometheus",
      description: "People now ask ChatGPT, Gemini, and Perplexity to find service providers instead of Googling. If your business isn't optimized for AI search, you're invisible to a growing channel.",
      keywords: "AEO for service businesses, answer engine optimization contractors, AI search optimization local business, how to show up in ChatGPT",
      ogType: "article",
      canonicalPath: "/blog/aeo-for-service-businesses",
      schema: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "Your Customers Are Asking AI for Recommendations — Here's How to Be the Answer",
        "description": "People now ask ChatGPT, Gemini, and Perplexity to find service providers instead of Googling.",
        "author": { "@type": "Organization", "name": "Apex Prometheus AI" },
        "datePublished": "2026-03",
        "publisher": { "@type": "Organization", "name": "Apex Prometheus" },
        "url": `${SITE_URL}/blog/aeo-for-service-businesses`
      },
      content: `
        <header><nav aria-label="Main navigation"><a href="/">APEX PROMETHEUS</a><a href="/blog">Blog</a></nav></header>
        <main>
          <article>
            <a href="/blog">← Back to Blog</a>
            <p>Apex Prometheus AI — March 2026 — 14 min read</p>
            <h1>Your Customers Are Asking AI for Recommendations — Here's How to Be the Answer</h1>
            <p>People now ask ChatGPT, Gemini, and Perplexity to find service providers instead of Googling. If your business isn't optimized for AI search, you're invisible to a growing channel.</p>

            <p>Something fundamental changed in how people find service providers, and most business owners haven't noticed yet.</p>
            <p>A homeowner needs their house painted. Today, a growing number of them open ChatGPT, Gemini, or Perplexity and type: "Who's the best painting contractor in my area?" The AI doesn't show ten results. It gives one answer. Maybe two.</p>
            <p>If your business isn't that answer, you just lost a customer to a channel you didn't even know existed. Welcome to the world of AEO — Answer Engine Optimization.</p>

            <h2>What Is AEO and Why Does It Matter?</h2>
            <p><strong>AEO (Answer Engine Optimization)</strong> is the practice of structuring your business's online presence so that AI platforms cite and recommend you when users ask for services.</p>
            <p>It's different from SEO in one critical way: Google ranks pages. AI cites statements.</p>
            <ul>
              <li>Is this business mentioned consistently across authoritative sources?</li>
              <li>Does their content directly answer the question the user is asking?</li>
              <li>Do they have structured data that AI can parse easily?</li>
              <li>Are they a verified, legitimate entity?</li>
              <li>Do real people vouch for them?</li>
            </ul>

            <h2>The Scale of the Shift</h2>
            <ul>
              <li>ChatGPT processes over 1 billion queries per week</li>
              <li>Perplexity went from zero to 30 million daily queries in under two years</li>
              <li>Google's AI Overviews appear in 15-60% of searches</li>
              <li>58.5% of Google searches now end without a click to any external website</li>
            </ul>

            <h2>The 7 Pillars of AEO for Service Businesses</h2>
            <h3>1. Claim and Verify Every Business Listing</h3>
            <p>Google Business Profile, Bing Places, Apple Business Connect, Yelp, Angi, HomeAdvisor, BBB, Thumbtack, Houzz.</p>
            <h3>2. Build FAQ Pages That AI Can Extract</h3>
            <p>AI models love the question-and-answer format because it maps directly to how users query them.</p>
            <h3>3. Add Structured Data (JSON-LD Schema Markup)</h3>
            <p>Schema markup translates your content into a language AI models parse natively.</p>
            <h3>4. Create an llms.txt File</h3>
            <p>An emerging standard that provides context about your website specifically for AI models.</p>
            <h3>5. Configure robots.txt for AI Crawlers</h3>
            <p>Make sure you're explicitly allowing: OAI-SearchBot, Claude-SearchBot, PerplexityBot, Google-Extended, MistralAI-User.</p>
            <h3>6. Build Review Volume and Quality</h3>
            <p>Reviews are one of the strongest signals AI models use.</p>
            <h3>7. Write Content in Direct-Answer Format</h3>
            <p>Structure every piece of content: direct answer first, one idea per paragraph, use headers as questions.</p>

            <h2>Frequently Asked Questions</h2>
            <h3>What's the difference between SEO and AEO?</h3>
            <p>SEO optimizes your website to rank in traditional search engine results. AEO optimizes your entire online presence so that AI platforms recommend your business. Both matter.</p>
            <h3>Does AEO replace SEO?</h3>
            <p>No. AEO builds on top of SEO. Think of SEO as the foundation and AEO as an additional floor you build on top.</p>
            <h3>How long does it take for AEO to work?</h3>
            <p>Structured data changes can be indexed within weeks. Content and review improvements take 2-4 months.</p>
          </article>
        </main>
        <footer><p>&copy; 2026 Apex Prometheus. All rights reserved.</p></footer>
      `,
    },

    "/blog/ai-wont-replace-tradespeople": {
      title: "AI Won't Replace Tradespeople — But Tradespeople Who Use AI Will Replace Those Who Don't | Apex Prometheus",
      description: "The trades aren't going away. But the businesses that integrate AI into operations, marketing, and customer service will outcompete those running on pen and paper.",
      keywords: "AI replacing tradespeople, AI for contractors, will AI replace trades, AI and blue collar work, future of trades businesses",
      ogType: "article",
      canonicalPath: "/blog/ai-wont-replace-tradespeople",
      schema: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "AI Won't Replace Tradespeople — But Tradespeople Who Use AI Will Replace Those Who Don't",
        "description": "The trades aren't going away. But the businesses that integrate AI will outcompete those running on pen and paper.",
        "author": { "@type": "Organization", "name": "Apex Prometheus AI" },
        "datePublished": "2026-03",
        "publisher": { "@type": "Organization", "name": "Apex Prometheus" },
        "url": `${SITE_URL}/blog/ai-wont-replace-tradespeople`
      },
      content: `
        <header><nav aria-label="Main navigation"><a href="/">APEX PROMETHEUS</a><a href="/blog">Blog</a></nav></header>
        <main>
          <article>
            <a href="/blog">← Back to Blog</a>
            <p>Apex Prometheus AI — March 2026 — 11 min read</p>
            <h1>AI Won't Replace Tradespeople — But Tradespeople Who Use AI Will Replace Those Who Don't</h1>
            <p>The trades aren't going away. But the businesses that integrate AI into operations, marketing, and customer service will outcompete those running on pen and paper.</p>

            <p>Every time a new wave of technology hits, the same fear surfaces: "Will this replace me?"</p>
            <p>For tradespeople — painters, plumbers, electricians, HVAC techs, roofers, carpenters, general contractors — the answer is straightforward: <strong>No. AI cannot do your job.</strong></p>
            <p>AI can't climb a ladder. It can't diagnose why a furnace is short-cycling by listening to it run. It can't feel whether a wall needs skim coating or just a good sanding.</p>
            <p>But here's the uncomfortable part: AI can do almost everything else in your business. And the companies that let it will crush the ones that don't.</p>

            <h2>The Two Halves of Every Trades Business</h2>
            <p><strong>The craft</strong> — the actual skilled work. This is what AI cannot do.</p>
            <p><strong>The business</strong> — lead generation, estimating, scheduling, customer communication, marketing, invoicing, follow-ups. This is where AI excels.</p>
            <p>AI doesn't replace the tradesperson. AI replaces the chaos.</p>

            <h2>What Changes When a Tradesperson Uses AI</h2>
            <p>That single change — instant response versus next-day callback — can increase lead capture by 30-50%. 78% of customers hire the first business that responds. AI makes you first, every time.</p>

            <h2>The Competitive Reality</h2>
            <p>The craft didn't change. The business game did.</p>

            <h2>The Trades Shortage Makes This More Urgent</h2>
            <p>AI doesn't solve the labor shortage for craft work — you still need skilled hands. But it solves the labor shortage for everything else.</p>

            <h2>Frequently Asked Questions</h2>
            <h3>Is AI actually useful for small trades businesses or is it just hype?</h3>
            <p>It's not hype — it's already working. 68% of US small businesses now use AI regularly.</p>
            <h3>What's the cheapest way to start using AI in a trades business?</h3>
            <p>Start with free tools. ChatGPT's free tier can help write estimates, emails, blog posts, and social media content. Total cost to start: $0.</p>
            <h3>What's the biggest mistake trades businesses make with AI?</h3>
            <p>Trying to do everything at once. Pick one problem and solve it with AI first.</p>
          </article>
        </main>
        <footer><p>&copy; 2026 Apex Prometheus. All rights reserved.</p></footer>
      `,
    },

    "/blog/geo-strategy-trades-businesses-2026": {
      title: "How to Build a GEO Strategy for Your Trades Business in 2026 | Apex Prometheus",
      description: "Your customers aren't Googling anymore. They're asking ChatGPT. Generative Engine Optimization is how you build a GEO strategy that gets AI to recommend your trades business.",
      keywords: "GEO strategy trades businesses, generative engine optimization contractors, AI search optimization blue collar",
      ogType: "article",
      canonicalPath: "/blog/geo-strategy-trades-businesses-2026",
      schema: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "How to Build a GEO Strategy for Your Trades Business in 2026",
        "description": "Generative Engine Optimization is how you build a GEO strategy that gets AI to recommend your trades business.",
        "author": { "@type": "Organization", "name": "Apex Prometheus AI" },
        "datePublished": "2026-03",
        "publisher": { "@type": "Organization", "name": "Apex Prometheus" },
        "url": `${SITE_URL}/blog/geo-strategy-trades-businesses-2026`
      },
      content: `
        <header><nav aria-label="Main navigation"><a href="/">APEX PROMETHEUS</a><a href="/blog">Blog</a></nav></header>
        <main>
          <article>
            <a href="/blog">← Back to Blog</a>
            <p>Apex Prometheus AI — March 2026 — 10 min read</p>
            <h1>How to Build a GEO Strategy for Your Trades Business in 2026</h1>
            <p>Your customers aren't Googling anymore. They're asking ChatGPT. Generative Engine Optimization is how you fix that — and trades businesses that move first will own their markets.</p>

            <p>Your customers aren't Googling anymore. They're asking ChatGPT, "Who's the best plumber near me?" If your business isn't the answer AI gives, you're invisible to a growing share of your market.</p>

            <h2>What Is GEO and Why Should Trades Businesses Care?</h2>
            <p>Generative Engine Optimization is the practice of structuring your business's digital presence so AI systems cite and recommend you.</p>
            <ul>
              <li>37% of consumers now start searches in AI chatbots, bypassing Google entirely</li>
              <li>72% of Google searches end without a click</li>
              <li>Traditional search volume is projected to drop 25% by 2026</li>
              <li>Traffic FROM AI answers converts up to 25x higher than traditional search</li>
            </ul>

            <h2>Step 1: Audit Your AI Visibility (Week 1)</h2>
            <p>Open ChatGPT, Perplexity, and Google AI Overview. Ask about your trade in your city. Record whether you're mentioned.</p>

            <h2>Step 2: Fix Your Foundation — Schema and Structure (Weeks 1-2)</h2>
            <p>AI doesn't read your website the way a customer does. It scans for machine-readable signals — structured data.</p>

            <h2>Step 3: Create Content AI Can Cite (Weeks 2-4)</h2>
            <p>AI systems favor comprehensive, authoritative, well-structured content.</p>

            <h2>Step 4: Build Authority Through Third-Party Citations (Weeks 3-8)</h2>
            <p>95% of AI citations come from non-paid sources, and 89% come from earned media.</p>

            <h2>Step 5: Monitor and Iterate (Ongoing)</h2>
            <p>GEO is not set-and-forget. AI models update regularly.</p>

            <h2>The 90-Day Reality</h2>
            <p>Phase 1: Foundation. Phase 2: Authority. Phase 3: Optimization.</p>

            <h2>Why This Matters NOW — Not Next Year</h2>
            <p>The GEO market is projected to grow from $1.48B to $17B by 2034. Trades businesses that build AI visibility now will be nearly impossible to displace later.</p>
          </article>
        </main>
        <footer><p>&copy; 2026 Apex Prometheus. All rights reserved.</p></footer>
      `,
    },

    "/manifesto": {
      title: "The Blue Collar AI Manifesto | Apex Prometheus",
      description: "The Blue Collar AI Manifesto — Apex Prometheus's founding declaration. AI is the great equalizer for trades businesses. We plant our flags in granite and steel.",
      keywords: "blue collar AI, trades AI manifesto, AI for contractors, Apex Prometheus manifesto, AI equalizer",
      ogType: "article",
      canonicalPath: "/manifesto",
      schema: {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "The Blue Collar AI Manifesto",
        "description": "Apex Prometheus's founding declaration. AI is the great equalizer for trades businesses.",
        "author": { "@type": "Person", "name": "Stan 'Slao' LoMonaco" },
        "datePublished": "2026",
        "publisher": { "@type": "Organization", "name": "Apex Prometheus" },
        "url": `${SITE_URL}/manifesto`
      },
      content: `
        <header><nav aria-label="Main navigation"><a href="/">APEX PROMETHEUS</a></nav></header>
        <main>
          <article>
            <a href="/">← Back to Home</a>
            <p>Stan 'Slao' LoMonaco, Founder — 2026</p>
            <h1>The Blue Collar AI Manifesto</h1>
            <p>A declaration from the trades — we won't let AI take us over. We will take AI over.</p>

            <p>The aim in blue collar trade business is the leverage that we take back — that had been sold to us for too many years, earning away at our hard earned margins while "coders" and "programmers" build the rails our businesses run on and our customers and clients find us.</p>
            <p>No longer will the plumber, carpenter, electrician, painter and handymen be held hostage and have a piece of our business and livelihood taken away by those who provide a nominal yet vital service in the years past — such as bookkeeping, lead generating and tracking, marketing, scheduling and so on.</p>
            <p><strong>If it's here for the taking, we want it — and our lives depend on it.</strong></p>
            <p>Oh no — those of us who made the choices to work our asses off while the many partying in college and learned white collar jobs now find themselves feeling what we felt over the many industrial cycles that hit our fields.</p>
            <p><strong>AI is the great equalizer</strong> — and the college education that we knew we didn't need to make a living and feed our families when we had no choice but to bet on ourselves and the talents we inherited by waking up with the moon and pushing and shoving our way through the economies good and bad.</p>
            <p>We know what the future AI brings to us and the utility that it provides for a fraction of the cost of the past.</p>
            <blockquote><p><strong>We are here to plant our flags in granite and steel. We are the adaptive sector. We are the strong arm. And we are the trades business.</strong></p></blockquote>
            <blockquote><p><strong>We won't let AI take us over — instead, we will take AI over.</strong></p></blockquote>
            <p><em>— The Apex Prometheus AI Manifesto. Written by Stan "Slao" LoMonaco, Founder</em></p>
          </article>
        </main>
        <footer><p>&copy; 2026 Apex Prometheus. All rights reserved.</p></footer>
      `,
    },

    "/whitepaper": {
      title: "The AI Discovery Shift — Whitepaper | Apex Prometheus",
      description: "AI systems are mediating how people find services online. Traditional SEO is necessary but no longer sufficient. Learn about Answer Engine Optimization (AEO) and the Apex Prometheus 5-Pillar Framework.",
      keywords: "AEO whitepaper, answer engine optimization, AI discovery, SEO vs AEO, AI search optimization, Apex Prometheus framework",
      ogType: "article",
      canonicalPath: "/whitepaper",
      schema: {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "The AI Discovery Shift",
        "description": "Why Traditional SEO Is No Longer Enough — and How Answer Engine Optimization Changes Everything for Service Businesses",
        "author": { "@type": "Organization", "name": "Apex Prometheus" },
        "datePublished": "2026-03",
        "publisher": { "@type": "Organization", "name": "Apex Prometheus" },
        "url": `${SITE_URL}/whitepaper`
      },
      content: `
        <header><nav aria-label="Main navigation"><a href="/">APEX PROMETHEUS</a><a href="/blog">Blog</a></nav></header>
        <main>
          <article>
            <a href="/blog">← Back to Blog</a>
            <p>Apex Prometheus — March 2026 — 5 min read</p>
            <h1>The AI Discovery Shift</h1>
            <p>Why Traditional SEO Is No Longer Enough — and How Answer Engine Optimization Changes Everything for Service Businesses</p>

            <h2>Executive Summary</h2>
            <p>Digital discovery is entering a new phase. AI systems are increasingly mediating how people find information, services, and companies online. Traditional SEO remains necessary, but it is no longer sufficient. This new discipline is known as <strong>Answer Engine Optimization (AEO)</strong>.</p>

            <h2>The Compression Effect</h2>
            <p>Traditional search shows approximately 100 results per query. AI recommends only 2-3 sources. Sometimes just one. In AI search, you either are the answer or you don't exist. There is no page two.</p>

            <h2>The Apex Prometheus Framework — 5 Pillars</h2>
            <h3>Pillar 1: AI Crawlability</h3>
            <p>Ensuring AI systems can access and interpret your website content. This includes proper robots.txt configuration for AI crawlers, fast page load times, clean HTML structure, and an llms.txt file.</p>
            <h3>Pillar 2: Structured Data</h3>
            <p>Implementing schema markup and machine-readable signals that AI can parse natively.</p>
            <h3>Pillar 3: Answer-Based Content</h3>
            <p>Structuring information around common user questions using the BLUF (Bottom Line Up Front) format.</p>
            <h3>Pillar 4: Authority Signals</h3>
            <p>95% of AI citations come from non-paid sources, and 89% come from earned media.</p>
            <h3>Pillar 5: AI Visibility Monitoring</h3>
            <p>Tracking how AI systems reference and recommend your business over time.</p>

            <h2>Why This Matters for Service Businesses</h2>
            <p>The businesses that build AI visibility now will be nearly impossible to displace later. The GEO market is projected to grow from $1.48 billion to $17 billion by 2034.</p>

            <h2>The Bottom Line</h2>
            <p><strong>Your next customer is asking AI for a recommendation right now.</strong> The only question is whether AI recommends you — or your competitor.</p>
            <p>Apex Prometheus helps service businesses become the answer AI gives.</p>
          </article>
        </main>
        <footer><p>&copy; 2026 Apex Prometheus. All rights reserved.</p></footer>
      `,
    },
  };
}

function buildFullHtml(page: PageMeta): string {
  const canonicalUrl = `${SITE_URL}${page.canonicalPath}`;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.description)}">
  <meta name="keywords" content="${escapeHtml(page.keywords)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Open Graph -->
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(page.description)}">
  <meta property="og:type" content="${page.ogType}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="${SITE_NAME}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(page.title)}">
  <meta name="twitter:description" content="${escapeHtml(page.description)}">

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">${JSON.stringify(page.schema)}</script>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">

  <style>
    body { font-family: 'Rajdhani', sans-serif; background: #0a0a0f; color: #e0e0ec; margin: 0; padding: 0; line-height: 1.6; }
    a { color: #00e5ff; }
    h1, h2, h3 { font-family: 'Orbitron', sans-serif; }
    main { max-width: 900px; margin: 0 auto; padding: 2rem; }
    nav { padding: 1rem 2rem; }
    footer { padding: 2rem; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 3rem; }
    ul, ol { padding-left: 1.5rem; }
    blockquote { border-left: 3px solid #ff6b00; padding: 1rem 1.5rem; margin: 1.5rem 0; }
    address { font-style: normal; }
  </style>
</head>
<body>
  <div id="root">
    ${page.content}
  </div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Express middleware that intercepts crawler requests and serves pre-rendered HTML.
 * Must be registered BEFORE the Vite/static file middleware.
 */
export function seoPrerender(req: Request, res: Response, next: NextFunction): void {
  const userAgent = req.headers["user-agent"] || "";
  
  // Only intercept for crawlers
  if (!isCrawler(userAgent)) {
    return next();
  }

  // Skip API routes, static assets, etc.
  const url = req.path;
  if (url.startsWith("/api/") || url.startsWith("/src/") || url.startsWith("/node_modules/") || url.includes(".")) {
    return next();
  }

  const pages = getPages();
  const page = pages[url];

  if (!page) {
    return next();
  }

  console.log(`[SEO] Serving pre-rendered HTML for crawler: ${userAgent.substring(0, 50)}... → ${url}`);
  
  const html = buildFullHtml(page);
  res.status(200).set({ "Content-Type": "text/html; charset=utf-8" }).end(html);
}

/**
 * Also serve pre-rendered HTML when ?_escaped_fragment_ is present (legacy AJAX crawling)
 * or when explicitly requested via ?prerender=true (for testing)
 */
export function seoPrerenderTest(req: Request, res: Response, next: NextFunction): void {
  const url = req.path;
  
  // Allow testing with ?prerender=true query param
  if (req.query.prerender !== "true" && req.query._escaped_fragment_ === undefined) {
    return next();
  }

  // Skip API routes, static assets
  if (url.startsWith("/api/") || url.startsWith("/src/") || url.includes(".")) {
    return next();
  }

  const pages = getPages();
  const page = pages[url];

  if (!page) {
    return next();
  }

  console.log(`[SEO] Serving pre-rendered HTML (test mode) → ${url}`);
  
  const html = buildFullHtml(page);
  res.status(200).set({ "Content-Type": "text/html; charset=utf-8" }).end(html);
}
