/**
 * Design Elements for Apex Prometheus
 * Enhanced: Standalone circular flame, workflow background graphics, breathing animation
 * Brand: Cyan (#00BFFF) + Orange (#FFA500) on Dark (#0D0D0D)
 */

import { useEffect, useRef, useState } from "react";

/* ── Grain Texture Overlay ── */
export function GrainTexture() {
  return (
    <svg
      className="fixed inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay z-[9999]"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" result="noise" seed="3" />
        <feColorMatrix in="noise" type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}

/* ── Standalone Flame Logo — Circular, no square box ── */
export function AnimatedFireLogo({ src, size = "lg", className = "" }: { src: string; size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  const sizes = {
    sm: { img: "w-10 h-10", outer: "w-14 h-14", glow: "w-20 h-20" },
    md: { img: "w-16 h-16", outer: "w-20 h-20", glow: "w-28 h-28" },
    lg: { img: "w-28 h-28 md:w-36 md:h-36", outer: "w-32 h-32 md:w-40 md:h-40", glow: "w-40 h-40 md:w-52 md:h-52" },
    xl: { img: "w-40 h-40 md:w-52 md:h-52", outer: "w-44 h-44 md:w-56 md:h-56", glow: "w-56 h-56 md:w-72 md:h-72" },
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Outermost ambient glow — breathing */}
      <div
        className={`absolute ${sizes[size].glow} rounded-full animate-flame-breathe`}
        style={{
          background: "radial-gradient(circle, rgba(255,165,0,0.12) 0%, rgba(0,191,255,0.06) 40%, transparent 70%)",
        }}
      />
      {/* Rotating conic glow ring */}
      <div
        className={`absolute ${sizes[size].outer} rounded-full animate-spin-slow`}
        style={{
          background: "conic-gradient(from 0deg, transparent 0%, rgba(0,191,255,0.12) 15%, transparent 30%, rgba(255,165,0,0.1) 50%, transparent 65%, rgba(0,191,255,0.08) 80%, transparent 100%)",
        }}
      />
      {/* The flame image — circular clip, flicker animation */}
      <img
        src={src}
        alt="Apex Prometheus"
        className={`${sizes[size].img} relative z-10 rounded-full animate-flame-flicker object-cover`}
        style={{
          filter: "drop-shadow(0 0 30px rgba(255, 165, 0, 0.35)) drop-shadow(0 0 60px rgba(0, 191, 255, 0.2))",
        }}
      />
    </div>
  );
}

/* ── Scroll Reveal Hook ── */
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(el); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

/* ── Scroll Reveal Wrapper ── */
export function ScrollReveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Floating Particles Background ── */
export function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-particle"
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: i % 3 === 0 ? "rgba(255, 165, 0, 0.4)" : "rgba(0, 191, 255, 0.3)",
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${Math.random() * 6 + 6}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Workflow Background Graphics — automation mockups flowing behind hero ── */
export function WorkflowBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Flowing data line gradient */}
          <linearGradient id="flowGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0,191,255,0)" />
            <stop offset="40%" stopColor="rgba(0,191,255,0.15)" />
            <stop offset="60%" stopColor="rgba(0,191,255,0.15)" />
            <stop offset="100%" stopColor="rgba(0,191,255,0)" />
          </linearGradient>
          <linearGradient id="flowGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,165,0,0)" />
            <stop offset="40%" stopColor="rgba(255,165,0,0.1)" />
            <stop offset="60%" stopColor="rgba(255,165,0,0.1)" />
            <stop offset="100%" stopColor="rgba(255,165,0,0)" />
          </linearGradient>
          {/* Pulse dot */}
          <radialGradient id="nodeDot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,191,255,0.6)" />
            <stop offset="100%" stopColor="rgba(0,191,255,0)" />
          </radialGradient>
          <radialGradient id="nodeOrange" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,165,0,0.5)" />
            <stop offset="100%" stopColor="rgba(255,165,0,0)" />
          </radialGradient>
        </defs>

        {/* ── Left side workflow lines ── */}
        {/* Horizontal connector lines */}
        <line x1="0" y1="25%" x2="30%" y2="25%" stroke="url(#flowGrad1)" strokeWidth="1" className="animate-flow-left" />
        <line x1="0" y1="45%" x2="25%" y2="45%" stroke="url(#flowGrad2)" strokeWidth="1" className="animate-flow-left-slow" />
        <line x1="0" y1="65%" x2="28%" y2="65%" stroke="url(#flowGrad1)" strokeWidth="1" className="animate-flow-left-delay" />

        {/* Vertical connector segments */}
        <line x1="20%" y1="25%" x2="20%" y2="45%" stroke="rgba(0,191,255,0.08)" strokeWidth="1" strokeDasharray="4 8" className="animate-dash-down" />
        <line x1="22%" y1="45%" x2="22%" y2="65%" stroke="rgba(255,165,0,0.06)" strokeWidth="1" strokeDasharray="4 8" className="animate-dash-down-slow" />

        {/* Node dots on left */}
        <circle cx="15%" cy="25%" r="4" fill="url(#nodeDot)" className="animate-node-pulse" />
        <circle cx="20%" cy="45%" r="3" fill="url(#nodeOrange)" className="animate-node-pulse-delay" />
        <circle cx="18%" cy="65%" r="4" fill="url(#nodeDot)" className="animate-node-pulse-slow" />

        {/* ── Right side workflow lines ── */}
        <line x1="70%" y1="30%" x2="100%" y2="30%" stroke="url(#flowGrad1)" strokeWidth="1" className="animate-flow-right" />
        <line x1="75%" y1="50%" x2="100%" y2="50%" stroke="url(#flowGrad2)" strokeWidth="1" className="animate-flow-right-slow" />
        <line x1="72%" y1="70%" x2="100%" y2="70%" stroke="url(#flowGrad1)" strokeWidth="1" className="animate-flow-right-delay" />

        {/* Vertical connector segments right */}
        <line x1="80%" y1="30%" x2="80%" y2="50%" stroke="rgba(0,191,255,0.08)" strokeWidth="1" strokeDasharray="4 8" className="animate-dash-down" />
        <line x1="78%" y1="50%" x2="78%" y2="70%" stroke="rgba(255,165,0,0.06)" strokeWidth="1" strokeDasharray="4 8" className="animate-dash-down-slow" />

        {/* Node dots on right */}
        <circle cx="85%" cy="30%" r="4" fill="url(#nodeDot)" className="animate-node-pulse-delay" />
        <circle cx="80%" cy="50%" r="3" fill="url(#nodeOrange)" className="animate-node-pulse" />
        <circle cx="82%" cy="70%" r="4" fill="url(#nodeDot)" className="animate-node-pulse-slow" />

        {/* ── Workflow box mockups — left side ── */}
        <rect x="5%" y="20%" width="8%" height="3.5%" rx="2" fill="rgba(0,191,255,0.04)" stroke="rgba(0,191,255,0.1)" strokeWidth="0.5" className="animate-box-fade" />
        <rect x="5%" y="40%" width="10%" height="3.5%" rx="2" fill="rgba(255,165,0,0.03)" stroke="rgba(255,165,0,0.08)" strokeWidth="0.5" className="animate-box-fade-delay" />
        <rect x="5%" y="60%" width="9%" height="3.5%" rx="2" fill="rgba(0,191,255,0.04)" stroke="rgba(0,191,255,0.1)" strokeWidth="0.5" className="animate-box-fade-slow" />

        {/* ── Workflow box mockups — right side ── */}
        <rect x="87%" y="25%" width="8%" height="3.5%" rx="2" fill="rgba(0,191,255,0.04)" stroke="rgba(0,191,255,0.1)" strokeWidth="0.5" className="animate-box-fade-delay" />
        <rect x="87%" y="45%" width="10%" height="3.5%" rx="2" fill="rgba(255,165,0,0.03)" stroke="rgba(255,165,0,0.08)" strokeWidth="0.5" className="animate-box-fade" />
        <rect x="87%" y="65%" width="9%" height="3.5%" rx="2" fill="rgba(0,191,255,0.04)" stroke="rgba(0,191,255,0.1)" strokeWidth="0.5" className="animate-box-fade-slow" />

        {/* ── Data flow pulses — small dots traveling along paths ── */}
        <circle r="2" fill="#00BFFF" opacity="0.7">
          <animateMotion dur="4s" repeatCount="indefinite" path="M 0,150 L 300,150" />
          <animate attributeName="opacity" values="0;0.7;0.7;0" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle r="2" fill="#FFA500" opacity="0.5">
          <animateMotion dur="5s" repeatCount="indefinite" path="M 0,300 L 250,300" />
          <animate attributeName="opacity" values="0;0.5;0.5;0" dur="5s" repeatCount="indefinite" />
        </circle>
        <circle r="2" fill="#00BFFF" opacity="0.7">
          <animateMotion dur="4.5s" repeatCount="indefinite" path="M 900,200 L 1200,200" />
          <animate attributeName="opacity" values="0;0.7;0.7;0" dur="4.5s" repeatCount="indefinite" />
        </circle>
        <circle r="2" fill="#FFA500" opacity="0.5">
          <animateMotion dur="5.5s" repeatCount="indefinite" path="M 850,350 L 1200,350" />
          <animate attributeName="opacity" values="0;0.5;0.5;0" dur="5.5s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* ── Floating workflow labels ── */}
      <div className="absolute left-[3%] top-[18%] animate-label-float hidden md:block">
        <div className="px-2 py-1 rounded-sm border border-[#00BFFF]/10 bg-[#00BFFF]/[0.03] font-mono text-[9px] tracking-widest text-[#00BFFF]/30">
          CRM_SYNC
        </div>
      </div>
      <div className="absolute left-[4%] top-[38%] animate-label-float-delay hidden md:block">
        <div className="px-2 py-1 rounded-sm border border-[#FFA500]/10 bg-[#FFA500]/[0.03] font-mono text-[9px] tracking-widest text-[#FFA500]/25">
          AUTO_INVOICE
        </div>
      </div>
      <div className="absolute left-[3%] top-[58%] animate-label-float-slow hidden md:block">
        <div className="px-2 py-1 rounded-sm border border-[#00BFFF]/10 bg-[#00BFFF]/[0.03] font-mono text-[9px] tracking-widest text-[#00BFFF]/30">
          AI_AGENT_01
        </div>
      </div>

      <div className="absolute right-[3%] top-[23%] animate-label-float-delay hidden md:block">
        <div className="px-2 py-1 rounded-sm border border-[#00BFFF]/10 bg-[#00BFFF]/[0.03] font-mono text-[9px] tracking-widest text-[#00BFFF]/30">
          DATA_PIPELINE
        </div>
      </div>
      <div className="absolute right-[4%] top-[43%] animate-label-float hidden md:block">
        <div className="px-2 py-1 rounded-sm border border-[#FFA500]/10 bg-[#FFA500]/[0.03] font-mono text-[9px] tracking-widest text-[#FFA500]/25">
          WORKFLOW_02
        </div>
      </div>
      <div className="absolute right-[3%] top-[63%] animate-label-float-slow hidden md:block">
        <div className="px-2 py-1 rounded-sm border border-[#00BFFF]/10 bg-[#00BFFF]/[0.03] font-mono text-[9px] tracking-widest text-[#00BFFF]/30">
          LEAN_OPS
        </div>
      </div>
    </div>
  );
}

