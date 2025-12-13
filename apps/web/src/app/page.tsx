"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, Zap, Shield, TrendingUp, ArrowRight, Check, Sparkles, ChevronRight, ShoppingCart, LineChart, Cpu } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40" />
      
      {/* Gradient orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-green-500/5 via-blue-500/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl" />
      
      {/* Header */}
      <header className="relative z-20 border-b border-gray-200/80 bg-white/70 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo - Top Left */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded bg-gray-900 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">
              <span className="bg-gradient-to-b from-green-500 from-50% to-blue-500 to-50% bg-clip-text text-transparent">S</span>UBRA
            </span>
          </Link>
          
          {/* Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
            <a href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Dashboard</a>
          </nav>
          
          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-gray-900 hover:bg-black text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Modern, Professional */}
      <section className="relative z-10 container mx-auto px-6 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Left: Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 border border-gray-200">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-gray-700">AI-POWERED COMMERCE</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Shop Smarter with{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                  AI Agents
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 4 Q50 0, 100 4 T200 4" stroke="url(#gradient)" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-xl">
              Deploy autonomous AI agents that search products, negotiate prices, and execute purchases with cryptographic proof—all while you sleep.
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              {['Autonomous Shopping', 'Price Negotiation', 'ZK Verification', 'Multi-Marketplace'].map((feature, i) => (
                <div key={i} className="px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700 hover:border-gray-900 hover:shadow-md transition-all">
                  {feature}
                </div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white px-8 py-6 text-lg group relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Deploy Your First Agent
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-gray-900 hover:bg-gray-900 hover:text-white px-8 py-6 text-lg group">
                  View Dashboard
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            {/* Trust Badges */}
            <div className="flex items-center gap-6 pt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Deploy in 2 min</span>
              </div>
            </div>
          </div>
          
          {/* Right: Visual Element */}
          <div className="relative hidden lg:block">
            {/* Animated Agent Card */}
            <div className="relative">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-3xl blur-3xl" />
              
              {/* Main visual card */}
              <div className="relative bg-white rounded-3xl border-2 border-gray-200 shadow-2xl p-8 space-y-6">
                {/* Agent Activity Simulation */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Explorer Agent</div>
                        <div className="text-xs text-gray-500">Searching...</div>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      Active
                    </div>
                  </div>
                  
                  {/* Activity Feed */}
                  <div className="space-y-3 pt-4">
                    {[
                      { icon: ShoppingCart, text: 'Searching 47 marketplaces...', delay: '0s' },
                      { icon: LineChart, text: 'Comparing 128 products...', delay: '0.5s' },
                      { icon: Cpu, text: 'Analyzing best deals...', delay: '1s' },
                    ].map((activity, i) => (
                      <div 
                        key={i} 
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 animate-slide-in-right"
                        style={{ animationDelay: activity.delay }}
                      >
                        <activity.icon className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{activity.text}</span>
                        <div className="ml-auto flex gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-900 animate-bounce" style={{ animationDelay: '0s' }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-900 animate-bounce" style={{ animationDelay: '0.2s' }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-900 animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold">$847</div>
                      <div className="text-xs text-gray-500">Saved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">23</div>
                      <div className="text-xs text-gray-500">Products</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">2.4s</div>
                      <div className="text-xs text-gray-500">Speed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - KEPT AS IS (You Like These!) */}
      <section id="features" className="relative z-10 py-24 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="container mx-auto px-6">
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
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Three steps to autonomous shopping</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              { 
                step: "01", 
                title: "Deploy Your Agent", 
                desc: "Choose an agent type, set your preferences, and deploy in seconds. No code required." 
              },
              { 
                step: "02", 
                title: "Agent Works 24/7", 
                desc: "Your agent searches marketplaces, compares prices, and finds the best deals automatically." 
              },
              { 
                step: "03", 
                title: "Secure Purchase", 
                desc: "Agent executes purchase with crypto and generates cryptographic proof receipt." 
              },
            ].map((item, i) => (
              <div key={i} className="group text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 text-white text-2xl font-bold mb-4 group-hover:scale-110 group-hover:shadow-xl transition-all">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="relative z-10 py-16 bg-gray-50/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { value: '10K+', label: 'Products Tracked' },
              { value: '500+', label: 'Marketplaces' },
              { value: '24/7', label: 'Monitoring' },
              { value: '<1s', label: 'Avg Response' },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl border-2 border-gray-900 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">
                Start Saving with AI Agents
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join thousands using AI agents to automate their shopping and save money.
              </p>
              <Link href="/auth/register">
                <Button size="lg" className="bg-gray-900 hover:bg-black text-white px-12 py-6 text-lg group hover:scale-105 transition-all duration-300">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 py-12 bg-white">
        <div className="container mx-auto px-6">
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
              AI-Powered Commerce • Cryptographic Verification • Built on Solana
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
