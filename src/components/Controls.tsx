export function Controls({
  density,
  setDensity,
  theme,
  setTheme,
  onExport,
  onExportSVG,
  onCopy,
  onShare,
  showActions = true,
}: {
  density: "minimal" | "medium" | "extra";
  setDensity: (d: "minimal" | "medium" | "extra") => void;
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
  onExport: () => void | Promise<void>;
  onExportSVG: () => void | Promise<void>;
  onCopy: () => void | Promise<void>;
  onShare: () => void | Promise<void>;
  showActions?: boolean;
}) {
  return (
    <div className="control-row">
      <div className="control-group" aria-label="Density">
        <span className="control-label">Density</span>
        <div className="seg seg-sm" role="tablist" aria-label="Density">
          <button
            type="button"
            className={`seg-btn ${density === "minimal" ? "seg-active" : ""}`}
            aria-pressed={density === "minimal"}
            onClick={() => setDensity("minimal")}
          >
            minimal
          </button>
          <button
            type="button"
            className={`seg-btn ${density === "medium" ? "seg-active" : ""}`}
            aria-pressed={density === "medium"}
            onClick={() => setDensity("medium")}
          >
            medium
          </button>
          <button
            type="button"
            className={`seg-btn ${density === "extra" ? "seg-active" : ""}`}
            aria-pressed={density === "extra"}
            onClick={() => setDensity("extra")}
          >
            extra
          </button>
        </div>
      </div>
      <div className="control-group" aria-label="Theme">
        <div className="pill" role="tablist" aria-label="Theme toggle">
          <button
            type="button"
            className={`pill-btn ${theme === "light" ? "pill-active" : ""}`}
            aria-pressed={theme === "light"}
            onClick={() => setTheme("light")}
            title="Light"
          >
            ☀️
          </button>
          <button
            type="button"
            className={`pill-btn ${theme === "dark" ? "pill-active" : ""}`}
            aria-pressed={theme === "dark"}
            onClick={() => setTheme("dark")}
            title="Dark"
          >
            🌙
          </button>
        </div>
      </div>
      {showActions && (
        <div className="control-actions">
          <button onClick={onCopy} className="btn btn-sm" aria-label="Copy emojis">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M9 9h9v9H9z" stroke="currentColor" strokeWidth="1.6"/>
              <path d="M6 6h9v9" stroke="currentColor" strokeWidth="1.6"/>
            </svg>
            <span>Copy emojis</span>
          </button>
          <button onClick={onExport} className="btn btn-sm" aria-label="Export PNG">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 3v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M8 7l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" stroke="currentColor" strokeWidth="1.6"/>
            </svg>
            <span>Export PNG</span>
          </button>
          <button onClick={onExportSVG} className="btn btn-sm" aria-label="Export SVG">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 3v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M8 7l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" stroke="currentColor" strokeWidth="1.6"/>
            </svg>
            <span>Export SVG</span>
          </button>
          <button onClick={onShare} className="btn btn-sm" aria-label="Copy permalink">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 3v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M8 7l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" stroke="currentColor" strokeWidth="1.6"/>
            </svg>
            <span>Copy link</span>
          </button>
        </div>
      )}
    </div>
  );
}
