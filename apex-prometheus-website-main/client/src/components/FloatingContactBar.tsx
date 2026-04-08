import { useState } from "react";

interface ContactConfig {
  phone: string;
  telegram?: string;
  whatsapp?: string;
}

const defaultConfig: ContactConfig = {
  phone: "+17186031726",
  telegram: "https://t.me/ApexPrometheus", // Update with real Telegram link
  whatsapp: "+17186031726",
};

export default function FloatingContactBar({ config = defaultConfig }: { config?: ContactConfig }) {
  const [expanded, setExpanded] = useState(false);

  const buttons = [
    {
      label: "Call",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      href: `tel:${config.phone}`,
      color: "#00e5ff",
      glowColor: "rgba(0,229,255,0.4)",
    },
    {
      label: "Text",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      href: `sms:${config.phone}`,
      color: "#00e5ff",
      glowColor: "rgba(0,229,255,0.4)",
    },
    {
      label: "Telegram",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
      href: config.telegram || "#",
      color: "#29b6f6",
      glowColor: "rgba(41,182,246,0.4)",
    },
    {
      label: "WhatsApp",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
      ),
      href: `https://wa.me/${config.whatsapp?.replace(/[^0-9]/g, "")}`,
      color: "#25d366",
      glowColor: "rgba(37,211,102,0.4)",
    },
  ];

  return (
    <>
      <div className={`fcb-container ${expanded ? "fcb-expanded" : ""}`}>
        {/* Expand/collapse toggle */}
        <button
          className="fcb-toggle"
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? "Close contact options" : "Open contact options"}
        >
          {expanded ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          )}
        </button>

        {/* Contact buttons */}
        <div className="fcb-buttons">
          {buttons.map((btn, i) => (
            <a
              key={btn.label}
              href={btn.href}
              target={btn.label === "Telegram" || btn.label === "WhatsApp" ? "_blank" : undefined}
              rel={btn.label === "Telegram" || btn.label === "WhatsApp" ? "noopener noreferrer" : undefined}
              className="fcb-btn"
              style={{
                "--btn-color": btn.color,
                "--btn-glow": btn.glowColor,
                transitionDelay: expanded ? `${i * 60}ms` : `${(buttons.length - i) * 30}ms`,
              } as React.CSSProperties}
              aria-label={btn.label}
            >
              <span className="fcb-btn-icon">{btn.icon}</span>
              <span className="fcb-btn-label">{btn.label}</span>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .fcb-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
          display: flex;
          flex-direction: column-reverse;
          align-items: flex-end;
          gap: 10px;
        }

        .fcb-toggle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: 1px solid rgba(0, 229, 255, 0.3);
          background: rgba(10, 10, 15, 0.95);
          backdrop-filter: blur(20px);
          color: #00e5ff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 229, 255, 0.15);
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          animation: fcbPulse 3s ease-in-out infinite;
        }

        .fcb-toggle:hover {
          border-color: rgba(0, 229, 255, 0.6);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 229, 255, 0.3);
          transform: scale(1.05);
        }

        .fcb-expanded .fcb-toggle {
          background: rgba(255, 107, 0, 0.15);
          border-color: rgba(255, 107, 0, 0.4);
          color: #ff6b00;
          animation: none;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 107, 0, 0.2);
        }

        @keyframes fcbPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 229, 255, 0.15); }
          50% { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 229, 255, 0.3), 0 0 60px rgba(255, 107, 0, 0.1); }
        }

        .fcb-buttons {
          display: flex;
          flex-direction: column-reverse;
          gap: 8px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .fcb-expanded .fcb-buttons {
          pointer-events: auto;
          opacity: 1;
        }

        .fcb-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px 10px 12px;
          background: rgba(10, 10, 15, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 28px;
          color: var(--btn-color, #00e5ff);
          text-decoration: none;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
          transform: translateY(10px) scale(0.95);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .fcb-expanded .fcb-btn {
          transform: translateY(0) scale(1);
          opacity: 1;
        }

        .fcb-btn:hover {
          border-color: var(--btn-color, #00e5ff);
          box-shadow: 0 0 20px var(--btn-glow, rgba(0, 229, 255, 0.3));
          transform: translateX(-4px) scale(1.02);
          background: rgba(10, 10, 15, 0.98);
        }

        .fcb-btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.04);
          flex-shrink: 0;
        }

        .fcb-btn-label {
          padding-right: 4px;
        }

        @media (max-width: 600px) {
          .fcb-container {
            bottom: 16px;
            right: 16px;
          }
          .fcb-toggle {
            width: 50px;
            height: 50px;
          }
          .fcb-btn {
            padding: 8px 14px 8px 10px;
            font-size: 0.7rem;
          }
          .fcb-btn-icon {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </>
  );
}
