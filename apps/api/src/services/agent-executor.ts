import { prisma } from "../lib/prisma";
import { redis } from "../lib/redis";
import { productSearchService } from "./product-search";
import { solanaPayService } from "./solana-pay";
import { Keypair, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";

/**
 * AgentExecutor
 * Executes agent tasks based on their skills
 * Phase 2: Marketplace Integration
 */

export interface TaskResult {
  success: boolean;
  data?: any;
  error?: string;
  experienceGained: number;
}

export class AgentExecutor {
  /**
   * Execute a search task
   */
  async executeSearchTask(
    agentId: string,
    taskId: string,
    query: string,
    marketplaces?: string[]
  ): Promise<TaskResult> {
    console.log(`🔍 Agent ${agentId} searching for "${query}"`);

    try {
      // Update task status
      await prisma.agentTask.update({
        where: { id: taskId },
        data: {
          status: "in_progress",
          startedAt: new Date(),
        },
      });

      // Publish activity
      await this.publishActivity(agentId, "search_started", {
        query,
        marketplaces,
      });

      // Execute search using real scraping
      const searchResult = await productSearchService.searchProducts(
        query,
        marketplaces || ["amazon", "ebay"],
        true // useRealData
      );

      // Update task with results
      await prisma.agentTask.update({
        where: { id: taskId },
        data: {
          status: "completed",
          output: searchResult,
          completedAt: new Date(),
        },
      });

      // Add experience to search skill (10 base + 2 per product found)
      const productCount = searchResult.products?.length || 0;
      const experienceGained = 10 + productCount * 2;
      await this.addSkillExperience(agentId, "search", experienceGained);

      // Publish completion
      await this.publishActivity(agentId, "search_completed", {
        query,
        productsFound: searchResult.products.length,
        experienceGained,
      });

      console.log(
        `✅ Agent ${agentId} found ${productCount} products (gained ${experienceGained} XP)`
      );

      return {
        success: true,
        data: searchResult,
        experienceGained,
      };
    } catch (error: any) {
      console.error(`❌ Search task failed:`, error);

      await prisma.agentTask.update({
        where: { id: taskId },
        data: {
          status: "failed",
          error: error.message,
          completedAt: new Date(),
        },
      });

      await this.publishActivity(agentId, "search_failed", {
        query,
        error: error.message,
      });

      return {
        success: false,
        error: error.message,
        experienceGained: 0,
      };
    }
  }

  /**
   * Execute a compare task
   */
  async executeCompareTask(
    agentId: string,
    taskId: string,
    productName: string,
    marketplaces?: string[]
  ): Promise<TaskResult> {
    console.log(`💰 Agent ${agentId} comparing prices for "${productName}"`);

    try {
      await prisma.agentTask.update({
        where: { id: taskId },
        data: {
          status: "in_progress",
          startedAt: new Date(),
        },
      });

      await this.publishActivity(agentId, "compare_started", {
        productName,
        marketplaces,
      });

      // Execute price comparison using real scraping
      const searchResult = await productSearchService.searchProducts(
        productName,
        marketplaces || ["amazon", "ebay", "walmart"],
        true // useRealData
      );

      // Extract products array from search result
      const products = searchResult.products || [];

      // Compare prices - find best deal
      let bestProduct = products.length > 0 ? products[0] : null;
      let highestPrice = products.length > 0 ? products[0].price : 0;
      let lowestPrice = products.length > 0 ? products[0].price : 0;

      for (const product of products) {
        if (product.price < lowestPrice) {
          lowestPrice = product.price;
          bestProduct = product;
        }
        if (product.price > highestPrice) {
          highestPrice = product.price;
        }
      }

      const savings = highestPrice - lowestPrice;
      const priceComparison = {
        bestProduct,
        savings,
        priceRange: { min: lowestPrice, max: highestPrice },
      };

      const compareResult = {
        productName,
        marketplaces: marketplaces || ["amazon", "ebay", "walmart"],
        products,
        bestProduct: priceComparison.bestProduct,
        bestPrice: priceComparison.bestProduct?.price || 0,
        bestMarketplace: priceComparison.bestProduct?.marketplace || "unknown",
        savings: priceComparison.savings,
        priceRange: priceComparison.priceRange,
        totalResults: products.length,
      };

      await prisma.agentTask.update({
        where: { id: taskId },
        data: {
          status: "completed",
          output: compareResult,
          completedAt: new Date(),
        },
      });

      // Add experience to compare skill (15 base + 3 per product compared)
      const experienceGained = 15 + products.length * 3;
      await this.addSkillExperience(agentId, "compare", experienceGained);

      await this.publishActivity(agentId, "compare_completed", {
        productName,
        bestPrice: compareResult.bestPrice,
        bestMarketplace: compareResult.bestMarketplace,
        savings: compareResult.savings,
        experienceGained,
      });

      console.log(
        `✅ Agent ${agentId} found best price: $${compareResult.bestPrice} at ${compareResult.bestMarketplace} (saved $${compareResult.savings.toFixed(2)}, gained ${experienceGained} XP)`
      );

      return {
        success: true,
        data: compareResult,
        experienceGained,
      };
    } catch (error: any) {
      console.error(`❌ Compare task failed:`, error);

      await prisma.agentTask.update({
        where: { id: taskId },
        data: {
          status: "failed",
          error: error.message,
          completedAt: new Date(),
        },
      });

      await this.publishActivity(agentId, "compare_failed", {
        productName,
        error: error.message,
      });

      return {
        success: false,
        error: error.message,
        experienceGained: 0,
      };
    }
  }

  /**
   * Execute a purchase task
   */
  async executePurchaseTask(
    agentId: string,
    taskId: string,
    userId: string,
    productId: string,
    productName: string,
    price: number,
    merchant: string,
    currency: "SOL" | "USDC" = "USDC"
  ): Promise<TaskResult> {
    console.log(`💳 Agent ${agentId} purchasing "${productName}" for ${price} ${currency}`);

    try {
      // Update task status
      await prisma.agentTask.update({
        where: { id: taskId },
        data: {
          status: "in_progress",
          startedAt: new Date(),
        },
      });

      await this.publishActivity(agentId, "purchase_started", {
        productName,
        price,
        currency,
        merchant,
      });

      // Get agent wallet keypair
      const agent = await prisma.agent.findUnique({
        where: { id: agentId },
        select: { encryptedKey: true, walletAddress: true },
      });

      if (!agent || !agent.encryptedKey || !agent.walletAddress) {
        throw new Error("Agent wallet not configured");
      }

      // Decrypt agent's private key
      // TODO: Implement proper decryption with user's password
      // For now, assume the encryptedKey is the base58-encoded private key
      const agentKeypair = Keypair.fromSecretKey(bs58.decode(agent.encryptedKey));

      // Check balance
      const balance = await solanaPayService.getBalance(
        agentKeypair.publicKey,
        currency
      );

      console.log(`💰 Agent balance: ${balance} ${currency}`);

      if (balance < price) {
        throw new Error(
          `Insufficient balance. Required: ${price} ${currency}, Available: ${balance} ${currency}`
        );
      }

      // Execute payment
      const paymentResult = await solanaPayService.executePayment(agentKeypair, {
        recipient: merchant,
        amount: price,
        currency,
        label: productName,
        message: `Purchase: ${productName}`,
        memo: `Agent purchase - ${productId}`,
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || "Payment failed");
      }

      // Create transaction record
      const transaction = await prisma.transaction.create({
        data: {
          userId,
          agentId,
          type: "purchase",
          status: "completed",
          amount: price,
          currency,
          fromAddress: agent.walletAddress,
          toAddress: merchant,
          txHash: paymentResult.signature,
          metadata: {
            productId,
            productName,
            merchant,
            taskId,
          },
        },
      });

      const purchaseResult = {
        productName,
        price,
        currency,
        merchant,
        transactionId: transaction.id,
        signature: paymentResult.signature,
        timestamp: paymentResult.timestamp,
      };

      // Update task with results
      await prisma.agentTask.update({
        where: { id: taskId },
        data: {
          status: "completed",
          output: purchaseResult,
          completedAt: new Date(),
        },
      });

      // Add experience to execute skill (20 base + 5 per $10 spent)
      const experienceGained = 20 + Math.floor(price / 10) * 5;
      await this.addSkillExperience(agentId, "execute", experienceGained);

      await this.publishActivity(agentId, "purchase_completed", {
        productName,
        price,
        currency,
        signature: paymentResult.signature,
        experienceGained,
      });

      console.log(
        `✅ Agent ${agentId} purchased "${productName}" for ${price} ${currency} (TX: ${paymentResult.signature})`
      );

      return {
        success: true,
        data: purchaseResult,
        experienceGained,
      };
    } catch (error: any) {
      console.error(`❌ Purchase task failed:`, error);

      await prisma.agentTask.update({
        where: { id: taskId },
        data: {
          status: "failed",
          error: error.message,
          completedAt: new Date(),
        },
      });

      await this.publishActivity(agentId, "purchase_failed", {
        productName,
        error: error.message,
      });

      return {
        success: false,
        error: error.message,
        experienceGained: 0,
      };
    }
  }

  /**
   * Add experience to an agent skill
   */
  private async addSkillExperience(
    agentId: string,
    skillType: string,
    amount: number
  ): Promise<void> {
    try {
      // Find skill
      const skill = await prisma.agentSkill.findUnique({
        where: {
          agentId_skillType: {
            agentId,
            skillType,
          },
        },
      });

      if (!skill) {
        console.log(`⚠️ Skill ${skillType} not found for agent ${agentId}`);
        return;
      }

      // Add experience
      const newExperience = skill.experience + amount;
      const experiencePerLevel = 100;
      const newLevel = Math.min(
        Math.floor(newExperience / experiencePerLevel) + 1,
        10
      );

      await prisma.agentSkill.update({
        where: { id: skill.id },
        data: {
          experience: newExperience,
          level: newLevel,
        },
      });

      if (newLevel > skill.level) {
        console.log(
          `🎉 Agent ${agentId} leveled up ${skillType} to level ${newLevel}!`
        );
        await this.publishActivity(agentId, "skill_level_up", {
          skillType,
          newLevel,
          experience: newExperience,
        });
      }
    } catch (error) {
      console.error("Failed to add skill experience:", error);
    }
  }

  /**
   * Publish activity to Redis for real-time updates
   */
  private async publishActivity(
    agentId: string,
    activityType: string,
    data: any
  ): Promise<void> {
    try {
      const activity = {
        agentId,
        type: activityType,
        data,
        timestamp: new Date().toISOString(),
      };

      // Publish to Redis pub/sub
      await redis.publish(`agent:${agentId}:activity`, JSON.stringify(activity));

      // Also store in Redis list for history (keep last 100)
      const key = `agent:${agentId}:activity:history`;
      await redis.lpush(key, JSON.stringify(activity));
      await redis.ltrim(key, 0, 99); // Keep only last 100 activities
      await redis.expire(key, 86400); // Expire after 24 hours

      console.log(`📢 Published activity: ${activityType} for agent ${agentId}`);
    } catch (error) {
      console.error("Failed to publish activity:", error);
    }
  }

  /**
   * Get agent activity history
   */
  async getActivityHistory(agentId: string, limit: number = 50): Promise<any[]> {
    try {
      const key = `agent:${agentId}:activity:history`;
      const activities = await redis.lrange(key, 0, limit - 1);
      return activities.map((a) => JSON.parse(a));
    } catch (error) {
      console.error("Failed to get activity history:", error);
      return [];
    }
  }
}

export const agentExecutor = new AgentExecutor();

