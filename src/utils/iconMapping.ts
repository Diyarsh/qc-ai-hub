import { 
  Mic,
  Languages,
  FileText,
  FileCheck,
  ClipboardList,
  Sparkles,
  Globe,
  Folder,
  Code,
  Terminal,
  Brackets,
  Briefcase,
  User,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Activity,
  LucideIcon 
} from "lucide-react";

/**
 * Agent category type definition
 */
export type AgentCategory = "all" | "language" | "assistant" | "documents" | "code" | "industrial";

/**
 * Mapping of specific agent types to their icons.
 * Use these for agents with well-defined purposes like transriber, translator, summarizer.
 * 
 * @example
 * ```typescript
 * const icon = agentTypeIcons.transriber; // Returns Mic icon
 * ```
 */
export const agentTypeIcons: Record<string, LucideIcon> = {
  transriber: Mic,
  translator: Languages,
  summarizer: FileText,
};

/**
 * Mapping of agent categories to arrays of suitable icons.
 * Each category has multiple icon options that can be used for different agents in that category.
 * The first icon in each array is the default/primary icon for that category.
 * 
 * @example
 * ```typescript
 * const icons = categoryIcons.documents; // Returns [FileText, FileCheck, Folder]
 * const defaultIcon = categoryIcons.documents[0]; // Returns FileText
 * ```
 */
export const categoryIcons: Record<AgentCategory, LucideIcon[]> = {
  language: [Sparkles, Languages, Globe],
  documents: [FileText, FileCheck, Folder],
  code: [Code, Terminal, Brackets],
  assistant: [Briefcase, User, MessageSquare],
  industrial: [BarChart3, TrendingUp, Activity],
  all: [Sparkles], // fallback
};

/**
 * Gets the appropriate icon for an agent based on its type or category.
 * 
 * Priority order:
 * 1. Specific agent type (e.g., "transriber", "translator", "summarizer")
 * 2. Category-based icon (first icon from the category array)
 * 3. Default fallback icon (Sparkles)
 * 
 * @param agentType - The specific type of agent (e.g., "transriber", "translator", "summarizer")
 * @param category - The category of the agent (e.g., "language", "documents", "code")
 * @returns The appropriate LucideIcon component
 * 
 * @example
 * ```typescript
 * // Specific agent type
 * const icon = getAgentIcon("transriber"); // Returns Mic icon
 * 
 * // Category-based
 * const icon = getAgentIcon(undefined, "documents"); // Returns FileText icon
 * 
 * // Fallback
 * const icon = getAgentIcon(); // Returns Sparkles (default)
 * 
 * // In a component
 * const Icon = getAgentIcon(agent.type, agent.category[0]);
 * return <Icon className="h-4 w-4" />;
 * ```
 */
export function getAgentIcon(
  agentType?: string, 
  category?: AgentCategory
): LucideIcon {
  // First priority: Check for specific agent type
  if (agentType && agentTypeIcons[agentType.toLowerCase()]) {
    return agentTypeIcons[agentType.toLowerCase()];
  }
  
  // Second priority: Use category-based icon
  if (category && categoryIcons[category]?.length > 0) {
    return categoryIcons[category][0]; // Return first icon from category
  }
  
  // Fallback: Default icon
  return Sparkles;
}

/**
 * Gets all available icons for a specific category.
 * Useful when you need to cycle through icons or provide multiple options.
 * 
 * @param category - The category of the agent
 * @returns Array of LucideIcon components for that category
 * 
 * @example
 * ```typescript
 * const icons = getCategoryIcons("documents"); // Returns [FileText, FileCheck, Folder]
 * ```
 */
export function getCategoryIcons(category: AgentCategory): LucideIcon[] {
  return categoryIcons[category] || categoryIcons.all;
}
