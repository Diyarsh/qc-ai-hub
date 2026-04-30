import PptxGenJS from "pptxgenjs";
import { BrandProfile } from "./brand-profiles";
import { PresentationOutline, PresentationSlide } from "./presentation.service";
import { brandUsesRichDeckStyle, mixHex } from "./deck-visual-utils";

const SLIDE_W = 13.333;
const SLIDE_H = 7.5;

function primaryTextWidth(brand: BrandProfile): number {
  return brandUsesRichDeckStyle(brand) ? SLIDE_W - 1.92 : SLIDE_W - 1.2;
}

function titleSlideWidth(brand: BrandProfile): number {
  return brandUsesRichDeckStyle(brand) ? SLIDE_W - 2.05 : SLIDE_W - 1.4;
}

function innerMarginX(brand: BrandProfile): number {
  return brandUsesRichDeckStyle(brand) ? 0.88 : 0.85;
}

function paintHorizontalGradientRegion(
  slide: PptxGenJS.Slide,
  brand: BrandProfile,
  x0: number,
  x1: number,
  fromHex: string,
  toHex: string,
  steps = 28
) {
  const span = Math.max(0.01, x1 - x0);
  const stepW = span / steps;
  for (let i = 0; i < steps; i++) {
    const t = steps <= 1 ? 1 : i / (steps - 1);
    slide.addShape("rect", {
      x: x0 + i * stepW,
      y: 0,
      w: stepW + 0.02,
      h: SLIDE_H,
      fill: { color: mixHex(fromHex, toHex, t) },
      line: { type: "none" },
    });
  }
}

function drawHalftoneNoise(
  slide: PptxGenJS.Slide,
  pageNumber: number,
  density = 70
) {
  const seed = pageNumber * 7919 + 13;
  const rnd = (k: number) => ((seed + k * 9973) % 10000) / 10000;
  for (let i = 0; i < density; i++) {
    const cx = SLIDE_W * (0.38 + rnd(i) * 0.62);
    const cy = SLIDE_H * (0.04 + rnd(i + 31) * 0.52);
    const d = 0.022 + rnd(i + 7) * 0.038;
    slide.addShape("ellipse", {
      x: cx - d / 2,
      y: cy - d / 2,
      w: d,
      h: d,
      fill: { color: "FFFFFF", transparency: 86 },
      line: { type: "none" },
    });
  }
}

/** Полоски и точки справа — декоративная «инфографика» */
function drawRichInfographicDecor(slide: PptxGenJS.Slide, brand: BrandProfile) {
  if (!brandUsesRichDeckStyle(brand)) return;
  const a = brand.colors.accent;
  const baseRight = SLIDE_W - 0.36;
  const widths = [0.38, 0.26, 0.44, 0.22, 0.34];
  let y = 1.32;
  for (const bw of widths) {
    slide.addShape("roundRect", {
      x: baseRight - bw,
      y,
      w: bw,
      h: 0.052,
      fill: { color: a, transparency: 62 },
      line: { type: "none" },
      rectRadius: 0.02,
    });
    y += 0.105;
  }
  const dotY = SLIDE_H - 1.46;
  let cx = SLIDE_W - 0.5;
  for (let j = 0; j < 4; j++) {
    slide.addShape("ellipse", {
      x: cx - 0.036,
      y: dotY,
      w: 0.072,
      h: 0.072,
      fill: {
        color: j % 2 === 0 ? a : "FFFFFF",
        transparency: j % 2 === 0 ? 46 : 80,
      },
      line: { type: "none" },
    });
    cx += 0.105;
  }
}

