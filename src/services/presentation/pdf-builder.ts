import { jsPDF } from "jspdf";
import { BrandProfile } from "./brand-profiles";
import { PresentationOutline, PresentationSlide } from "./presentation.service";
import { brandUsesRichDeckStyle, mixHex } from "./deck-visual-utils";

const PAGE_W = 1280;
const PAGE_H = 720;
const PADDING = 64;

function primaryCanvasContentWidth(brand: BrandProfile): number {
  return brandUsesRichDeckStyle(brand)
    ? PAGE_W - PADDING * 2 - 132
    : PAGE_W - PADDING * 2;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const v = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(v, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

async function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function fillBackground(ctx: CanvasRenderingContext2D, brand: BrandProfile) {
  const w = PAGE_W;
  const h = PAGE_H;
  const split = brand.colors.splitBand;
  if (split) {
    const bandW = w * 0.26;
    ctx.fillStyle = `#${split}`;
    ctx.fillRect(0, 0, bandW, h);
    const grd = ctx.createLinearGradient(bandW, 0, w, 0);
    grd.addColorStop(0, `#${brand.colors.surface}`);
    grd.addColorStop(1, `#${brand.colors.background}`);
    ctx.fillStyle = grd;
    ctx.fillRect(bandW, 0, w - bandW, h);
  } else {
    ctx.fillStyle = `#${brand.colors.background}`;
    ctx.fillRect(0, 0, w, h);
  }

  if (brandUsesRichDeckStyle(brand)) {
    const glaze = ctx.createLinearGradient(0, 0, 0, h);
    glaze.addColorStop(0, "rgba(255,255,255,0.14)");
    glaze.addColorStop(0.35, "rgba(255,255,255,0.03)");
    glaze.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glaze;
    ctx.fillRect(0, 0, w, h);
  }
}

function drawHalftoneOverlay(
  ctx: CanvasRenderingContext2D,
  brand: BrandProfile,
  pageSeed: number
) {
  if (!brandUsesRichDeckStyle(brand)) return;
  const rnd = (k: number) => ((pageSeed * 9301 + k * 49297) % 233280) / 233280;
  ctx.save();
  for (let i = 0; i < 130; i++) {
    const x = PAGE_W * (0.3 + rnd(i) * 0.7);
    const y = PAGE_H * (0.02 + rnd(i + 17) * 0.58);
    const r = 1.8 + rnd(i + 4) * 4.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${0.03 + rnd(i + 9) * 0.065})`;
    ctx.fill();
  }
  ctx.restore();
}

function drawRichInfographicDecorPdf(
  ctx: CanvasRenderingContext2D,
  brand: BrandProfile
) {
  if (!brandUsesRichDeckStyle(brand)) return;
  const [r, g, b] = hexToRgb(brand.colors.accent);
  ctx.save();
  let y = 128;
  const bars = [54, 36, 58, 30, 46];
  const right = PAGE_W - 26;
  for (const bw of bars) {
    ctx.fillStyle = `rgba(${r},${g},${b},0.26)`;
    ctx.beginPath();
    pathRoundRect(ctx, right - bw, y, bw, 9, 4);
    ctx.fill();
    y += 21;
  }
  let cx = PAGE_W - 56;
  const dotY = PAGE_H - 112;
  for (let j = 0; j < 4; j++) {
    ctx.beginPath();
    ctx.arc(cx, dotY, 7.5, 0, Math.PI * 2);
    ctx.fillStyle =
      j % 2 === 0 ? `rgba(${r},${g},${b},0.42)` : "rgba(255,255,255,0.18)";
    ctx.fill();
    cx += 23;
  }
  ctx.restore();
}

function drawHeaderLogoPdf(
  ctx: CanvasRenderingContext2D,
  logo: HTMLImageElement | null,
  brand: BrandProfile
) {
  if (!logo || !brandUsesRichDeckStyle(brand)) return;
  const h = 40;
  const ratio = logo.width / logo.height || 4;
  const w = h * ratio;
  ctx.drawImage(logo, PAGE_W - PADDING / 2 - w, 26, w, h);
}

function drawFooter(
  ctx: CanvasRenderingContext2D,
  brand: BrandProfile,
  logo: HTMLImageElement | null,
  pageNumber: number,
  total: number
) {
  ctx.fillStyle = `#${brand.colors.accent}`;
  ctx.fillRect(0, PAGE_H - 36, PAGE_W, 4);

  if (logo) {
    const h = 28;
    const ratio = logo.width / logo.height || 4;
    const w = h * ratio;
    ctx.drawImage(logo, PADDING / 1.5, PAGE_H - 30, w, h);
  } else {
    ctx.fillStyle = `#${brand.colors.textMuted}`;
    ctx.font = "bold 15px Inter, system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(brand.name, PADDING / 1.5, PAGE_H - 12);
  }

  ctx.fillStyle = `#${brand.colors.textMuted}`;
  ctx.font = "15px Inter, system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`${pageNumber} / ${total}`, PAGE_W - PADDING / 1.5, PAGE_H - 12);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const test = current ? `${current} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = w;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function pathRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + rad, y);
  ctx.lineTo(x + w - rad, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
  ctx.lineTo(x + w, y + h - rad);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
  ctx.lineTo(x + rad, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
  ctx.lineTo(x, y + rad);
  ctx.quadraticCurveTo(x, y, x + rad, y);
}

function drawTitle(
  ctx: CanvasRenderingContext2D,
  s: PresentationSlide,
  brand: BrandProfile
) {
  const rich = brandUsesRichDeckStyle(brand);
  const maxW = primaryCanvasContentWidth(brand);
  ctx.fillStyle = `#${brand.colors.text}`;
  ctx.font = `bold ${rich ? 70 : 72}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "left";
  const lines = wrapText(ctx, s.title, maxW);
  const startTop = rich ? 252 : 272;
  const lineStep = 82;
  lines.forEach((line, i) => ctx.fillText(line, PADDING, startTop + i * lineStep));

  const titleBlockEnd = startTop + lines.length * lineStep;
  if (rich) {
    ctx.fillStyle = `#${brand.colors.accent}`;
    ctx.fillRect(PADDING, titleBlockEnd + 10, 360, 5);
  }

  if (s.subtitle) {
    ctx.fillStyle = `#${brand.colors.accent}`;
    ctx.font = `${rich ? 31 : 29}px Inter, system-ui, sans-serif`;
    ctx.fillText(s.subtitle, PADDING, titleBlockEnd + (rich ? 54 : 38));
  }
}

function drawSection(
  ctx: CanvasRenderingContext2D,
  s: PresentationSlide,
  brand: BrandProfile
) {
  const rich = brandUsesRichDeckStyle(brand);
  const maxW = primaryCanvasContentWidth(brand);
  ctx.fillStyle = `#${brand.colors.accent}`;
  ctx.fillRect(PADDING, 296, rich ? 18 : 14, rich ? 152 : 138);
  ctx.fillStyle = `#${brand.colors.text}`;
  ctx.font = `bold ${rich ? 60 : 58}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "left";
  const titleLines = wrapText(ctx, s.title, maxW - (rich ? 44 : 40));
  let ty = 372;
  titleLines.forEach((line) => {
    ctx.fillText(line, PADDING + (rich ? 36 : 32), ty);
    ty += 68;
  });
  if (s.subtitle) {
    ctx.fillStyle = `#${brand.colors.textMuted}`;
    ctx.font = `${rich ? 26 : 24}px Inter, system-ui, sans-serif`;
    ctx.fillText(s.subtitle, PADDING + (rich ? 36 : 32), ty + 12);
  }
}

function drawBullets(
  ctx: CanvasRenderingContext2D,
  s: PresentationSlide,
  brand: BrandProfile
) {
  const rich = brandUsesRichDeckStyle(brand);
  const maxW = primaryCanvasContentWidth(brand);
  ctx.fillStyle = `#${brand.colors.text}`;
  ctx.font = `bold ${rich ? 44 : 40}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText(s.title, PADDING, 106);

  ctx.fillStyle = `#${brand.colors.accent}`;
  ctx.fillRect(PADDING, 128, rich ? 100 : 68, 5);

  const bullets = s.bullets || [];
  const list = bullets.length > 0 ? bullets : ["—"];

  if (rich && list.length >= 2) {
    const steps = Math.min(list.length, 5);
    const [r, g, b] = hexToRgb(brand.colors.accent);
    let sx = PADDING;
    const sy = 146;
    for (let i = 0; i < steps; i++) {
      ctx.beginPath();
      ctx.arc(sx + 9, sy, 8.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},0.32)`;
      ctx.fill();
      if (i < steps - 1) {
        ctx.fillStyle = `rgba(${r},${g},${b},0.18)`;
        ctx.fillRect(sx + 17, sy - 3, 44, 7);
      }
      sx += 72;
    }
  }

  const footerY = PAGE_H - 52;
  const startY = rich && list.length >= 2 ? 198 : 188;
  const gap = 14;
  const avail = footerY - startY - gap * Math.max(0, list.length - 1);
  let cardH = list.length > 0 ? avail / list.length : 72;
  const useCards = rich && list.length >= 2 && list.length <= 6 && cardH >= 52;

  if (useCards) {
    cardH = Math.min(112, cardH);
    let top = startY;
    list.forEach((b, idx) => {
      const hCard = cardH;
      const fillHex = mixHex(brand.colors.surface, brand.colors.background, 0.28);
      ctx.fillStyle = `#${fillHex}`;
      ctx.strokeStyle = `#${brand.colors.line}`;
      ctx.lineWidth = 1;
      const rad = 12;
      const x0 = PADDING;
      const w0 = maxW;
      ctx.beginPath();
      pathRoundRect(ctx, x0, top, w0, hCard, rad);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = `#${brand.colors.accent}`;
      ctx.fillRect(x0, top, 14, hCard);

      ctx.fillStyle = `#${brand.colors.background}`;
      ctx.font = "bold 17px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(idx + 1), x0 + 7, top + hCard / 2);
      ctx.textBaseline = "alphabetic";

      ctx.textAlign = "left";
      ctx.fillStyle = `#${brand.colors.text}`;
      ctx.font = `${rich ? 24 : 23}px Inter, system-ui, sans-serif`;
      const lines = wrapText(ctx, b, maxW - 52);
      let ly = top + 28;
      lines.forEach((line) => {
        ctx.fillText(line, PADDING + 44, ly);
        ly += 30;
      });
      top += hCard + gap;
    });
    return;
  }

  let y = rich && list.length >= 2 ? 206 : 198;
  ctx.font = `${rich ? 25 : 24}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = `#${brand.colors.text}`;
  for (const b of list) {
    const lines = wrapText(ctx, b, maxW - 30);
    ctx.fillStyle = `#${brand.colors.accent}`;
    ctx.beginPath();
    ctx.arc(PADDING + 8, y - 8, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `#${brand.colors.text}`;
    lines.forEach((line, i) => ctx.fillText(line, PADDING + 26, y + i * 34));
    y += lines.length * 34 + 16;
    if (y > PAGE_H - 80) break;
  }
}

function drawTwoColumn(
  ctx: CanvasRenderingContext2D,
  s: PresentationSlide,
  brand: BrandProfile
) {
  const rich = brandUsesRichDeckStyle(brand);
  const totalInner = primaryCanvasContentWidth(brand);
  ctx.fillStyle = `#${brand.colors.text}`;
  ctx.font = `bold ${rich ? 40 : 38}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText(s.title, PADDING, 106);

  const colW = (totalInner - 36) / 2;
  ctx.font = `${rich ? 24 : 23}px Inter, system-ui, sans-serif`;
  let y = 192;
  for (const b of s.bullets || []) {
    const lines = wrapText(ctx, b, colW - 24);
    ctx.fillStyle = `#${brand.colors.accent}`;
    ctx.beginPath();
    ctx.arc(PADDING + 8, y - 8, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `#${brand.colors.text}`;
    lines.forEach((line, i) => ctx.fillText(line, PADDING + 26, y + i * 32));
    y += lines.length * 32 + 14;
  }

  if (s.body) {
    let ry = 192;
    ctx.fillStyle = `#${brand.colors.textMuted}`;
    ctx.font = `${rich ? 22 : 21}px Inter, system-ui, sans-serif`;
    const lines = wrapText(ctx, s.body, colW);
    lines.forEach((line) => {
      ctx.fillText(line, PADDING + colW + 36, ry);
      ry += 30;
    });
  }
}

function drawQuote(
  ctx: CanvasRenderingContext2D,
  s: PresentationSlide,
  brand: BrandProfile
) {
  const rich = brandUsesRichDeckStyle(brand);
  const maxW = rich ? PAGE_W - PADDING * 3 - 80 : PAGE_W - PADDING * 4;
  ctx.fillStyle = `#${brand.colors.text}`;
  ctx.font = `italic ${rich ? 44 : 42}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "center";
  const text = `"${s.body || s.title}"`;
  const lines = wrapText(ctx, text, maxW);
  const lineStep = 54;
  const startY = PAGE_H / 2 - (lines.length * lineStep) / 2;
  lines.forEach((line, i) => ctx.fillText(line, PAGE_W / 2, startY + i * lineStep));

  if (s.subtitle) {
    ctx.font = `${rich ? 22 : 21}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = `#${brand.colors.accent}`;
    ctx.fillText(`— ${s.subtitle}`, PAGE_W / 2, startY + lines.length * lineStep + 62);
  }
  ctx.textAlign = "left";
}

