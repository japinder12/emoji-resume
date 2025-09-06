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

  return new Promise<void>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Failed to create PNG blob"));
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cvmoji.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      resolve();
    }, "image/png");
  });
}