function drawBulletStepConnector(
  slide: PptxGenJS.Slide,
  brand: BrandProfile,
  n: number
) {
  if (!brandUsesRichDeckStyle(brand) || n < 2) return;
  const steps = Math.min(n, 5);
  const a = brand.colors.accent;
  let x = 0.62;
  const y = 1.06;
  for (let i = 0; i < steps; i++) {
    slide.addShape("ellipse", {
      x,
      y,
      w: 0.084,
      h: 0.084,
      fill: { color: a, transparency: 24 },
      line: { type: "none" },
    });
    if (i < steps - 1) {
      slide.addShape("rect", {
        x: x + 0.084,
        y: y + 0.028,
        w: 0.48,
        h: 0.026,
        fill: { color: a, transparency: 74 },
        line: { type: "none" },
      });
    }
    x += 0.564;
  }
}

async function loadLogoBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();

    const lower = url.toLowerCase();
    if (blob.type.includes("svg") || lower.endsWith(".svg")) {
      const svgText = await blob.text();
      const img = new Image();
      const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
      const objUrl = URL.createObjectURL(svgBlob);
      try {
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("SVG decode failed"));
          img.src = objUrl;
        });
        const w = img.naturalWidth || 400;
        const h = img.naturalHeight || Math.round((400 * 89) / 52);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;
        ctx.drawImage(img, 0, 0, w, h);
        return canvas.toDataURL("image/png");
      } finally {
        URL.revokeObjectURL(objUrl);
      }
    }

    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function decorateSlide(
  slide: PptxGenJS.Slide,
  brand: BrandProfile,
  logoData: string | null,
  pageNumber: number,
  totalPages: number
) {
  const rich = brandUsesRichDeckStyle(brand);
  slide.background = { color: brand.colors.background };

  const stripW = brand.colors.splitBand ? SLIDE_W * 0.26 : 0;
  if (rich && stripW > 0) {
    paintHorizontalGradientRegion(
      slide,
      brand,
      stripW,
      SLIDE_W,
      brand.colors.surface,
      brand.colors.background,
      30
    );
    slide.addShape("rect", {
      x: 0,
      y: 0,
      w: stripW,
      h: SLIDE_H,
      fill: { color: brand.colors.splitBand! },
      line: { type: "none" },
    });
    drawHalftoneNoise(slide, pageNumber, 72);
    drawRichInfographicDecor(slide, brand);
    if (logoData) {
      slide.addImage({
        data: logoData,
        x: SLIDE_W - 1.38,
        y: 0.26,
        w: 1.22,
        h: 0.38,
        sizing: { type: "contain", w: 1.22, h: 0.38 },
      });
    }
  } else if (brand.colors.splitBand) {
    slide.addShape("rect", {
      x: 0,
      y: 0,
      w: stripW,
      h: SLIDE_H,
      fill: { color: brand.colors.splitBand },
      line: { type: "none" },
    });
  }

  slide.addShape("rect", {
    x: 0,
    y: SLIDE_H - 0.45,
    w: SLIDE_W,
    h: 0.04,
    fill: { color: brand.colors.accent },
    line: { type: "none" },
  });

  if (logoData) {
    slide.addImage({
      data: logoData,
      x: 0.45,
      y: SLIDE_H - 0.55,
      w: 1.1,
      h: 0.35,
      sizing: { type: "contain", w: 1.1, h: 0.35 },
    });
  } else {
    slide.addText(brand.name, {
      x: 0.4,
      y: SLIDE_H - 0.55,
      w: 2,
      h: 0.35,
      fontFace: brand.typography.heading,
      fontSize: 11,
      color: brand.colors.textMuted,
      bold: true,
    });
  }

  slide.addText(`${pageNumber} / ${totalPages}`, {
    x: SLIDE_W - 1.2,
    y: SLIDE_H - 0.55,
    w: 1,
    h: 0.35,
    align: "right",
    fontFace: brand.typography.body,
    fontSize: 11,
    color: brand.colors.textMuted,
  });
}

