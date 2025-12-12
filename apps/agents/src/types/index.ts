import { Agent } from "@prisma/client";

export interface AgentTaskJob {
  taskId: string;
  agentId: string;
  type: string;
  input: Record<string, any>;
}

export interface BaseAgent {
  agent: Agent;
  execute(type: string, input: Record<string, any>): Promise<any>;
}

export interface SearchResult {
  title: string;
  url: string;
  price?: number;
  currency?: string;
  description?: string;
  image?: string;
  merchant?: string;
  rating?: number;
  availability?: string;
}

export interface ComparisonResult {
  product: string;
  results: SearchResult[];
  bestOption: SearchResult;
  reasoning: string;
}

export interface NegotiationResult {
  originalPrice: number;
  negotiatedPrice: number;
  savings: number;
  strategy: string;
  success: boolean;
}

export interface PurchaseResult {
  orderId: string;
  status: string;
  totalAmount: number;
  currency: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export interface TrackingUpdate {
  status: string;
  location?: string;
  timestamp: string;
  description: string;
}

