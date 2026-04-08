import ArticlePage from "@/components/ArticlePage";

export default function Manifesto() {
  return (
    <ArticlePage
      title="The Blue Collar AI Manifesto"
      subtitle="A declaration from the trades — we won't let AI take us over. We will take AI over."
      author="Stan 'Slao' LoMonaco, Founder"
      date="2026"
      metaDescription="The Blue Collar AI Manifesto — Apex Prometheus's founding declaration. AI is the great equalizer for trades businesses. We plant our flags in granite and steel."
      metaKeywords="blue collar AI, trades AI manifesto, AI for contractors, Apex Prometheus manifesto, AI equalizer"
      backLink="/"
      backLabel="← Back to Home"
    >
      <div className="manifesto-content">
        <p>The aim in blue collar trade business is the leverage that we take back — that had been sold to us for too many years, earning away at our hard earned margins while "coders" and "programmers" build the rails our businesses run on and our customers and clients find us.</p>

        <p>No longer will the plumber, carpenter, electrician, painter and handymen be held hostage and have a piece of our business and livelihood taken away by those who provide a nominal yet vital service in the years past — such as bookkeeping, lead generating and tracking, marketing, scheduling and so on.</p>

        <p><strong>If it's here for the taking, we want it — and our lives depend on it.</strong></p>

        <p>Oh no — those of us who made the choices to work our asses off while the many partying in college and learned white collar jobs now find themselves feeling what we felt over the many industrial cycles that hit our fields.</p>

        <p><strong>AI is the great equalizer</strong> — and the college education that we knew we didn't need to make a living and feed our families when we had no choice but to bet on ourselves and the talents we inherited by waking up with the moon and pushing and shoving our way through the economies good and bad.</p>

        <p>We know what the future AI brings to us and the utility that it provides for a fraction of the cost of the past.</p>

        <blockquote>
          <p><strong>We are here to plant our flags in granite and steel. We are the adaptive sector. We are the strong arm. And we are the trades business.</strong></p>
        </blockquote>

        <blockquote>
          <p><strong>We won't let AI take us over — instead, we will take AI over.</strong></p>
        </blockquote>

        <hr />

        <p style={{ fontStyle: "italic", color: "var(--text-dim)" }}>— The Apex Prometheus AI Manifesto<br />Written by Stan "Slao" LoMonaco, Founder</p>
      </div>

      <style>{`
        .manifesto-content p{font-size:1.15rem;line-height:1.9;margin-bottom:1.5rem}
        .manifesto-content blockquote{border-left:3px solid var(--fire);padding:1.5rem 2rem;margin:2rem 0;background:var(--panel);clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))}
        .manifesto-content blockquote p{font-size:1.3rem;font-weight:600;color:var(--text);margin-bottom:0;font-style:normal;line-height:1.6}
      `}</style>
    </ArticlePage>
  );
}
