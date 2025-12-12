import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Zap, ShieldCheck, Wallet } from "lucide-react";
import Link from "next/link";
import { ConnectWalletButton } from "@/components/connect-wallet-button";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-6">
          <div className="inline-block mb-4">
            <span className="text-purple-500 text-2xl font-bold">🟣 Built on Solana</span>
          </div>
          <h1 className="text-6xl font-bold tracking-tight">
            Autonomous AI Commerce on <br />
            <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
              the Fastest Blockchain
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Let AI agents shop for you on Solana. 65,000 TPS, $0.00025 per transaction, 400ms blocks.
            <br />
            <span className="text-purple-400 font-semibold mt-2 inline-block">
              Pay with SOL or USDC • Zero gas fees • Instant settlements
            </span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <ConnectWalletButton />
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-lg border-purple-500 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950">
                View Dashboard
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Connect Phantom • Solflare • Torus • or any Solana wallet
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Bot className="w-10 h-10 mb-2 text-primary" />
              <CardTitle>AI Agents</CardTitle>
              <CardDescription>
                Create autonomous agents that search, compare, and negotiate purchases
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Wallet className="w-10 h-10 mb-2 text-primary" />
              <CardTitle>Solana Payments</CardTitle>
              <CardDescription>
                Pay with SOL or USDC on Solana. Fast, cheap, and secure blockchain transactions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <ShieldCheck className="w-10 h-10 mb-2 text-primary" />
              <CardTitle>ZK Receipts</CardTitle>
              <CardDescription>
                Cryptographic proof of purchases stored on-chain with privacy
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="w-10 h-10 mb-2 text-primary" />
              <CardTitle>Agent Marketplace</CardTitle>
              <CardDescription>
                Discover and use specialized agents for any shopping need
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
              1
            </div>
            <h3 className="text-xl font-semibold">Create or Summon Agents</h3>
            <p className="text-muted-foreground">
              Choose from Explorer, Negotiator, Executor, or Tracker agents
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
              2
            </div>
            <h3 className="text-xl font-semibold">Tell Your Agent What to Buy</h3>
            <p className="text-muted-foreground">
              Chat with your agent to find, compare, and negotiate products
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
              3
            </div>
            <h3 className="text-xl font-semibold">Pay with SOL or USDC</h3>
            <p className="text-muted-foreground">
              Complete purchase on Solana and receive cryptographic proof on-chain
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="text-center space-y-4 p-12">
            <CardTitle className="text-4xl">Ready to Get Started?</CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg">
              Join thousands of users leveraging AI agents for autonomous commerce
            </CardDescription>
            <div className="pt-4">
              <Link href="/auth/register">
                <Button size="lg" variant="secondary" className="text-lg">
                  Create Your First Agent
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      </section>
    </div>
  );
}

