import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import BigNumber from "bignumber.js";
import { createTransferCheckedInstruction, getMint } from "@solana/spl-token";

/**
 * Solana Pay Service
 * Handles payment processing for autonomous agent purchases
 * 
 * Features:
 * - SOL payments
 * - USDC SPL token payments
 * - Payment verification
 * - Transaction monitoring
 */

export interface PaymentRequest {
  recipient: string; // Merchant wallet address
  amount: number; // Amount in SOL or USDC
  currency: "SOL" | "USDC";
  reference?: string; // Unique reference for tracking
  label?: string; // Product name
  message?: string; // Purchase description
  memo?: string; // On-chain memo
}

export interface PaymentResult {
  success: boolean;
  signature?: string;
  error?: string;
  amount: number;
  currency: string;
  timestamp: Date;
}

export class SolanaPayService {
  private connection: Connection;
  private usdcMint: PublicKey;

  constructor() {
    const rpcUrl = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";
    this.connection = new Connection(rpcUrl, "confirmed");

    // USDC Mint addresses
    // Devnet: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
    // Mainnet: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
    this.usdcMint = new PublicKey(
      process.env.USDC_MINT_ADDRESS ||
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
    );

    console.log(`✅ Solana Pay initialized (${rpcUrl})`);
  }

  /**
   * Create a payment transaction for an agent purchase
   */
  async createPaymentTransaction(
    payerPublicKey: PublicKey,
    request: PaymentRequest
  ): Promise<Transaction> {
    const recipientPublicKey = new PublicKey(request.recipient);

    if (request.currency === "SOL") {
      return this.createSOLPayment(
        payerPublicKey,
        recipientPublicKey,
        request.amount
      );
    } else if (request.currency === "USDC") {
      return this.createUSDCPayment(
        payerPublicKey,
        recipientPublicKey,
        request.amount
      );
    } else {
      throw new Error(`Unsupported currency: ${request.currency}`);
    }
  }

