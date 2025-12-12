import axios, { AxiosInstance } from "axios";
import type {
  Agent,
  Task,
  Transaction,
  ZkReceipt,
  User,
  ApiResponse,
  PaginatedResponse,
  AgentType,
  TaskStatus,
} from "./types";

export interface SubraClientOptions {
  apiUrl: string;
  apiKey?: string;
  accessToken?: string;
}

export class SubraClient {
  private client: AxiosInstance;

  constructor(options: SubraClientOptions) {
    this.client = axios.create({
      baseURL: options.apiUrl,
      headers: {
        "Content-Type": "application/json",
        ...(options.apiKey && { "X-API-Key": options.apiKey }),
        ...(options.accessToken && { Authorization: `Bearer ${options.accessToken}` }),
      },
    });
  }

  /**
   * Set access token for authenticated requests
   */
  setAccessToken(token: string) {
    this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  /**
   * User Methods
   */
  async getMe(): Promise<ApiResponse<User>> {
    const { data } = await this.client.get("/user/me");
    return data;
  }

  /**
   * Agent Methods
   */
  async createAgent(params: {
    name: string;
    type: AgentType;
    description?: string;
  }): Promise<ApiResponse<Agent>> {
    const { data } = await this.client.post("/agent", params);
    return data;
  }

  async getAgents(): Promise<PaginatedResponse<Agent>> {
    const { data } = await this.client.get("/agent");
    return data;
  }

  async getAgent(agentId: string): Promise<ApiResponse<Agent>> {
    const { data } = await this.client.get(`/agent/${agentId}`);
    return data;
  }

  async updateAgent(
    agentId: string,
    params: Partial<Pick<Agent, "name" | "description" | "isActive">>
  ): Promise<ApiResponse<Agent>> {
    const { data } = await this.client.patch(`/agent/${agentId}`, params);
    return data;
  }

  async deleteAgent(agentId: string): Promise<ApiResponse<void>> {
    const { data } = await this.client.delete(`/agent/${agentId}`);
    return data;
  }

  /**
   * Task Methods
   */
  async createTask(params: {
    agentId: string;
    type: string;
    input: Record<string, any>;
  }): Promise<ApiResponse<Task>> {
    const { data } = await this.client.post("/task", params);
    return data;
  }

  async getTasks(filters?: {
    agentId?: string;
    status?: TaskStatus;
  }): Promise<PaginatedResponse<Task>> {
    const { data } = await this.client.get("/task", { params: filters });
    return data;
  }

  async getTask(taskId: string): Promise<ApiResponse<Task>> {
    const { data } = await this.client.get(`/task/${taskId}`);
    return data;
  }

  async cancelTask(taskId: string): Promise<ApiResponse<Task>> {
    const { data } = await this.client.post(`/task/${taskId}/cancel`);
    return data;
  }

  /**
   * Transaction Methods
   */
  async getTransactions(): Promise<PaginatedResponse<Transaction>> {
    const { data } = await this.client.get("/transaction");
    return data;
  }

  async getTransaction(transactionId: string): Promise<ApiResponse<Transaction>> {
    const { data } = await this.client.get(`/transaction/${transactionId}`);
    return data;
  }

  async initiatePayment(params: {
    agentId: string;
    amount: number;
    currency: string;
    metadata?: Record<string, any>;
  }): Promise<ApiResponse<Transaction>> {
    const { data } = await this.client.post("/transaction/payment", params);
    return data;
  }

  /**
   * ZK Receipt Methods
   */
  async getZkReceipts(): Promise<PaginatedResponse<ZkReceipt>> {
    const { data } = await this.client.get("/zk-receipt");
    return data;
  }

  async getZkReceipt(receiptId: string): Promise<ApiResponse<ZkReceipt>> {
    const { data } = await this.client.get(`/zk-receipt/${receiptId}`);
    return data;
  }

  async verifyZkReceipt(receiptId: string): Promise<ApiResponse<{ verified: boolean }>> {
    const { data } = await this.client.post(`/zk-receipt/${receiptId}/verify`);
    return data;
  }
}

