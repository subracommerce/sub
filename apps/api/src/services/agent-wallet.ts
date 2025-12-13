import { Keypair, Connection, LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import crypto from "crypto";
import { prisma } from "../lib/prisma";

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";
const ENCRYPTION_KEY = process.env.AGENT_WALLET_ENCRYPTION_KEY || process.env.PRIVATE_KEY_ENCRYPTION_KEY!;

/**
 * AgentWalletService
 * Handles creation and management of per-agent Solana wallets
 */
export class AgentWalletService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(SOLANA_RPC_URL, "confirmed");
  }

  /**
   * Create a new Solana wallet for an agent
   */
  async createAgentWallet(agentId: string): Promise<{
    walletAddress: string;
    balance: number;
  }> {
    // Check if agent already has a wallet
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      throw new Error("Agent not found");
    }

    if (agent.agentWalletAddress) {
      throw new Error("Agent already has a wallet");
    }

    // Generate new Solana keypair
    const keypair = Keypair.generate();
    const walletAddress = keypair.publicKey.toBase58();

    // Encrypt private key
    const encryptedPrivateKey = this.encryptPrivateKey(
      Buffer.from(keypair.secretKey).toString("base64")
    );

    // Update agent in database
    await prisma.agent.update({
      where: { id: agentId },
      data: {
        walletAddress: walletAddress,
        encryptedKey: encryptedPrivateKey,
        walletBalance: 0,
      },
    });

    console.log(`✅ Created wallet for agent ${agentId}: ${walletAddress}`);

    return {
      walletAddress,
      balance: 0,
    };
  }

  /**
   * Get wallet balance for an agent
   */
  async getWalletBalance(agentId: string): Promise<number> {
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      select: { walletAddress: true },
    });

    if (!agent || !agent.walletAddress) {
      throw new Error("Agent wallet not found");
    }

    const publicKey = new PublicKey(agent.walletAddress);
    const balance = await this.connection.getBalance(publicKey);
    const balanceInSOL = balance / LAMPORTS_PER_SOL;

    // Update balance in database
    await prisma.agent.update({
      where: { id: agentId },
      data: { walletBalance: balanceInSOL },
    });

    return balanceInSOL;
  }

  /**
   * Fund an agent's wallet from user's main wallet
   */
  async fundAgentWallet(
    agentId: string,
    fromPrivateKey: string,
    amountSOL: number
  ): Promise<string> {
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      select: { walletAddress: true },
    });

    if (!agent || !agent.walletAddress) {
      throw new Error("Agent wallet not found");
    }

    // Create transaction
    const fromKeypair = Keypair.fromSecretKey(
      Buffer.from(fromPrivateKey, "base64")
    );
    const toPublicKey = new PublicKey(agent.walletAddress);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: toPublicKey,
        lamports: amountSOL * LAMPORTS_PER_SOL,
      })
    );

    // Send transaction
    const signature = await this.connection.sendTransaction(transaction, [
      fromKeypair,
    ]);

    // Confirm transaction
    await this.connection.confirmTransaction(signature, "confirmed");

    console.log(`✅ Funded agent ${agentId} with ${amountSOL} SOL. Signature: ${signature}`);

    // Update balance
    await this.getWalletBalance(agentId);

    return signature;
  }

  /**
   * Get agent's keypair (for transactions)
   * INTERNAL USE ONLY - Never expose private key to API
   */
  async getAgentKeypair(agentId: string): Promise<Keypair> {
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      select: { encryptedKey: true },
    });

    if (!agent || !agent.encryptedKey) {
      throw new Error("Agent wallet not found");
    }

    const decryptedPrivateKey = this.decryptPrivateKey(agent.encryptedKey);
    const secretKey = Buffer.from(decryptedPrivateKey, "base64");

    return Keypair.fromSecretKey(secretKey);
  }

  /**
   * Encrypt private key with AES-256
   */
  private encryptPrivateKey(privateKey: string): string {
    const algorithm = "aes-256-cbc";
    const key = crypto
      .createHash("sha256")
      .update(ENCRYPTION_KEY)
      .digest();
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(privateKey, "utf8", "hex");
    encrypted += cipher.final("hex");

    return iv.toString("hex") + ":" + encrypted;
  }

  /**
   * Decrypt private key
   */
  private decryptPrivateKey(encryptedPrivateKey: string): string {
    const algorithm = "aes-256-cbc";
    const key = crypto
      .createHash("sha256")
      .update(ENCRYPTION_KEY)
      .digest();

    const parts = encryptedPrivateKey.split(":");
    const iv = Buffer.from(parts[0], "hex");
    const encrypted = parts[1];

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }
}

export const agentWalletService = new AgentWalletService();

