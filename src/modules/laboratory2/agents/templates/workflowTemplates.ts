import { WorkflowTemplate } from "../components/TemplateGallery";

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: "faq-bot",
    name: "FAQ-бот по документам",
    description: "RAG workflow для ответов на вопросы по документам компании",
    category: "Knowledge",
    icon: null,
    tags: ["RAG", "Chat", "Knowledge"],
    nodes: [
      {
        id: "trigger-1",
        type: "trigger",
        position: { x: 100, y: 100 },
        data: {
          label: "Manual",
          icon: null,
          color: "bg-purple-500",
          description: "Manual execution trigger",
        },
      },
      {
        id: "rag-search-1",
        type: "knowledge",
        position: { x: 300, y: 100 },
        data: {
          label: "RAG Search",
          icon: null,
          color: "bg-lime-500",
          description: "Semantic search in knowledge base",
        },
      },
      {
        id: "llm-1",
        type: "llm",
        position: { x: 500, y: 100 },
        data: {
          label: "LLM Node",
          icon: null,
          color: "bg-indigo-500",
          description: "Generate answer based on context",
        },
      },
      {
        id: "action-1",
        type: "action",
        position: { x: 700, y: 100 },
        data: {
          label: "Chat Widget",
          icon: null,
          color: "bg-teal-600",
          description: "Return response to user",
        },
      },
    ],
    connections: [
      { id: "c1", source: "trigger-1", target: "rag-search-1" },
      { id: "c2", source: "rag-search-1", target: "llm-1" },
      { id: "c3", source: "llm-1", target: "action-1" },
    ],
  },
  {
    id: "email-processor",
    name: "Агент обработки писем",
    description: "Обработка входящих писем и генерация резюме/тикетов",
    category: "Automation",
    icon: null,
    tags: ["Email", "Summary", "Ticket"],
    nodes: [
      {
        id: "trigger-2",
        type: "trigger",
        position: { x: 100, y: 100 },
        data: {
          label: "Email",
          icon: null,
          color: "bg-red-500",
          description: "Email trigger",
        },
      },
      {
        id: "llm-2",
        type: "llm",
        position: { x: 300, y: 100 },
        data: {
          label: "LLM Node",
          icon: null,
          color: "bg-indigo-500",
          description: "Generate summary",
        },
      },
      {
        id: "action-2",
        type: "action",
        position: { x: 500, y: 100 },
        data: {
          label: "REST Endpoint",
          icon: null,
          color: "bg-indigo-600",
          description: "Create ticket",
        },
      },
    ],
    connections: [
      { id: "c4", source: "trigger-2", target: "llm-2" },
      { id: "c5", source: "llm-2", target: "action-2" },
    ],
  },
  {
    id: "data-assistant",
    name: "Data-assistant для отдела",
    description: "Chat → SQL-узел → визуализация → отчёт",
    category: "Data",
    icon: null,
    tags: ["Chat", "SQL", "Visualization"],
    nodes: [
      {
        id: "trigger-3",
        type: "trigger",
        position: { x: 100, y: 100 },
        data: {
          label: "Manual",
          icon: null,
          color: "bg-purple-500",
          description: "Manual execution",
        },
      },
      {
        id: "llm-3",
        type: "llm",
        position: { x: 300, y: 100 },
        data: {
          label: "Chat Builder",
          icon: null,
          color: "bg-teal-500",
          description: "Process user query",
        },
      },
      {
        id: "tool-1",
        type: "tool",
        position: { x: 500, y: 100 },
        data: {
          label: "SQL Query",
          icon: null,
          color: "bg-orange-500",
          description: "Execute SQL query",
        },
      },
      {
        id: "action-3",
        type: "action",
        position: { x: 700, y: 100 },
        data: {
          label: "REST Endpoint",
          icon: null,
          color: "bg-indigo-600",
          description: "Return visualization",
        },
      },
    ],
    connections: [
      { id: "c6", source: "trigger-3", target: "llm-3" },
      { id: "c7", source: "llm-3", target: "tool-1" },
      { id: "c8", source: "tool-1", target: "action-3" },
    ],
  },
  {
    id: "content-assistant",
    name: "Контент-ассистент",
    description: "Генерация, проверка стиля/тональности, модерация",
    category: "Content",
    icon: null,
    tags: ["Generation", "Moderation", "Content"],
    nodes: [
      {
        id: "trigger-4",
        type: "trigger",
        position: { x: 100, y: 100 },
        data: {
          label: "Manual",
          icon: null,
          color: "bg-purple-500",
          description: "Manual execution",
        },
      },
      {
        id: "llm-4",
        type: "llm",
        position: { x: 300, y: 100 },
        data: {
          label: "LLM Node",
          icon: null,
          color: "bg-indigo-500",
          description: "Generate content",
        },
      },
      {
        id: "guardrail-1",
        type: "guardrail",
        position: { x: 500, y: 100 },
        data: {
          label: "Content Moderation",
          icon: null,
          color: "bg-orange-600",
          description: "Moderate content",
        },
      },
      {
        id: "action-4",
        type: "action",
        position: { x: 700, y: 100 },
        data: {
          label: "REST Endpoint",
          icon: null,
          color: "bg-indigo-600",
          description: "Return moderated content",
        },
      },
    ],
    connections: [
      { id: "c9", source: "trigger-4", target: "llm-4" },
      { id: "c10", source: "llm-4", target: "guardrail-1" },
      { id: "c11", source: "guardrail-1", target: "action-4" },
    ],
  },
  {
    id: "incident-bot",
    name: "Инцидент-бот",
    description: "Webhook → обогащение → уведомления → протокол",
    category: "Operations",
    icon: null,
    tags: ["Webhook", "Notifications", "Incident"],
    nodes: [
      {
        id: "trigger-5",
        type: "trigger",
        position: { x: 100, y: 100 },
        data: {
          label: "Webhook",
          icon: null,
          color: "bg-blue-500",
          description: "Webhook trigger",
        },
      },
      {
        id: "llm-5",
        type: "llm",
        position: { x: 300, y: 100 },
        data: {
          label: "LLM Node",
          icon: null,
          color: "bg-indigo-500",
          description: "Enrich incident data",
        },
      },
      {
        id: "tool-2",
        type: "tool",
        position: { x: 500, y: 100 },
        data: {
          label: "Messengers",
          icon: null,
          color: "bg-blue-600",
          description: "Send notifications",
        },
      },
      {
        id: "action-5",
        type: "action",
        position: { x: 700, y: 100 },
        data: {
          label: "REST Endpoint",
          icon: null,
          color: "bg-indigo-600",
          description: "Create incident log",
        },
      },
    ],
    connections: [
      { id: "c12", source: "trigger-5", target: "llm-5" },
      { id: "c13", source: "llm-5", target: "tool-2" },
      { id: "c14", source: "tool-2", target: "action-5" },
    ],
  },
];