/* ── Animated Counter ── */
export function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <span ref={ref} className={isVisible ? "animate-count-up" : "opacity-0"}>
      {target}{suffix}
    </span>
  );
}

/* ── All Animation Styles ── */
export function AnimationStyles() {
  return (
    <style>{`
      /* ── Flame breathing — subtle scale pulse, no bouncing ── */
      @keyframes flameBreath {
        0%, 100% {
          transform: scale(1);
          filter: drop-shadow(0 0 30px rgba(255,165,0,0.35)) drop-shadow(0 0 60px rgba(0,191,255,0.2));
        }
        50% {
          transform: scale(1.04);
          filter: drop-shadow(0 0 40px rgba(255,165,0,0.5)) drop-shadow(0 0 80px rgba(0,191,255,0.3));
        }
      }
      .animate-flame-breathe {
        animation: flameBreath 3s ease-in-out infinite;
      }

      /* ── Flame flicker — subtle brightness/scale oscillation ── */
      @keyframes flameFlicker {
        0%, 100% {
          transform: scale(1);
          filter: drop-shadow(0 0 30px rgba(255,165,0,0.35)) drop-shadow(0 0 60px rgba(0,191,255,0.2)) brightness(1);
        }
        25% {
          transform: scale(1.015);
          filter: drop-shadow(0 0 35px rgba(255,165,0,0.45)) drop-shadow(0 0 70px rgba(0,191,255,0.25)) brightness(1.05);
        }
        50% {
          transform: scale(1.03);
          filter: drop-shadow(0 0 40px rgba(255,165,0,0.5)) drop-shadow(0 0 80px rgba(0,191,255,0.3)) brightness(1.08);
        }
        75% {
          transform: scale(1.01);
          filter: drop-shadow(0 0 32px rgba(255,165,0,0.4)) drop-shadow(0 0 65px rgba(0,191,255,0.22)) brightness(1.02);
        }
      }
      .animate-flame-flicker {
        animation: flameFlicker 2.5s ease-in-out infinite;
      }

      /* Slow spin for conic gradient */
      .animate-spin-slow {
        animation: spin 15s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* ── Workflow flow lines ── */
      @keyframes flowLeft {
        0% { opacity: 0; stroke-dashoffset: 200; }
        30% { opacity: 1; }
        70% { opacity: 1; }
        100% { opacity: 0; stroke-dashoffset: 0; }
      }
      .animate-flow-left { stroke-dasharray: 200; animation: flowLeft 6s ease-in-out infinite; }
      .animate-flow-left-slow { stroke-dasharray: 200; animation: flowLeft 8s ease-in-out infinite; animation-delay: 1s; }
      .animate-flow-left-delay { stroke-dasharray: 200; animation: flowLeft 7s ease-in-out infinite; animation-delay: 2s; }

      @keyframes flowRight {
        0% { opacity: 0; stroke-dashoffset: -200; }
        30% { opacity: 1; }
        70% { opacity: 1; }
        100% { opacity: 0; stroke-dashoffset: 0; }
      }
      .animate-flow-right { stroke-dasharray: 200; animation: flowRight 6s ease-in-out infinite; animation-delay: 0.5s; }
      .animate-flow-right-slow { stroke-dasharray: 200; animation: flowRight 8s ease-in-out infinite; animation-delay: 1.5s; }
      .animate-flow-right-delay { stroke-dasharray: 200; animation: flowRight 7s ease-in-out infinite; animation-delay: 2.5s; }

      /* ── Dashed line crawl ── */
      @keyframes dashDown {
        0% { stroke-dashoffset: 24; }
        100% { stroke-dashoffset: 0; }
      }
      .animate-dash-down { animation: dashDown 3s linear infinite; }
      .animate-dash-down-slow { animation: dashDown 4s linear infinite; animation-delay: 1s; }

      /* ── Node pulse ── */
      @keyframes nodePulse {
        0%, 100% { r: 3; opacity: 0.4; }
        50% { r: 5; opacity: 0.8; }
      }
      .animate-node-pulse { animation: nodePulse 3s ease-in-out infinite; }
      .animate-node-pulse-delay { animation: nodePulse 3s ease-in-out infinite; animation-delay: 1s; }
      .animate-node-pulse-slow { animation: nodePulse 4s ease-in-out infinite; animation-delay: 2s; }

      /* ── Workflow box fade ── */
      @keyframes boxFade {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.7; }
      }
      .animate-box-fade { animation: boxFade 5s ease-in-out infinite; }
      .animate-box-fade-delay { animation: boxFade 5s ease-in-out infinite; animation-delay: 1.5s; }
      .animate-box-fade-slow { animation: boxFade 6s ease-in-out infinite; animation-delay: 3s; }

      /* ── Floating labels ── */
      @keyframes labelFloat {
        0%, 100% { transform: translateY(0); opacity: 0.5; }
        50% { transform: translateY(-6px); opacity: 0.8; }
      }
      .animate-label-float { animation: labelFloat 5s ease-in-out infinite; }
      .animate-label-float-delay { animation: labelFloat 6s ease-in-out infinite; animation-delay: 1.5s; }
      .animate-label-float-slow { animation: labelFloat 7s ease-in-out infinite; animation-delay: 3s; }

      /* Floating particles */
      @keyframes particleFloat {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-120px) translateX(30px); opacity: 0; }
      }
      .animate-particle {
        animation: particleFloat 8s ease-in-out infinite;
      }

      /* Fade up */
      @keyframes fadeUpIn {
        from { opacity: 0; transform: translateY(32px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-up {
        animation: fadeUpIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
      }

      /* Slide in left */
      @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-40px); }
        to { opacity: 1; transform: translateX(0); }
      }
      .animate-slide-in-left {
        animation: slideInLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
      }

      /* Cyan glow pulse for cards */
      @keyframes cyanGlowPulse {
        0%, 100% { box-shadow: 0 0 15px rgba(0, 191, 255, 0.15); }
        50% { box-shadow: 0 0 40px rgba(0, 191, 255, 0.35); }
      }
      .animate-glow-pulse {
        animation: cyanGlowPulse 3s ease-in-out infinite;
      }

      /* Fire glow pulse */
      @keyframes fireGlowPulse {
        0%, 100% { box-shadow: 0 0 15px rgba(255, 165, 0, 0.15); }
        50% { box-shadow: 0 0 40px rgba(255, 165, 0, 0.35); }
      }
      .animate-fire-glow {
        animation: fireGlowPulse 3s ease-in-out infinite;
      }

      /* Text shimmer for tagline */
      @keyframes textShimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      .animate-text-shimmer {
        background: linear-gradient(90deg, #FFA500 0%, #FFD700 25%, #FFA500 50%, #FF6B00 75%, #FFA500 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: textShimmer 4s linear infinite;
      }

      /* Stagger animations */
      .animate-stagger > * {
        animation: fadeUpIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
      }
      .animate-stagger > *:nth-child(1) { animation-delay: 0.05s; }
      .animate-stagger > *:nth-child(2) { animation-delay: 0.15s; }
      .animate-stagger > *:nth-child(3) { animation-delay: 0.25s; }
      .animate-stagger > *:nth-child(4) { animation-delay: 0.35s; }
      .animate-stagger > *:nth-child(5) { animation-delay: 0.45s; }

      /* Hover lift */
      .hover-lift {
        transition: transform 0.25s ease, box-shadow 0.25s ease;
      }
      .hover-lift:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 191, 255, 0.08);
      }

      /* Focus glow */
      input:focus, textarea:focus {
        box-shadow: 0 0 0 2px rgba(0, 191, 255, 0.2);
      }

      /* Glowing border animation */
      @keyframes borderGlow {
        0%, 100% { border-color: rgba(0, 191, 255, 0.3); }
        50% { border-color: rgba(0, 191, 255, 0.7); }
      }
      .animate-border-glow {
        animation: borderGlow 2.5s ease-in-out infinite;
      }

      /* Scan line effect */
      @keyframes scanLine {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100vh); }
      }
      .scan-line::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(0, 191, 255, 0.15), transparent);
        animation: scanLine 8s linear infinite;
        pointer-events: none;
      }
    `}</style>
  );
}
