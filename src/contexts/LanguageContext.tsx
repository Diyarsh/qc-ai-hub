import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'kk' | 'ru' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  kk: {
    // Header
    'language.kk': 'Қазақша',
    'language.ru': 'Орысша',  
    'language.en': 'Ағылшынша',
    
    // Sidebar
    'sidebar.chat': 'Сөйлесу',
    'sidebar.ai-studio': 'AI-Студия',
    'sidebar.projects': 'Менің жобаларым',
    'sidebar.history': 'Тарих',
    'sidebar.lab': 'Зертхана',
    'sidebar.developer': 'Әзірлеуші режимі',
    
    // Dashboard
    'dashboard.title': 'AI-HUB',
    'dashboard.input.placeholder': 'Дауыстық хабарламаны жазу...',
    'dashboard.documents.title': 'Құжаттарды өңдеу',
    'dashboard.documents.desc': 'Талдау және деректерді алу',
    'dashboard.bots.title': 'Боттар',
    'dashboard.bots.desc': 'Автоматтандыру және чат-боттар',
    'dashboard.developers.title': 'Әзірлеушілерден',
    'dashboard.developers.desc': 'Дайын шешімдер және модельдер',
    
    // AI Studio
    'ai-studio.title': 'AI-Студия',
    'ai-studio.subtitle': 'AI шешімдерінің кітапханасы',
    'ai-studio.search': 'Модельдер мен шешімдерді іздеу...',
    'ai-studio.filters': 'Сүзгілер',
    'ai-studio.all': 'Барлығы',
    'ai-studio.language': 'Тілдік модельдер',
    'ai-studio.assistant': 'Корпоративтік көмекші',
    'ai-studio.documents': 'Құжаттар',
    'ai-studio.code': 'Код',
    'ai-studio.industrial': 'Өнеркәсіптік',
    'ai-studio.agents': 'Агенттер',
    'ai-studio.developers': 'Әзірлеушілерден',
    'ai-studio.use': 'Пайдалану',
    
    // Projects
    'projects.title': 'Жобалар',
    'projects.create': 'Жоба құру',
    'projects.my': 'Менің жобаларым',
    'projects.shared': 'Менімен бөлісілген',
    'projects.search': 'Іздеу',
    
    // History
    'history.title': 'Тарих',
    'history.search': 'Іздеу',
    'history.days-ago': 'күн бұрын'
  },
  ru: {
    // Header
    'language.kk': 'Казахский',
    'language.ru': 'Русский',
    'language.en': 'Английский',
    
    // Sidebar
    'sidebar.chat': 'Чат',
    'sidebar.ai-studio': 'AI-Студия',
    'sidebar.projects': 'Мои проекты',
    'sidebar.history': 'История',
    'sidebar.lab': 'Лаборатория',
    'sidebar.developer': 'Режим разработчика',
    
    // Dashboard
    'dashboard.title': 'AI-HUB',
    'dashboard.input.placeholder': 'Записать голосовое сообщение...',
    'dashboard.documents.title': 'Обработка документов',
    'dashboard.documents.desc': 'Анализ и извлечение данных',
    'dashboard.bots.title': 'Боты',
    'dashboard.bots.desc': 'Автоматизация и чат-боты',
    'dashboard.developers.title': 'От Разработчиков',
    'dashboard.developers.desc': 'Готовые решения и модели',
    
    // AI Studio
    'ai-studio.title': 'AI-Студия',
    'ai-studio.subtitle': 'Библиотека AI-решений',
    'ai-studio.search': 'Поиск моделей и решений...',
    'ai-studio.filters': 'Фильтры',
    'ai-studio.all': 'Все',
    'ai-studio.language': 'Языковые модели',
    'ai-studio.assistant': 'Корпоративный ассистент',
    'ai-studio.documents': 'Документы',
    'ai-studio.code': 'Код',
    'ai-studio.industrial': 'Промышленные',
    'ai-studio.agents': 'Агенты',
    'ai-studio.developers': 'От Разработчиков',
    'ai-studio.use': 'Использовать',
    
    // Projects
    'projects.title': 'Проекты',
    'projects.create': 'Создать проект',
    'projects.my': 'Мои проекты',
    'projects.shared': 'Поделились со мной',
    'projects.search': 'Поиск',
    
    // History
    'history.title': 'История',
    'history.search': 'Поиск',
    'history.days-ago': 'дня назад'
  },
  en: {
    // Header
    'language.kk': 'Kazakh',
    'language.ru': 'Russian',
    'language.en': 'English',
    
    // Sidebar
    'sidebar.chat': 'Chat',
    'sidebar.ai-studio': 'AI Studio',
    'sidebar.projects': 'My Projects',
    'sidebar.history': 'History',
    'sidebar.lab': 'Laboratory',
    'sidebar.developer': 'Developer Mode',
    
    // Dashboard
    'dashboard.title': 'AI-HUB',
    'dashboard.input.placeholder': 'Record a voice message...',
    'dashboard.documents.title': 'Document Processing',
    'dashboard.documents.desc': 'Analysis and data extraction',
    'dashboard.bots.title': 'Bots',
    'dashboard.bots.desc': 'Automation and chatbots',
    'dashboard.developers.title': 'From Developers',
    'dashboard.developers.desc': 'Ready solutions and models',
    
    // AI Studio
    'ai-studio.title': 'AI Studio',
    'ai-studio.subtitle': 'AI Solutions Library',
    'ai-studio.search': 'Search models and solutions...',
    'ai-studio.filters': 'Filters',
    'ai-studio.all': 'All',
    'ai-studio.language': 'Language Models',
    'ai-studio.assistant': 'Corporate Assistant',
    'ai-studio.documents': 'Documents',
    'ai-studio.code': 'Code',
    'ai-studio.industrial': 'Industrial',
    'ai-studio.agents': 'Agents',
    'ai-studio.developers': 'From Developers',
    'ai-studio.use': 'Use',
    
    // Projects
    'projects.title': 'Projects',
    'projects.create': 'Create project',
    'projects.my': 'My Projects',
    'projects.shared': 'Shared with me',
    'projects.search': 'Search',
    
    // History
    'history.title': 'History',
    'history.search': 'Search',
    'history.days-ago': 'days ago'
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ru');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}