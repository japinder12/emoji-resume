import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

// Point pdf.js at its worker using a URL handled by Vite
GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export async function pdfToText(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const pdfDoc = await getDocument({ data: buffer }).promise;
  const textParts: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdfDoc.numPages; pageNumber++) {
    const page = await pdfDoc.getPage(pageNumber);
    const content = await page.getTextContent();

    const line = (content.items as { str: string }[])
      .map((item) => item.str)
      .join(" ");

    textParts.push(line);
  }

  return textParts
    .join("\n")
    .replace(/\u2022/g, "\n• ")
    .replace(/\s{2,}/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}
