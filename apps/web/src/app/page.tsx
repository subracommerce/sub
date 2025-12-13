"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, Zap, Shield, TrendingUp, ArrowRight, Check, Sparkles, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      {/* Animated grid background with mouse tracking */}
      <div className="absolute inset-0 bg-agentic-grid opacity-30" />
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 0, 0, 0.03), transparent 80%)`
        }}
      />
      
      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl animate-float-slower" />
      
      {/* Header */}
      <header className="relative z-20 border-b border-gray-200/80 bg-white/70 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 group cursor-pointer">
            <div className="w-8 h-8 rounded bg-gray-900 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="bg-gradient-to-b from-green-500 from-50% to-blue-500 to-50% bg-clip-text text-transparent">S</span>UBRA
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors relative group">
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors relative group">
              How It Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#agents" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors relative group">
              Agent Types
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300" />
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-sm hover:bg-gray-100">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-gray-900 hover:bg-black text-white text-sm group">
                Get Started 
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Original Style Enhanced */}
      <section className="relative z-10 container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge with shimmer effect */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-gray-900/20 bg-white/50 backdrop-blur-sm mb-8 agentic-fade-in relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div className="w-2 h-2 rounded-full bg-gray-900 animate-pulse-smooth relative z-10" />
            <div className="flex items-center gap-1 text-xs font-semibold text-gray-700 tracking-wider relative z-10">
              <span>AI Agent</span>
              <span className="text-gray-400">•</span>
              <span>Commerce</span>
              <span className="text-gray-400">•</span>
              <span>Marketplace</span>
            </div>
          </div>
          
          {/* Main Title with Split S - Original Style */}
          <div className="relative mb-8 agentic-title-slide">
            <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-bold tracking-tighter text-gray-900 relative">
              <span className="relative inline-block group cursor-pointer">
                <span className="absolute inset-0 bg-gradient-to-b from-green-500 from-50% to-blue-500 to-50% bg-clip-text text-transparent group-hover:scale-110 transition-transform origin-center">S</span>
                <span className="opacity-0">S</span>
              </span>
              <span className="inline-block hover:tracking-wide transition-all duration-500">UBRA</span>
            </h1>
          </div>
          
          {/* Animated expanding underline - full width with glow */}
          <div className="relative w-full max-w-4xl h-1 mb-10 mx-auto">
            <div className="absolute inset-0 bg-gray-900 agentic-underline" />
            <div className="absolute inset-0 bg-gray-900 blur-md agentic-underline opacity-50" />
          </div>
          
          {/* Subheading with typing effect */}
          <div className="mb-12 max-w-3xl mx-auto space-y-2">
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
          
          {/* CTA Buttons with enhanced hover */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 agentic-buttons">
            <Link href="/auth/register">
              <Button size="lg" className="bg-gray-900 hover:bg-black text-white px-10 py-7 text-lg group relative overflow-hidden w-full sm:w-auto hover:scale-105 transition-all duration-300">
                <span className="relative z-10 flex items-center">
                  Deploy Your First Agent
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="border-2 border-gray-900 hover:bg-gray-900 hover:text-white px-10 py-7 text-lg transition-all duration-500 group w-full sm:w-auto hover:scale-105 hover:shadow-xl">
                View Dashboard
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Stats with hover effects */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto agentic-text-2">
            {[
              { value: "24/7", label: "Active Monitoring" },
              { value: "100%", label: "Autonomous" },
              { value: "$0", label: "Gas Fees" }
            ].map((stat, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="text-4xl font-bold mb-1 group-hover:scale-110 transition-transform">{stat.value}</div>
                <div className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{stat.label}</div>
              </div>
            ))}
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
              { icon: Bot, title: "AI Shopping Agents", desc: "Autonomous agents that search, compare, and purchase products across marketplaces" },
              { icon: Zap, title: "Instant Execution", desc: "Lightning-fast on-chain transactions with Solana's high-performance blockchain" },
              { icon: Shield, title: "ZK Proofs", desc: "Zero-knowledge cryptographic receipts for every transaction" },
              { icon: TrendingUp, title: "Agent Marketplace", desc: "Discover and deploy specialized shopping agents for any product category" },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border-2 border-gray-200 hover:border-gray-900 bg-white transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 agentic-card relative overflow-hidden cursor-pointer"
                style={{ animationDelay: `${i * 100 + 1000}ms` }}
              >
                {/* Corner accent lines */}
                <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-gray-900 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-gray-900 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                
                {/* Scan line effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-900/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
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
              { step: "01", title: "Tell Your Agent", desc: "Describe what you want to buy, set budget and preferences. Your agent understands natural language." },
              { step: "02", title: "Agent Shops", desc: "Autonomous search across marketplaces, price comparison, and negotiation—all while you focus on what matters." },
              { step: "03", title: "Purchase & Verify", desc: "Executes purchase with crypto payment and generates zero-knowledge proof receipt for complete transparency." },
            ].map((item, i) => (
              <div key={i} className="text-center agentic-step group" style={{ animationDelay: `${i * 150 + 1400}ms` }}>
                <div className="text-6xl font-bold text-gray-200 mb-4 transition-all duration-500 group-hover:text-gray-900 group-hover:scale-110 relative">
                  {item.step}
                  <div className="absolute inset-0 text-gray-900 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500">{item.step}</div>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:translate-y-[-2px] transition-transform">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">{item.desc}</p>
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
              <div key={i} className="group p-6 rounded-2xl border-2 border-gray-200 hover:border-gray-900 bg-white transition-all hover:shadow-xl hover:-translate-y-2 duration-500 cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-gray-900 transition-colors">{agent.name}</h3>
                  <p className="text-gray-600 leading-relaxed">{agent.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl border-2 border-gray-900 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Deploy Your AI Agent?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join the future of autonomous commerce. Start with a free account.
              </p>
              <Link href="/auth/register">
                <Button size="lg" className="bg-gray-900 hover:bg-black text-white px-12 py-6 text-lg group hover:scale-105 transition-all duration-300">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 py-12 bg-white/50 backdrop-blur-sm">
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
