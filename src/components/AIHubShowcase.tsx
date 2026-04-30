import { motion } from "framer-motion";
import {
  Bot,
  Sparkles,
  Quote,
  BarChart3,
  MessageSquare,
  Send,
  Plus,
  ThumbsUp,
  ThumbsDown,
  FileText,
  ArrowUpRight,
  Wand2,
  Database,
  ShieldCheck,
  TrendingUp,
  Eye,
  MousePointerClick,
} from "lucide-react";

interface FeatureMock {
  id: string;
  icon: typeof Bot;
  title: string;
  description: string;
  visual: React.ReactNode;
}

const cardEnter = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const visualEnter = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

function AgentChatMock() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c0a09] via-[#11100e] to-[#1a1814] p-5 sm:p-6">
      <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-[#A17436]/20 blur-3xl" />
      <div className="relative flex flex-col gap-3">
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="ml-auto max-w-[80%]"
        >
          <div className="rounded-2xl rounded-br-md border border-[#A17436]/40 bg-[#A17436]/15 px-4 py-2.5 text-sm text-white">
            Подскажи политику командировок и лимиты на проживание
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="max-w-[92%]"
        >
          <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#A17436]/20 text-[#E1B383]">
              <Bot className="h-3.5 w-3.5" />
            </span>
            <span className="font-medium text-zinc-200">HR-Ассистент Самрука</span>
            <span className="rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-emerald-300/90 bg-emerald-500/10 border border-emerald-500/30">
              Локальный
            </span>
          </div>
          <div className="rounded-2xl rounded-tl-md border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-zinc-100 backdrop-blur">
            <p className="font-semibold text-white">Политика командировок:</p>
            <ul className="mt-1.5 space-y-1 text-zinc-300">
              <li>• Лимит проживания — до 35 000 ₸ / сутки в городах I категории</li>
              <li>• Суточные внутри РК — 10 МРП</li>
              <li>• Заявка согласуется руководителем за 3 рабочих дня</li>
            </ul>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-zinc-400">
              <FileText className="h-3 w-3" />
              <span>Источник: ВНД 04.7 «Командировки», п. 3.2</span>
            </div>
          </div>
        </motion.div>

        <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
          <Plus className="h-4 w-4 text-zinc-500" />
          <span className="flex-1 text-xs text-zinc-500">Спросить у HR-Ассистента…</span>
          <button className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#A17436] text-white">
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StudioBuilderMock() {
  const blocks = [
    { icon: Database, label: "База знаний", tag: "ВНД" },
    { icon: ShieldCheck, label: "Гайдрейлы", tag: "PII" },
    { icon: Wand2, label: "Промпт-шаблон", tag: "v3" },
    { icon: Bot, label: "Модель", tag: "GPT-4 Turbo" },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d0c0a] via-[#161311] to-[#1f1a14] p-5 sm:p-6">
      <div className="absolute -bottom-12 -left-10 h-56 w-56 rounded-full bg-[#A17436]/20 blur-3xl" />
      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#A17436]/15 text-[#E1B383]">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">AI Studio · конструктор агента</p>
            <p className="text-[11px] text-zinc-400">Соберите своего AI-помощника без кода</p>
          </div>
          <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">
            готов к запуску
          </span>
        </div>

        <div className="space-y-2">
          {blocks.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 backdrop-blur"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#A17436]/15 text-[#E1B383]">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">{b.label}</p>
                  <p className="text-[11px] text-zinc-400">конфигурация · drag-and-drop</p>
                </div>
                <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-300">
                  {b.tag}
                </span>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: 0.5 }}
          className="mt-3 flex items-center justify-between rounded-xl border border-[#A17436]/30 bg-[#A17436]/10 px-3 py-2"
        >
          <span className="text-xs text-[#E1B383]">Опубликовать в каталоге Самрука</span>
          <button className="inline-flex items-center gap-1 rounded-md bg-[#A17436] px-2.5 py-1 text-[11px] font-medium text-white">
            Запустить
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function CitationMock() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b0a09] via-[#13110f] to-[#1c1814] p-5 sm:p-6">
      <div className="absolute top-1/3 right-0 h-48 w-48 rounded-full bg-[#A17436]/15 blur-3xl" />
      <div className="relative">
        <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-zinc-300">
          <Quote className="h-3 w-3 text-[#E1B383]" />
          Ответ с цитатами из источников
        </div>

        <p className="text-sm leading-relaxed text-zinc-100">
          Согласно{" "}
          <span className="rounded border border-[#A17436]/40 bg-[#A17436]/15 px-1 py-0.5 text-[#E1B383]">
            ВНД 04.7
          </span>{" "}
          лимит на проживание в городах I категории составляет{" "}
          <span className="rounded border border-[#A17436]/40 bg-[#A17436]/15 px-1 py-0.5 text-[#E1B383]">
            35 000 ₸
          </span>{" "}
          в сутки. Суточные регулируются{" "}
          <span className="rounded border border-[#A17436]/40 bg-[#A17436]/15 px-1 py-0.5 text-[#E1B383]">
            пп. 3.2
          </span>
          .
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {[
            { name: "ВНД 04.7 «Командировки»", page: "стр. 12, п. 3.2", color: "from-[#A17436]/30 to-[#A17436]/10" },
            { name: "Постановление №412", page: "Приложение 2", color: "from-emerald-500/30 to-emerald-500/10" },
          ].map((doc, i) => (
            <motion.div
              key={doc.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: 0.15 + i * 0.1 }}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur"
            >
              <div
                className={`mb-2 inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br ${doc.color}`}
              >
                <FileText className="h-3.5 w-3.5 text-white" />
              </div>
              <p className="text-[12px] font-medium text-white truncate">{doc.name}</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">{doc.page}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] text-zinc-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          Только проверенные внутренние документы Самрук-Қазына
        </div>
      </div>
    </div>
  );
}

function AnalyticsMock() {
  const bars = [42, 58, 36, 70, 64, 88, 52, 76, 60, 92, 70, 58];
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d0c0a] via-[#15130f] to-[#1f1b14] p-5 sm:p-6">
      <div className="absolute -top-10 -left-10 h-48 w-48 rounded-full bg-[#A17436]/15 blur-3xl" />
      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Аналитика по агентам</p>
            <p className="text-[11px] text-zinc-400">за последние 30 дней</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300">
            <TrendingUp className="h-3 w-3" />
            +12.4%
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Пользователей", value: "3 243", icon: MousePointerClick },
            { label: "Сообщений", value: "12 580", icon: MessageSquare },
            { label: "Открытий", value: "5 412", icon: Eye },
          ].map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.label}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5"
              >
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                  <Icon className="h-3 w-3" />
                  {kpi.label}
                </div>
                <p className="mt-1 text-base font-semibold text-white tabular-nums">
                  {kpi.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="flex h-24 items-end gap-1.5">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: 0.05 * i, ease: "easeOut" }}
                className="flex-1 rounded-t bg-gradient-to-t from-[#A17436]/40 to-[#E1B383]"
              />
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500">
            <span>1 апр</span>
            <span>15 апр</span>
            <span>30 апр</span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-[11px] text-zinc-400">
          <span className="inline-flex items-center gap-1">
            <ThumbsUp className="h-3 w-3 text-emerald-400" />
            2 184 лайков
          </span>
          <span className="inline-flex items-center gap-1">
            <ThumbsDown className="h-3 w-3 text-red-400" />
            136 дизлайков
          </span>
        </div>
      </div>
    </div>
  );
}