function renderTitleSlide(
  slide: PptxGenJS.Slide,
  s: PresentationSlide,
  brand: BrandProfile
) {
  const rich = brandUsesRichDeckStyle(brand);
  const tw = titleSlideWidth(brand);
  slide.addText(s.title, {
    x: 0.7,
    y: rich ? 2.05 : 2.2,
    w: tw,
    h: 1.65,
    fontFace: brand.typography.heading,
    fontSize: rich ? 52 : 54,
    bold: true,
    color: brand.colors.text,
  });

  if (rich) {
    slide.addShape("rect", {
      x: 0.7,
      y: 3.72,
      w: rich ? 4.6 : 3,
      h: 0.045,
      fill: { color: brand.colors.accent },
      line: { type: "none" },
    });
  }

  if (s.subtitle) {
    slide.addText(s.subtitle, {
      x: 0.7,
      y: rich ? 3.95 : 4.0,
      w: tw,
      h: 1.0,
      fontFace: brand.typography.body,
      fontSize: rich ? 25 : 23,
      color: brand.colors.accent,
    });
  }
}

function renderSectionSlide(
  slide: PptxGenJS.Slide,
  s: PresentationSlide,
  brand: BrandProfile
) {
  const rich = brandUsesRichDeckStyle(brand);
  slide.addShape("rect", {
    x: 0.5,
    y: 3.05,
    w: rich ? 0.22 : 0.18,
    h: 1.55,
    fill: { color: brand.colors.accent },
    line: { type: "none" },
  });
  const imx = innerMarginX(brand);
  const sw = rich ? SLIDE_W - 2.08 : SLIDE_W - 1.45;
  slide.addText(s.title, {
    x: imx,
    y: 2.85,
    w: sw,
    h: 1.85,
    fontFace: brand.typography.heading,
    fontSize: rich ? 48 : 44,
    bold: true,
    color: brand.colors.text,
  });
  if (s.subtitle) {
    slide.addText(s.subtitle, {
      x: imx,
      y: 4.48,
      w: sw,
      h: 0.65,
      fontFace: brand.typography.body,
      fontSize: rich ? 19 : 17,
      color: brand.colors.textMuted,
    });
  }
}

function renderBulletsSlide(
  slide: PptxGenJS.Slide,
  s: PresentationSlide,
  brand: BrandProfile
) {
  const rich = brandUsesRichDeckStyle(brand);
  const raw = s.bullets && s.bullets.length > 0 ? s.bullets : ["—"];
  const pw = primaryTextWidth(brand);

  slide.addText(s.title, {
    x: 0.6,
    y: 0.48,
    w: pw,
    h: 0.92,
    fontFace: brand.typography.heading,
    fontSize: rich ? 36 : 31,
    bold: true,
    color: brand.colors.text,
  });

  slide.addShape("rect", {
    x: 0.6,
    y: 1.42,
    w: rich ? 1.05 : 0.6,
    h: 0.045,
    fill: { color: brand.colors.accent },
    line: { type: "none" },
  });

  drawBulletStepConnector(slide, brand, raw.length);

  const footerTop = SLIDE_H - 0.62;
  const startY = 1.72;
  const gap = 0.07;
  const avail = footerTop - startY - gap * Math.max(0, raw.length - 1);
  let cardH = raw.length > 0 ? avail / raw.length : 0.75;
  const useCards = rich && raw.length >= 2 && raw.length <= 6 && cardH >= 0.44;

  if (useCards) {
    cardH = Math.min(0.92, cardH);
    let y = startY;
    raw.forEach((text, idx) => {
      slide.addShape("roundRect", {
        x: 0.62,
        y,
        w: pw - 0.04,
        h: cardH,
        fill: { color: mixHex(brand.colors.surface, brand.colors.background, 0.28) },
        line: { color: brand.colors.line, width: 0.75 },
        rectRadius: 0.06,
      });
      slide.addShape("rect", {
        x: 0.62,
        y,
        w: 0.09,
        h: cardH,
        fill: { color: brand.colors.accent },
        line: { type: "none" },
      });
      slide.addText(String(idx + 1), {
        x: 0.62,
        y,
        w: 0.09,
        h: cardH,
        fontFace: brand.typography.heading,
        fontSize: 15,
        bold: true,
        color: brand.colors.background,
        align: "center",
        valign: "middle",
      });
      slide.addText(text, {
        x: 0.76,
        y: y + 0.1,
        w: pw - 0.18,
        h: cardH - 0.2,
        fontFace: brand.typography.body,
        fontSize: rich ? 19 : 20,
        color: brand.colors.text,
        valign: "middle",
      });
      y += cardH + gap;
    });
    return;
  }

  const bullets = raw.map((b) => ({
    text: b,
    options: {
      bullet: { code: "25CF" },
      color: brand.colors.text,
      fontFace: brand.typography.body,
      fontSize: rich ? 22 : 20,
      paraSpaceAfter: 9,
    },
  }));

  slide.addText(bullets, {
    x: 0.7,
    y: 1.78,
    w: pw - 0.1,
    h: SLIDE_H - 2.58,
    valign: "top",
  });
}

