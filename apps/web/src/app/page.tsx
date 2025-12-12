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
      {/* Agentic grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.03),transparent_50%)]" />
      
      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-4 py-28 flex flex-col items-center text-center">
          {/* Animated Badge */}
          <div className="mb-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-gray-900 bg-white shadow-lg animate-fade-in backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-gray-900 animate-pulse" />
            <span className="text-sm font-semibold tracking-wide text-gray-900">
              AUTONOMOUS AI COMMERCE PLATFORM
            </span>
          </div>
          
          {/* Main Title with Split Green/Blue S */}
          <div className="relative mb-8 animate-explosive-slide-up">
            <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-bold tracking-tighter text-gray-900">
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-gradient-to-b from-green-500 from-50% to-blue-500 to-50% bg-clip-text text-transparent">S</span>
                <span className="opacity-0">S</span>
              </span>UBRA
            </h1>
          </div>
          
          {/* Animated expanding underline - full width */}
          <div className="w-full max-w-4xl h-1 bg-gray-900 animate-expand-from-center mb-10" />
          
          {/* Subheading with Sequential Animation */}
          <div className="mb-12 max-w-3xl space-y-2">
            <p className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed animate-explosive-fade-1">
              AI agents that shop, compare prices, negotiate deals,
            </p>
            <p className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed animate-explosive-fade-2">
              and purchase products for you autonomously with crypto
            </p>
            <p className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed animate-explosive-fade-3">
              payments, ZK receipts, and agent-to-agent marketplace
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 animate-explosive-fade-4">
            <Link href="/auth/register">
              <Button 
                size="lg" 
                className="bg-gray-900 hover:bg-black text-white font-semibold px-10 py-7 text-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl border-2 border-gray-900"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-semibold transition-all duration-500 hover:scale-110 px-10 py-7 text-lg shadow-lg"
              >
                Dashboard
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
              className="group relative p-8 rounded-xl bg-white border-2 border-gray-200 hover:border-gray-900 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in cursor-pointer"
              style={{ animationDelay: mounted ? `${i * 150}ms` : '0ms' }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-gray-900 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="w-14 h-14 mb-6 rounded-lg bg-gray-900 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="relative container mx-auto px-4 py-20 border-t-2 border-gray-200">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
        
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
            <div key={i} className="text-center animate-fade-in group cursor-pointer" style={{ animationDelay: mounted ? `${i * 200}ms` : '0ms' }}>
              <div className="text-7xl font-bold text-gray-200 mb-4 transition-all duration-500 group-hover:text-gray-900 group-hover:scale-110">
                {item.step}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
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
