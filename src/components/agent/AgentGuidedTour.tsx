import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, Check, MousePointer2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface AgentTourStep {
  target: string;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

interface Props {
  name: string;
  step: number | null;
  steps: AgentTourStep[];
  onBack: () => void;
  onClose: () => void;
}

// Non-modal hints: the highlighted controls remain usable throughout the tour.
export function AgentGuidedTour({ name, step, steps, onBack, onClose }: Props) {
  const [bounds, setBounds] = useState<DOMRect | null>(null);
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });
  const actionRef = useRef<HTMLButtonElement>(null);
  const current = step === null ? undefined : steps[step];
  const target = current?.target;

  useEffect(() => {
    if (step === null || !target) { setBounds(null); return; }
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const element = document.querySelector(target);
        setBounds(element?.getBoundingClientRect() ?? null);
        setViewport({ width: window.innerWidth, height: window.innerHeight });
      });
    };
    const element = document.querySelector(target);
    element?.scrollIntoView({ block: "nearest", behavior: "instant" });
    const observer = new ResizeObserver(measure);
    if (element) observer.observe(element);
    const mutations = new MutationObserver(measure);
    mutations.observe(document.getElementById("root")!, { childList: true, subtree: true });
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    measure();
    actionRef.current?.focus({ preventScroll: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect(); mutations.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [step, target]);

  useEffect(() => {
    if (step === null) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, onClose]);

  if (step === null || !current) return null;
  const width = Math.min(352, viewport.width - 24);
  const panelHeight = 282;
  const left = bounds ? Math.min(Math.max(12, bounds.right - width), viewport.width - width - 12) : (viewport.width - width) / 2;
  const top = bounds
    ? bounds.top >= panelHeight + 24
      ? bounds.top - panelHeight - 16
      : Math.min(bounds.bottom + 16, viewport.height - panelHeight - 12)
    : Math.max(12, (viewport.height - panelHeight) / 2);

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[80]">
      {bounds && bounds.width > 0 ? (
        <div className="absolute rounded-xl border-2 border-primary shadow-[0_0_0_9999px_rgba(8,20,31,0.42)]" style={{ top: Math.max(0, bounds.top - 6), left: Math.max(0, bounds.left - 6), width: Math.min(viewport.width, bounds.width + 12), height: Math.min(viewport.height, bounds.height + 12) }} />
      ) : <div className="absolute inset-0 bg-slate-950/40" />}
      <section role="region" aria-label={`Знакомство с агентом ${name}`} className="pointer-events-auto absolute rounded-2xl border border-border bg-popover p-5 text-popover-foreground shadow-2xl" style={{ left, top: Math.max(12, top), width }}>
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-[11px] font-medium text-primary"><MousePointer2 className="h-4 w-4" />Знакомство · {step + 1} из {steps.length}</p>
          <button onClick={onClose} aria-label="Закрыть знакомство" className="rounded-md p-1 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <div aria-live="polite" className="mt-3">
          <h3 className="text-lg font-semibold leading-snug">{current.title}</h3>
          <p className="mt-2 min-h-[60px] text-sm leading-5 text-muted-foreground">{current.description}</p>
        </div>
        <div className="mt-4 flex gap-1.5" aria-hidden="true">{steps.map((_, index) => <div key={index} className={`h-1 flex-1 rounded-full ${index <= step ? "bg-primary" : "bg-muted"}`} />)}</div>
        <div className="mt-4 flex items-center justify-between gap-2">
          {step > 0 ? <Button size="sm" variant="ghost" onClick={onBack} className="gap-1 px-2"><ArrowLeft className="h-3.5 w-3.5" />Назад</Button> : <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">Пропустить</button>}
          <Button ref={actionRef} size="sm" onClick={current.onAction} className="gap-1.5">{current.actionLabel}{step === steps.length - 1 ? <Check className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}</Button>
        </div>
      </section>
    </div>, document.body,
  );
}
