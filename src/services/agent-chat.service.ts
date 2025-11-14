import { AgentChatSession, AgentChatMessage } from "@/types/agent-chat";

export class AgentChatService {
  static getSessionsKey(agentId: string): string {
    return `agent-chat.sessions.${agentId}`;
  }

  private static getMessagesKey(sessionId: string): string {
    return `agent-chat.messages.${sessionId}`;
  }

  /**
   * Get all sessions for a specific agent
   */
  static getSessions(agentId: string): AgentChatSession[] {
    try {
      const key = this.getSessionsKey(agentId);
      const stored = localStorage.getItem(key);
      if (!stored) return [];
      
      const sessions = JSON.parse(stored) as AgentChatSession[];
      // Filter out sessions with long titles or specific unwanted titles
      const filtered = sessions.filter(s => {
        const title = s.title.trim();
        // Remove sessions with "Сформируй краткую сводку по рынку за Q3 2025" or similar long titles
        if (title.includes('Сформируй краткую сводку по рынку за Q3 2025')) {
          return false;
        }
        return true;
      });
      
      // Sort by updatedAt descending (newest first)
      return filtered.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } catch {
      return [];
    }
  }

  /**
   * Get a specific session by ID
   */
  static getSession(sessionId: string, agentId: string): AgentChatSession | null {
    const sessions = this.getSessions(agentId);
    return sessions.find(s => s.id === sessionId) || null;
  }

  /**
   * Create a new session
   */
  static createSession(agentId: string, title?: string): AgentChatSession {
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);
    const now = new Date().toISOString();
    
    const session: AgentChatSession = {
      id,
      agentId,
      title: title || 'Новый чат',
      updatedAt: now,
      messageCount: 0,
    };

    const sessions = this.getSessions(agentId);
    sessions.unshift(session); // Add to beginning
    this.saveSessions(agentId, sessions);

    return session;
  }

  /**
   * Update a session
   */
  static updateSession(sessionId: string, agentId: string, updates: Partial<AgentChatSession>): void {
    const sessions = this.getSessions(agentId);
    const index = sessions.findIndex(s => s.id === sessionId);
    
    if (index >= 0) {
      sessions[index] = {
        ...sessions[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.saveSessions(agentId, sessions);
    }
  }

  /**
   * Delete a session
   */
  static deleteSession(sessionId: string, agentId: string): void {
    const sessions = this.getSessions(agentId);
    const filtered = sessions.filter(s => s.id !== sessionId);
    this.saveSessions(agentId, filtered);
    
    // Also delete messages for this session
    try {
      localStorage.removeItem(this.getMessagesKey(sessionId));
    } catch {}
  }

  /**
   * Save messages for a session
   */
  static saveMessages(sessionId: string, messages: AgentChatMessage[]): void {
    try {
      const key = this.getMessagesKey(sessionId);
      localStorage.setItem(key, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  }

  /**
   * Get messages for a session
   */
  static getMessages(sessionId: string): AgentChatMessage[] {
    try {
      const key = this.getMessagesKey(sessionId);
      const stored = localStorage.getItem(key);
      if (!stored) return [];
      return JSON.parse(stored) as AgentChatMessage[];
    } catch {
      return [];
    }
  }

  /**
   * Save sessions array
   */
  private static saveSessions(agentId: string, sessions: AgentChatSession[]): void {
    try {
      const key = this.getSessionsKey(agentId);
      localStorage.setItem(key, JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to save sessions:', error);
    }
  }

  /**
   * Generate mock data for demonstration
   */
  static generateMockSessions(agentId: string): AgentChatSession[] {
    const now = new Date();
    const mockSessions: AgentChatSession[] = [
      {
        id: 'mock-1',
        agentId,
        title: 'Анализ рынка за Q3 2025',
        lastMessage: 'Спасибо за анализ! Это очень полезная информация.',
        updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        messageCount: 8,
      },
      {
        id: 'mock-2',
        agentId,
        title: 'План внедрения чат-бота',
        lastMessage: 'Отлично, начнем с первого этапа.',
        updatedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        messageCount: 12,
      },
      {
        id: 'mock-3',
        agentId,
        title: 'Вопросы по документации',
        lastMessage: 'Понял, спасибо за разъяснения!',
        updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        messageCount: 5,
      },
    ].map(session => ({
      ...session,
      title: session.title.length > 35 ? session.title.slice(0, 35) : session.title
    }));

    // Save mock data to localStorage
    this.saveSessions(agentId, mockSessions);
    return mockSessions;
  }
}