function renderTwoColumnSlide(
  slide: PptxGenJS.Slide,
  s: PresentationSlide,
  brand: BrandProfile
) {
  const rich = brandUsesRichDeckStyle(brand);
  const pw = primaryTextWidth(brand);
  const pairGap = 0.28;
  const colW = (pw - pairGap) / 2;
  slide.addText(s.title, {
    x: 0.6,
    y: 0.48,
    w: pw,
    h: 0.92,
    fontFace: brand.typography.heading,
    fontSize: rich ? 34 : 28,
    bold: true,
    color: brand.colors.text,
  });

  const midX = 0.6 + colW + pairGap / 2;
  if (rich) {
    slide.addShape("rect", {
      x: midX - 0.015,
      y: 1.55,
      w: 0.03,
      h: SLIDE_H - 2.35,
      fill: { color: brand.colors.accent, transparency: 55 },
      line: { type: "none" },
    });
  }

  const left = s.bullets || [];
  const right = (s.body || "").split(/\n+/).filter(Boolean);

  slide.addText(
    left.map((b) => ({
      text: b,
      options: {
        bullet: { code: "25CF" },
        color: brand.colors.text,
        fontFace: brand.typography.body,
        fontSize: rich ? 19 : 17,
        paraSpaceAfter: 6,
      },
    })),
    {
      x: 0.6,
      y: 1.6,
      w: colW,
      h: SLIDE_H - 2.4,
      valign: "top",
    }
  );

  slide.addText(
    right.map((b) => ({
      text: b,
      options: {
        color: brand.colors.textMuted,
        fontFace: brand.typography.body,
        fontSize: rich ? 17 : 15,
        paraSpaceAfter: 6,
      },
    })),
    {
      x: 0.6 + colW + pairGap,
      y: 1.6,
      w: colW,
      h: SLIDE_H - 2.4,
      valign: "top",
    }
  );
}

function renderQuoteSlide(
  slide: PptxGenJS.Slide,
  s: PresentationSlide,
  brand: BrandProfile
) {
  const rich = brandUsesRichDeckStyle(brand);
  slide.addText(`"${s.body || s.title}"`, {
    x: 1.2,
    y: 2.2,
    w: rich ? SLIDE_W - 2.85 : SLIDE_W - 2.4,
    h: 2.5,
    fontFace: brand.typography.heading,
    fontSize: rich ? 36 : 34,
    italic: true,
    color: brand.colors.text,
    align: "center",
  });

  if (s.subtitle) {
    slide.addText(`— ${s.subtitle}`, {
      x: 1.2,
      y: 4.9,
      w: rich ? SLIDE_W - 2.85 : SLIDE_W - 2.4,
      h: 0.6,
      fontFace: brand.typography.body,
      fontSize: rich ? 18 : 17,
      color: brand.colors.accent,
      align: "center",
    });
  }
}

