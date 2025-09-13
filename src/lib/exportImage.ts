import html2canvas from "html2canvas";

export async function exportCardPNG(node: HTMLElement) {
  // Expand the card to its full content height to avoid clipping scrollable content
  const prev = {
    maxHeight: node.style.maxHeight,
    overflowY: node.style.overflowY,
    height: node.style.height,
  };
  try {
    node.style.maxHeight = "none";
    node.style.overflowY = "visible";
    // Let layout settle
    await new Promise(r => setTimeout(r, 0));
    const fullHeight = Math.ceil(node.scrollHeight);
    const rect = node.getBoundingClientRect();

    // Dynamically adjust scale to avoid exceeding memory limits on very long cards
    const dpr = window.devicePixelRatio || 2;
    let scale = Math.min(3, Math.max(1.5, Math.ceil(dpr)));
    const baseW = Math.ceil(rect.width);
    const baseH = fullHeight; // use full content height
    const MAX_PIXELS = 16000000; // ~16 MP, balance quality and memory
    const pxAtScale = (w: number, h: number, s: number) => w * h * s * s;
    if (pxAtScale(baseW, baseH, scale) > MAX_PIXELS) {
      scale = Math.max(1, Math.sqrt(MAX_PIXELS / (baseW * baseH)));
    }

    const canvas = await html2canvas(node, {
      backgroundColor: getComputedStyle(node).backgroundColor || "#ffffff",
      scale,
      width: baseW,
      height: baseH,
      useCORS: true,
      logging: false,
      windowWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      windowHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    });

    // Compose a simple header bar above the captured card
    const styles = getComputedStyle(node);
    const bg = styles.backgroundColor || "#ffffff";
    const fg = styles.color || "#0f172a";
    const headerText = "💼 my emoji resume 📝";
    const headerCssHeight = 36; // CSS px
    const headerPx = Math.round(headerCssHeight * scale);

    const composed = document.createElement("canvas");
    composed.width = canvas.width;
    composed.height = canvas.height + headerPx;
    const ctx = composed.getContext("2d")!;
    // Header background
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, composed.width, headerPx);
    // Optional subtle divider
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    if (bg.startsWith("rgb(")) ctx.fillStyle = "rgba(0,0,0,0.10)";
    ctx.fillRect(0, headerPx - Math.max(1, Math.floor(scale)), composed.width, Math.max(1, Math.floor(scale)));
    // Header text (centered)
    ctx.fillStyle = fg;
    ctx.font = `${Math.round(600)} ${Math.round(14 * scale)}px Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial`;
    ctx.textBaseline = "middle";
    const metrics = ctx.measureText(headerText);
    const textX = Math.round((composed.width - metrics.width) / 2);
    const textY = Math.round(headerPx / 2);
    ctx.fillText(headerText, textX, textY);
    // Draw original card below header
    ctx.drawImage(canvas, 0, headerPx);

    await new Promise<void>((resolve, reject) => {
      composed.toBlob((blob) => {
        let href: string | null = null;
        if (blob) {
          href = URL.createObjectURL(blob);
        } else {
          // Fallback for browsers that return null from toBlob
          try {
            href = composed.toDataURL("image/png");
          } catch {
            reject(new Error("Failed to create PNG"));
            return;
          }
        }
        const a = document.createElement("a");
        a.href = href!;
        a.download = "cvmoji.png";
        document.body.appendChild(a);
        a.click();
        a.remove();
        if (blob && href.startsWith("blob:")) URL.revokeObjectURL(href);
        resolve();
      }, "image/png");
    });
  } finally {
    // Restore styles after capture
    node.style.maxHeight = prev.maxHeight;
    node.style.overflowY = prev.overflowY;
    node.style.height = prev.height;
  }
}
