import { useMemo, useRef, useState, type ReactNode } from "react";
import {
  FileUp,
  Sparkles,
  FileDown,
  Presentation as PresentationIcon,
  Building2,
  Languages,
  Target,
  Loader2,
  CheckCircle2,
  Info,
  ChevronRight,
  ChevronLeft,
  Users,
  UserCircle,
  Layers,
  MessageSquareText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/shared/components/Toast";
import { cn } from "@/lib/utils";

import {
  BRAND_LIST,
  getBrandProfile,
} from "@/services/presentation/brand-profiles";
import {
  generatePresentation,
  PresentationGoal,
  PresentationOutline,
  describeProvider,
  type PresentationSlide,
} from "@/services/presentation/presentation.service";
import { isClaudeConfigured } from "@/services/presentation/claude.service";
import { readPresentationFileAsText } from "@/services/presentation/document-text";
import { brandUsesRichDeckStyle } from "@/services/presentation/deck-visual-utils";
import type { BrandProfile } from "@/services/presentation/brand-profiles";
import { buildPptx, downloadBlob } from "@/services/presentation/pptx-builder";
import { buildPdf } from "@/services/presentation/pdf-builder";

export const GOALS: { id: PresentationGoal; label: string }[] = [
  { id: "sales", label: "Продажи" },
  { id: "investor", label: "Инвесторский питч" },
  { id: "internal", label: "Внутренняя" },
  { id: "training", label: "Обучение" },
  { id: "report", label: "Отчёт" },
  { id: "demo", label: "Демо продукта" },
];

const LANGUAGES: { id: "ru" | "en" | "kk"; label: string }[] = [
  { id: "ru", label: "Русский" },
  { id: "en", label: "English" },
  { id: "kk", label: "Қазақша" },
];

const AUDIENCE_CHIPS = [
  "C-level / руководство",
  "Техспециалисты / DevOps",
  "Клиенты / партнёры",
  "Закупки / compliance",
  "Внутренняя команда",
];

const SLIDE_CHIPS = [8, 10, 12, 15, 18, 20];

export type WizardStepId =
  | "brand"
  | "goal"
  | "language"
  | "topic"
  | "audience"
  | "speaker"
  | "slides"
  | "document";

const STEP_ORDER: WizardStepId[] = [
  "brand",
  "goal",
  "language",
  "topic",
  "audience",
  "speaker",
  "slides",
  "document",
];

interface PresentationAgentPanelProps {
  /** Режим: блок внутри ленты чата (без отдельной колонки и без вложенного ScrollArea) */
  inlineInChat?: boolean;
  /** После генерации — добавить реплики в ленту чата */
  appendChatMessages?: (
    items: { role: "user" | "assistant"; text: string }[]
  ) => void;
}

function ChipOption({
  selected,
  children,
  onClick,
  className,
}: {
  selected?: boolean;
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors text-left",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background hover:bg-muted/80 hover:border-primary/50",
        className
      )}
    >
      {children}
    </button>
  );
}

