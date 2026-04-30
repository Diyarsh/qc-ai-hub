/**
 * Извлечение обычного текста из документов для Presentation Agent.
 * .docx / .pptx / .pdf — через парсеры; .rtf — грубый fallback (лучше конвертировать в .txt).
 */

import mammoth from "mammoth";
import JSZip from "jszip";

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** Fallback для RTF и любых «неизвестных бинарных» попыток (плохое качество). */
function legacyBinaryAsGuessText(bytes: Uint8Array): string {
  const decoder = new TextDecoder("utf-8", { fatal: false });
  const raw = decoder.decode(bytes);
  const cleaned = raw
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]+/g, " ")
    .replace(
      /[^\x20-\x7Eа-яА-ЯёЁәіңғүұқөһӘІҢҒҮҰҚӨҺ\u0400-\u04FF\s.,;:!?\-—()«»\d]/g,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();
  return cleaned;
}

async function extractDocxText(buffer: ArrayBuffer): Promise<string> {
  const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
  const text = normalizeWhitespace(value || "");
  if (!text) {
    throw new Error("Не удалось извлечь текст из DOCX (файл пустой или повреждён)");
  }
  return text;
}

/** OOXML: текст слайдов обычно в элементе <a:t> в ppt/slides/slideN.xml */
async function extractPptxText(buffer: ArrayBuffer): Promise<string> {
  const zip = await JSZip.loadAsync(buffer);
  const slidePaths = Object.keys(zip.files)
    .filter((p) => /^ppt\/slides\/slide\d+\.xml$/i.test(p))
    .sort((a, b) => {
      const na = parseInt(/slide(\d+)/i.exec(a)?.[1] || "0", 10);
      const nb = parseInt(/slide(\d+)/i.exec(b)?.[1] || "0", 10);
      return na - nb;
    });

  if (slidePaths.length === 0) {
    throw new Error("В PPTX не найдены слайды (ppt/slides/slide*.xml)");
  }

  const chunks: string[] = [];
  for (const path of slidePaths) {
    const entry = zip.files[path];
    if (!entry) continue;
    const xml = await entry.async("text");
    const texts = [...xml.matchAll(/<a:t[^>]*>([^<]*)<\/a:t>/gi)].map((m) =>
      (m[1] || "").trim()
    );
    const slideText = texts.filter(Boolean).join(" ");
    if (slideText) chunks.push(slideText);
  }

  const text = normalizeWhitespace(chunks.join("\n\n"));
  if (!text) {
    throw new Error("Не удалось извлечь текст из PPTX");
  }
  return text;
}

async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  const { default: workerUrl } = await import(
    "pdfjs-dist/build/pdf.worker.min.mjs?url"
  );
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const parts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const line = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    if (line.trim()) parts.push(line.trim());
  }

  const text = normalizeWhitespace(parts.join("\n\n"));
  if (!text) {
    throw new Error(
      "Не удалось извлечь текст из PDF (возможно, только сканы без текстового слоя)"
    );
  }
  return text;
}

export async function readPresentationFileAsText(file: File): Promise<string> {
  const lower = file.name.toLowerCase();

  if (/\.(txt|md|markdown|csv|json|html?)$/i.test(lower)) {
    return file.text();
  }

  const buffer = await file.arrayBuffer();

  if (lower.endsWith(".docx")) {
    return extractDocxText(buffer);
  }

  if (lower.endsWith(".pptx")) {
    return extractPptxText(buffer);
  }

  if (lower.endsWith(".pdf")) {
    return extractPdfText(buffer);
  }

  if (lower.endsWith(".rtf")) {
    return legacyBinaryAsGuessText(new Uint8Array(buffer));
  }

  return file.text();
}
