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
  const width = Math.ceil(rect.width * SCALE);
  const height = Math.ceil(rect.height * SCALE);

  const fontSize = (parseFloat(styles.fontSize) || 16) * SCALE;
  let lineHeight = parseFloat(styles.lineHeight) * SCALE;
  if (isNaN(lineHeight)) lineHeight = fontSize * 1.2;

  const paddingLeft = (parseFloat(styles.paddingLeft) || 0) * SCALE;
  const paddingTop = (parseFloat(styles.paddingTop) || 0) * SCALE;
  const bg = styles.backgroundColor || "#ffffff";
  const fg = styles.color || "#000000";
  const fontFamily = styles.fontFamily || "monospace";
  const radius = (parseFloat(styles.borderTopLeftRadius) || 0) * SCALE;

  const raw = node.getAttribute("data-text");
  const source = (raw ?? node.innerText).replace(/\r\n/g, "\n");
  const lines = source.split("\n");
  const textNodes = lines
    .map((line, i) => {
      const y = paddingTop + i * lineHeight;
      return `<text x="${paddingLeft}" y="${y}" font-family="${escapeAttr(fontFamily)}" font-size="${fontSize}" fill="${escapeAttr(fg)}" dominant-baseline="hanging">${escapeXML(line)}</text>`;
    })
    .join("");

  const svg =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">` +
    `<rect width="100%" height="100%" fill="${escapeAttr(bg)}" rx="${radius}" />` +
    textNodes +
    `</svg>`;

  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "emoji-resume.svg";
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
