export interface AgentChatSession {
  id: string;
  agentId: string; // 'LLM-Ultra', 'Assistant Pro', etc.
  title: string;
  lastMessage?: string;
  updatedAt: string; // ISO string
  messageCount: number;
}

export interface AgentChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  files?: Array<{
    name: string;
    size: number;
  }>;
  createdAt: string; // ISO string
  isLoading?: boolean;
  durationMs?: number; // response generation time in ms
  feedback?: 'like' | 'dislike';
  feedbackReasons?: string[]; // reasons for dislike feedback
  feedbackDetails?: string; // additional details for feedback
}

