import api from "@/main/webapp/app/shared/utils/api";

export async function getHealth() {
  const { data } = await api.get("/admin/health");
  return data;
}

export async function getSystemMetrics() {
  const { data } = await api.get("/admin/metrics");
  return data;
}

export async function getAgentsCount() {
  const { data } = await api.get("/api/ai-agents");
  // если pagination: {content:[]}, иначе просто data.length или data.content.length
  return Array.isArray(data) ? data.length : (Array.isArray(data.content) ? data.content.length : 0);
}

export async function getLLMModelsCount() {
  const { data } = await api.get("/api/llm-models");
  return Array.isArray(data) ? data.length : (Array.isArray(data.content) ? data.content.length : 0);
}

export async function getKnowledgeCount() {
  const { data } = await api.get("/api/knowledges");
  return Array.isArray(data) ? data.length : (Array.isArray(data.content) ? data.content.length : 0);
}