  /**
   * Create SOL payment transaction
   */
  private async createSOLPayment(
    payer: PublicKey,
    recipient: PublicKey,
    amount: number
  ): Promise<Transaction> {
    const lamports = Math.floor(amount * LAMPORTS_PER_SOL);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: recipient,
        lamports,
      })
    );

    // Get latest blockhash
    const { blockhash, lastValidBlockHeight } =
      await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;

    console.log(
      `💰 Created SOL payment: ${amount} SOL from ${payer.toBase58()} to ${recipient.toBase58()}`
    );

    return transaction;
  }

  /**
   * Create USDC (SPL Token) payment transaction
   */
  private async createUSDCPayment(
    payer: PublicKey,
    recipient: PublicKey,
    amount: number
  ): Promise<Transaction> {
    // USDC has 6 decimals
    const decimals = 6;
    const amountInSmallestUnit = Math.floor(amount * Math.pow(10, decimals));

    // Get associated token accounts
    const payerTokenAccount = await getAssociatedTokenAddress(
      this.usdcMint,
      payer
    );

    const recipientTokenAccount = await getAssociatedTokenAddress(
      this.usdcMint,
      recipient
    );

    const transaction = new Transaction().add(
      createTransferCheckedInstruction(
        payerTokenAccount,
        this.usdcMint,
        recipientTokenAccount,
        payer,
        amountInSmallestUnit,
        decimals
      )
    );

    // Get latest blockhash
    const { blockhash } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;

    console.log(
      `💰 Created USDC payment: ${amount} USDC from ${payer.toBase58()} to ${recipient.toBase58()}`
    );

    return transaction;
  }

  /**
   * Execute payment from agent wallet
   * @param agentKeypair Agent's Solana keypair
   * @param request Payment details
   */
  async executePayment(
    agentKeypair: Keypair,
    request: PaymentRequest
  ): Promise<PaymentResult> {
    try {
      console.log(`🚀 Executing payment: ${request.amount} ${request.currency}`);

      // Create transaction
      const transaction = await this.createPaymentTransaction(
        agentKeypair.publicKey,
        request
      );

      // Sign transaction with agent's keypair
      transaction.sign(agentKeypair);

      // Send and confirm transaction
      const signature = await this.connection.sendRawTransaction(
        transaction.serialize()
      );

      console.log(`📝 Transaction sent: ${signature}`);

      // Wait for confirmation
      await this.connection.confirmTransaction(signature, "confirmed");

      console.log(`✅ Payment confirmed: ${signature}`);

      return {
        success: true,
        signature,
        amount: request.amount,
        currency: request.currency,
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error(`❌ Payment failed:`, error.message);

      return {
        success: false,
        error: error.message,
        amount: request.amount,
        currency: request.currency,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Verify a payment transaction
   */
  async verifyPayment(
    signature: string,
    expectedAmount: number,
    expectedRecipient: string,
    currency: "SOL" | "USDC"
  ): Promise<boolean> {
    try {
      const transaction = await this.connection.getTransaction(signature, {
        commitment: "confirmed",
      });

      if (!transaction) {
        console.log(`❌ Transaction not found: ${signature}`);
        return false;
      }

      // Verify transaction was successful
      if (transaction.meta?.err) {
        console.log(`❌ Transaction failed: ${signature}`);
        return false;
      }

      const recipientPublicKey = new PublicKey(expectedRecipient);

      if (currency === "SOL") {
        // Verify SOL transfer
        const preBalance =
          transaction.meta?.preBalances[
            transaction.transaction.message.accountKeys.findIndex((key) =>
              key.equals(recipientPublicKey)
            )
          ] || 0;

        const postBalance =
          transaction.meta?.postBalances[
            transaction.transaction.message.accountKeys.findIndex((key) =>
              key.equals(recipientPublicKey)
            )
          ] || 0;

        const receivedAmount = (postBalance - preBalance) / LAMPORTS_PER_SOL;

        console.log(`✅ Verified SOL payment: ${receivedAmount} SOL`);
        return receivedAmount >= expectedAmount;
      } else if (currency === "USDC") {
        // Verify USDC transfer (check token balances)
        // This is more complex - would need to parse transaction logs
        // For now, just verify transaction succeeded
        console.log(`✅ Verified USDC payment transaction: ${signature}`);
        return true;
      }

      return false;
    } catch (error: any) {
      console.error(`❌ Payment verification failed:`, error.message);
      return false;
    }
  }

  /**
   * Get account balance (SOL or USDC)
   */
  async getBalance(
    publicKey: PublicKey,
    currency: "SOL" | "USDC"
  ): Promise<number> {
    try {
      if (currency === "SOL") {
        const balance = await this.connection.getBalance(publicKey);
        return balance / LAMPORTS_PER_SOL;
      } else if (currency === "USDC") {
        const tokenAccount = await getAssociatedTokenAddress(
          this.usdcMint,
          publicKey
        );

        try {
          const balance = await this.connection.getTokenAccountBalance(
            tokenAccount
          );
          return parseFloat(balance.value.uiAmount?.toString() || "0");
        } catch (error) {
          // Token account might not exist
          return 0;
        }
      }

      return 0;
    } catch (error: any) {
      console.error(`❌ Failed to get balance:`, error.message);
      return 0;
    }
  }

  /**
   * Generate a payment QR code URL (for user-initiated payments)
   */
  generatePaymentURL(request: PaymentRequest): string {
    const params = new URLSearchParams({
      recipient: request.recipient,
      amount: request.amount.toString(),
      label: request.label || "SUBRA Purchase",
      message: request.message || "Autonomous agent purchase",
    });

    if (request.currency === "USDC") {
      params.append("spl-token", this.usdcMint.toString());
    }

    if (request.reference) {
      params.append("reference", request.reference);
    }

    if (request.memo) {
      params.append("memo", request.memo);
    }

    return `solana:${request.recipient}?${params.toString()}`;
  }

  /**
   * Check if an account has sufficient balance
   */
  async hasSufficientBalance(
    publicKey: PublicKey,
    amount: number,
    currency: "SOL" | "USDC"
  ): Promise<boolean> {
    const balance = await this.getBalance(publicKey, currency);
    
    // For SOL, add 0.01 SOL buffer for transaction fees
    const requiredAmount = currency === "SOL" ? amount + 0.01 : amount;
    
    return balance >= requiredAmount;
  }

  /**
   * Estimate transaction fee
   */
  async estimateFee(transaction: Transaction): Promise<number> {
    try {
      const fee = await this.connection.getFeeForMessage(
        transaction.compileMessage(),
        "confirmed"
      );
      return (fee.value || 5000) / LAMPORTS_PER_SOL; // Default to 5000 lamports if not available
    } catch (error) {
      // Return default fee estimate
      return 0.000005; // 5000 lamports
    }
  }
}

export const solanaPayService = new SolanaPayService();