function drawStats(
  ctx: CanvasRenderingContext2D,
  s: PresentationSlide,
  brand: BrandProfile
) {
  const rich = brandUsesRichDeckStyle(brand);
  const maxW = primaryCanvasContentWidth(brand);
  ctx.fillStyle = `#${brand.colors.text}`;
  ctx.font = `bold ${rich ? 40 : 38}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText(s.title, PADDING, 106);

  const stats = (s.stats || []).slice(0, 4);
  const colW = maxW / Math.max(1, stats.length);
  stats.forEach((stat, i) => {
    const cx = PADDING + colW * i + colW / 2;
    ctx.fillStyle = `#${brand.colors.accent}`;
    ctx.font = `bold ${rich ? 86 : 82}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(stat.value, cx, PAGE_H / 2);
    ctx.fillStyle = `#${brand.colors.textMuted}`;
    ctx.font = `${rich ? 22 : 21}px Inter, system-ui, sans-serif`;
    ctx.fillText(stat.label, cx, PAGE_H / 2 + 54);
  });
  ctx.textAlign = "left";
}

function drawClosing(
  ctx: CanvasRenderingContext2D,
  s: PresentationSlide,
  brand: BrandProfile
) {
  const rich = brandUsesRichDeckStyle(brand);
  ctx.fillStyle = `#${brand.colors.text}`;
  ctx.font = `bold ${rich ? 86 : 82}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(s.title, PAGE_W / 2, PAGE_H / 2 - 42);

  if (s.subtitle) {
    ctx.fillStyle = `#${brand.colors.accent}`;
    ctx.font = `${rich ? 27 : 26}px Inter, system-ui, sans-serif`;
    ctx.fillText(s.subtitle, PAGE_W / 2, PAGE_H / 2 + 26);
  }

  if (s.bullets && s.bullets.length > 0) {
    ctx.fillStyle = `#${brand.colors.textMuted}`;
    ctx.font = `${rich ? 20 : 19}px Inter, system-ui, sans-serif`;
    ctx.fillText(s.bullets.join(" · "), PAGE_W / 2, PAGE_H / 2 + 74);
  }
  ctx.textAlign = "left";
}

