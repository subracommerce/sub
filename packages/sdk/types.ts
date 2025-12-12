import { z } from "zod";

// Agent Types
export const AgentTypeSchema = z.enum(["explorer", "negotiator", "executor", "tracker"]);
export type AgentType = z.infer<typeof AgentTypeSchema>;

export const AgentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  type: AgentTypeSchema,
  description: z.string().optional(),
  walletAddress: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Agent = z.infer<typeof AgentSchema>;

// Task Types
export const TaskStatusSchema = z.enum(["pending", "in_progress", "completed", "failed"]);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const TaskSchema = z.object({
  id: z.string(),
  agentId: z.string(),
  userId: z.string(),
  type: z.string(),
  status: TaskStatusSchema,
  input: z.record(z.any()),
  output: z.record(z.any()).optional(),
  error: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Task = z.infer<typeof TaskSchema>;

// Transaction Types
export const TransactionTypeSchema = z.enum(["deposit", "withdrawal", "purchase", "refund"]);
export type TransactionType = z.infer<typeof TransactionTypeSchema>;

export const TransactionStatusSchema = z.enum(["pending", "processing", "completed", "failed"]);
export type TransactionStatus = z.infer<typeof TransactionStatusSchema>;

export const TransactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  agentId: z.string().optional(),
  type: TransactionTypeSchema,
  status: TransactionStatusSchema,
  amount: z.number(),
  currency: z.string(),
  fromAddress: z.string().optional(),
  toAddress: z.string().optional(),
  txHash: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

// ZK Receipt Types
export const ZkReceiptSchema = z.object({
  id: z.string(),
  transactionId: z.string(),
  userId: z.string(),
  proof: z.string(),
  publicInputs: z.array(z.string()),
  verificationKey: z.string().optional(),
  verified: z.boolean(),
  onChainTxHash: z.string().optional(),
  createdAt: z.string(),
});

export type ZkReceipt = z.infer<typeof ZkReceiptSchema>;

// User Types
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  walletAddress: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof UserSchema>;

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

