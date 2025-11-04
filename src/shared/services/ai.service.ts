/**
 * AI Service for chat interactions
 * Supports multiple AI providers (OpenAI, Anthropic, etc.)
 */

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatCompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

interface ChatResponse {
  content: string;
  model?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Get API configuration from environment
const getApiConfig = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const apiBaseUrl = import.meta.env.VITE_OPENAI_API_BASE_URL || 'https://api.openai.com/v1';
  const provider = (import.meta.env.VITE_AI_PROVIDER || 'openai').toLowerCase();
  
  return { apiKey, apiBaseUrl, provider };
};

/**
 * Send chat message to AI model
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  options: ChatCompletionOptions = {}
): Promise<ChatResponse> {
  const { apiKey, apiBaseUrl, provider } = getApiConfig();
  
  // If no API key is configured, return mock response for demo
  if (!apiKey) {
    console.warn('No AI API key configured. Using mock response. Add VITE_OPENAI_API_KEY to .env file for real AI responses.');
    return getMockResponse(messages);
  }

  const {
    model = import.meta.env.VITE_AI_MODEL || 'gpt-3.5-turbo',
    temperature = 0.7,
    maxTokens = 1000,
    systemPrompt,
  } = options;

  // Build messages array with system prompt if provided
  const fullMessages: ChatMessage[] = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages;

  try {
    if (provider === 'openai' || provider === 'deepseek' || provider === 'custom') {
      return await sendOpenAICompatibleRequest(apiBaseUrl, apiKey, fullMessages, {
        model,
        temperature,
        maxTokens,
      });
    }
    
    // Add support for other providers here (Anthropic, etc.)
    throw new Error(`Unsupported AI provider: ${provider}`);
  } catch (error: any) {
    console.error('AI API Error:', error);
    
    // Return mock response on error for graceful degradation
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('Invalid API key. Please check your VITE_OPENAI_API_KEY in .env file.');
    }
    
    throw new Error(`AI service error: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Send request to OpenAI-compatible API
 */
async function sendOpenAICompatibleRequest(
  apiBaseUrl: string,
  apiKey: string,
  messages: ChatMessage[],
  options: { model: string; temperature: number; maxTokens: number }
): Promise<ChatResponse> {
  const response = await fetch(`${apiBaseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: options.model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: options.temperature,
      max_tokens: options.maxTokens,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
  }

  const data = await response.json();
  
  return {
    content: data.choices[0]?.message?.content || 'No response generated',
    model: data.model,
    usage: data.usage ? {
      promptTokens: data.usage.prompt_tokens,
      completionTokens: data.usage.completion_tokens,
      totalTokens: data.usage.total_tokens,
    } : undefined,
  };
}

/**
 * Mock response for demo mode (when no API key is configured)
 */
function getMockResponse(messages: ChatMessage[]): ChatResponse {
  const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
  
  // Simple pattern-based responses for demo
  let mockResponse = 'Принято. Я подготовлю ответ. Уточните детали, если нужно.';
  
  if (lastUserMessage.toLowerCase().includes('привет') || lastUserMessage.toLowerCase().includes('hello')) {
    mockResponse = 'Привет! Чем могу помочь?';
  } else if (lastUserMessage.toLowerCase().includes('анализ') || lastUserMessage.toLowerCase().includes('анализ')) {
    mockResponse = 'Провожу анализ данных. Это может занять некоторое время. В реальной версии здесь будет ответ от AI модели.';
  } else if (lastUserMessage.toLowerCase().includes('создать') || lastUserMessage.toLowerCase().includes('разработать')) {
    mockResponse = 'Отлично! Для реализации этой задачи нужны дополнительные детали. Опишите требования подробнее.';
  }
  
  return {
    content: mockResponse,
    model: 'demo-mode',
  };
}

/**
 * Stream chat completion (for real-time responses)
 * This is a placeholder for future streaming support
 */
export async function* streamChatMessage(
  messages: ChatMessage[],
  options: ChatCompletionOptions = {}
): AsyncGenerator<string, void, unknown> {
  // TODO: Implement streaming when needed
  const response = await sendChatMessage(messages, options);
  yield response.content;
}







