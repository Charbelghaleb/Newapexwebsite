# Critical SEO Fixes for apexprometheus.ai

## Priority 1 — SSR/Pre-rendering for Search Engines
- [x] Assess current project structure and all routes
- [x] Implement server-side rendering or pre-rendering so crawlers get full HTML
- [x] Verify every page returns full content (not empty div#root shell)
- [x] Pages to verify: homepage, blog listing, 4 blog articles, manifesto, whitepaper

## Priority 2 — Logo Fix
- [x] Identify and remove Claude logo reference (claude-logo_7063f369.png)
- [x] Replace with proper Apex Prometheus animated flame SVG logo
- [x] Verify no Claude branding remains anywhere on the site

## Priority 3 — Sitemap and robots.txt
- [x] Create/verify sitemap.xml listing all pages
- [x] Create/verify robots.txt allowing all crawlers
- [x] Add meta robots "index, follow" to every page
- [x] Verify sitemap.xml and robots.txt are accessible via curl
- [x] Create llms.txt for AI crawlers

## Final
- [x] Test all pages with curl confirming full HTML content
- [x] Write vitest tests for SEO pre-rendering (15 tests passing)
- [ ] Publish updated site
