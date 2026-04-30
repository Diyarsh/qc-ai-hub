/**
 * Presentation Agent core.
 * - Parses arbitrary source text (paste / .txt / .md); для .docx / .pptx / .pdf текст извлекается на клиенте
 * - Asks Claude to produce a structured slide outline
 * - Falls back to a deterministic local generator when no API key is set,
 *   so the agent always returns a usable presentation
 */

import {
  callClaude,
  getPresentationModel,
  isClaudeConfigured,
} from "./claude.service";
import { BrandProfile } from "./brand-profiles";

export type PresentationGoal =
  | "sales"
  | "investor"
  | "internal"
  | "training"
  | "report"
  | "demo";

export interface PresentationRequest {
  brand: BrandProfile;
  sourceText: string;
  topic?: string;
  audience?: string;
  goal: PresentationGoal;
  language: "ru" | "en" | "kk";
  slidesCount: number;
  authorName?: string;
}

export type SlideLayout =
  | "title"
  | "section"
  | "bullets"
  | "two-column"
  | "quote"
  | "stats"
  | "closing";

export interface SlideStat {
  value: string;
  label: string;
}

export interface PresentationSlide {
  index: number;
  layout: SlideLayout;
  title: string;
  subtitle?: string;
  bullets?: string[];
  body?: string;
  stats?: SlideStat[];
  notes?: string;
  visualHint?: string;
}

export interface PresentationOutline {
  title: string;
  subtitle: string;
  language: PresentationRequest["language"];
  brandId: string;
  slides: PresentationSlide[];
  brandCompliance: string[];
  generatedBy: "claude" | "openai-compatible" | "local-fallback";
  model?: string;
}

const GOAL_LABELS: Record<PresentationGoal, string> = {
  sales: "продажа продукта/решения",
  investor: "инвесторский питч",
  internal: "внутренняя презентация для команды",
  training: "обучающий материал",
  report: "отчётная презентация",
  demo: "демонстрация продукта",
};

/** Короткие тезисные буллеты при постобработке outline */
function clampThesisBullet(text: string, maxWords = 12): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (!t) return t;
  const words = t.split(/\s+/);
  if (words.length <= maxWords) return t;
  return `${words.slice(0, maxWords).join(" ")}…`;
}

const STORYLINE_BY_GOAL: Record<PresentationGoal, string[]> = {
  sales: [
    "Контекст и боль клиента",
    "Решение",
    "Как это работает",
    "Ключевые преимущества",
    "Кейсы / социальные доказательства",
    "Стоимость и модель внедрения",
    "Следующие шаги",
  ],
  investor: [
    "Проблема и рынок",
    "Решение",
    "Продукт",
    "Бизнес-модель",
    "Тракшен и метрики",
    "Конкурентный ландшафт",
    "Команда",
    "Запрос инвестиций",
  ],
  internal: [
    "Цель встречи",
    "Контекст и предпосылки",
    "Текущее состояние",
    "Предлагаемые изменения",
    "Влияние и риски",
    "План работ",
    "Решения, которые нужны",
  ],
  training: [
    "Цели обучения",
    "Базовые понятия",
    "Ключевые концепции",
    "Примеры и кейсы",
    "Практика",
    "Чек-лист",
    "Ресурсы",
  ],
  report: [
    "Период и scope",
    "Главные результаты",
    "Метрики и KPI",
    "Риски и проблемы",
    "Финансы / ресурсы",
    "Планы на следующий период",
  ],
  demo: [
    "Контекст продукта",
    "Что будем показывать",
    "Демо: пользовательский путь",
    "Технические особенности",
    "Безопасность и compliance",
    "Roadmap",
    "Q&A",
  ],
};