function renderStatsSlide(
  slide: PptxGenJS.Slide,
  s: PresentationSlide,
  brand: BrandProfile
) {
  const rich = brandUsesRichDeckStyle(brand);
  const pw = primaryTextWidth(brand);
  slide.addText(s.title, {
    x: 0.6,
    y: 0.48,
    w: pw,
    h: 0.92,
    fontFace: brand.typography.heading,
    fontSize: rich ? 36 : 30,
    bold: true,
    color: brand.colors.text,
  });

  const stats = (s.stats || []).slice(0, 4);
  const colWidth = pw / Math.max(1, stats.length);
  stats.forEach((stat, i) => {
    const x = 0.6 + i * colWidth;
    if (rich) {
      slide.addShape("roundRect", {
        x: x + colWidth * 0.06,
        y: 1.95,
        w: colWidth * 0.88,
        h: 3.05,
        fill: { color: brand.colors.surface, transparency: 35 },
        line: { color: brand.colors.line, width: 0.75 },
        rectRadius: 0.09,
      });
    }
    slide.addText(stat.value, {
      x,
      y: rich ? 2.35 : 2.2,
      w: colWidth,
      h: 1.5,
      fontFace: brand.typography.heading,
      fontSize: rich ? 58 : 56,
      bold: true,
      color: brand.colors.accent,
      align: "center",
    });
    slide.addText(stat.label, {
      x,
      y: rich ? 4.05 : 3.9,
      w: colWidth,
      h: 1,
      fontFace: brand.typography.body,
      fontSize: rich ? 17 : 15,
      color: brand.colors.textMuted,
      align: "center",
    });
  });
}

function renderClosingSlide(
  slide: PptxGenJS.Slide,
  s: PresentationSlide,
  brand: BrandProfile
) {
  const cw = titleSlideWidth(brand);
  slide.addText(s.title, {
    x: 0.7,
    y: 2.6,
    w: cw,
    h: 1.4,
    fontFace: brand.typography.heading,
    fontSize: 62,
    bold: true,
    color: brand.colors.text,
    align: "center",
  });

  if (s.subtitle) {
    slide.addText(s.subtitle, {
      x: 0.7,
      y: 4.2,
      w: cw,
      h: 0.6,
      fontFace: brand.typography.body,
      fontSize: 21,
      color: brand.colors.accent,
      align: "center",
    });
  }

  if (s.bullets && s.bullets.length > 0) {
    slide.addText(s.bullets.join(" · "), {
      x: 0.7,
      y: 5.0,
      w: cw,
      h: 0.6,
      fontFace: brand.typography.body,
      fontSize: 16,
      color: brand.colors.textMuted,
      align: "center",
    });
  }
}

function renderSlide(
  slide: PptxGenJS.Slide,
  s: PresentationSlide,
  brand: BrandProfile
) {
  switch (s.layout) {
    case "title":
      return renderTitleSlide(slide, s, brand);
    case "section":
      return renderSectionSlide(slide, s, brand);
    case "two-column":
      return renderTwoColumnSlide(slide, s, brand);
    case "quote":
      return renderQuoteSlide(slide, s, brand);
    case "stats":
      return renderStatsSlide(slide, s, brand);
    case "closing":
      return renderClosingSlide(slide, s, brand);
    case "bullets":
    default:
      return renderBulletsSlide(slide, s, brand);
  }
}

export async function buildPptx(
  outline: PresentationOutline,
  brand: BrandProfile
): Promise<Blob> {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.title = outline.title;
  pptx.author = brand.name;
  pptx.company = brand.name;

  const logoData = await loadLogoBase64(brand.logoUrl);
  const total = outline.slides.length;

  outline.slides.forEach((s, i) => {
    const slide = pptx.addSlide();
    decorateSlide(slide, brand, logoData, i + 1, total);
    renderSlide(slide, s, brand);
    if (s.notes) slide.addNotes(s.notes);
  });

  const blob = (await pptx.write({ outputType: "blob" })) as Blob;
  return blob;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