const FEATURES: FeatureMock[] = [
  {
    id: "agents",
    icon: Bot,
    title: "Каталог AI-агентов Самрука",
    description:
      "Готовые помощники по HR, юриспруденции, финансам, закупкам и ВНД — отвечают на основе ваших документов и говорят на трёх языках.",
    visual: <AgentChatMock />,
  },
  {
    id: "studio",
    icon: Sparkles,
    title: "AI Studio · соберите своего агента",
    description:
      "Drag-and-drop конструктор: подключите базы знаний, гайдрейлы, модель и шаблон промпта, опубликуйте в каталоге компании.",
    visual: <StudioBuilderMock />,
  },
  {
    id: "sources",
    icon: Quote,
    title: "Не просто ответ — источник",
    description:
      "Каждый ответ сопровождается ссылками на ВНД, законы и регламенты. Ничего лишнего: только проверенные внутренние документы.",
    visual: <CitationMock />,
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Аналитика и инсайты",
    description:
      "Посмотрите, какие агенты и темы востребованы, как распределяются дизлайки, и оцените эффект от внедрения по компании и департаментам.",
    visual: <AnalyticsMock />,
  },
];

export const AIHubShowcase = () => {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-[#A17436]/8 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={cardEnter}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-3xl text-center sm:mb-20"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#A17436]/30 bg-[#A17436]/10 px-4 py-1.5 text-sm font-medium text-[#A17436]">
            <Sparkles className="h-4 w-4" />
            Возможности AI-HUB
          </div>
          <h2 className="text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Ваш AI-партнёр для работы со знаниями Самрук-Қазына
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Единая платформа: каталог корпоративных агентов, конструктор без кода,
            ответы со ссылками на источники и аналитика использования.
          </p>
        </motion.div>

        <div className="space-y-12 sm:space-y-20">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            const reverse = idx % 2 === 1;
            return (
              <motion.div
                key={feature.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardEnter}
                transition={{ duration: 0.6, delay: 0.05 }}
                className={`grid items-center gap-6 sm:gap-10 lg:grid-cols-12 ${
                  reverse ? "lg:[direction:rtl]" : ""
                }`}
              >
                <div
                  className={`lg:col-span-4 ${reverse ? "lg:[direction:ltr]" : ""}`}
                >
                  <div className="flex items-start gap-4 sm:flex-col sm:items-start">
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#A17436]/12 text-[#A17436] ring-1 ring-[#A17436]/30">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
                        {feature.title}
                      </h3>
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>

                <motion.div
                  variants={visualEnter}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className={`lg:col-span-8 ${reverse ? "lg:[direction:ltr]" : ""}`}
                >
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-[#A17436]/30 via-transparent to-transparent opacity-60 blur-xl" />
                    <div className="relative aspect-[16/10] w-full rounded-3xl border border-white/10 bg-zinc-950/40 p-1.5 shadow-2xl shadow-black/40 ring-1 ring-black/5 sm:p-2">
                      <div className="h-full w-full">{feature.visual}</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AIHubShowcase;
