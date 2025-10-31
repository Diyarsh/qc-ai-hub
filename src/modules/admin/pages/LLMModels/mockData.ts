export type LLMProvider = "OPENAI" | "DEEPSEEK" | "LLAMA" | "QWEN" | "GEMMA";

export interface LLMModel {
  id: number;
  name: string;
  provider: LLMProvider;
  maxTokens: number;
  temperature: number;
  isLocal: boolean;
  chatCapable: boolean;
  enabled: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const mockLLMModels: LLMModel[] = [
  {
    id: 1,
    name: "GPT-4 Turbo",
    provider: "OPENAI",
    maxTokens: 128000,
    temperature: 0.7,
    isLocal: false,
    chatCapable: true,
    enabled: true,
    description: "Самый мощный GPT-4 модель с расширенным контекстом",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: 2,
    name: "GPT-3.5 Turbo",
    provider: "OPENAI",
    maxTokens: 16385,
    temperature: 0.7,
    isLocal: false,
    chatCapable: true,
    enabled: true,
    description: "Быстрая и эффективная модель для повседневных задач",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: 3,
    name: "DeepSeek Chat",
    provider: "DEEPSEEK",
    maxTokens: 32768,
    temperature: 0.8,
    isLocal: false,
    chatCapable: true,
    enabled: true,
    description: "Высокопроизводительная модель для диалогов",
    createdAt: "2024-01-15T14:30:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
  },
  {
    id: 4,
    name: "DeepSeek Coder",
    provider: "DEEPSEEK",
    maxTokens: 16384,
    temperature: 0.6,
    isLocal: false,
    chatCapable: false,
    enabled: true,
    description: "Специализированная модель для программирования",
    createdAt: "2024-01-15T14:30:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
  },
  {
    id: 5,
    name: "Llama 3 70B",
    provider: "LLAMA",
    maxTokens: 8192,
    temperature: 0.7,
    isLocal: true,
    chatCapable: true,
    enabled: true,
    description: "Локальная open-source модель высокой мощности",
    createdAt: "2024-01-20T09:15:00Z",
    updatedAt: "2024-01-20T09:15:00Z",
  },
  {
    id: 6,
    name: "Llama 3 8B",
    provider: "LLAMA",
    maxTokens: 8192,
    temperature: 0.7,
    isLocal: true,
    chatCapable: true,
    enabled: false,
    description: "Компактная локальная модель для легких задач",
    createdAt: "2024-01-20T09:15:00Z",
    updatedAt: "2024-01-20T09:15:00Z",
  },
  {
    id: 7,
    name: "Qwen2.5 72B",
    provider: "QWEN",
    maxTokens: 32768,
    temperature: 0.8,
    isLocal: true,
    chatCapable: true,
    enabled: true,
    description: "Крупная модель от Alibaba Cloud",
    createdAt: "2024-02-01T11:20:00Z",
    updatedAt: "2024-02-01T11:20:00Z",
  },
  {
    id: 8,
    name: "Gemma 7B",
    provider: "GEMMA",
    maxTokens: 8192,
    temperature: 0.7,
    isLocal: true,
    chatCapable: true,
    enabled: true,
    description: "Легкая модель от Google",
    createdAt: "2024-02-05T16:45:00Z",
    updatedAt: "2024-02-05T16:45:00Z",
  },
  {
    id: 9,
    name: "Qwen2.5 14B",
    provider: "QWEN",
    maxTokens: 32768,
    temperature: 0.75,
    isLocal: true,
    chatCapable: true,
    enabled: true,
    description: "Балансированная модель среднего размера",
    createdAt: "2024-02-10T10:30:00Z",
    updatedAt: "2024-02-10T10:30:00Z",
  },
  {
    id: 10,
    name: "Gemma 2B",
    provider: "GEMMA",
    maxTokens: 8192,
    temperature: 0.7,
    isLocal: true,
    chatCapable: true,
    enabled: false,
    description: "Минимальная модель для ограниченных ресурсов",
    createdAt: "2024-02-12T08:00:00Z",
    updatedAt: "2024-02-12T08:00:00Z",
  },
];

