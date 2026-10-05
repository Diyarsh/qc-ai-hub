export interface DashboardMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  files?: { name: string; type: string }[];
  isLoading?: boolean;
  feedback?: "correct" | "partially-correct" | "incorrect";
  feedbackDetails?: string;
  createdAt?: string;
}

export interface DashboardChat {
  id: string;
  messages: DashboardMessage[];
  draft: string;
}

const ACTIVE_KEY = "dashboard.active-chat";
const chatKey = (id: string) => `dashboard.chat.${id}`;

export function createDashboardChat(): DashboardChat {
  return { id: crypto.randomUUID(), messages: [], draft: "" };
}

export function loadDashboardChat(id?: string | null): DashboardChat | null {
  try {
    const activeId = id || localStorage.getItem(ACTIVE_KEY);
    if (!activeId) return null;
    const stored = localStorage.getItem(chatKey(activeId));
    if (!stored) return null;
    const chat = JSON.parse(stored) as DashboardChat;
    if (chat.id !== activeId || !Array.isArray(chat.messages)) return null;
    return { ...chat, draft: chat.draft || "", messages: chat.messages.map(message => message.isLoading
      ? { ...message, isLoading: false, text: "Ответ не был завершён. Отправьте запрос повторно." }
      : message) };
  } catch { return null; }
}

export function saveDashboardChat(chat: DashboardChat) {
  try {
    const messages = chat.messages.map(message => ({ ...message, files: message.files?.map(file => ({ name: file.name, type: file.type })) }));
    localStorage.setItem(chatKey(chat.id), JSON.stringify({ ...chat, messages }));
    localStorage.setItem(ACTIVE_KEY, chat.id);
    const firstMessage = messages.find(message => message.role === "user");
    if (!firstMessage) return;
    const history = JSON.parse(localStorage.getItem("dashboard.history") || "[]");
    const existing = history.findIndex((item: { chatId?: string }) => item.chatId === chat.id);
    const entry = { chatId: chat.id, text: firstMessage.text, time: "только что", type: "chat", model: "AI" };
    if (existing < 0) history.unshift(entry);
    else history[existing] = entry;
    localStorage.setItem("dashboard.history", JSON.stringify(history.slice(0, 100)));
    window.dispatchEvent(new CustomEvent("dashboard.history.updated"));
  } catch { /* Keep the current conversation usable if browser storage is unavailable. */ }
}
