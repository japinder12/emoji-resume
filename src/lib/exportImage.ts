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
      let href: string | null = null;
      if (blob) {
        href = URL.createObjectURL(blob);
      } else {
        // Fallback for browsers that return null from toBlob
        try {
          href = canvas.toDataURL("image/png");
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
