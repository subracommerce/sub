"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, Zap, Shield, TrendingUp, ArrowRight, Check, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-agentic-grid opacity-40" />
      
      {/* Header */}
      <header className="relative z-20 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-gray-900 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="bg-gradient-to-b from-green-500 from-50% to-blue-500 to-50% bg-clip-text text-transparent">S</span>UBRA
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#agents" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Agent Types</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-sm">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-gray-900 hover:bg-black text-white text-sm">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-900/20 bg-white/50 backdrop-blur-sm mb-8 agentic-fade-in">
            <div className="w-2 h-2 rounded-full bg-gray-900 animate-pulse-smooth" />
            <span className="text-xs font-semibold text-gray-700 tracking-wide">
              AUTONOMOUS AI COMMERCE AGENTS
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 agentic-title-slide">
            AI Agents That<br />
            Shop For You
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed agentic-text-1">
            Deploy autonomous AI agents that search products, compare prices, negotiate deals, and execute purchases with cryptographic proof
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 agentic-buttons">
            <Link href="/auth/register">
              <Button size="lg" className="bg-gray-900 hover:bg-black text-white px-8 py-6 text-lg w-full sm:w-auto">
                Deploy Your First Agent
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="border-2 border-gray-900 px-8 py-6 text-lg w-full sm:w-auto">
                View Dashboard
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto agentic-text-2">
            <div>
              <div className="text-3xl font-bold mb-1">24/7</div>
              <div className="text-sm text-gray-600">Active Monitoring</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">100%</div>
              <div className="text-sm text-gray-600">Autonomous</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">$0</div>
              <div className="text-sm text-gray-600">Gas Fees</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Built for Autonomous Commerce</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Enterprise-grade AI agents with cryptographic verification
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Bot,
                title: "AI Shopping Agents",
                desc: "Autonomous agents that search, compare, and purchase products across marketplaces"
              },
              {
                icon: Zap,
                title: "Instant Execution",
                desc: "Lightning-fast on-chain transactions with Solana's high-performance blockchain"
              },
              {
                icon: Shield,
                title: "ZK Proofs",
                desc: "Zero-knowledge cryptographic receipts for every transaction"
              },
              {
                icon: TrendingUp,
                title: "Agent Marketplace",
                desc: "Discover and deploy specialized shopping agents for any product category"
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border-2 border-gray-200 hover:border-gray-900 bg-white transition-all duration-500 hover:shadow-xl agentic-card"
                style={{ animationDelay: `${i * 100 + 1000}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple, automated, secure</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Tell Your Agent",
                desc: "Describe what you want to buy, set budget and preferences. Your agent understands natural language."
              },
              {
                step: "02",
                title: "Agent Shops",
                desc: "Autonomous search across marketplaces, price comparison, and negotiation—all while you focus on what matters."
              },
              {
                step: "03",
                title: "Purchase & Verify",
                desc: "Executes purchase with crypto payment and generates zero-knowledge proof receipt for complete transparency."
              },
            ].map((item, i) => (
              <div key={i} className="text-center agentic-step" style={{ animationDelay: `${i * 150 + 1400}ms` }}>
                <div className="text-6xl font-bold text-gray-200 mb-4 transition-all duration-500 hover:text-gray-900">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Types */}
      <section id="agents" className="relative z-10 py-24 bg-gradient-to-b from-white to-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Specialized Agent Types</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the right agent for your shopping needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Explorer", desc: "Discovers products across multiple marketplaces based on your criteria" },
              { name: "Negotiator", desc: "Compares prices and negotiates the best deals on your behalf" },
              { name: "Executor", desc: "Executes purchases autonomously with cryptographic verification" },
              { name: "Tracker", desc: "Monitors orders and provides real-time shipment updates" },
            ].map((agent, i) => (
              <div key={i} className="p-6 rounded-2xl border-2 border-gray-200 hover:border-gray-900 bg-white transition-all hover:shadow-lg">
                <h3 className="text-xl font-bold mb-2">{agent.name}</h3>
                <p className="text-gray-600 leading-relaxed">{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl border-2 border-gray-900 bg-gradient-to-br from-gray-50 to-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Deploy Your AI Agent?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join the future of autonomous commerce. Start with a free account.
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="bg-gray-900 hover:bg-black text-white px-12 py-6 text-lg">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Deploy in minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-gray-900 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="font-bold">
                <span className="bg-gradient-to-b from-green-500 from-50% to-blue-500 to-50% bg-clip-text text-transparent">S</span>UBRA
              </span>
            </div>
            <div className="text-sm text-gray-600">
              AI Commerce • Crypto Payments • Zero-Knowledge Proofs
            </div>
            <div className="text-sm text-gray-500">
              © 2025 SUBRA. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
