/**
 * Thin wrapper that talks to Anthropic Claude when configured, otherwise
 * falls back to the existing OpenAI-compatible service or to a local generator.
 *
 * Configure via .env:
 *   VITE_ANTHROPIC_API_KEY=sk-ant-...
 *   VITE_ANTHROPIC_MODEL=claude-sonnet-4-6        (default if unset)
 *   VITE_PRESENTATION_ANTHROPIC_MODEL=...        — только для Presentation Agent (опционально)
 *   VITE_ANTHROPIC_BASE_URL=https://api.anthropic.com/v1
 */

import { sendChatMessage } from "@/shared/services/ai.service.ts";

interface ClaudeMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClaudeOptions {
  model?: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface ClaudeResult {
  content: string;
  provider: "anthropic" | "openai-compatible" | "mock";
  model: string;
}

/** Alias из документации Anthropic: Sonnet 4.6 — баланс качества и скорости для агентов */
const DEFAULT_MODEL = "claude-sonnet-4-6";

/** Модель только для генерации outline презентаций (перекрывает VITE_ANTHROPIC_MODEL для этого сценария). */
export function getPresentationModel(): string {
  const dedicated = import.meta.env
    .VITE_PRESENTATION_ANTHROPIC_MODEL as string | undefined;
  if (dedicated?.trim()) return dedicated.trim();
  const general = import.meta.env.VITE_ANTHROPIC_MODEL as string | undefined;
  if (general?.trim()) return general.trim();
  return DEFAULT_MODEL;
}

function getAnthropicConfig() {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;
  const baseUrl =
    (import.meta.env.VITE_ANTHROPIC_BASE_URL as string | undefined) ||
    "https://api.anthropic.com/v1";
  const model =
    (import.meta.env.VITE_ANTHROPIC_MODEL as string | undefined) ||
    DEFAULT_MODEL;
  return { apiKey, baseUrl, model };
}

export function isClaudeConfigured(): boolean {
  return Boolean(import.meta.env.VITE_ANTHROPIC_API_KEY);
}

export async function callClaude(
  userPrompt: string,
  options: ClaudeOptions = {}
): Promise<ClaudeResult> {
  const cfg = getAnthropicConfig();
  const model = options.model || cfg.model;

  if (cfg.apiKey) {
    try {
      const res = await fetch(`${cfg.baseUrl}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": cfg.apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model,
          max_tokens: options.maxTokens ?? 4000,
          temperature: options.temperature ?? 0.4,
          system: options.systemPrompt,
          messages: [{ role: "user", content: userPrompt } as ClaudeMessage],
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Anthropic API ${res.status}: ${text || res.statusText}`);
      }

      const data = await res.json();
      const text = Array.isArray(data?.content)
        ? data.content
            .map((c: { type: string; text?: string }) =>
              c.type === "text" ? c.text || "" : ""
            )
            .join("\n")
        : "";
      return { content: text, provider: "anthropic", model };
    } catch (error) {
      console.warn("[claude] direct call failed, trying fallback:", error);
    }
  }

  try {
    const res = await sendChatMessage(
      [{ role: "user", content: userPrompt }],
      {
        systemPrompt: options.systemPrompt,
        temperature: options.temperature ?? 0.4,
        maxTokens: options.maxTokens ?? 2000,
      }
    );
    return {
      content: res.content,
      provider: "openai-compatible",
      model: res.model || "openai-compatible",
    };
  } catch (error) {
    console.warn("[claude] openai-compatible fallback failed:", error);
    return {
      content: "",
      provider: "mock",
      model,
    };
  }
}
