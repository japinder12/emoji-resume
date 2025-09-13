import { useEffect, useMemo, useRef, useState } from "react";
import Card from "./components/Card";
import { Controls } from "./components/Controls";
import Legend from "./components/Legend";
import DraggableList from "./components/DraggableList";
import Toast from "./components/Toast";
import { toast } from "./lib/toast";
import { pdfToText } from "./lib/pdf";
import { toEmojiCardFromLines, toLines } from "./lib/parse";
import { toIconText } from "./lib/icons";
import { exportCardPNG } from "./lib/exportImage";
import { exportCardSVG } from "./lib/exportCardSVG";
import { hashToState, stateToHash } from "./lib/link";

const SAMPLE = `Japinder Narula — Software Engineer
Skills: Java, Kotlin, Python, React, SQL, Azure, Git
Experience: LegalZoom — SWE Intern — Kotlin, Spring Boot, REST, JPA, SQL
Projects: LSTM music generator; Portfolio website
Education: B.S. Electrical Engineering and Computer Science
Contact: github.com/japinder12 • website • email`;

export default function App() {
  const [raw, setRaw] = useState(SAMPLE);
  const [lines, setLines] = useState<string[]>(toLines(SAMPLE));
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mode, setMode] = useState<"emoji" | "icon">("emoji");
  const [showWatermark, setShowWatermark] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Restore from permalink or saved theme on first load
  useEffect(() => {
    const restored = hashToState(location.hash);
    if (restored) {
      setTheme(restored.theme);
      if (restored.mode === "emoji" || restored.mode === "icon") setMode(restored.mode);
      setRaw(restored.raw);
      return;
    }
    try {
      const saved = localStorage.getItem("cvmoji_theme");
      if (saved === "light" || saved === "dark") setTheme(saved);
      else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme("dark");
    } catch { /* empty */ }
  }, []);

  
  // Keep lines in sync with textarea edits (debounced for typing)
  useEffect(() => {
    const id = setTimeout(() => setLines(toLines(raw)), 150);
    return () => clearTimeout(id);
  }, [raw]);

  // Dynamic theme color for mobile address bar + apply site-wide theme
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0f172a" : "#ffffff");
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("cvmoji_theme", theme); } catch { /* empty */ }
  }, [theme]);

  // Keyboard shortcuts: copy/export/copy-link
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();
      if (mod && e.shiftKey && key === "c") {
        e.preventDefault();
        navigator.clipboard.writeText(emojiText).then(() => toast("Emojis copied"));
      } else if (mod && key === "e") {
        e.preventDefault();
        onExport();
      } else if (mod && e.shiftKey && key === "s") {
        e.preventDefault();
        onShare();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, theme]);

  const emojiText = useMemo(
    () => toEmojiCardFromLines(lines, "medium"),
    [lines]
  );

  const displayText = useMemo(() => {
    if (mode === "emoji") return emojiText;
    // Icon mode: map emoji tokens to short labels
    return toIconText(emojiText);
  }, [emojiText, mode]);

  const onExport = async () => {
    if (!cardRef.current) return;
    try {
      setShowWatermark(true); // show domain watermark for export
      await new Promise((r) => setTimeout(r, 50)); // ensure DOM updates
      await exportCardPNG(cardRef.current);
      toast("PNG exported");
    } catch (e) {
      console.error(e);
      toast("Export failed");
    } finally {
      setShowWatermark(false); // hide in live UI
    }
  };

  const onExportSVG = async () => {
    if (!cardRef.current) return;
    try {
      setShowWatermark(true);
      await new Promise((r) => setTimeout(r, 50));
      await exportCardSVG(cardRef.current);
      toast("SVG exported");
    } catch (e) {
      console.error(e);
      toast("Export failed");
    } finally {
      setShowWatermark(false);
    }
  };

  const onCopy = async () => {
    await navigator.clipboard.writeText(displayText);
    toast("Emojis copied");
  };

  const onShare = async () => {
    const url = new URL(location.href);
    url.hash = stateToHash({ raw, theme, mode });
    history.replaceState({}, "", url.toString());
    await navigator.clipboard.writeText(url.toString());
    toast("Permalink copied");
  };

  const onPDF = async (f: File) => {
    const text = await pdfToText(f);
    setRaw(text || "");
    toast("PDF parsed");
  };

  return (
    <div data-theme={theme} className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <div className="mx-auto max-w-6xl p-6 flex flex-col" style={{ width: "100%" }}>
        <header className="mb-6">
          <h1 className="font-semibold" style={{ fontSize: "2rem", lineHeight: 1.2 }}>
            <span aria-hidden>💻</span> cvmoji — <span className="title-gradient">emoji resume generator</span>
          </h1>
          <Legend />
        </header>

        <div className="grid grid-app">
          {/* Left: input + controls */}
          <section className="flex flex-col gap-3">
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">Paste text</span>
                <label className="btn btn-sm ml-auto">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => e.target.files?.[0] && onPDF(e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 3v10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                    <path d="M8 7l4-4 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <span>Upload PDF</span>
                </label>
              </div>
              <div className="panel-body">
                <textarea
                  className="textarea h-[160px] w-full font-mono"
                  value={raw}
                  onChange={(e) => setRaw(e.target.value)}
                  placeholder="Paste your resume text…"
                />
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">Reorder / edit lines</span>
              </div>
              <div className="panel-body">
              <DraggableList lines={lines} setLines={setLines} />
              </div>
            </div>

            <Controls
              theme={theme}
              setTheme={setTheme}
              mode={mode}
              setMode={setMode}
              onExport={onExport}
              onExportSVG={onExportSVG}
              onCopy={onCopy}
              onShare={onShare}
              showActions={false}
            />

            {/* Shortcuts moved to footer for a lighter touch */}
          </section>

          {/* Right: preview + actions below */}
          <section>
            <div className="sticky" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <Card
                ref={cardRef}
                text={displayText}
                showWatermark={showWatermark}
              />
              <div className="actions">
                <button onClick={onCopy} className="btn btn-sm btn-pill" aria-label="Copy emojis">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M9 9h9v9H9z" stroke="currentColor" strokeWidth="1.6"/>
                    <path d="M6 6h9v9" stroke="currentColor" strokeWidth="1.6"/>
                  </svg>
                  <span>Copy emojis</span>
                </button>
                <button onClick={onShare} className="btn btn-sm btn-pill" aria-label="Copy permalink">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M4 12a5 5 0 0 1 5-5h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    <path d="M20 12a5 5 0 0 1-5 5h-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    <path d="M8 12h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                  <span>Copy link</span>
                </button>
                <button onClick={onExport} className="btn btn-sm btn-pill" aria-label="Export PNG">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 3v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M8 7l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" stroke="currentColor" strokeWidth="1.6"/>
                  </svg>
                  <span>Export PNG</span>
                </button>
                <button onClick={onExportSVG} className="btn btn-sm btn-pill" aria-label="Export SVG">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 3v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M8 7l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" stroke="currentColor" strokeWidth="1.6"/>
                  </svg>
                  <span>Export SVG</span>
                </button>

              </div>
            </div>
          </section>
        </div>

        <footer className="mt-10 text-xs text-slate-400 mt-auto">
          <div className="flex items-center justify-center gap-3">
            <span className="opacity-70">Built with Vite + React</span>
            <span className="opacity-50">·</span>
            <span className="opacity-70">cvmoji</span>
            <span className="opacity-50">·</span>
            <span className="opacity-60">Shortcuts: ⌘/Ctrl+Shift+C copy · ⌘/Ctrl+E export · ⌘/Ctrl+Shift+S link</span>
          </div>
        </footer>
        <div className="social-fixed" aria-label="Social links">
          <a href="https://github.com/japinder12" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-slate-500">
              <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.35-1.77-1.35-1.77-1.1-.76.08-.75.08-.75 1.22.09 1.86 1.25 1.86 1.25 1.08 1.85 2.84 1.31 3.53 1 .11-.8.42-1.31.77-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.16 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.64.24 2.86.12 3.16.77.84 1.24 1.9 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.69.82.58A12 12 0 0 0 12 .5Z"/>
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-slate-500">
              <path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.454C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.225 0zM7.003 21.452H3.56V9h3.443v12.452zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM20.447 21.452h-3.554V15.88c0-1.328-.027-3.037-1.85-3.037-1.851 0-2.134 1.445-2.134 2.939v5.67H9.356V9h3.244v1.561h.047c.452-.857 1.554-1.76 3.197-1.76 3.418 0 4.049 2.246 4.049 5.165v7.486z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Toasts */}
      <Toast />
    </div>
  );
}
