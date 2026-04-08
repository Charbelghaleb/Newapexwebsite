# Apex Prometheus Website - Updated Source Code

**Version:** 2.0.0  
**Updated:** March 19, 2026  
**New Feature:** AI Visibility Score Lead Magnet Tool

---

## What's New

### AI Visibility Score Tool (`/ai-visibility-score`)
A fully integrated lead generation tool that:
- Captures business info (name, website, industry, location)
- Gates results behind email capture
- Runs AI-powered diagnostic via Claude API
- Displays animated results dashboard with:
  - Overall AI Visibility Score (0-100)
  - Category breakdown (AI Visibility, Local SEO, Website, Reviews, Content)
  - Platform-specific scores (ChatGPT, Perplexity, Google AI)
  - Issues found + recommended fixes
- Drives to booking page CTA

### Homepage Updates
- Added "Free AI Score" link in navigation (highlighted in fire orange)
- Added AI Score CTA section between Problem and Services sections
- Animated visual with spinning ring and pulsing button

### Navigation Updates
- "Free AI Score" link added to both desktop and mobile navigation
- Styled as highlighted call-to-action (orange color, stands out)

### Blog Updates
- Added inline CTA banner to AEO article (most relevant content)
- Promotes the AI Score tool contextually

### SEO/AEO Updates
- `sitemap.xml` updated with new page (priority 0.95)
- `llms.txt` updated with tool description for AI crawlers
- Schema markup added to tool page (WebApplication type)
- Meta tags optimized for "AI visibility score" keywords

---

## Deployment Instructions

### Option 1: Same Hosting (Recommended)
1. Replace the existing `churchill-integrated` folder contents
2. Run `npm install` (no new dependencies)
3. Run `npm run build`
4. Deploy the `dist` folder

### Option 2: Fresh Deploy
1. Unzip to your server
2. `cd churchill-integrated`
3. `npm install`
4. `npm run build`
5. Serve the `dist` folder

### Environment
- Node.js 18+ required
- No new environment variables needed
- Claude API is called client-side (API key handled by Anthropic)

---

## Files Changed

```
ADDED:
├── client/src/pages/AIVisibilityScore.tsx    # New tool page

MODIFIED:
├── client/src/App.tsx                        # Added route
├── client/src/components/Layout.tsx          # Added nav link + styles
├── client/src/pages/Home.tsx                 # Added nav link + CTA section
├── client/src/pages/BlogArticle2.tsx         # Added inline CTA
├── client/public/sitemap.xml                 # Added new page
├── client/public/llms.txt                    # Added tool description
```

---

## Lead Capture Integration

The tool captures email before showing results. To connect to your CRM:

### Option A: Webhook (Recommended)
Add fetch call in `AIVisibilityScore.tsx` after email validation:

```javascript
// In runDiagnostic function, after validateEmail()
await fetch('YOUR_WEBHOOK_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email,
    businessName: formData.businessName,
    website: formData.website,
    industry: formData.industry,
    location: formData.location,
    timestamp: new Date().toISOString()
  })
});
```

### Option B: Zapier
Use Zapier's webhook trigger to capture leads and route to your CRM.

### Option C: Form Backend Service
Services like Formspree, Basin, or Netlify Forms can capture submissions.

---

## SEO Keywords Targeted

Primary:
- AI visibility score
- AI visibility test
- ChatGPT business visibility
- digital presence test

Secondary:
- AEO audit
- Perplexity recommendations
- answer engine optimization
- AI search optimization

---

## Testing

1. Visit `/ai-visibility-score`
2. Fill out Step 1 (business info)
3. Enter email in Step 2
4. Watch scanning animation
5. Review results dashboard
6. Click CTA to booking page

---

## Support

Questions? Contact info@apexprometheus.ai
