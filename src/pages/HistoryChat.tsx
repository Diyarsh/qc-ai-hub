import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatComposer } from "@/components/ChatComposer";

// Mock conversation data based on history items
const mockConversations: Record<string, { title: string; messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: string }> }> = {
  "0": {
    title: "Analyze quantum computing algorithms",
    messages: [
      {
        role: "user",
        content: "Analyze quantum computing algorithms and explain the key principles behind quantum supremacy",
        timestamp: "2024-01-15T10:30:00Z"
      },
      {
        role: "assistant",
        content: "Quantum computing leverages quantum mechanical phenomena like superposition and entanglement to process information. Key principles include:\n\n1. **Qubits**: Unlike classical bits (0 or 1), qubits exist in superposition, representing both states simultaneously\n2. **Quantum Gates**: Operations that manipulate qubits (Hadamard, CNOT, etc.)\n3. **Entanglement**: Qubits become correlated, allowing parallel computation\n4. **Quantum Supremacy**: When a quantum computer solves problems faster than classical computers\n\nAlgorithms like Shor's (factoring) and Grover's (search) demonstrate quantum advantages. Current challenges include decoherence and error correction.",
        timestamp: "2024-01-15T10:31:15Z"
      },
      {
        role: "user",
        content: "What are the practical applications of quantum computing?",
        timestamp: "2024-01-15T10:32:00Z"
      },
      {
        role: "assistant",
        content: "Practical applications include:\n\n- **Cryptography**: Breaking current encryption (RSA, ECC)\n- **Drug Discovery**: Molecular simulation for pharmaceutical research\n- **Optimization**: Solving complex logistics and scheduling problems\n- **Machine Learning**: Quantum neural networks for pattern recognition\n- **Financial Modeling**: Portfolio optimization and risk analysis\n\nCompanies like IBM, Google, and Rigetti are actively developing quantum systems.",
        timestamp: "2024-01-15T10:33:20Z"
      }
    ]
  },
  "1": {
    title: "Create AI-powered data visualization",
    messages: [
      {
        role: "user",
        content: "Create AI-powered data visualization for business analytics",
        timestamp: "2024-01-14T14:20:00Z"
      },
      {
        role: "assistant",
        content: "I'll help you create an AI-powered data visualization system. Here's a comprehensive approach:\n\n**Key Components:**\n1. **Data Ingestion**: Connect to various data sources (databases, APIs, files)\n2. **AI Analysis**: Use ML models for pattern detection and insights\n3. **Visualization Engine**: Interactive charts, dashboards, and reports\n4. **Natural Language Queries**: Allow users to ask questions in plain language\n\n**Technologies:**\n- Python (Pandas, NumPy)\n- Visualization: Plotly, D3.js, Tableau API\n- ML: scikit-learn, TensorFlow for predictive analytics\n- NLP: Transformers for query understanding",
        timestamp: "2024-01-14T14:21:30Z"
      },
      {
        role: "user",
        content: "Show me example visualizations",
        timestamp: "2024-01-14T14:22:15Z"
      },
      {
        role: "assistant",
        content: "Example visualizations:\n\n1. **Sales Trend Analysis**: Time series charts with AI-predicted future trends\n2. **Customer Segmentation**: Interactive scatter plots with clustering\n3. **Revenue Dashboard**: Real-time metrics with anomaly detection highlights\n4. **Geographic Heat Maps**: Sales performance by region\n5. **Correlation Matrices**: AI-identified relationships between variables\n\nWould you like me to generate code for a specific visualization type?",
        timestamp: "2024-01-14T14:23:45Z"
      }
    ]
  },
  "2": {
    title: "Generate video from text description",
    messages: [
      {
        role: "user",
        content: "Generate video from text description: A sunset over mountains with birds flying",
        timestamp: "2024-01-13T09:15:00Z"
      },
      {
        role: "assistant",
        content: "I can help you generate video content from text descriptions using AI video generation tools.\n\n**Available Tools:**\n- **Veo 2**: Google's advanced video generation model\n- **Runway ML**: Text-to-video generation\n- **Pika Labs**: Creative video generation\n\nFor your sunset scene, I recommend:\n1. Detailed prompt: \"Cinematic sunset over snow-capped mountains, golden hour lighting, flock of birds flying in formation, 4K quality, serene atmosphere\"\n2. Duration: 10-30 seconds\n3. Style: Realistic or artistic\n\nWould you like me to proceed with generation using Veo 2?",
        timestamp: "2024-01-13T09:16:20Z"
      }
    ]
  },
  "3": {
    title: "Optimize database query performance",
    messages: [
      {
        role: "user",
        content: "How can I optimize database query performance for a large PostgreSQL database?",
        timestamp: "2024-01-12T16:45:00Z"
      },
      {
        role: "assistant",
        content: "Here are key optimization strategies for PostgreSQL:\n\n**1. Indexing**\n- Create indexes on frequently queried columns\n- Use composite indexes for multi-column queries\n- Monitor index usage with `pg_stat_user_indexes`\n\n**2. Query Optimization**\n- Use `EXPLAIN ANALYZE` to identify bottlenecks\n- Avoid `SELECT *`; specify needed columns\n- Use JOINs efficiently; avoid N+1 queries\n\n**3. Configuration**\n- Adjust `shared_buffers` (25% of RAM)\n- Tune `work_mem` for sorting/joins\n- Configure `maintenance_work_mem` for VACUUM\n\n**4. Partitioning**\n- Partition large tables by date or range\n- Improves query performance on subsets\n\nWould you like specific recommendations for your schema?",
        timestamp: "2024-01-12T16:46:30Z"
      },
      {
        role: "user",
        content: "Show me how to create indexes",
        timestamp: "2024-01-12T16:47:00Z"
      },
      {
        role: "assistant",
        content: "Here are common index creation patterns:\n\n```sql\n-- Single column index\nCREATE INDEX idx_user_email ON users(email);\n\n-- Composite index\nCREATE INDEX idx_orders_date_status ON orders(order_date, status);\n\n-- Partial index (for filtered queries)\nCREATE INDEX idx_active_users ON users(email) WHERE is_active = true;\n\n-- Unique index\nCREATE UNIQUE INDEX idx_product_sku ON products(sku);\n\n-- Expression index\nCREATE INDEX idx_user_name_lower ON users(LOWER(name));\n```\n\n**Best Practices:**\n- Index foreign keys\n- Don't over-index (maintenance cost)\n- Monitor with `pg_stat_user_indexes`\n- Use `CONCURRENTLY` for production:\n  ```sql\n  CREATE INDEX CONCURRENTLY idx_name ON table(column);\n  ```",
        timestamp: "2024-01-12T16:48:15Z"
      }
    ]
  },
  "4": {
    title: "Build machine learning model pipeline",
    messages: [
      {
        role: "user",
        content: "Build a machine learning model pipeline for customer churn prediction",
        timestamp: "2024-01-11T11:20:00Z"
      },
      {
        role: "assistant",
        content: "I'll design a complete ML pipeline for churn prediction:\n\n**Pipeline Architecture:**\n1. **Data Collection**: Extract customer data (transactions, interactions, demographics)\n2. **Feature Engineering**: Create features (RFM metrics, engagement scores, tenure)\n3. **Data Preprocessing**: Handle missing values, encode categoricals, scale features\n4. **Model Training**: Train multiple models (Random Forest, XGBoost, Neural Networks)\n5. **Model Evaluation**: Cross-validation, ROC-AUC, precision-recall\n6. **Deployment**: API endpoint for real-time predictions\n7. **Monitoring**: Track model drift and performance metrics\n\n**Tech Stack:**\n- Scikit-learn / XGBoost for models\n- Pandas for data processing\n- Flask/FastAPI for API\n- MLflow for experiment tracking\n\nWould you like me to generate the code?",
        timestamp: "2024-01-11T11:22:00Z"
      },
      {
        role: "user",
        content: "What features should I use?",
        timestamp: "2024-01-11T11:23:00Z"
      },
      {
        role: "assistant",
        content: "Key features for churn prediction:\n\n**Behavioral Features:**\n- Days since last purchase\n- Purchase frequency (transactions per month)\n- Average order value\n- Product category preferences\n- Support ticket count\n\n**Engagement Features:**\n- Email open rate\n- App login frequency\n- Feature usage metrics\n- Time spent on platform\n\n**Demographic Features:**\n- Customer tenure (days as customer)\n- Geographic region\n- Customer segment\n\n**Derived Features:**\n- RFM score (Recency, Frequency, Monetary)\n- Engagement score (weighted combination)\n- Trend indicators (declining vs. increasing activity)\n\nThese features should provide strong predictive power for churn.",
        timestamp: "2024-01-11T11:24:30Z"
      }
    ]
  },
  "5": {
    title: "Generate product demo video",
    messages: [
      {
        role: "user",
        content: "Generate product demo video for our new AI platform",
        timestamp: "2024-01-10T15:30:00Z"
      },
      {
        role: "assistant",
        content: "I can help you create a product demo video using AI video generation tools. Here's a suggested approach:\n\n**Video Structure:**\n1. **Introduction** (5-10s): Platform logo with animated text\n2. **Feature Showcase** (30-45s): Key features with UI animations\n3. **Use Cases** (20-30s): Real-world applications\n4. **Call to Action** (5-10s): Contact information\n\n**Recommended Tools:**\n- Veo 2 for high-quality video generation\n- Runway ML for creative transitions\n- Adobe After Effects for post-processing\n\nWould you like me to generate a script first?",
        timestamp: "2024-01-10T15:31:20Z"
      }
    ]
  },
  "6": {
    title: "Implement natural language processing",
    messages: [
      {
        role: "user",
        content: "Implement natural language processing for text analysis",
        timestamp: "2024-01-09T09:15:00Z"
      },
      {
        role: "assistant",
        content: "I'll help you implement NLP for text analysis. Here's a comprehensive approach:\n\n**NLP Pipeline:**\n1. **Text Preprocessing**: Tokenization, normalization, stop word removal\n2. **Feature Extraction**: TF-IDF, word embeddings (Word2Vec, GloVe)\n3. **Model Selection**: BERT, GPT-based models for advanced tasks\n4. **Analysis Tasks**: Sentiment analysis, named entity recognition, topic modeling\n\n**Libraries:**\n- NLTK, spaCy for basic NLP\n- Transformers (Hugging Face) for advanced models\n- scikit-learn for traditional ML\n\nWhat specific analysis tasks do you need?",
        timestamp: "2024-01-09T09:16:30Z"
      },
      {
        role: "user",
        content: "I need sentiment analysis",
        timestamp: "2024-01-09T09:17:00Z"
      },
      {
        role: "assistant",
        content: "For sentiment analysis, I recommend:\n\n**Approach 1: Pre-trained Models**\n- Use VADER (for social media text)\n- FinBERT (financial sentiment)\n- BERT-based models (general purpose)\n\n**Approach 2: Custom Model**\n- Train on your domain-specific data\n- Fine-tune BERT on labeled dataset\n- Achieve 85-95% accuracy with good data\n\n**Implementation:**\n```python\nfrom transformers import pipeline\nsentiment = pipeline('sentiment-analysis', model='nlptown/bert-base-multilingual-uncased-sentiment')\nresult = sentiment('Your text here')\n```\n\nWould you like code for a specific approach?",
        timestamp: "2024-01-09T09:18:15Z"
      }
    ]
  },
  "7": {
    title: "Create animated explainer video",
    messages: [
      {
        role: "user",
        content: "Create an animated explainer video about AI technology",
        timestamp: "2024-01-08T13:45:00Z"
      },
      {
        role: "assistant",
        content: "I can help you create an animated explainer video about AI. Here's a production plan:\n\n**Video Concept:**\n- Duration: 60-90 seconds\n- Style: Modern, clean animations\n- Tone: Educational and engaging\n\n**Sections:**\n1. **Hook** (5s): \"What is AI?\"\n2. **Explanation** (40s): How AI works with visual metaphors\n3. **Applications** (30s): Real-world examples\n4. **CTA** (15s): Learn more\n\n**Tools:**\n- Veo 2 for AI-generated animations\n- Adobe After Effects for compositing\n- Voiceover: Text-to-speech or professional narrator\n\nWould you like me to generate a storyboard?",
        timestamp: "2024-01-08T13:46:30Z"
      }
    ]
  }
};

