"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, Zap, Shield, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      {/* Stylish agentic grid background - subtle and slow */}
      <div className="absolute inset-0 bg-agentic-grid animate-grid-drift" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.02),transparent_60%)]" />
      
      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-4 py-28 flex flex-col items-center text-center">
          {/* Animated Badge */}
          <div className="mb-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-gray-900 bg-white shadow-lg agentic-fade-in backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 badge-shimmer"></div>
            <div className="w-2 h-2 rounded-full bg-gray-900 animate-pulse-smooth relative z-10" />
            <span className="text-sm font-semibold tracking-wide text-gray-900 relative z-10">
              AUTONOMOUS AI COMMERCE PLATFORM
            </span>
          </div>
          
          {/* Main Title with Split Green/Blue S */}
          <div className="relative mb-8 agentic-title-slide">
            <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-bold tracking-tighter text-gray-900 relative">
              <span className="relative inline-block title-glitch">
                <span className="absolute inset-0 bg-gradient-to-b from-green-500 from-50% to-blue-500 to-50% bg-clip-text text-transparent">S</span>
                <span className="opacity-0">S</span>
              </span>
              <span className="inline-block stagger-letters">UBRA</span>
            </h1>
          </div>
          
          {/* Animated expanding underline - full width with glow */}
          <div className="relative w-full max-w-4xl h-1 mb-10">
            <div className="absolute inset-0 bg-gray-900 agentic-underline"></div>
            <div className="absolute inset-0 bg-gray-900 blur-sm agentic-underline opacity-50"></div>
          </div>
          
          {/* Subheading with Sequential Fade */}
          <div className="mb-12 max-w-3xl space-y-2">
            <p className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed agentic-text-1">
              AI agents that shop, compare prices, negotiate deals,
            </p>
            <p className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed agentic-text-2">
              and purchase products for you autonomously with crypto
            </p>
            <p className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed agentic-text-3">
              payments, ZK receipts, and agent-to-agent marketplace
            </p>
          </div>
          
          {/* CTA Buttons with Hover Effects */}
          <div className="flex gap-4 agentic-buttons">
            <Link href="/auth/register">
              <Button 
                size="lg" 
                className="relative overflow-hidden bg-gray-900 hover:bg-black text-white font-semibold px-10 py-7 text-lg transition-all duration-700 hover:scale-105 hover:shadow-2xl border-2 border-gray-900 group"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 button-glow opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button 
                size="lg" 
                variant="outline" 
                className="relative overflow-hidden border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-semibold transition-all duration-700 hover:scale-105 px-10 py-7 text-lg shadow-lg group"
              >
                <span className="relative z-10">Dashboard</span>
                <div className="absolute inset-0 bg-gray-900 transform translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              icon: Bot, 
              title: "AI Shopping Agents", 
              desc: "Search and compare products across marketplaces"
            },
            { 
              icon: Zap, 
              title: "Crypto Payments", 
              desc: "Pay with SOL, USDC seamlessly"
            },
            { 
              icon: Shield, 
              title: "ZK Receipts", 
              desc: "Cryptographic proof of purchases"
            },
            { 
              icon: TrendingUp, 
              title: "Agent Marketplace", 
              desc: "Discover specialized shopping agents"
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group relative p-8 rounded-xl bg-white border-2 border-gray-200 hover:border-gray-900 transition-all duration-700 hover:scale-105 hover:shadow-2xl agentic-card cursor-pointer overflow-hidden"
              style={{ animationDelay: mounted ? `${i * 100 + 1400}ms` : '0ms' }}
            >
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-gray-900 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0"></div>
              
              {/* Scan effect on hover */}
              <div className="absolute inset-0 card-scan opacity-0 group-hover:opacity-100"></div>
              
              <div className="relative z-10 w-14 h-14 mb-6 rounded-lg bg-gray-900 flex items-center justify-center transform group-hover:scale-110 transition-all duration-700">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="relative z-10 text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
              <p className="relative z-10 text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="relative container mx-auto px-4 py-20 border-t-2 border-gray-200">
        <h2 className="text-4xl font-bold text-center mb-16 agentic-section-title">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {[
            {
              step: "01",
              title: "Tell Your Agent",
              desc: "Describe what you want to buy, set budget and preferences"
            },
            {
              step: "02",
              title: "Agent Shops",
              desc: "Searches products, compares prices, negotiates best deals"
            },
            {
              step: "03",
              title: "Purchase & Receipt",
              desc: "Executes purchase with crypto and generates ZK proof"
            },
          ].map((item, i) => (
            <div key={i} className="text-center agentic-step group cursor-pointer" style={{ animationDelay: mounted ? `${i * 150 + 1800}ms` : '0ms' }}>
              <div className="text-7xl font-bold text-gray-200 mb-4 transition-all duration-700 group-hover:text-gray-900 group-hover:scale-110 relative">
                {item.step}
                <div className="absolute inset-0 text-gray-900 opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-700">{item.step}</div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 transition-all duration-500 group-hover:translate-y-[-2px]">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed transition-all duration-500 group-hover:text-gray-900">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative container mx-auto px-4 py-16 text-center border-t-2 border-gray-200">
        <p className="text-sm text-gray-500 font-medium mb-3">
          AI Commerce • Crypto Payments • ZK Receipts • Agent Marketplace
        </p>
        <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
          <span>Built on Solana</span>
          <span>•</span>
          <span>Autonomous Shopping</span>
          <span>•</span>
          <span>Decentralized</span>
        </div>
      </div>
    </div>
  );
}
