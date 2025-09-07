export function exportCardSVG(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  const styles = getComputedStyle(node);
  const width = Math.ceil(rect.width);
  const height = Math.ceil(rect.height);

  const fontSize = parseFloat(styles.fontSize) || 16;
  let lineHeight = parseFloat(styles.lineHeight);
  if (isNaN(lineHeight)) lineHeight = fontSize * 1.2;

  const paddingLeft = parseFloat(styles.paddingLeft) || 0;
  const paddingTop = parseFloat(styles.paddingTop) || 0;
  const bg = styles.backgroundColor || "#ffffff";
  const fg = styles.color || "#000000";
  const fontFamily = styles.fontFamily || "monospace";
  const radius = parseFloat(styles.borderTopLeftRadius) || 0;

  const lines = node.innerText.replace(/\r\n/g, "\n").split("\n");
  const textNodes = lines
    .map((line, i) => {
      const y = paddingTop + i * lineHeight;
      return `<text x="${paddingLeft}" y="${y}" font-family="${fontFamily}" font-size="${fontSize}" fill="${fg}" dominant-baseline="hanging">${escapeXML(line)}</text>`;
    })
    .join("");

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<rect width="100%" height="100%" fill="${bg}" rx="${radius}" />` +
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