// Default conversation if ID not found
const defaultConversation = {
  title: "Chat History",
  messages: [
    {
      role: "user" as const,
      content: "Hello, I need help with AI integration",
      timestamp: new Date().toISOString()
    },
    {
      role: "assistant" as const,
      content: "I'm here to help! What would you like to know about AI integration?",
      timestamp: new Date().toISOString()
    }
  ]
};

export default function HistoryChat() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  
  const conversation = id ? (mockConversations[id] || defaultConversation) : defaultConversation;
  const [messages, setMessages] = useState(conversation.messages);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "только что";
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays < 7) return `${diffDays} дн назад`;
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    
    const userMsg = {
      role: 'user' as const,
      content: trimmed,
      timestamp: new Date().toISOString()
    };
    
    const assistantMsg = {
      role: 'assistant' as const,
      content: "Это демонстрационная история чата. В реальном приложении здесь был бы ответ от AI модели.",
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader 
        title={conversation.title}
        actions={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/history')}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        }
      />

      {/* Messages */}
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-6">
          <div className="w-full max-w-3xl mx-auto space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm border ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground border-primary/60'
                      : 'bg-card border-border'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                  <div className={`text-xs mt-2 ${
                    msg.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </main>

      {/* Input */}
      <div className="p-4 bg-background">
        <div className="w-full max-w-3xl mx-auto">
          <ChatComposer
            value={input}
            onChange={setInput}
            onSend={handleSend}
          />
        </div>
      </div>
    </div>
  );
}