function OutlineSlidePreview({
  slide: s,
  index: i,
  brand,
}: {
  slide: PresentationSlide;
  index: number;
  brand: BrandProfile;
}) {
  const rich = brandUsesRichDeckStyle(brand);
  const split = brand.colors.splitBand;
  const bullets = s.bullets ?? [];
  const useBulletCards =
    rich &&
    bullets.length >= 2 &&
    bullets.length <= 6 &&
    s.layout === "bullets";

  const lineColor = `#${brand.colors.line}`;
  const accent = `#${brand.colors.accent}`;
  const muted = `#${brand.colors.textMuted}`;
  const bgDeep = `#${brand.colors.background}`;
  const surface = `#${brand.colors.surface}`;

  let mainBlock: ReactNode;

  if (s.layout === "stats" && s.stats && s.stats.length > 0) {
    mainBlock = (
      <>
        <div
          className={cn(
            "font-bold leading-tight line-clamp-2 mb-1",
            rich ? "text-base" : "text-xs"
          )}
        >
          {s.title}
        </div>
        <div className="flex gap-1 mt-1 justify-between min-h-0">
          {s.stats.slice(0, 4).map((st, si) => (
            <div
              key={si}
              className={cn(
                "flex-1 rounded-md px-1 py-1 text-center border min-w-0",
                rich && "backdrop-blur-[2px]"
              )}
              style={{
                borderColor: lineColor,
                background: rich ? "rgba(255,255,255,0.09)" : undefined,
              }}
            >
              <div
                className={cn(
                  "font-bold leading-none truncate",
                  rich ? "text-lg" : "text-sm"
                )}
                style={{ color: accent }}
              >
                {st.value}
              </div>
              <div
                className={cn(
                  "mt-0.5 leading-tight line-clamp-2",
                  rich ? "text-[9px]" : "text-[7px]"
                )}
                style={{ color: muted }}
              >
                {st.label}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  } else if (s.layout === "two-column") {
    mainBlock = (
      <div className="relative flex flex-col min-h-0 flex-1">
        <div
          className={cn(
            "font-bold leading-tight line-clamp-2",
            rich ? "text-[15px]" : "text-xs"
          )}
        >
          {s.title}
        </div>
        <div
          className={cn(
            "grid grid-cols-2 gap-1 mt-1.5 flex-1 min-h-0",
            rich ? "text-[10px]" : "text-[8px]"
          )}
        >
          <div
            className="border-r pr-1 space-y-0.5 min-h-0"
            style={{ borderColor: lineColor }}
          >
            {(s.bullets ?? []).slice(0, 3).map((b, bi) => (
              <div key={bi} className="line-clamp-2 leading-snug flex gap-0.5">
                <span style={{ color: accent }}>●</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
          <div className="pl-1 line-clamp-6 leading-snug min-h-0" style={{ color: muted }}>
            {s.body?.trim() || "—"}
          </div>
        </div>
        {rich && (
          <div
            className="absolute left-1/2 top-[28%] bottom-[18%] w-px -translate-x-1/2 pointer-events-none opacity-60 z-[11]"
            style={{
              background: `linear-gradient(180deg, transparent, ${accent}, transparent)`,
            }}
            aria-hidden
          />
        )}
      </div>
    );
  } else if (s.layout === "quote") {
    mainBlock = (
      <div className="flex flex-col flex-1 justify-center items-center gap-1 px-1 min-h-0">
        <p
          className={cn(
            "italic text-center leading-snug line-clamp-4",
            rich ? "text-[11px]" : "text-[10px]"
          )}
        >
          &ldquo;{s.body || s.title}&rdquo;
        </p>
        {s.subtitle && (
          <p
            className={cn(
              "text-center line-clamp-1",
              rich ? "text-[10px]" : "text-[9px]"
            )}
            style={{ color: accent }}
          >
            — {s.subtitle}
          </p>
        )}
      </div>
    );
  } else if (s.layout === "closing") {
    mainBlock = (
      <div className="flex flex-1 flex-col items-center justify-center gap-1 px-2 text-center min-h-0">
        <div
          className={cn(
            "font-bold leading-tight line-clamp-3",
            rich ? "text-lg" : "text-sm"
          )}
        >
          {s.title}
        </div>
        {s.subtitle && (
          <div className="text-[11px] line-clamp-2" style={{ color: accent }}>
            {s.subtitle}
          </div>
        )}
      </div>
    );
  } else if (s.layout === "title") {
    mainBlock = (
      <>
        <div
          className={cn(
            "font-bold leading-tight line-clamp-2",
            rich ? "text-[15px]" : "text-xs"
          )}
        >
          {s.title}
        </div>
        {rich && (
          <div
            className="mt-1.5 h-0.5 w-16 max-w-[40%] rounded-full"
            style={{ background: accent }}
          />
        )}
        {s.subtitle && (
          <div
            className={cn(
              "mt-1 line-clamp-2 leading-snug",
              rich ? "text-[12px]" : "text-[10px]"
            )}
            style={{ color: muted }}
          >
            {s.subtitle}
          </div>
        )}
      </>
    );
  } else if (s.layout === "section") {
    mainBlock = (
      <div className="flex gap-2 items-stretch min-h-0">
        {rich && (
          <div
            className="w-1 shrink-0 rounded-full self-stretch"
            style={{
              background: accent,
              minHeight: "2.5rem",
            }}
          />
        )}
        <div className="min-w-0 flex-1">
          <div
            className={cn(
              "font-bold leading-tight line-clamp-2",
              rich ? "text-[15px]" : "text-xs"
            )}
          >
            {s.title}
          </div>
          {s.subtitle && (
            <div
              className={cn(
                "mt-1 line-clamp-2 leading-snug",
                rich ? "text-[12px]" : "text-[10px]"
              )}
              style={{ color: muted }}
            >
              {s.subtitle}
            </div>
          )}
        </div>
      </div>
    );
  } else {
    mainBlock = (
      <>
        <div
          className={cn(
            "font-bold leading-tight line-clamp-2",
            rich ? "text-[15px]" : "text-xs"
          )}
        >
          {s.title}
        </div>
        {s.subtitle && (
          <div
            className={cn(
              "mt-1 line-clamp-2 leading-snug",
              rich ? "text-[12px]" : "text-[10px]"
            )}
            style={{ color: muted }}
          >
            {s.subtitle}
          </div>
        )}
      </>
    );
  }

  const bottomBullets =
    s.layout !== "stats" &&
    s.layout !== "two-column" &&
    s.layout !== "quote" &&
    s.layout !== "closing";

  return (
    <div
      className="rounded-xl border overflow-hidden bg-card"
      style={{ borderColor: lineColor }}
    >
      <div className="aspect-video relative overflow-hidden">
        {rich && split ? (
          <>
            <div
              className="absolute inset-y-0 left-0 w-[26%] z-0"
              style={{ backgroundColor: `#${split}` }}
            />
            <div
              className="absolute inset-y-0 z-0"
              style={{
                left: "26%",
                right: 0,
                background: `linear-gradient(90deg, ${surface} 0%, ${bgDeep} 100%)`,
              }}
            />
            <div
              className="absolute inset-0 z-[1] pointer-events-none opacity-[0.42]"
              aria-hidden
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "11px 13px",
                maskImage:
                  "linear-gradient(105deg, transparent 0%, transparent 30%, rgba(0,0,0,0.82) 50%, rgba(0,0,0,0.95) 100%)",
                WebkitMaskImage:
                  "linear-gradient(105deg, transparent 0%, transparent 30%, rgba(0,0,0,0.82) 50%, rgba(0,0,0,0.95) 100%)",
              }}
            />
          </>
        ) : (
          <div
            className="absolute inset-0 z-0"
            style={{ backgroundColor: bgDeep }}
          />
        )}

        {rich && (
          <div
            className="absolute inset-0 z-[2] pointer-events-none"
            aria-hidden
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.02) 36%, transparent 68%)",
            }}
          />
        )}

        {rich && (
          <div
            className="absolute top-10 bottom-24 right-1 z-[3] flex flex-col justify-center gap-1 pointer-events-none items-end"
            aria-hidden
          >
            {[42, 26, 48, 22, 36].map((w, wi) => (
              <div
                key={wi}
                className="h-1 rounded-full shrink-0 opacity-55"
                style={{
                  width: w,
                  backgroundColor: accent,
                }}
              />
            ))}
            <div className="flex gap-1 mt-2 opacity-70">
              {[0, 1, 2, 3].map((j) => (
                <span
                  key={j}
                  className="inline-block size-1.5 rounded-full"
                  style={{
                    backgroundColor: j % 2 === 0 ? accent : "rgba(255,255,255,0.35)",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {rich && brand.logoUrl ? (
          <img
            src={brand.logoUrl}
            alt=""
            className="absolute top-2 right-2 z-[16] h-6 sm:h-7 w-auto max-w-[38%] object-contain pointer-events-none"
          />
        ) : null}

        <div
          className={cn(
            "relative z-10 h-full p-2.5 sm:p-3 flex flex-col min-h-0",
            s.layout === "quote" || s.layout === "closing"
              ? "justify-center"
              : "justify-between"
          )}
          style={{ color: `#${brand.colors.text}` }}
        >
          <div className="min-h-0 shrink-0">
            <div
              className="text-[9px] uppercase tracking-[0.12em] mb-1 font-semibold"
              style={{ color: accent }}
            >
              {s.layout} · #{i + 1}
            </div>
          </div>

          <div
            className={cn(
              "min-h-0 flex flex-col",
              s.layout === "quote" || s.layout === "closing"
                ? "flex-1 justify-center"
                : "flex-1"
            )}
          >
            {mainBlock}
          </div>

          {rich &&
          s.layout === "bullets" &&
          bottomBullets &&
          bullets.length >= 2 ? (
            <div
              className="flex items-center gap-0.5 mt-0.5 shrink-0 px-0.5 opacity-85"
              aria-hidden
            >
              {bullets.slice(0, 5).map((_, si) => (
                <span key={si} className="flex items-center gap-0.5">
                  <span
                    className="inline-block size-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: accent }}
                  />
                  {si < Math.min(bullets.length, 5) - 1 ? (
                    <span
                      className="inline-block h-px w-3 shrink-0 rounded-full opacity-60"
                      style={{ backgroundColor: accent }}
                    />
                  ) : null}
                </span>
              ))}
            </div>
          ) : null}

          {bottomBullets &&
            (useBulletCards ? (
              <div className="flex flex-col gap-1 mt-1 overflow-hidden shrink-0">
                {bullets.slice(0, 4).map((b, bi) => (
                  <div
                    key={bi}
                    className="flex rounded-md overflow-hidden border min-h-0"
                    style={{
                      borderColor: lineColor,
                      background: "rgba(255,255,255,0.07)",
                    }}
                  >
                    <div
                      className="shrink-0 w-5 flex items-center justify-center text-[10px] font-bold"
                      style={{
                        background: accent,
                        color: bgDeep,
                      }}
                    >
                      {bi + 1}
                    </div>
                    <div className="px-1.5 py-0.5 text-[11px] leading-snug line-clamp-2">
                      {b}
                    </div>
                  </div>
                ))}
              </div>
            ) : bullets.length > 0 ? (
              <ul className="text-[11px] space-y-0.5 mt-1.5 leading-snug shrink-0">
                {bullets.slice(0, 4).map((b, bi) => (
                  <li key={bi} className="line-clamp-2 flex gap-1">
                    <span style={{ color: accent }} className="shrink-0">
                      ●
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : null)}

          {s.visualHint ? (
            <div
              className="mt-1 text-[7px] leading-tight line-clamp-2 italic shrink-0 opacity-85"
              style={{ color: muted }}
            >
              Визуал: {s.visualHint}
            </div>
          ) : null}
        </div>

        <div
          className="absolute left-0 right-0 bottom-0 h-1 z-20"
          style={{ background: accent }}
        />
      </div>
    </div>
  );
}

export function PresentationAgentPanel({
  inlineInChat,
  appendChatMessages,
}: PresentationAgentPanelProps) {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<WizardStepId>("brand");
  const [brandId, setBrandId] = useState<string | null>(null);
  const [goal, setGoal] = useState<PresentationGoal | null>(null);
  const [language, setLanguage] = useState<"ru" | "en" | "kk" | null>(null);
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [audienceCustom, setAudienceCustom] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [slidesCount, setSlidesCount] = useState<number | null>(null);
  const [sourceText, setSourceText] = useState("");
  const [fileName, setFileName] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExportingPptx, setIsExportingPptx] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [outline, setOutline] = useState<PresentationOutline | null>(null);

  const brand = useMemo(
    () => getBrandProfile(brandId || "qazcloud"),
    [brandId]
  );
  const claudeReady = isClaudeConfigured();

  const stepIndex = STEP_ORDER.indexOf(step);
  const totalSteps = STEP_ORDER.length;

  const goToStep = (s: WizardStepId) => setStep(s);

  const pickBrand = (id: string) => {
    setBrandId(id);
    goToStep("goal");
  };

  const pickGoal = (id: PresentationGoal) => {
    setGoal(id);
    goToStep("language");
  };

  const pickLanguage = (id: "ru" | "en" | "kk") => {
    setLanguage(id);
    goToStep("topic");
  };

  const submitTopic = (skip: boolean) => {
    if (skip) {
      setTopic("");
    } else {
      const t = topic.trim();
      if (!t) {
        showToast("Введите тему или нажмите «Без темы»", "warning");
        return;
      }
    }
    goToStep("audience");
  };

  const pickAudience = (label: string) => {
    setAudience(label);
    setAudienceCustom(false);
    goToStep("speaker");
  };

  const submitSpeaker = (skip: boolean) => {
    if (skip) {
      setAuthorName("");
    }
    goToStep("slides");
  };

  const pickSlides = (n: number) => {
    setSlidesCount(n);
    goToStep("document");
  };

  const handleBack = () => {
    const i = STEP_ORDER.indexOf(step);
    if (i <= 0) return;
    goToStep(STEP_ORDER[i - 1]!);
  };

  const handleFile = async (file: File) => {
    setFileName(file.name);
    try {
      const text = await readPresentationFileAsText(file);
      setSourceText(text);
      showToast(
        `${file.name} • ${text.length.toLocaleString("ru-RU")} символов`,
        "success"
      );
    } catch (e) {
      showToast(`Не удалось прочитать файл: ${String((e as Error).message || e)}`, "error");
    }
  };

  const handleGenerate = async () => {
    if (!brandId || !goal || !language || slidesCount == null) {
      showToast("Пройдите шаги мастера до конца", "warning");
      return;
    }
    if (!sourceText.trim()) {
      showToast(
        "Нужен текст: загрузите файл или вставьте содержимое ниже",
        "warning"
      );
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generatePresentation({
        brand,
        sourceText,
        topic: topic.trim() || undefined,
        audience: audience.trim() || undefined,
        authorName: authorName.trim() || undefined,
        goal,
        language,
        slidesCount,
      });
      setOutline(result);
      const modeLabel =
        result.generatedBy === "claude"
          ? "Claude"
          : result.generatedBy === "openai-compatible"
            ? "OpenAI-compatible"
            : "локально";
      appendChatMessages?.([
        {
          role: "user",
          text: "Сгенерировать презентацию по тексту и параметрам мастера",
        },
        {
          role: "assistant",
          text: `**Готово.** Слайдов: **${result.slides.length}** (${modeLabel}). Ниже — превью; скачайте **PPTX** или **PDF**.`,
        },
      ]);
      showToast(
        `Презентация готова: ${result.slides.length} слайдов`,
        "success"
      );
    } catch (e) {
      appendChatMessages?.([
        {
          role: "assistant",
          text: `**Ошибка:** ${String((e as Error).message || e)}`,
        },
      ]);
      showToast(`Ошибка генерации: ${String((e as Error).message || e)}`, "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPptx = async () => {
    if (!outline) return;
    setIsExportingPptx(true);
    try {
      const blob = await buildPptx(outline, brand);
      const safe = outline.title.replace(/[^\p{L}\p{N}._-]+/gu, "_").slice(0, 60);
      downloadBlob(blob, `${safe || "presentation"}.pptx`);
      showToast("PPTX сохранён", "success");
    } catch (e) {
      showToast(`PPTX: ${String((e as Error).message || e)}`, "error");
    } finally {
      setIsExportingPptx(false);
    }
  };

  const handleExportPdf = async () => {
    if (!outline) return;
    setIsExportingPdf(true);
    try {
      const blob = await buildPdf(outline, brand);
      const safe = outline.title.replace(/[^\p{L}\p{N}._-]+/gu, "_").slice(0, 60);
      downloadBlob(blob, `${safe || "presentation"}.pdf`);
      showToast("PDF сохранён", "success");
    } catch (e) {
      showToast(`PDF: ${String((e as Error).message || e)}`, "error");
    } finally {
      setIsExportingPdf(false);
    }
  };

  const renderQuestion = () => {
    switch (step) {
      case "brand":
        return (
          <>
            <p className="text-sm text-foreground leading-snug">
              Для **какой компании** применить brand guideline и оформление?
            </p>
            <div className="flex flex-wrap gap-2">
              {BRAND_LIST.map((b) => (
                <ChipOption
                  key={b.id}
                  selected={brandId === b.id}
                  onClick={() => pickBrand(b.id)}
                >
                  {b.name}
                </ChipOption>
              ))}
            </div>
          </>
        );
      case "goal":
        return (
          <>
            <p className="text-sm text-foreground leading-snug">
              Какова **цель** презентации?
            </p>
            <div className="flex flex-wrap gap-2">
              {GOALS.map((g) => (
                <ChipOption
                  key={g.id}
                  selected={goal === g.id}
                  onClick={() => pickGoal(g.id)}
                >
                  {g.label}
                </ChipOption>
              ))}
            </div>
          </>
        );
      case "language":
        return (
          <>
            <p className="text-sm text-foreground leading-snug">
              На **каком языке** оформить заголовки и текст на слайдах?
            </p>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <ChipOption
                  key={l.id}
                  selected={language === l.id}
                  onClick={() => pickLanguage(l.id)}
                >
                  {l.label}
                </ChipOption>
              ))}
            </div>
          </>
        );
      case "topic":
        return (
          <>
            <p className="text-sm text-foreground leading-snug">
              **Тема или название** презентации (будет на титульном слайде)?
            </p>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Например: Облачная платформа для ритейла"
              className="h-9 text-sm"
            />
            <div className="flex flex-wrap gap-2">
              <ChipOption
                selected={false}
                onClick={() => submitTopic(true)}
              >
                Без темы / позже
              </ChipOption>
              <Button size="sm" className="rounded-full" onClick={() => submitTopic(false)}>
                Далее
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </>
        );
      case "audience":
        return (
          <>
            <p className="text-sm text-foreground leading-snug">
              **Кто аудитория?** Выберите или уточните ниже.
            </p>
            <div className="flex flex-wrap gap-2">
              {AUDIENCE_CHIPS.map((a) => (
                <ChipOption
                  key={a}
                  selected={!audienceCustom && audience === a}
                  onClick={() => pickAudience(a)}
                >
                  {a}
                </ChipOption>
              ))}
            </div>
            <div className="space-y-2">
              <Input
                value={audienceCustom ? audience : ""}
                onChange={(e) => {
                  setAudienceCustom(true);
                  setAudience(e.target.value);
                }}
                placeholder="Свой вариант аудитории…"
                className="h-9 text-sm"
              />
              {audienceCustom && audience.trim() && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full"
                  onClick={() => {
                    goToStep("speaker");
                  }}
                >
                  Подтвердить аудиторию
                </Button>
              )}
            </div>
          </>
        );
      case "speaker":
        return (
          <>
            <p className="text-sm text-foreground leading-snug">
              **Спикер / контакт** на финальном слайде?
            </p>
            <Input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Имя Фамилия, должность"
              className="h-9 text-sm"
            />
            <div className="flex flex-wrap gap-2">
              <ChipOption selected={false} onClick={() => submitSpeaker(true)}>
                Не указывать
              </ChipOption>
              <Button size="sm" className="rounded-full" onClick={() => submitSpeaker(false)}>
                Далее
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </>
        );
      case "slides":
        return (
          <>
            <p className="text-sm text-foreground leading-snug">
              Сколько **слайдов** примерно нужно (вместе с титульным и финальным)?
            </p>
            <div className="flex flex-wrap gap-2">
              {SLIDE_CHIPS.map((n) => (
                <ChipOption
                  key={n}
                  selected={slidesCount === n}
                  onClick={() => pickSlides(n)}
                >
                  {n}
                </ChipOption>
              ))}
            </div>
          </>
        );
      case "document":
        return (
          <>
            <p className="text-sm text-foreground leading-snug">
              Загрузите **файл** или вставьте **текст** документа, из которого собрать презентацию.
            </p>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={async (e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) await handleFile(f);
              }}
              className="border-2 border-dashed border-border/60 hover:border-primary/60 rounded-xl p-4 text-center cursor-pointer transition-colors bg-muted/20"
            >
              <FileUp className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <div className="text-xs">
                {fileName ? (
                  <span className="font-medium">{fileName}</span>
                ) : (
                  <span>
                    Перетащите файл или{" "}
                    <span className="text-primary underline">выбрать</span>
                  </span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".txt,.md,.markdown,.csv,.json,.html,.htm,.pdf,.docx,.pptx,.rtf"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) await handleFile(f);
                }}
              />
            </div>
            <Textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Или вставьте текст здесь…"
              className={cn(
                "font-mono text-xs",
                inlineInChat ? "min-h-[120px]" : "min-h-[160px]"
              )}
            />
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] text-muted-foreground">
                {sourceText.length.toLocaleString("ru-RU")} симв.
              </span>
              <Button
                size="sm"
                onClick={handleGenerate}
                disabled={
                  isGenerating ||
                  !sourceText.trim() ||
                  !brandId ||
                  !goal ||
                  !language ||
                  slidesCount == null
                }
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Генерация…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Сгенерировать
                  </>
                )}
              </Button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const summaryBadges =
    brandId && goal && language && slidesCount != null ? (
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="outline" className="text-[10px] font-normal">
          {getBrandProfile(brandId).name}
        </Badge>
        <Badge variant="outline" className="text-[10px] font-normal">
          {GOALS.find((g) => g.id === goal)?.label}
        </Badge>
        <Badge variant="outline" className="text-[10px] font-normal">
          {LANGUAGES.find((l) => l.id === language)?.label}
        </Badge>
        {topic.trim() && (
          <Badge variant="outline" className="text-[10px] font-normal max-w-[140px] truncate">
            {topic.trim()}
          </Badge>
        )}
        {audience.trim() && (
          <Badge variant="outline" className="text-[10px] font-normal max-w-[120px] truncate">
            {audience.trim()}
          </Badge>
        )}
        <Badge variant="outline" className="text-[10px] font-normal">
          {slidesCount} слайдов
        </Badge>
      </div>
    ) : null;

  return (
    <div
      className={cn(
        "space-y-4 pb-4",
        inlineInChat ? "pt-1" : "max-w-7xl mx-auto p-6 space-y-6"
      )}
    >
        <Card className="border-primary/20 bg-card/80">
          <CardHeader className="py-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquareText className="h-4 w-4 text-primary shrink-0" />
                Пошаговый мастер
              </CardTitle>
              <span className="text-[11px] text-muted-foreground tabular-nums">
                Шаг {stepIndex + 1} из {totalSteps}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{
                  width: `${((stepIndex + 1) / totalSteps) * 100}%`,
                }}
              />
            </div>
            {summaryBadges && step !== "brand" && (
              <div className="pt-1">{summaryBadges}</div>
            )}
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-primary">
                {step === "brand" && <Building2 className="h-4 w-4" />}
                {step === "goal" && <Target className="h-4 w-4" />}
                {step === "language" && <Languages className="h-4 w-4" />}
                {step === "topic" && <PresentationIcon className="h-4 w-4" />}
                {step === "audience" && <Users className="h-4 w-4" />}
                {step === "speaker" && <UserCircle className="h-4 w-4" />}
                {step === "slides" && <Layers className="h-4 w-4" />}
                {step === "document" && <FileUp className="h-4 w-4" />}
              </div>
              <div className="flex-1 space-y-3 min-w-0">{renderQuestion()}</div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/60">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={handleBack}
                disabled={stepIndex === 0}
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                Назад
              </Button>
            </div>
          </CardContent>
        </Card>

        {inlineInChat ? (
          <p className="text-[10px] text-muted-foreground px-1">
            {describeProvider()}
            {!claudeReady && (
              <>
                {" · "}
                <code className="px-1 rounded bg-muted text-[9px]">
                  VITE_ANTHROPIC_API_KEY
                </code>
              </>
            )}
          </p>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-3 space-y-1 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Info className="h-3.5 w-3.5 shrink-0" />
                AI: {describeProvider()}
                {claudeReady ? (
                  <Badge variant="outline" className="text-[10px] py-0">
                    Claude OK
                  </Badge>
                ) : null}
              </div>
              {!claudeReady && (
                <p>
                  <code className="px-1 rounded bg-muted">VITE_ANTHROPIC_API_KEY</code> для Claude Sonnet.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {outline && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 py-3 flex-wrap">
              <CardTitle className="text-sm flex items-center gap-2 min-w-0">
                <PresentationIcon className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate">{outline.title}</span>
              </CardTitle>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleExportPdf}
                  disabled={isExportingPdf}
                >
                  {isExportingPdf ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileDown className="h-4 w-4 mr-2" />
                  )}
                  PDF
                </Button>
                <Button
                  size="sm"
                  onClick={handleExportPptx}
                  disabled={isExportingPptx}
                >
                  {isExportingPptx ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileDown className="h-4 w-4 mr-2" />
                  )}
                  PPTX
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{brand.name}</Badge>
                <Badge variant="secondary">
                  {GOALS.find((g) => g.id === goal)?.label}
                </Badge>
                <Badge variant="secondary">{outline.slides.length} слайдов</Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    outline.generatedBy === "claude" &&
                      "border-emerald-500/40 text-emerald-500",
                    outline.generatedBy === "local-fallback" &&
                      "border-amber-500/40 text-amber-500"
                  )}
                >
                  {outline.generatedBy === "claude"
                    ? "Claude"
                    : outline.generatedBy === "openai-compatible"
                      ? "OpenAI-compatible"
                      : "Local fallback"}
                </Badge>
              </div>

              <div
                className={cn(
                  "grid gap-2",
                  inlineInChat ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
                )}
              >
                {outline.slides.map((s, i) => (
                  <OutlineSlidePreview key={i} slide={s} index={i} brand={brand} />
                ))}
              </div>

              {outline.brandCompliance.length > 0 && (
                <div className="rounded-lg border bg-muted/30 p-2 space-y-1">
                  <div className="text-[11px] font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Brand compliance
                  </div>
                  <ul className="text-[10px] text-muted-foreground space-y-0.5">
                    {outline.brandCompliance.map((c, i) => (
                      <li key={i}>• {c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
    </div>
  );
}
