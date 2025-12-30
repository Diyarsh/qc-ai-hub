import { AgentChatSession, AgentChatMessage } from "@/types/agent-chat";
import { sendChatMessage } from "@/shared/services/ai.service.ts";

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
   * Generate realistic mock response based on agent type and user question
   */
  static async generateMockResponse(agentId: string, userQuestion: string): Promise<string> {
    try {
      // Try to use AI API for realistic responses
      const systemPrompt = `Ты ${agentId} - эксперт AI ассистент. Отвечай на русском языке профессионально и очень подробно. Дай развернутый, детальный ответ минимум на 200-300 слов. Ответ должен быть информативным, структурированным, содержать конкретные примеры и практические рекомендации. Используй маркированные списки, подзаголовки и структурируй информацию для лучшей читаемости.`;
      
      const response = await sendChatMessage(
        [{ role: 'user', content: userQuestion }],
        {
          model: import.meta.env.VITE_AI_MODEL || 'gpt-3.5-turbo',
          temperature: 0.8,
          maxTokens: 1200,
          systemPrompt,
        }
      );
      
      // Ensure response is substantial
      if (response.content && response.content.length > 100) {
        return response.content;
      }
    } catch (error) {
      console.warn('Failed to generate AI response, using fallback:', error);
    }
    
    // Always use fallback for consistency and to ensure detailed responses
    return this.getFallbackResponse(agentId, userQuestion);
  }

  /**
   * Fallback response generator when AI is unavailable
   */
  private static getFallbackResponse(agentId: string, userQuestion: string): string {
    const responses: Record<string, string> = {
      'LLM-Ultra': `Основываясь на вашем вопросе "${userQuestion}", могу предоставить следующий детальный анализ:

## Ключевые аспекты и анализ

**1. Комплексный подход к решению**
Важный момент, который следует учитывать - это необходимость комплексного подхода к решению задачи. Это означает, что нужно рассматривать проблему с разных углов зрения, учитывая не только прямые, но и косвенные факторы влияния.

**2. Анализ данных и источников**
Необходимо провести тщательный анализ всех доступных данных и источников информации. Это включает в себя:
- Проверку достоверности источников
- Сопоставление данных из различных источников
- Выявление противоречий и несоответствий
- Оценку актуальности информации

**3. Дополнительное исследование**
Рекомендуется провести дополнительное исследование для более точных выводов. Это особенно важно в случаях, когда имеющаяся информация недостаточна или противоречива.

## Практические рекомендации

- **Детали реализации**: Следует обратить особое внимание на детали реализации предложенных решений. Важно продумать каждый этап процесса и возможные препятствия.

- **Контекст и специфика**: Важно учитывать контекст и специфику вашей конкретной ситуации. Универсальные решения не всегда работают одинаково хорошо в разных условиях.

- **Консультации с экспертами**: Рекомендую проконсультироваться с экспертами в данной области для получения дополнительных инсайтов и проверки ваших предположений.

Если у вас есть дополнительные вопросы или нужна более детальная информация по конкретным аспектам, я готов помочь с дальнейшим анализом и предоставить более специфические рекомендации.`,

      'Assistant Pro': `Относительно вашего запроса "${userQuestion}", вот детальный структурированный план действий:

## Шаг 1: Подготовка и планирование

**Определение целей и задач**
Первым делом необходимо четко определить основные цели и задачи проекта. Это включает в себя:
- Формулировку конкретных, измеримых целей
- Определение приоритетов
- Установление критериев успеха
- Идентификацию ключевых заинтересованных сторон

**Сбор информации и ресурсов**
Соберите всю необходимую информацию и ресурсы, которые понадобятся для реализации:
- Анализ существующих процессов и систем
- Идентификация необходимых ресурсов (человеческие, технические, финансовые)
- Оценка доступности и ограничений ресурсов

**Оценка текущей ситуации**
Проведите тщательную оценку текущей ситуации:
- SWOT-анализ (сильные и слабые стороны, возможности и угрозы)
- Анализ рисков
- Оценка готовности команды и организации

## Шаг 2: Реализация

**Разработка детального плана**
Разработайте детальный план действий с четкими этапами:
- Разбейте проект на управляемые фазы
- Определите зависимости между задачами
- Установите контрольные точки и вехи

**Распределение ответственности**
Распределите ответственность между участниками:
- Назначьте ответственных за каждую задачу
- Определите роли и обязанности
- Установите каналы коммуникации

**Временные рамки и контрольные точки**
Установите реалистичные временные рамки и контрольные точки:
- Создайте временную шкалу проекта
- Определите критические пути
- Установите регулярные точки проверки прогресса

## Шаг 3: Мониторинг и оптимизация

**Отслеживание прогресса**
Регулярно отслеживайте прогресс выполнения:
- Проводите регулярные статус-встречи
- Используйте инструменты для отслеживания задач
- Анализируйте метрики и KPI

**Корректировки**
Вносите корректировки при необходимости:
- Адаптируйте план при изменении условий
- Решайте возникающие проблемы оперативно
- Учитесь на ошибках и улучшайте процессы

**Документирование**
Документируйте результаты и извлеченные уроки:
- Ведите журнал проекта
- Фиксируйте лучшие практики
- Создавайте базу знаний для будущих проектов

Готов помочь с детализацией любого из этапов и предоставить дополнительные инструменты и шаблоны для эффективной реализации.`,

      'Doc AI': `Анализируя ваш запрос "${userQuestion}", могу выделить следующие ключевые моменты и предоставить детальный анализ:

## Основные положения и нормативно-правовая база

**Важность нормативно-правовой базы**
Крайне важно обратить внимание на нормативно-правовую базу, регулирующую данную область. В контексте законодательства Республики Казахстан это включает в себя:
- Конституционные нормы и принципы
- Кодексы и законы, регулирующие конкретную сферу
- Подзаконные акты и постановления правительства
- Ведомственные нормативные документы

**Соответствие требованиям законодательства РК**
Необходимо провести тщательную проверку соответствия всех аспектов вашего запроса требованиям действующего законодательства РК. Это включает:
- Проверку на соответствие основным принципам права
- Анализ применимых статей кодексов и законов
- Оценку соответствия процедурным требованиям
- Проверку соблюдения сроков и формальностей

**Учет релевантных документов**
Следует учесть все релевантные документы и акты, которые могут иметь отношение к вашему вопросу:
- Международные договоры и соглашения
- Региональные нормативные акты
- Отраслевые стандарты и требования
- Судебная практика и прецеденты

## Детальные рекомендации

**1. Тщательный анализ документов**
Проведите тщательный анализ всех связанных документов:
- Изучите полный текст нормативных актов, а не только выдержки
- Обратите внимание на определения и терминологию
- Проверьте наличие изменений и дополнений
- Изучите официальные разъяснения и комментарии

**2. Даты и сроки действия**
Обратите особое внимание на даты и сроки действия нормативных актов:
- Проверьте дату вступления в силу
- Уточните, не утратил ли акт силу
- Проверьте наличие переходных положений
- Учтите сроки действия временных норм

**3. Актуальность источников**
Убедитесь в актуальности используемых источников:
- Используйте официальные источники публикации
- Проверяйте наличие последних изменений
- Сверяйте информацию с официальными базами данных
- Учитывайте дату последнего обновления документа

## Дополнительные аспекты

При работе с документами также важно учитывать:
- Правила толкования нормативных актов
- Принципы системности и непротиворечивости права
- Особенности применения норм в конкретных ситуациях
- Возможность альтернативных толкований

Если нужна помощь с конкретными документами или правовыми аспектами, могу предоставить более детальную информацию, провести анализ конкретных статей или помочь с подготовкой необходимых документов.`,
    };

    return responses[agentId] || `Относительно вашего вопроса "${userQuestion}", могу предоставить следующую детальную информацию:

## Анализ ситуации

Это важный вопрос, требующий детального рассмотрения с различных углов зрения. Для начала необходимо провести тщательный анализ текущей ситуации:

**Оценка текущего состояния**
Необходимо оценить текущее состояние и контекст, в котором находится рассматриваемый вопрос. Это включает анализ:
- Внутренних факторов и условий
- Внешних обстоятельств и влияний
- Исторического контекста и предпосылок
- Текущих трендов и динамики развития

**Идентификация ключевых элементов**
Важно идентифицировать все ключевые элементы, которые могут влиять на решение вопроса:
- Основные участники и заинтересованные стороны
- Ресурсы и ограничения
- Взаимосвязи и зависимости
- Потенциальные риски и возможности

## Возможные решения

**Рассмотрение различных подходов**
Следует рассмотреть различные подходы и их эффективность в контексте вашей ситуации:

**Подход 1: Традиционный метод**
- Преимущества: проверен временем, понятен всем участникам
- Недостатки: может быть менее эффективен в современных условиях
- Применимость: подходит для стандартных ситуаций

**Подход 2: Инновационное решение**
- Преимущества: может дать значительный эффект, использует современные технологии
- Недостатки: требует дополнительных ресурсов и обучения
- Применимость: оптимален для сложных или новых задач

**Подход 3: Комбинированный подход**
- Преимущества: сочетает надежность и инновационность
- Недостатки: требует тщательного планирования
- Применимость: универсальный вариант для большинства случаев

## Рекомендации

**Оптимальный путь действий**
На основе проведенного анализа рекомендую следующий оптимальный путь действий:

1. **Начальный этап**: Проведите дополнительное исследование для уточнения деталей
2. **Планирование**: Разработайте детальный план с учетом всех выявленных факторов
3. **Пилотное внедрение**: Начните с небольшого пилотного проекта для проверки эффективности
4. **Масштабирование**: После успешного пилота распространите решение на всю систему
5. **Мониторинг**: Постоянно отслеживайте результаты и вносите корректировки

**Дополнительные соображения**
- Учтите специфику вашей организации и отрасли
- Обеспечьте поддержку со стороны руководства
- Подготовьте команду к изменениям
- Создайте систему обратной связи

Для более точного ответа было бы полезно уточнить некоторые детали вашей ситуации. Готов помочь с дальнейшим анализом, разработкой детального плана действий или консультацией по конкретным аспектам реализации.`;
  }

  /**
   * Generate mock messages for a session
   */
  static async generateMockMessages(sessionId: string, agentId: string, userQuestions: string[]): Promise<AgentChatMessage[]> {
    const messages: AgentChatMessage[] = [];
    const now = Date.now();

    for (let i = 0; i < userQuestions.length; i++) {
      const question = userQuestions[i];
      const questionTime = new Date(now - (userQuestions.length - i) * 5 * 60 * 1000).toISOString();
      
      // User message
      messages.push({
        id: `msg-user-${i}`,
        role: 'user',
        text: question,
        createdAt: questionTime,
      });

      // Generate realistic assistant response
      const responseText = await this.generateMockResponse(agentId, question);
      const responseTime = new Date(new Date(questionTime).getTime() + 2000).toISOString();
      const durationMs = Math.floor(Math.random() * 3000) + 1500; // 1.5-4.5 seconds

      messages.push({
        id: `msg-assistant-${i}`,
        role: 'assistant',
        text: responseText,
        createdAt: responseTime,
        durationMs,
        feedback: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'like' : 'dislike') : undefined,
      });
    }

    this.saveMessages(sessionId, messages);
    return messages;
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
    
    // Generate mock messages for each session
    const questionsBySession: Record<string, string[]> = {
      'mock-1': [
        'Сформируй краткую сводку по рынку за Q3 2025',
        'Какие основные тренды ты видишь?',
        'Какие риски стоит учитывать?',
        'Спасибо за анализ! Это очень полезная информация.'
      ],
      'mock-2': [
        'Составь план внедрения чат-бота в службу поддержки',
        'Какие этапы самые критичные?',
        'Сколько времени займет внедрение?',
        'Отлично, начнем с первого этапа.'
      ],
      'mock-3': [
        'Объясни основные принципы работы системы',
        'Какие есть ограничения?',
        'Как правильно использовать API?',
        'Понял, спасибо за разъяснения!'
      ],
    };

    // Generate messages asynchronously and ensure they're saved
    Object.entries(questionsBySession).forEach(([sessionId, questions]) => {
      this.generateMockMessages(sessionId, agentId, questions)
        .then(messages => {
          console.log(`Generated ${messages.length} mock messages for session ${sessionId}`);
        })
        .catch(error => {
          console.error(`Failed to generate mock messages for ${sessionId}:`, error);
          // Still save basic messages even if generation fails
          const basicMessages: AgentChatMessage[] = questions.flatMap((q, i) => [
            {
              id: `msg-user-${i}`,
              role: 'user',
              text: q,
              createdAt: new Date(Date.now() - (questions.length - i) * 5 * 60 * 1000).toISOString(),
            },
            {
              id: `msg-assistant-${i}`,
              role: 'assistant',
              text: this.getFallbackResponse(agentId, q),
              createdAt: new Date(Date.now() - (questions.length - i) * 5 * 60 * 1000 + 2000).toISOString(),
              durationMs: Math.floor(Math.random() * 3000) + 1500,
            },
          ]);
          this.saveMessages(sessionId, basicMessages);
        });
    });

    return mockSessions;
  }
}

