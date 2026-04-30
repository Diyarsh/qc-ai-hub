/**
 * Brand profiles used by the Presentation Agent.
 * Colors are stored as HEX without leading "#" so they can be passed directly to pptxgenjs.
 */

export interface BrandColor {
  name: string;
  hex: string;
}

export interface BrandProfile {
  id: string;
  name: string;
  tagline?: string;
  logoUrl: string;
  colors: {
    background: string;
    surface: string;
    primary: string;
    accent: string;
    text: string;
    textMuted: string;
    line: string;
    /** Узкая вертикальная плашка слева (фирменный приём из гайдлайна) */
    splitBand?: string;
  };
  palette: BrandColor[];
  typography: {
    heading: string;
    body: string;
  };
  voice: {
    tone: string;
    do: string[];
    dont: string[];
  };
  /** Доп. правила для outline — официальный дизайн/тональность из Brand Guidelines */
  guidelinePrompt?: string;
  defaults: {
    language: "ru" | "en" | "kk";
    slidesCount: number;
  };
}

export const BRAND_PROFILES: Record<string, BrandProfile> = {
  qazcloud: {
    id: "qazcloud",
    name: "QazCloud",
    tagline:
      "Мы делаем простыми и доступными сложные цифровые решения. Каждый день. Каждый час. Для каждой отрасли.",
    logoUrl: "/brands/qazcloud/logo.svg",
    colors: {
      background: "2438C7",
      surface: "4B62EA",
      primary: "FFFFFF",
      accent: "8BADFF",
      text: "FFFFFF",
      textMuted: "C8D8FF",
      line: "5C73EB",
      splitBand: "6478F5",
    },
    palette: [
      { name: "Deep Blue", hex: "2438C7" },
      { name: "Mid Blue", hex: "4D62FF" },
      { name: "Light Blue", hex: "6478F5" },
      { name: "Accent Sky", hex: "8BADFF" },
      { name: "White", hex: "FFFFFF" },
    ],
    typography: {
      heading: "Inter",
      body: "Inter",
    },
    voice: {
      tone:
        "Спокойный эксперт и надёжный партнёр (архетипы «Хранитель» и «Мудрец»): факты, ответственность, «тихая гордость» за компетенцию — без хайпа и давления.",
      do: [
        "Опирайся на ценности: надёжность и безопасность; масштаб и лидерство; инновационность; рост",
        "Подчёркивай партнёрство, предсказуемость и экспертизу инженерной команды",
        "Формулируй выгоды для клиента ясно и по делу",
      ],
      dont: [
        "Не используй агрессивный маркетинг и пустые обещания",
        "Не перегружай слайд текстом — воздух и структура важнее",
        "Не смешивай несколько мыслей в одном буллете",
      ],
    },
    guidelinePrompt: [
      `Официальный визуальный стиль — QazCloud Brand Guidelines (2025):`,
      `- Фон: монохромная палитра синих — от глубокого королевского (#2438C7) к более светлым (#6478F5, #8BADFF). Не использовать чёрный фон и «бронзовые» акценты старого набора.`,
      `- Композиция: много «воздуха», чёткая сетка; допустима вертикальная двух-тоновая плашка (узкая светлая слева ~¼ ширины, основная глубокая синяя справа).`,
      `- Типографика: современный геометрический grotesk (в экспорте — Inter); заголовки и текст на слайде — белые или очень светлые на синем фоне.`,
      `- Декор: допустимы лёгкие технологичные мотивы (точечные/halftone паттерны), без перегруза.`,
      `- Инфографика в содержании: предлагай слайды с KPI (stats), сравнениями (two-column), блок-схемами и таймлайнами; в visualHint всегда конкретика (не «иллюстрация», а «столбчатая диаграмма 3 колонки», «стрелки этапов 1→2→3»).`,
      `- Миссия (для смыслов): создавать облачные сервисы и строить дата-центры, чтобы бизнес и люди росли без границ в безопасном и надёжном цифровом мире.`,
      `- Видение: быть узнаваемой и надёжной IT-платформой, дающей свободу расти и открывать новые горизонты.`,
      `- Тональность: надёжность, экспертиза, партнёрство; присутствие без навязчивости.`,
      `- Визуальные подсказки в поле visualHint должны соответствовать этому стилю (синие градиенты, светлый текст, минимализм).`,
    ].join("\n"),
    defaults: {
      language: "ru",
      slidesCount: 10,
    },
  },
  "samruk-kazyna": {
    id: "samruk-kazyna",
    name: "Samruk-Kazyna",
    tagline: "Корпоративный фонд национального благосостояния",
    logoUrl: "/brands/qazcloud/logo.png",
    colors: {
      background: "07182B",
      surface: "0E2843",
      primary: "FFFFFF",
      accent: "A17436",
      text: "F5F1EA",
      textMuted: "B9B2A3",
      line: "1B3658",
    },
    palette: [
      { name: "Navy 295C", hex: "07182B" },
      { name: "Bronze 7504C", hex: "A17436" },
      { name: "Cream", hex: "F5F1EA" },
    ],
    typography: { heading: "Inter", body: "Inter" },
    voice: {
      tone: "Официальный, корпоративный, выверенный. Подходит для регуляторных и стратегических презентаций.",
      do: ["Соблюдай корпоративную риторику", "Опирайся на нормативные источники"],
      dont: ["Не используй разговорные обороты", "Не делай предположений без источника"],
    },
    defaults: { language: "ru", slidesCount: 12 },
  },
  generic: {
    id: "generic",
    name: "Generic / без брендинга",
    logoUrl: "/QC-logo.svg",
    colors: {
      background: "FFFFFF",
      surface: "F5F5F7",
      primary: "111111",
      accent: "2563EB",
      text: "111111",
      textMuted: "555555",
      line: "E5E5E5",
    },
    palette: [
      { name: "Black", hex: "111111" },
      { name: "Blue", hex: "2563EB" },
      { name: "Gray", hex: "F5F5F7" },
    ],
    typography: { heading: "Inter", body: "Inter" },
    voice: {
      tone: "Нейтральный деловой стиль.",
      do: ["Структурируй контент логично"],
      dont: ["Не используй жаргон"],
    },
    defaults: { language: "ru", slidesCount: 10 },
  },
};

export const BRAND_LIST = Object.values(BRAND_PROFILES);

export function getBrandProfile(id: string): BrandProfile {
  return BRAND_PROFILES[id] || BRAND_PROFILES.qazcloud;
}
