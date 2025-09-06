import { useEffect, useMemo, useRef, useState } from "react";
import Card from "./components/Card";
import { Controls } from "./components/Controls";
import Legend from "./components/Legend";
import DraggableList from "./components/DraggableList";
import Toast, { toast } from "./components/Toast";

import { pdfToText } from "./lib/pdf";
import { toEmojiCardFromLines, toLines } from "./lib/parse";
import { exportCardPNG } from "./lib/exportImage";
import { hashToState, stateToHash } from "./lib/link";

const SAMPLE = `Japinder Narula — Software Engineer
Summary: Backend-leaning full-stack developer
Skills: Java, Kotlin, Python, React, SQL, Azure, Git
Experience: LegalZoom — SWE Intern — Kotlin, Spring Boot, REST, JPA, SQL
Projects: LSTM music generator; Portfolio website
Education: B.S. Electrical Engineering and Computer Science — GPA 4.0
Contact: github.com/japinder12 • website • email`;

export default function App() {
  const [raw, setRaw] = useState(SAMPLE);
  const [lines, setLines] = useState<string[]>(toLines(SAMPLE));
  const [density, setDensity] = useState<"minimal" | "medium" | "extra">("medium");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showWatermark, setShowWatermark] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Restore from permalink on first load
  useEffect(() => {
    const restored = hashToState(location.hash);
    if (restored) {
      setLines(restored.lines);
      setTheme(restored.theme);
      setDensity(restored.density);
      setRaw(restored.lines.join("\n"));
    }
  }, []);

  // Keep lines in sync with textarea edits
  useEffect(() => {
    setLines(toLines(raw));
  }, [raw]);

  // Dynamic theme color for mobile address bar
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0f172a" : "#ffffff");
  }, [theme]);

  // Update document title based on state
  useEffect(() => {
    const count = lines.filter(Boolean).length;
    document.title = `cvmoji — ${count} lines · ${density}`;
  }, [lines, density]);

  // Keyboard shortcuts: copy/share/export
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();
      if (mod && e.shiftKey && key === "c") {
        e.preventDefault();
        navigator.clipboard.writeText(emojiText).then(() => toast("Emojis copied"));
      } else if (mod && e.shiftKey && key === "s") {
        e.preventDefault();
        onShare();
      } else if (mod && key === "e") {
        e.preventDefault();
        onExport();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, density, theme]); // state influences share link + export

  const emojiText = useMemo(
    () => toEmojiCardFromLines(lines, density),
    [lines, density]
  );

  const onExport = async () => {
    if (!cardRef.current) return;
    setShowWatermark(true); // show domain watermark for export
    await new Promise((r) => setTimeout(r, 50)); // ensure DOM updates
    await exportCardPNG(cardRef.current);
    setShowWatermark(false); // hide in live UI
    toast("PNG exported");
  };

  const onCopy = async () => {
    await navigator.clipboard.writeText(emojiText);
    toast("Emojis copied");
  };

  const onShare = async () => {
    const url = new URL(location.href);
    url.hash = stateToHash({ lines, theme, density });
    history.replaceState({}, "", url.toString());

    try {
      if (navigator.share) {
        await navigator.share({
          title: "cvmoji — emoji résumé",
          text: "My emoji résumé card",
          url: url.toString(),
        });
        return;
      }
    } catch {
      // user canceled share sheet -> fall through to clipboard
    }
    await navigator.clipboard.writeText(url.toString());
    toast("Permalink copied");
  };

  const onPDF = async (f: File) => {
    const text = await pdfToText(f);
    setRaw(text || "");
    toast("PDF parsed");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">cvmoji — emoji résumé generator</h1>
          <Legend />
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left: input + controls */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => e.target.files?.[0] && onPDF(e.target.files[0])}
              />
              <span className="text-xs text-slate-500">or paste text below</span>
            </div>

            <textarea
              className="h-[160px] w-full border rounded-xl p-4 font-mono"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder="Paste your résumé text…"
            />

            <div>
              <p className="text-xs mb-2 text-slate-500">Reorder / edit lines</p>
              <DraggableList lines={lines} setLines={setLines} />
            </div>

            <Controls
              density={density}
              setDensity={setDensity}
              theme={theme}
              setTheme={setTheme}
              onExport={onExport}
              onCopy={onCopy}
              onShare={onShare}
            />

            <p className="text-xs text-slate-500">
              Shortcuts: ⌘/Ctrl+Shift+C copy · ⌘/Ctrl+Shift+S share · ⌘/Ctrl+E export
            </p>
          </section>

          {/* Right: preview */}
          <section className="flex items-start justify-center">
            <Card
              ref={cardRef}
              text={emojiText}
              theme={theme}
              showWatermark={showWatermark}
            />
          </section>
        </div>

        <footer className="mt-10 text-xs text-slate-400">
          Built with Vite + React. Emoji rendering depends on OS fonts.
        </footer>
      </div>

      {/* Toasts */}
      <Toast />
    </div>
  );
}