function buildSystemPrompt(req: PresentationRequest): string {
  const brand = req.brand;
  return [
    `Ты — Presentation Agent для платформы QazCloud AI-HUB.`,
    `Твоя задача: превратить произвольный исходный текст в структурированный outline презентации.`,
    ``,
    `Бренд: ${brand.name}.`,
    brand.tagline ? `Tagline: ${brand.tagline}.` : "",
    `Tone of voice: ${brand.voice.tone}`,
    `Do: ${brand.voice.do.join("; ")}`,
    `Don't: ${brand.voice.dont.join("; ")}`,
    `Цвета бренда (hex): ${brand.palette.map((c) => `${c.name}#${c.hex}`).join(", ")}`,
    brand.guidelinePrompt ? `\n${brand.guidelinePrompt}` : "",
    ``,
    `Язык вывода: ${req.language}.`,
    `Цель презентации: ${GOAL_LABELS[req.goal]}.`,
    req.audience ? `Аудитория: ${req.audience}.` : "",
    req.topic ? `Тема: ${req.topic}.` : "",
    `Целевое количество слайдов: ${req.slidesCount} (включая титульный и финальный).`,
    ``,
    `Качество: заголовки слайдов конкретные и запоминающиеся (избегай пустых «Введение»/«Обзор», если можно точнее).`,
    `Буллеты — строго тезисно: 3–5 пунктов; каждый до 10–12 слов; одна мысль на строку; без длинных запятых и подчинительных конструкций; предпочитай формат «глагол + результат» или «факт + цифра».`,
    `Визуалы и инфографика (обязательно учитывай в outline):`,
    `- Для данных и KPI используй layout "stats" с понятными value/label (минимум 1 такой слайд, если в тексте есть метрики или можно их обоснованно ввести).`,
    `- Для сравнений «до/после», «мы vs альтернатива», процессов — layout "two-column" или разбей на связку слайдов.`,
    `- В каждом контентном слайде поле visualHint должно предлагать конкретную инфографику: диаграмма, блок-схема, таймлайн, пирамида, карта сервисов, иконки этапов (не общие фразы вроде «картинка»).`,
    `- Заголовки и подзаголовки помогай привязать к визуалу (например: «Три уровня безопасности», «Этапы внедрения за 30 дней»).`,
    `Требования к ответу:`,
    `1. Верни СТРОГО валидный JSON без markdown-обёртки и без комментариев.`,
    `2. Структура:`,
    `{`,
    `  "title": string,`,
    `  "subtitle": string,`,
    `  "brandCompliance": string[],`,
    `  "slides": [`,
    `    {`,
    `      "layout": "title" | "section" | "bullets" | "two-column" | "quote" | "stats" | "closing",`,
    `      "title": string,`,
    `      "subtitle"?: string,`,
    `      "bullets"?: string[],            // 3-5 тезисов: короткие фразы, без простыней`,
    `      "body"?: string,                  // для quote / two-column`,
    `      "stats"?: [{ "value": string, "label": string }],`,
    `      "notes": string,                  // speaker notes 2-4 предложения`,
    `      "visualHint": string              // подсказка по визуалу`,
    `    }`,
    `  ]`,
    `}`,
    `3. Первый слайд — layout "title", последний — "closing".`,
    `4. Каждый bullet — заготовка для спикера: коротко, как строка на слайде, не абзац.`,
    `5. Применяй бренд-правила. Если данных в источнике мало — расширяй разумно, но не выдумывай конкретные цифры.`,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildUserPrompt(req: PresentationRequest): string {
  const storyline = STORYLINE_BY_GOAL[req.goal].join(" → ");
  return [
    `Storyline-каркас под цель: ${storyline}.`,
    ``,
    `=== ИСХОДНЫЙ ТЕКСТ ===`,
    req.sourceText.slice(0, 18000),
    `=== КОНЕЦ ИСХОДНОГО ТЕКСТА ===`,
    ``,
    `Сгенерируй outline презентации.`,
  ].join("\n");
}

function safeJsonParse<T>(raw: string): T | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  const candidates = [trimmed];
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) candidates.push(fenceMatch[1]);
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    candidates.push(trimmed.slice(firstBrace, lastBrace + 1));
  }
  for (const c of candidates) {
    try {
      return JSON.parse(c) as T;
    } catch {
      // try next candidate
    }
  }
  return null;
}

export async function generatePresentation(
  req: PresentationRequest
): Promise<PresentationOutline> {
  const system = buildSystemPrompt(req);
  const user = buildUserPrompt(req);

  const presentationModel = getPresentationModel();
  const response = await callClaude(user, {
    systemPrompt: system,
    maxTokens: 8192,
    temperature: 0.35,
    model: presentationModel,
  });

  const parsed = safeJsonParse<{
    title?: string;
    subtitle?: string;
    brandCompliance?: string[];
    slides?: PresentationSlide[];
  }>(response.content);

  if (parsed?.slides && parsed.slides.length > 0) {
    return normalizeOutline(parsed, req, response.provider, response.model);
  }

  const fallback = buildLocalFallback(req);
  return normalizeOutline(fallback, req, "mock", response.model);
}

