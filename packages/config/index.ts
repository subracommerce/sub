export * from "./env";

export const APP_NAME = "SUBRA";
export const APP_DESCRIPTION = "Autonomous AI Commerce Platform with Crypto Payments";

export const SUPPORTED_CHAINS = {
  ETHEREUM: 1,
  SOLANA: "mainnet-beta",
  POLYGON: 137,
  BASE: 8453,
} as const;

export const SUPPORTED_TOKENS = {
  USDC: "USDC",
  SOL: "SOL",
  ETH: "ETH",
  MATIC: "MATIC",
} as const;

export const API_ROUTES = {
  AUTH: "/auth",
  USER: "/user",
  AGENT: "/agent",
  TASK: "/task",
  TRANSACTION: "/transaction",
  ZK_RECEIPT: "/zk-receipt",
} as const;

export const AGENT_TYPES = {
  EXPLORER: "explorer",
  NEGOTIATOR: "negotiator",
  EXECUTOR: "executor",
  TRACKER: "tracker",
} as const;

export const TASK_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

