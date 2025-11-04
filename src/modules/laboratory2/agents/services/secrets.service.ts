export interface Secret {
  id: string;
  name: string;
  type: "api_key" | "password" | "token" | "connection_string";
  value: string;
  encrypted: boolean;
  description?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Connection {
  id: string;
  name: string;
  type: "database" | "api" | "storage" | "messaging";
  config: Record<string, any>;
  secretIds?: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Limit {
  id: string;
  name: string;
  resource: "api_calls" | "storage" | "compute" | "requests";
  limit: number;
  window: "minute" | "hour" | "day" | "month";
  current: number;
  resetAt: Date;
}

export class SecretsService {
  private static SECRETS_KEY = "laboratory2-secrets";
  private static CONNECTIONS_KEY = "laboratory2-connections";
  private static LIMITS_KEY = "laboratory2-limits";

  // Secrets
  static saveSecret(secret: Secret): void {
    const secrets = this.getAllSecrets();
    const existingIndex = secrets.findIndex((s) => s.id === secret.id);

    if (existingIndex >= 0) {
      secrets[existingIndex] = {
        ...secret,
        updatedAt: new Date(),
      };
    } else {
      secrets.push({
        ...secret,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    localStorage.setItem(this.SECRETS_KEY, JSON.stringify(secrets));
  }

  static getAllSecrets(): Secret[] {
    try {
      const stored = localStorage.getItem(this.SECRETS_KEY);
      if (!stored) return [];
      const secrets = JSON.parse(stored);
      return secrets.map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt),
        value: s.encrypted ? "***" : s.value,
      }));
    } catch {
      return [];
    }
  }

  static getSecret(id: string): Secret | null {
    const secrets = this.getAllSecrets();
    return secrets.find((s) => s.id === id) || null;
  }

  static deleteSecret(id: string): boolean {
    const secrets = this.getAllSecrets();
    const filtered = secrets.filter((s) => s.id !== id);
    localStorage.setItem(this.SECRETS_KEY, JSON.stringify(filtered));
    return filtered.length < secrets.length;
  }

  // Connections
  static saveConnection(connection: Connection): void {
    const connections = this.getAllConnections();
    const existingIndex = connections.findIndex((c) => c.id === connection.id);

    if (existingIndex >= 0) {
      connections[existingIndex] = {
        ...connection,
        updatedAt: new Date(),
      };
    } else {
      connections.push({
        ...connection,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    localStorage.setItem(this.CONNECTIONS_KEY, JSON.stringify(connections));
  }

  static getAllConnections(): Connection[] {
    try {
      const stored = localStorage.getItem(this.CONNECTIONS_KEY);
      if (!stored) return [];
      const connections = JSON.parse(stored);
      return connections.map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
      }));
    } catch {
      return [];
    }
  }

  static getConnection(id: string): Connection | null {
    const connections = this.getAllConnections();
    return connections.find((c) => c.id === id) || null;
  }

  static deleteConnection(id: string): boolean {
    const connections = this.getAllConnections();
    const filtered = connections.filter((c) => c.id !== id);
    localStorage.setItem(this.CONNECTIONS_KEY, JSON.stringify(filtered));
    return filtered.length < connections.length;
  }

  // Limits
  static saveLimit(limit: Limit): void {
    const limits = this.getAllLimits();
    const existingIndex = limits.findIndex((l) => l.id === limit.id);

    if (existingIndex >= 0) {
      limits[existingIndex] = limit;
    } else {
      limits.push(limit);
    }

    localStorage.setItem(this.LIMITS_KEY, JSON.stringify(limits));
  }

  static getAllLimits(): Limit[] {
    try {
      const stored = localStorage.getItem(this.LIMITS_KEY);
      if (!stored) return [];
      const limits = JSON.parse(stored);
      return limits.map((l: any) => ({
        ...l,
        resetAt: new Date(l.resetAt),
      }));
    } catch {
      return [];
    }
  }

  static getLimit(id: string): Limit | null {
    const limits = this.getAllLimits();
    return limits.find((l) => l.id === id) || null;
  }

  static updateLimitUsage(id: string, usage: number): void {
    const limit = this.getLimit(id);
    if (limit) {
      limit.current = usage;
      this.saveLimit(limit);
    }
  }

  static checkLimit(id: string): boolean {
    const limit = this.getLimit(id);
    if (!limit) return true;
    return limit.current < limit.limit;
  }
}