function normalizeOutline(
  parsed: {
    title?: string;
    subtitle?: string;
    brandCompliance?: string[];
    slides?: PresentationSlide[];
  },
  req: PresentationRequest,
  provider: "anthropic" | "openai-compatible" | "mock",
  model?: string
): PresentationOutline {
  const slides = (parsed.slides || []).slice(0, req.slidesCount + 4).map(
    (s, i) => ({
      ...s,
      index: i,
      layout: s.layout || (i === 0 ? "title" : "bullets"),
      title: s.title?.trim() || `Слайд ${i + 1}`,
      bullets: (s.bullets?.slice(0, 6) || []).map(clampThesisBullet),
    })
  );

  const generatedBy: PresentationOutline["generatedBy"] =
    provider === "anthropic"
      ? "claude"
      : provider === "openai-compatible"
      ? "openai-compatible"
      : "local-fallback";

  return {
    title: parsed.title?.trim() || req.topic || "Презентация",
    subtitle: parsed.subtitle?.trim() || req.brand.tagline || "",
    language: req.language,
    brandId: req.brand.id,
    slides,
    brandCompliance:
      parsed.brandCompliance?.length
        ? parsed.brandCompliance
        : [
            `Применена палитра ${req.brand.name}`,
            `Tone of voice: ${req.brand.voice.tone.split(".")[0]}`,
            `Шрифт: ${req.brand.typography.heading}`,
          ],
    generatedBy,
    model,
  };
}

/**
 * Deterministic local generator. Splits source text into chunks and projects
 * them onto the storyline for the chosen goal. Always produces a usable outline.
 */
function buildLocalFallback(req: PresentationRequest): {
  title: string;
  subtitle: string;
  brandCompliance: string[];
  slides: PresentationSlide[];
} {
  const storyline = STORYLINE_BY_GOAL[req.goal];
  const sentences = req.sourceText
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const chunkSize = Math.max(2, Math.floor(sentences.length / storyline.length));
  const slides: PresentationSlide[] = [];

  slides.push({
    index: 0,
    layout: "title",
    title:
      req.topic ||
      sentences[0]?.slice(0, 80) ||
      `${req.brand.name} • Presentation`,
    subtitle: req.brand.tagline || GOAL_LABELS[req.goal],
    notes: `Презентация для ${req.audience || "целевой аудитории"}. Цель: ${GOAL_LABELS[req.goal]}.`,
    visualHint: "Логотип бренда по центру/слева, фоновое изображение приглушено.",
  });

  storyline.forEach((sectionTitle, sectionIndex) => {
    const start = sectionIndex * chunkSize;
    const slice = sentences.slice(start, start + chunkSize);
    const bullets = slice
      .slice(0, 5)
      .map((sent) =>
        clampThesisBullet(sent.replace(/\s+/g, " ").slice(0, 220))
      );

    slides.push({
      index: slides.length,
      layout: bullets.length >= 4 ? "bullets" : "two-column",
      title: sectionTitle,
      bullets: bullets.length > 0 ? bullets : ["—"],
      notes: `Раскрой блок «${sectionTitle.toLowerCase()}» опираясь на исходный текст.`,
      visualHint: "Иконка-метафора слева, текст справа.",
    });
  });

  slides.push({
    index: slides.length,
    layout: "closing",
    title: "Спасибо",
    subtitle: req.brand.name,
    bullets: req.authorName ? [req.authorName] : undefined,
    notes: "Контакт, призыв к действию, Q&A.",
    visualHint: "Логотип крупно, контакты внизу.",
  });

  return {
    title: req.topic || `${req.brand.name} • Presentation`,
    subtitle: req.brand.tagline || "",
    brandCompliance: [
      `Применена палитра ${req.brand.name}`,
      `Локальный fallback (Claude API не сконфигурирован — добавь VITE_ANTHROPIC_API_KEY в .env для качественной генерации)`,
    ],
    slides,
  };
}

export function describeProvider(): string {
  const model = getPresentationModel();
  return isClaudeConfigured()
    ? `Claude · ${model}`
    : "Локальный fallback / OpenAI-совместимый прокси — нужен VITE_ANTHROPIC_API_KEY для Claude Sonnet";
}
