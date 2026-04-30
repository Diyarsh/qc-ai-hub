import AIStudio3Chat from "./AIStudio3Chat";

/** Тот же экран чата, что у остальных агентов; маршрут для закладки `/agents/presentation` */
export default function PresentationAgent() {
  return <AIStudio3Chat presentationMode />;
}
