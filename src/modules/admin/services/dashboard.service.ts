// Mock data service for demo mode
// In production, replace with actual API calls

export async function getHealth() {
  // Mock health data - simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    status: "UP",
    components: {
      consul: { status: "UP" },
      db: { status: "UP" },
      diskSpace: { status: "UP" }
    }
  };
}

export async function getSystemMetrics() {
  // Mock metrics data - simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    cpu: 45,
    memory: 62,
    disk: 78,
    requests: 1250
  };
}

export async function getAgentsCount() {
  // Mock count - using mock data length
  await new Promise(resolve => setTimeout(resolve, 200));
  return 5; // Mock count for demo
}

export async function getLLMModelsCount() {
  // Mock count - using mock data length
  await new Promise(resolve => setTimeout(resolve, 200));
  return 8; // Mock count for demo
}

export async function getKnowledgeCount() {
  // Mock count
  await new Promise(resolve => setTimeout(resolve, 200));
  return 12; // Mock count for demo
}
