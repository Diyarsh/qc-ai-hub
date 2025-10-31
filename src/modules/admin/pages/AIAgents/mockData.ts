export type AIAgentType = "CHAT" | "TASK" | "ANALYSIS";

export interface AIAgent {
  id: number;
  name: string;
  description: string;
  type: AIAgentType;
  enabled: boolean;
  systemPrompt: string;
  llmModelId: number;
  createdAt: string;
  updatedAt: string;
}

export const mockAIAgents: AIAgent[] = [
  {
    id: 1,
    name: "Customer Support Agent",
    description: "Агент для обработки обращений клиентов",
    type: "CHAT",
    enabled: true,
    systemPrompt: "Ты полезный ассистент службы поддержки. Отвечай вежливо и профессионально.",
    llmModelId: 1,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    name: "Code Assistant",
    description: "Помощник в программировании",
    type: "TASK",
    enabled: true,
    systemPrompt: "Ты эксперт-программист. Помогай с написанием кода, отладкой и объяснениями.",
    llmModelId: 4,
    createdAt: "2024-01-20T14:30:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: 3,
    name: "Document Analyzer",
    description: "Анализ и извлечение информации из документов",
    type: "ANALYSIS",
    enabled: true,
    systemPrompt: "Ты аналитик документов. Извлекай ключевую информацию, резюмируй содержимое.",
    llmModelId: 1,
    createdAt: "2024-01-25T09:15:00Z",
    updatedAt: "2024-01-25T09:15:00Z",
  },
  {
    id: 4,
    name: "Content Writer",
    description: "Генерация контента и текстов",
    type: "TASK",
    enabled: true,
    systemPrompt: "Ты профессиональный копирайтер. Создавай качественный контент на любые темы.",
    llmModelId: 2,
    createdAt: "2024-02-01T11:20:00Z",
    updatedAt: "2024-02-01T11:20:00Z",
  },
  {
    id: 5,
    name: "Data Analyst",
    description: "Анализ данных и генерация отчетов",
    type: "ANALYSIS",
    enabled: true,
    systemPrompt: "Ты аналитик данных. Анализируй данные, находи паттерны, создавай отчеты.",
    llmModelId: 1,
    createdAt: "2024-02-05T16:45:00Z",
    updatedAt: "2024-02-05T16:45:00Z",
  },
  {
    id: 6,
    name: "Translation Assistant",
    description: "Перевод текстов между языками",
    type: "TASK",
    enabled: true,
    systemPrompt: "Ты профессиональный переводчик. Переводи тексты точно и естественно.",
    llmModelId: 3,
    createdAt: "2024-02-10T10:30:00Z",
    updatedAt: "2024-02-10T10:30:00Z",
  },
  {
    id: 7,
    name: "Research Assistant",
    description: "Помощь в исследованиях и поиске информации",
    type: "ANALYSIS",
    enabled: true,
    systemPrompt: "Ты исследовательский ассистент. Помогай находить и структурировать информацию.",
    llmModelId: 1,
    createdAt: "2024-02-12T08:00:00Z",
    updatedAt: "2024-02-12T08:00:00Z",
  },
  {
    id: 8,
    name: "Email Assistant",
    description: "Обработка и генерация email сообщений",
    type: "TASK",
    enabled: false,
    systemPrompt: "Ты помощник для работы с email. Помогай писать и обрабатывать письма.",
    llmModelId: 2,
    createdAt: "2024-02-14T13:22:00Z",
    updatedAt: "2024-02-14T13:22:00Z",
  },
  {
    id: 9,
    name: "Meeting Summarizer",
    description: "Резюмирование встреч и совещаний",
    type: "ANALYSIS",
    enabled: true,
    systemPrompt: "Ты ассистент для встреч. Создавай краткие и информативные резюме.",
    llmModelId: 1,
    createdAt: "2024-02-16T15:10:00Z",
    updatedAt: "2024-02-16T15:10:00Z",
  },
  {
    id: 10,
    name: "Technical Writer",
    description: "Создание технической документации",
    type: "TASK",
    enabled: true,
    systemPrompt: "Ты технический писатель. Создавай четкую и структурированную документацию.",
    llmModelId: 4,
    createdAt: "2024-02-18T09:45:00Z",
    updatedAt: "2024-02-18T09:45:00Z",
  },
  {
    id: 11,
    name: "Question Answering",
    description: "Ответы на вопросы на основе контекста",
    type: "CHAT",
    enabled: true,
    systemPrompt: "Ты помощник для ответов на вопросы. Отвечай точно на основе предоставленного контекста.",
    llmModelId: 1,
    createdAt: "2024-02-20T11:30:00Z",
    updatedAt: "2024-02-20T11:30:00Z",
  },
  {
    id: 12,
    name: "Sentiment Analyzer",
    description: "Анализ тональности текстов",
    type: "ANALYSIS",
    enabled: true,
    systemPrompt: "Ты аналитик тональности. Определяй эмоциональную окраску текстов.",
    llmModelId: 1,
    createdAt: "2024-02-22T14:15:00Z",
    updatedAt: "2024-02-22T14:15:00Z",
  },
];

