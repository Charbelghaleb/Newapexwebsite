import { useState, useEffect, useRef, useCallback } from "react";

type PlaybackState = "idle" | "playing" | "paused";
type Speed = 1 | 1.25 | 1.5;

interface ListenButtonProps {
  containerRef?: React.RefObject<HTMLDivElement | null>;
  text?: string;
}

export default function ListenButton({ containerRef, text }: ListenButtonProps) {
  const [state, setState] = useState<PlaybackState>("idle");
  const [speed, setSpeed] = useState<Speed>(1);
  const [supported, setSupported] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speedMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
    }
  }, []);

  // Close speed menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(e.target as Node)) {
        setShowSpeedMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getArticleText = useCallback((): string => {
    if (text) return text;
    if (containerRef?.current) return containerRef.current.textContent || "";
    return "";
  }, [text, containerRef]);

  const pickVoice = (): SpeechSynthesisVoice | null => {
    const voices = speechSynthesis.getVoices();
    const english = voices.filter((v) => v.lang.startsWith("en"));
    // Prefer deep, authoritative male voices — no bubbly nonsense
    const preferred = [
      "Aaron",        // macOS deep male
      "Daniel",       // macOS British male
      "Fred",         // macOS classic male
      "Tom",          // macOS male
      "Alex",         // macOS male
      "Ralph",        // macOS male
      "Google UK English Male",
      "Google US English",
      "Microsoft David",   // Windows deep male
      "Microsoft Mark",    // Windows male
      "Microsoft Guy",     // Edge male
    ];
    for (const name of preferred) {
      const found = english.find((v) => v.name.includes(name));
      if (found) return found;
    }
    // Fallback: try to find any voice with "Male" in the name
    const maleVoice = english.find((v) => /male/i.test(v.name) && !/female/i.test(v.name));
    if (maleVoice) return maleVoice;
    return english[0] || voices[0] || null;
  };

  const handlePlay = () => {
    const synth = window.speechSynthesis;

    if (state === "paused") {
      synth.resume();
      setState("playing");
      return;
    }

    // Fresh play
    synth.cancel();
    const content = getArticleText();
    if (!content.trim()) return;

    const utt = new SpeechSynthesisUtterance(content);
    utt.rate = speed;
    utt.pitch = 0.85; // Lower pitch — gritty, authoritative tone
    const voice = pickVoice();
    if (voice) utt.voice = voice;

    utt.onend = () => setState("idle");
    utt.onerror = () => setState("idle");

    utteranceRef.current = utt;
    synth.speak(utt);
    setState("playing");
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setState("paused");
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setState("idle");
  };

  const changeSpeed = (s: Speed) => {
    setSpeed(s);
    setShowSpeedMenu(false);
    // If currently playing, restart with new speed
    if (state === "playing" || state === "paused") {
      window.speechSynthesis.cancel();
      setState("idle");
      // Small delay so cancel settles, then auto-play at new speed
      setTimeout(() => {
        const synth = window.speechSynthesis;
        const content = getArticleText();
        if (!content.trim()) return;
        const utt = new SpeechSynthesisUtterance(content);
        utt.rate = s;
        utt.pitch = 0.85; // Lower pitch — gritty, authoritative tone
        const voice = pickVoice();
        if (voice) utt.voice = voice;
        utt.onend = () => setState("idle");
        utt.onerror = () => setState("idle");
        utteranceRef.current = utt;
        synth.speak(utt);
        setState("playing");
      }, 50);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  if (!supported) {
    return (
      <div className="listen-btn-wrap">
        <div className="listen-btn-bar listen-unsupported">
          <span>🎧 Audio not supported in this browser</span>
        </div>
        <style>{listenStyles}</style>
      </div>
    );
  }

  return (
    <div className="listen-btn-wrap">
      <div className={`listen-btn-bar ${state}`}>
        <div className="listen-header">
          <span className="listen-icon">🎧</span>
          <span className="listen-label">Listen to this article</span>
        </div>

        <div className="listen-controls">
          {state === "playing" ? (
            <button className="listen-ctrl" onClick={handlePause} aria-label="Pause" title="Pause">
              ⏸
            </button>
          ) : (
            <button className="listen-ctrl listen-play" onClick={handlePlay} aria-label="Play" title="Play">
              ▶
            </button>
          )}
          <button
            className="listen-ctrl"
            onClick={handleStop}
            disabled={state === "idle"}
            aria-label="Stop"
            title="Stop"
          >
            ⏹
          </button>

          <div className="listen-speed-wrap" ref={speedMenuRef}>
            <button
              className="listen-speed-btn"
              onClick={() => setShowSpeedMenu((v) => !v)}
              aria-label="Playback speed"
            >
              {speed}x ▾
            </button>
            {showSpeedMenu && (
              <div className="listen-speed-menu">
                {([1, 1.25, 1.5] as Speed[]).map((s) => (
                  <button
                    key={s}
                    className={`listen-speed-opt ${s === speed ? "active" : ""}`}
                    onClick={() => changeSpeed(s)}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {state !== "idle" && (
            <span className={`listen-state-badge ${state}`}>
              {state === "playing" ? "Playing" : "Paused"}
            </span>
          )}
        </div>

        <div className="listen-progress-track">
          <div className={`listen-progress-bar ${state === "playing" ? "animating" : ""} ${state === "paused" ? "paused-anim" : ""}`} />
        </div>
      </div>

      <style>{listenStyles}</style>
    </div>
  );
}

const listenStyles = `
  .listen-btn-wrap {
    margin: 1.5rem 0 2rem;
  }
  .listen-btn-bar {
    background: rgba(6, 78, 59, 0.25);
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: 12px;
    padding: 1rem 1.25rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(16, 185, 129, 0.05);
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .listen-btn-bar.playing {
    border-color: rgba(16, 185, 129, 0.6);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(16, 185, 129, 0.12);
  }
  .listen-btn-bar.paused {
    border-color: rgba(16, 185, 129, 0.4);
  }
  .listen-unsupported {
    text-align: center;
    color: rgba(224, 224, 236, 0.5);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem;
    letter-spacing: 0.05em;
  }
  .listen-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 0.65rem;
  }
  .listen-icon {
    font-size: 1rem;
  }
  .listen-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(16, 185, 129, 0.8);
  }
  .listen-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .listen-ctrl {
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.25);
    color: #10b981;
    font-size: 0.95rem;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  .listen-ctrl:hover:not(:disabled) {
    background: rgba(16, 185, 129, 0.22);
    border-color: rgba(16, 185, 129, 0.5);
    box-shadow: 0 0 12px rgba(16, 185, 129, 0.15);
  }
  .listen-ctrl:disabled {
    opacity: 0.3;
    cursor: default;
  }
  .listen-ctrl.listen-play {
    background: rgba(16, 185, 129, 0.2);
    border-color: rgba(16, 185, 129, 0.4);
  }
  .listen-speed-wrap {
    position: relative;
    margin-left: 4px;
  }
  .listen-speed-btn {
    background: rgba(16, 185, 129, 0.08);
    border: 1px solid rgba(16, 185, 129, 0.2);
    color: rgba(16, 185, 129, 0.7);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.72rem;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.04em;
  }
  .listen-speed-btn:hover {
    background: rgba(16, 185, 129, 0.16);
    color: #10b981;
  }
  .listen-speed-menu {
    position: absolute;
    bottom: calc(100% + 6px);
    left: 0;
    background: #1a2e1a;
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    z-index: 50;
  }
  .listen-speed-opt {
    display: block;
    width: 100%;
    background: none;
    border: none;
    color: rgba(224, 224, 236, 0.7);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.72rem;
    padding: 8px 18px;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s;
  }
  .listen-speed-opt:hover {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
  }
  .listen-speed-opt.active {
    color: #10b981;
    background: rgba(16, 185, 129, 0.1);
  }
  .listen-state-badge {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 20px;
    margin-left: auto;
  }
  .listen-state-badge.playing {
    color: #34d399;
    background: rgba(16, 185, 129, 0.12);
  }
  .listen-state-badge.paused {
    color: #fbbf24;
    background: rgba(251, 191, 36, 0.1);
  }
  .listen-progress-track {
    margin-top: 0.65rem;
    height: 3px;
    background: rgba(16, 185, 129, 0.1);
    border-radius: 3px;
    overflow: hidden;
  }
  .listen-progress-bar {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #059669, #10b981, #34d399);
    border-radius: 3px;
    transition: width 0.3s;
  }
  .listen-progress-bar.animating {
    width: 100%;
    animation: listenPulse 2.5s ease-in-out infinite;
  }
  .listen-progress-bar.paused-anim {
    width: 45%;
    animation: none;
  }
  @keyframes listenPulse {
    0% { width: 5%; opacity: 0.6; }
    50% { width: 85%; opacity: 1; }
    100% { width: 5%; opacity: 0.6; }
  }
  @media (max-width: 768px) {
    .listen-btn-bar {
      padding: 0.85rem 1rem;
    }
    .listen-ctrl {
      width: 32px;
      height: 32px;
      font-size: 0.85rem;
    }
  }
`;
