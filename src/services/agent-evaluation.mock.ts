import { AgentEvaluation, EvaluationRating } from "@/types/agent-evaluation";

/**
 * Мокапные данные для оценок агентов
 */
export const mockEvaluations: AgentEvaluation[] = [
  // LLM-Ultra
  {
    agentId: "LLM-Ultra",
    rating: 5,
    comment: "Отличная модель! Очень точные ответы на корпоративные вопросы. Отлично работает с многоязычными запросами.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 дней назад
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-1",
  },
  {
    agentId: "LLM-Ultra",
    rating: 5,
    comment: "Лучшая модель для бизнеса. Быстро и точно обрабатывает сложные запросы.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 дня назад
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-2",
  },
  {
    agentId: "LLM-Ultra",
    rating: 4,
    comment: "Хорошая модель, но иногда медленно отвечает на сложные запросы.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 дня назад
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-3",
  },
  {
    agentId: "LLM-Ultra",
    rating: 5,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 день назад
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-4",
  },

  // Assistant Pro
  {
    agentId: "Assistant Pro",
    rating: 5,
    comment: "Отличный помощник для корпоративных задач. Помогает с планированием и документооборотом.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 дней назад
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-5",
  },
  {
    agentId: "Assistant Pro",
    rating: 4,
    comment: "Хороший ассистент, но хотелось бы больше функций для HR.",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 дня назад
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-6",
  },
  {
    agentId: "Assistant Pro",
    rating: 5,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 дня назад
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-7",
  },

  // Doc AI
  {
    agentId: "Doc AI",
    rating: 5,
    comment: "Незаменимый инструмент для работы с документами. Отлично извлекает ключевую информацию.",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 дней назад
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-8",
  },
  {
    agentId: "Doc AI",
    rating: 4,
    comment: "Хорошо работает с PDF, но иногда пропускает важные детали.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 дня назад
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-9",
  },
  {
    agentId: "Doc AI",
    rating: 5,
    comment: "Лучший инструмент для анализа правовых документов РК!",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 день назад
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-10",
  },
  {
    agentId: "Doc AI",
    rating: 4,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 часов назад
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    userId: "user-11",
  },

  // Code Assistant
  {
    agentId: "Code Assistant",
    rating: 5,
    comment: "Отличный помощник для программирования! Пишет чистый код с комментариями.",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 дней назад
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-12",
  },
  {
    agentId: "Code Assistant",
    rating: 5,
    comment: "Спасает время на код-ревью. Находит баги и предлагает улучшения.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 дней назад
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-13",
  },
  {
    agentId: "Code Assistant",
    rating: 4,
    comment: "Хорошо работает с TypeScript и Python, но иногда предлагает устаревшие решения.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 дня назад
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-14",
  },

  // Translation Master
  {
    agentId: "Translation Master",
    rating: 5,
    comment: "Превосходный переводчик! Сохраняет контекст и стиль оригинала.",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-15",
  },
  {
    agentId: "Translation Master",
    rating: 4,
    comment: "Хорошо переводит между основными языками, но иногда теряет нюансы.",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-16",
  },
  {
    agentId: "Translation Master",
    rating: 5,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-17",
  },

  // Data Analyst
  {
    agentId: "Data Analyst",
    rating: 5,
    comment: "Отличный аналитик! Помогает находить паттерны в данных и создавать визуализации.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-18",
  },
  {
    agentId: "Data Analyst",
    rating: 4,
    comment: "Хорошо работает с SQL, но визуализации можно улучшить.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-19",
  },
  {
    agentId: "Data Analyst",
    rating: 5,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-20",
  },

  // Legal Advisor
  {
    agentId: "Legal Advisor",
    rating: 5,
    comment: "Незаменимый помощник для работы с законодательством РК. Точные ссылки на статьи.",
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-21",
  },
  {
    agentId: "Legal Advisor",
    rating: 4,
    comment: "Хорошо анализирует договоры, но иногда нужно больше контекста.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-22",
  },
  {
    agentId: "Legal Advisor",
    rating: 5,
    comment: "Отлично помогает с налоговым правом!",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-23",
  },

  // Content Creator
  {
    agentId: "Content Creator",
    rating: 4,
    comment: "Хороший копирайтер, создает интересные тексты для соцсетей.",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-24",
  },
  {
    agentId: "Content Creator",
    rating: 5,
    comment: "Отлично работает с SEO-оптимизацией контента!",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-25",
  },
  {
    agentId: "Content Creator",
    rating: 3,
    comment: "Иногда тексты получаются слишком формальными.",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-26",
  },

  // Financial Advisor
  {
    agentId: "Financial Advisor",
    rating: 5,
    comment: "Отличный финансовый консультант! Помогает анализировать отчетность.",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-27",
  },
  {
    agentId: "Financial Advisor",
    rating: 4,
    comment: "Хорошо работает с бухгалтерскими данными.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-28",
  },
  {
    agentId: "Financial Advisor",
    rating: 5,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-29",
  },

  // Customer Support
  {
    agentId: "Customer Support",
    rating: 5,
    comment: "Отличный виртуальный помощник! Вежливо отвечает на вопросы клиентов.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-30",
  },
  {
    agentId: "Customer Support",
    rating: 4,
    comment: "Хорошо работает с типовыми вопросами, но сложные случаи требуют доработки.",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-31",
  },
  {
    agentId: "Customer Support",
    rating: 5,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-32",
  },

  // Research Assistant
  {
    agentId: "Research Assistant",
    rating: 5,
    comment: "Отличный помощник для научных исследований! Помогает находить релевантные источники.",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-33",
  },
  {
    agentId: "Research Assistant",
    rating: 4,
    comment: "Хорошо составляет обзоры литературы, но иногда цитирования неточные.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-34",
  },
  {
    agentId: "Research Assistant",
    rating: 5,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-35",
  },

  // Security Auditor
  {
    agentId: "Security Auditor",
    rating: 5,
    comment: "Отличный инструмент для проверки безопасности кода! Находит уязвимости быстро.",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-36",
  },
  {
    agentId: "Security Auditor",
    rating: 4,
    comment: "Хорошо работает с базовыми проверками, но для сложных систем нужны дополнительные инструменты.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-37",
  },
  {
    agentId: "Security Auditor",
    rating: 5,
    comment: "Помогает соблюдать стандарты безопасности!",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-38",
  },

  // Project Manager
  {
    agentId: "Project Manager",
    rating: 5,
    comment: "Отличный помощник для управления проектами! Помогает планировать и отслеживать задачи.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-39",
  },
  {
    agentId: "Project Manager",
    rating: 4,
    comment: "Хорошо работает с Agile методологиями, но интеграция с Jira могла бы быть лучше.",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-40",
  },
  {
    agentId: "Project Manager",
    rating: 5,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-41",
  },
];