function renderSlideToCanvas(
  ctx: CanvasRenderingContext2D,
  s: PresentationSlide,
  brand: BrandProfile,
  logo: HTMLImageElement | null,
  pageNumber: number,
  total: number
) {
  fillBackground(ctx, brand);
  drawHalftoneOverlay(ctx, brand, pageNumber * 17 + s.index);
  drawRichInfographicDecorPdf(ctx, brand);
  switch (s.layout) {
    case "title":
      drawTitle(ctx, s, brand);
      break;
    case "section":
      drawSection(ctx, s, brand);
      break;
    case "two-column":
      drawTwoColumn(ctx, s, brand);
      break;
    case "quote":
      drawQuote(ctx, s, brand);
      break;
    case "stats":
      drawStats(ctx, s, brand);
      break;
    case "closing":
      drawClosing(ctx, s, brand);
      break;
    case "bullets":
    default:
      drawBullets(ctx, s, brand);
      break;
  }
  drawHeaderLogoPdf(ctx, logo, brand);
  drawFooter(ctx, brand, logo, pageNumber, total);
}

export async function buildPdf(
  outline: PresentationOutline,
  brand: BrandProfile
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = PAGE_W;
  canvas.height = PAGE_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  const logo = await loadImage(brand.logoUrl);

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [PAGE_W, PAGE_H],
    hotfixes: ["px_scaling"],
  });

  const total = outline.slides.length;
  for (let i = 0; i < outline.slides.length; i++) {
    renderSlideToCanvas(ctx, outline.slides[i], brand, logo, i + 1, total);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    if (i > 0) pdf.addPage([PAGE_W, PAGE_H], "landscape");
    pdf.addImage(dataUrl, "JPEG", 0, 0, PAGE_W, PAGE_H, undefined, "FAST");
  }

  const speakerNotes = outline.slides
    .map((s, i) => `Slide ${i + 1}: ${s.title}\n${s.notes || "—"}`)
    .join("\n\n");

  pdf.addPage([PAGE_W, PAGE_H], "landscape");
  const [r, g, b] = hexToRgb(brand.colors.background);
  pdf.setFillColor(r, g, b);
  pdf.rect(0, 0, PAGE_W, PAGE_H, "F");
  pdf.setTextColor(brand.colors.text);
  pdf.setFontSize(28);
  pdf.text("Speaker notes", PADDING, 80);
  pdf.setFontSize(14);
  const lines = pdf.splitTextToSize(speakerNotes, PAGE_W - PADDING * 2);
  pdf.text(lines, PADDING, 130);

  return pdf.output("blob");
}
