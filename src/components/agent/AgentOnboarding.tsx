import { ArrowRight, Check, FileText, MousePointer2, Sparkles, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isMediaAgent, type AgentOnboardingConfig } from "@/data/agent-onboarding";

interface Props {
  config: AgentOnboardingConfig;
  onStart: () => void;
  onExample: (prompt: string) => void;
  onPreview: () => void;
}

export function AgentOnboarding({ config, onStart, onExample, onPreview }: Props) {
  const Icon = config.icon;
  return (
    <section className="py-6 md:py-9" aria-label={`Знакомство: ${config.name}`}>
      <div className="rounded-3xl border border-primary/15 bg-gradient-to-b from-primary/[0.06] via-card to-card p-6 shadow-sm md:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium">{config.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Ваш первый шаг с агентом</p>
          </div>
        </div>
        <h2 className="max-w-xl text-2xl font-semibold leading-tight tracking-tight md:text-3xl">{config.headline}</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{config.description}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold"><FileText className="h-4 w-4 text-primary" />Что понадобится</p>
            <p className="text-sm leading-5 text-muted-foreground">{config.inputHint}</p>
            {config.formats && <p className="mt-2 text-[11px] uppercase tracking-wide text-primary">{config.formats.map(f => f.slice(1)).join(" · ")}</p>}
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold"><Check className="h-4 w-4 text-primary" />Что получите</p>
            <p className="text-sm leading-5 text-muted-foreground">{config.resultHint}</p>
          </div>
        </div>
        {isMediaAgent(config) && (
          <div className="mt-4 flex gap-2.5 rounded-xl bg-primary/5 p-3 text-xs leading-5 text-muted-foreground">
            <Video className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p>Для записи из Microsoft Teams выберите <span className="font-medium text-foreground">«Загрузить видео»</span> в меню добавления файла.</p>
          </div>
        )}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button onClick={onStart} className="gap-2 rounded-xl"><MousePointer2 className="h-4 w-4" />Пройти знакомство<ArrowRight className="h-4 w-4" /></Button>
          <Button variant="outline" onClick={onPreview} className="gap-2 rounded-xl"><Sparkles className="h-4 w-4" />Показать пример результата</Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Около минуты · подсказки прямо в интерфейсе · можно пропустить</p>
      </div>
      <div className="mt-6">
        <p className="mb-3 text-xs font-medium text-muted-foreground">Или начните с готового запроса</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {config.examples.map(example => (
            <button key={example.title} onClick={() => onExample(example.prompt)} className="group rounded-2xl border border-border/70 bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <span className="flex items-center justify-between gap-2 text-sm font-medium">{example.title}<ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" /></span>
              <span className="mt-2 block text-xs leading-5 text-muted-foreground">{example.prompt}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
