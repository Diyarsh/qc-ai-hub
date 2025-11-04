import {
  Clock,
  Webhook,
  Play,
  Bell,
  Brain,
  MessageSquare,
  Code,
  Wand2,
  Database,
  FileText,
  Search,
  Layers,
  Globe,
  Terminal,
  Eye,
  Mail,
  MessageCircle,
  Cloud,
  HardDrive,
  HardDriveIcon,
  Shield,
  AlertTriangle,
  Lock,
  Key,
  Activity,
  TrendingUp,
  BarChart3,
  FileCheck,
  ThumbsUp,
  Radio,
  Bot,
  Link2,
  Zap,
} from "lucide-react";
import { NodeType } from "../components/NodePalette";

export const nodeTypesLibrary: NodeType[] = [
  // Triggers
  {
    type: "trigger",
    category: "triggers",
    label: "Schedule",
    icon: Clock,
    color: "bg-green-500",
    description: "Time-based triggers (Cron, Interval)",
    config: {
      scheduleType: "cron",
      cronExpression: "0 0 * * *",
      interval: 3600,
    },
  },
  {
    type: "trigger",
    category: "triggers",
    label: "Webhook",
    icon: Webhook,
    color: "bg-blue-500",
    description: "HTTP endpoint trigger",
    config: {
      method: "POST",
      path: "/webhook",
    },
  },
  {
    type: "trigger",
    category: "triggers",
    label: "Manual",
    icon: Play,
    color: "bg-purple-500",
    description: "Manual execution trigger",
    config: {},
  },
  {
    type: "trigger",
    category: "triggers",
    label: "Event",
    icon: Bell,
    color: "bg-orange-500",
    description: "Event-based trigger (Slack, Telegram, S3)",
    config: {
      eventType: "slack",
    },
  },

  // LLM/Chat
  {
    type: "llm",
    category: "llm",
    label: "LLM Node",
    icon: Brain,
    color: "bg-indigo-500",
    description: "LLM inference with model selection",
    config: {
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt: "",
    },
  },
  {
    type: "llm",
    category: "llm",
    label: "Chat Builder",
    icon: MessageSquare,
    color: "bg-teal-500",
    description: "Dialog builder with few-shot examples",
    config: {
      examples: [],
      contextWindow: 4000,
    },
  },
  {
    type: "llm",
    category: "llm",
    label: "System Prompt",
    icon: Code,
    color: "bg-pink-500",
    description: "Visual system prompt editor",
    config: {
      prompt: "",
      variables: [],
    },
  },
  {
    type: "llm",
    category: "llm",
    label: "Function Calling",
    icon: Wand2,
    color: "bg-violet-500",
    description: "Tools and functions for LLM",
    config: {
      functions: [],
    },
  },

  // Knowledge
  {
    type: "knowledge",
    category: "knowledge",
    label: "Knowledge Index",
    icon: Database,
    color: "bg-cyan-500",
    description: "Index knowledge from S3/Postgres/SharePoint",
    config: {
      source: "s3",
      connection: "",
    },
  },
  {
    type: "knowledge",
    category: "knowledge",
    label: "Document Loader",
    icon: FileText,
    color: "bg-yellow-500",
    description: "Load PDF, CSV, Docx documents",
    config: {
      format: "pdf",
      chunkSize: 1000,
    },
  },
  {
    type: "knowledge",
    category: "knowledge",
    label: "RAG Index",
    icon: Layers,
    color: "bg-emerald-500",
    description: "Create embeddings and vector search index",
    config: {
      embeddingModel: "text-embedding-ada-002",
      chunkSize: 500,
    },
  },
  {
    type: "knowledge",
    category: "knowledge",
    label: "RAG Search",
    icon: Search,
    color: "bg-lime-500",
    description: "Semantic search in knowledge base",
    config: {
      topK: 5,
      similarityThreshold: 0.7,
    },
  },

  // Tools
  {
    type: "tool",
    category: "tools",
    label: "HTTP Request",
    icon: Globe,
    color: "bg-purple-500",
    description: "Make HTTP requests (GET, POST, PUT, DELETE)",
    config: {
      method: "GET",
      url: "",
      headers: {},
      body: "",
    },
  },
  {
    type: "tool",
    category: "tools",
    label: "SQL Query",
    icon: Database,
    color: "bg-orange-500",
    description: "Execute SQL queries (Postgres, MySQL)",
    config: {
      database: "postgres",
      query: "",
      connection: "",
    },
  },
  {
    type: "tool",
    category: "tools",
    label: "Python Script",
    icon: Terminal,
    color: "bg-pink-500",
    description: "Execute Python code safely",
    config: {
      code: "",
      timeout: 30,
    },
  },
  {
    type: "tool",
    category: "tools",
    label: "OCR",
    icon: Eye,
    color: "bg-amber-500",
    description: "Optical Character Recognition",
    config: {
      language: "eng",
      engine: "tesseract",
    },
  },
  {
    type: "tool",
    category: "tools",
    label: "Email",
    icon: Mail,
    color: "bg-red-500",
    description: "Send and receive emails",
    config: {
      action: "send",
      smtp: "",
    },
  },
  {
    type: "tool",
    category: "tools",
    label: "Messengers",
    icon: MessageCircle,
    color: "bg-blue-600",
    description: "Slack, Telegram integration",
    config: {
      platform: "slack",
      channel: "",
    },
  },
  {
    type: "tool",
    category: "tools",
    label: "Cloud Storage",
    icon: Cloud,
    color: "bg-sky-500",
    description: "S3, MinIO cloud storage",
    config: {
      provider: "s3",
      bucket: "",
    },
  },

  // Memory
  {
    type: "memory",
    category: "memory",
    label: "Short-term Memory",
    icon: HardDrive,
    color: "bg-blue-400",
    description: "Session-based memory",
    config: {
      ttl: 3600,
      maxSize: 1000,
    },
  },
  {
    type: "memory",
    category: "memory",
    label: "Long-term Memory",
    icon: HardDriveIcon,
    color: "bg-blue-600",
    description: "Persistent storage memory",
    config: {
      storage: "database",
      retention: "30d",
    },
  },
  {
    type: "memory",
    category: "memory",
    label: "Memory Policy",
    icon: Shield,
    color: "bg-indigo-600",
    description: "Memory retention rules",
    config: {
      policy: "lru",
      maxEntries: 10000,
    },
  },

  // Guardrails
  {
    type: "guardrail",
    category: "guardrails",
    label: "PII Detection",
    icon: AlertTriangle,
    color: "bg-red-600",
    description: "Detect and mask personal information",
    config: {
      entities: ["email", "phone", "ssn"],
      action: "mask",
    },
  },
  {
    type: "guardrail",
    category: "guardrails",
    label: "Content Moderation",
    icon: Shield,
    color: "bg-orange-600",
    description: "Moderate content for safety",
    config: {
      categories: ["hate", "violence", "self-harm"],
      threshold: 0.8,
    },
  },
  {
    type: "guardrail",
    category: "guardrails",
    label: "Rate Limiting",
    icon: Lock,
    color: "bg-yellow-600",
    description: "Limit API calls and requests",
    config: {
      maxRequests: 100,
      window: "1h",
    },
  },
  {
    type: "guardrail",
    category: "guardrails",
    label: "Security Policy",
    icon: Key,
    color: "bg-gray-600",
    description: "Security policies and rules",
    config: {
      policies: [],
    },
  },

  // Eval/Observability
  {
    type: "eval",
    category: "eval",
    label: "Execution Log",
    icon: Activity,
    color: "bg-green-600",
    description: "Log execution events",
    config: {
      level: "info",
      format: "json",
    },
  },
  {
    type: "eval",
    category: "eval",
    label: "Tracing",
    icon: TrendingUp,
    color: "bg-blue-600",
    description: "Trace workflow execution",
    config: {
      enabled: true,
      sampleRate: 1.0,
    },
  },
  {
    type: "eval",
    category: "eval",
    label: "Metrics",
    icon: BarChart3,
    color: "bg-purple-600",
    description: "Collect node metrics",
    config: {
      metrics: ["latency", "throughput", "error_rate"],
    },
  },
  {
    type: "eval",
    category: "eval",
    label: "Feedback",
    icon: ThumbsUp,
    color: "bg-teal-600",
    description: "User feedback collection",
    config: {
      questions: ["Was this helpful?"],
    },
  },

  // Actions/Deploy
  {
    type: "action",
    category: "actions",
    label: "REST Endpoint",
    icon: Radio,
    color: "bg-indigo-600",
    description: "Publish workflow as REST API",
    config: {
      path: "/api/workflow",
      method: "POST",
    },
  },
  {
    type: "action",
    category: "actions",
    label: "Chat Widget",
    icon: Bot,
    color: "bg-teal-600",
    description: "Embeddable chat widget",
    config: {
      theme: "light",
      position: "bottom-right",
    },
  },
  {
    type: "action",
    category: "actions",
    label: "Slack Bot",
    icon: MessageCircle,
    color: "bg-purple-600",
    description: "Deploy as Slack bot",
    config: {
      channel: "",
      commands: [],
    },
  },
  {
    type: "action",
    category: "actions",
    label: "Portal Button",
    icon: Zap,
    color: "bg-yellow-600",
    description: "Button on portal dashboard",
    config: {
      label: "Run Workflow",
      icon: "play",
    },
  },
];

export const getNodeTypeByLabel = (label: string): NodeType | undefined => {
  return nodeTypesLibrary.find((nt) => nt.label === label);
};

export const getNodeTypesByCategory = (category: string): NodeType[] => {
  return nodeTypesLibrary.filter((nt) => nt.category === category);
};

