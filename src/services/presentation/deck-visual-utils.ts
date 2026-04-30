import { BrandProfile } from "./brand-profiles";

/** Бренды с splitBand (QazCloud) получают градиенты, halftone и карточки в экспорте */
export function brandUsesRichDeckStyle(brand: BrandProfile): boolean {
  return Boolean(brand.colors.splitBand);
}

export function mixHex(hexA: string, hexB: string, t: number): string {
  const parse = (h: string) => parseInt(h.replace(/^#/, "").trim(), 16);
  const a = parse(hexA);
  const b = parse(hexB);
  const r = Math.round(
    ((a >> 16) & 255) * (1 - t) + ((b >> 16) & 255) * t
  );
  const g = Math.round(((a >> 8) & 255) * (1 - t) + ((b >> 8) & 255) * t);
  const bl = Math.round((a & 255) * (1 - t) + (b & 255) * t);
  return ((r << 16) | (g << 8) | bl).toString(16).padStart(6, "0").toUpperCase();
}
