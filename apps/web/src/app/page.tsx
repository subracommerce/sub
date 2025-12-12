import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, Zap, Shield, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-4 py-32 flex flex-col items-center text-center">
          {/* Animated Badge */}
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 animate-fade-in">
            <Zap className="w-4 h-4 text-gray-900" />
            <span className="text-sm font-medium text-gray-900">
              Autonomous AI Commerce Platform
            </span>
          </div>
          
          {/* Main Heading with Animation */}
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tight animate-slide-up">
            SUBRA
          </h1>
          
          {/* Animated Subheading */}
          <div className="mb-12 max-w-3xl">
            <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed animate-slide-up-delay">
              <span className="inline-block animate-text-shimmer bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-[length:200%_auto] bg-clip-text text-transparent">
                Deploy AI agents that shop, negotiate, and execute transactions autonomously on Solana
              </span>
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 animate-fade-in-delay">
            <Link href="/auth/register">
              <Button 
                size="lg" 
                className="bg-black hover:bg-gray-800 text-white font-medium px-8 py-6 text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-gray-900 text-gray-900 hover:bg-gray-50 hover:scale-105 transition-all duration-300 px-8 py-6 text-lg font-medium"
              >
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              icon: Bot, 
              title: "AI Agents", 
              desc: "Create autonomous agents that search, compare, and negotiate purchases on your behalf"
            },
            { 
              icon: Zap, 
              title: "Crypto Payments", 
              desc: "Pay with SOL, USDC, or other SPL tokens. Seamless Solana integration"
            },
            { 
              icon: Shield, 
              title: "ZK Receipts", 
              desc: "Cryptographic proof of purchases stored on-chain with privacy preserved"
            },
            { 
              icon: TrendingUp, 
              title: "Agent Marketplace", 
              desc: "Discover and use specialized agents from the community marketplace"
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group relative p-8 rounded-2xl bg-white border-2 border-gray-200 hover:border-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 mb-4 rounded-xl bg-gray-900 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="relative container mx-auto px-4 py-20 border-t border-gray-200">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              step: "01",
              title: "Create Agent",
              desc: "Deploy an AI agent with specific shopping preferences and budgets"
            },
            {
              step: "02",
              title: "Agent Executes",
              desc: "Your agent searches products, compares prices, and negotiates deals"
            },
            {
              step: "03",
              title: "Transact & Track",
              desc: "Purchases execute on Solana with ZK receipts. Track everything in real-time"
            },
          ].map((item, i) => (
            <div key={i} className="text-center animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="text-5xl font-bold text-gray-200 mb-4">{item.step}</div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative container mx-auto px-4 py-12 text-center text-gray-500 text-sm border-t border-gray-200">
        <p className="mb-2">Built on Solana • Powered by AI</p>
        <p className="text-xs">ZK Receipts • Agent-to-Agent Marketplace • Autonomous Commerce</p>
      </div>
    </div>
  );
}
