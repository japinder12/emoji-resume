import html2canvas from "html2canvas";

export async function exportCardPNG(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  const scale = Math.min(3, Math.max(2, Math.ceil(window.devicePixelRatio || 2)));

  const canvas = await html2canvas(node, {
    backgroundColor: getComputedStyle(node).backgroundColor || "#ffffff",
    scale,
    width: Math.ceil(rect.width),
    height: Math.ceil(rect.height),
    useCORS: true,
    logging: false,
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

  return new Promise<void>((resolve, reject) => {
    composed.toBlob((blob) => {
      let href: string | null = null;
      if (blob) {
        href = URL.createObjectURL(blob);
      } else {
        // Fallback for browsers that return null from toBlob
        try {
          href = composed.toDataURL("image/png");
        } catch (e) {
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
}
