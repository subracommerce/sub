import Fastify from "fastify";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import jwt from "@fastify/jwt";
import { prisma } from "./lib/prisma";
import { redis } from "./lib/redis";
import { authRoutes } from "./routes/auth";
import { walletAuthRoutes } from "./routes/wallet-auth";
import { userRoutes } from "./routes/user";
import { agentRoutes } from "./routes/agent";
import { taskRoutes } from "./routes/task";
import { transactionRoutes } from "./routes/transaction";
import { zkReceiptRoutes } from "./routes/zk-receipt";

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
  },
});

// Security middleware
fastify.register(helmet, {
  contentSecurityPolicy: process.env.NODE_ENV === "production",
});

// CORS
fastify.register(cors, {
  origin: process.env.NODE_ENV === "production" ? ["https://subra.app"] : true,
  credentials: true,
});

// Rate limiting
fastify.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute",
  redis: redis,
});

// JWT
fastify.register(jwt, {
  secret: process.env.JWT_SECRET!,
});

// Health check
fastify.get("/health", async (request, reply) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    await redis.ping();
    return { status: "ok", timestamp: new Date().toISOString() };
  } catch (error) {
    reply.code(503);
    return { status: "error", message: "Service unavailable" };
  }
});

// Register routes
fastify.register(authRoutes, { prefix: "/auth" });
fastify.register(walletAuthRoutes);
fastify.register(userRoutes, { prefix: "/user" });
fastify.register(agentRoutes, { prefix: "/agent" });
fastify.register(taskRoutes, { prefix: "/task" });
fastify.register(transactionRoutes, { prefix: "/transaction" });
fastify.register(zkReceiptRoutes, { prefix: "/zk-receipt" });

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);

  if (error.validation) {
    reply.code(400).send({
      success: false,
      error: "Validation error",
      details: error.validation,
    });
    return;
  }

  reply.code(error.statusCode || 500).send({
    success: false,
    error: error.message || "Internal server error",
  });
});

// Graceful shutdown
const closeGracefully = async (signal: string) => {
  fastify.log.info(`Received signal to terminate: ${signal}`);
  
  await fastify.close();
  await prisma.$disconnect();
  await redis.quit();
  
  process.exit(0);
};

process.on("SIGINT", () => closeGracefully("SIGINT"));
process.on("SIGTERM", () => closeGracefully("SIGTERM"));

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || "4000", 10);
    await fastify.listen({ port, host: "0.0.0.0" });
    fastify.log.info(`🚀 SUBRA API running on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

