function escapeAttr(str: string) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function exportCardSVG(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  const styles = getComputedStyle(node);
  const scaleAttr = parseFloat(node.getAttribute("data-scale") || "1");
  const SCALE = isNaN(scaleAttr) ? 1 : Math.max(0.1, scaleAttr);

  // Base (unscaled) size from the DOM
  const baseWidth = Math.ceil(rect.width);
  // Match PNG export by using full content height (scrollHeight)
  const fullHeight = Math.ceil(node.scrollHeight);
  const baseHeight = fullHeight;
  // Header above the card to match PNG composition
  const headerCssHeight = 36;
  const headerPx = headerCssHeight;
  // Output size (scaled)
  const width = Math.ceil(baseWidth * SCALE);
  const height = Math.ceil((baseHeight + headerPx) * SCALE);

  // Font size in px
  const fontSize = parseFloat(styles.fontSize) || 16;
  // Line height may be unitless (multiplier) or px; convert to px
  const lhRaw = styles.lineHeight;
  let lineHeight: number;
  const lhNum = parseFloat(lhRaw);
  if (lhRaw.endsWith("px")) {
    lineHeight = lhNum;
  } else if (!Number.isNaN(lhNum)) {
    lineHeight = lhNum * fontSize;
  } else {
    lineHeight = fontSize * 1.2;
  }

  const paddingLeft = parseFloat(styles.paddingLeft) || 0;
  const paddingTop = parseFloat(styles.paddingTop) || 0;
  const bg = styles.backgroundColor || "#ffffff";
  const fg = styles.color || "#000000";
  const fontFamily = styles.fontFamily || "monospace";

  const raw = node.getAttribute("data-text");
  const source = (raw ?? node.innerText).replace(/\r\n/g, "\n");
  const lines = source.split("\n");
  const textNodes = lines
    .map((line, i) => {
      const y = headerPx + paddingTop + i * lineHeight;
      return `<text x="${paddingLeft}" y="${y}" font-family="${escapeAttr(fontFamily)}" font-size="${fontSize}" fill="${escapeAttr(fg)}" dominant-baseline="hanging">${escapeXML(line)}</text>`;
    })
    .join("");

  // Optional watermark if the live node has the watermark element
  const hasWatermark = !!node.querySelector('.wm');
  let watermark = "";
  if (hasWatermark) {
    const label = "💻 cvmoji";
    const wmFontSize = Math.max(12, Math.round(fontSize * 0.85));
    const padX = 10;
    const padY = 5;
    // Rough text width estimate; good enough for a pill background
    const approxWidth = Math.round(label.length * wmFontSize * 0.6);
    const pillW = approxWidth + padX * 2;
    const pillH = wmFontSize + padY * 2;
    const cx = Math.round((baseWidth - pillW) / 2);
    // Lower watermark closer to the bottom
    const cy = headerPx + Math.round(baseHeight - pillH - 4);
    const pillR = Math.min(14, Math.round(pillH / 2));
    watermark =
      `<g opacity="0.92">` +
      `<rect x="${cx}" y="${cy}" width="${pillW}" height="${pillH}" rx="${pillR}" fill="${escapeAttr(bg)}" stroke="rgba(0,0,0,0.08)" />` +
      `<text x="${cx + pillW / 2}" y="${cy + pillH / 2}" font-family="${escapeAttr(fontFamily)}" font-size="${wmFontSize}" fill="${escapeAttr(fg)}" dominant-baseline="middle" text-anchor="middle">${escapeXML(label)}</text>` +
      `</g>`;
  }

  // Header (to match PNG export)
  const headerText = "💼 my emoji resume 📝";
  const headerFontSize = 14;
  const headerFontFamily = "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial";
  const header =
    `<g>` +
    `<rect x="0" y="0" width="${baseWidth}" height="${headerPx}" fill="${escapeAttr(bg)}" />` +
    `<rect x="0" y="${headerPx - 1}" width="${baseWidth}" height="1" fill="rgba(0,0,0,0.10)" />` +
    `<text x="${baseWidth / 2}" y="${headerPx / 2}" font-family="${escapeAttr(headerFontFamily)}" font-size="${headerFontSize}" font-weight="600" fill="${escapeAttr(fg)}" dominant-baseline="middle" text-anchor="middle">${escapeXML(headerText)}</text>` +
    `</g>`;

  const svg =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${baseWidth} ${baseHeight + headerPx}" preserveAspectRatio="xMidYMid meet">` +
    header +
    `<rect x="0" y="${headerPx}" width="${baseWidth}" height="${baseHeight}" fill="${escapeAttr(bg)}" />` +
    textNodes +
    watermark +
    `</svg>`;

  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cvmoji.svg";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function escapeXML(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
