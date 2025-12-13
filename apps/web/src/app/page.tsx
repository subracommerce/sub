"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, Zap, Shield, TrendingUp, ArrowRight, Check, Sparkles, ChevronRight, ShoppingCart, LineChart, Cpu, Activity } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      {/* Animated grid background with parallax */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40 animate-grid-slow" />
      
      {/* Mouse-following gradient spotlight */}
      <div 
        className="fixed inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle 800px at ${mousePosition.x}% ${mousePosition.y}%, rgba(16, 185, 129, 0.08), transparent 60%)`
        }}
      />
      
      {/* Floating gradient orbs with blur */}
      <div className="fixed top-20 right-20 w-[500px] h-[500px] bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-3xl animate-float-1" />
      <div className="fixed bottom-20 left-20 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl animate-float-2" />
      
      {/* Header with glass effect */}
      <header className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/60 backdrop-blur-2xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gray-900 rounded blur opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-8 h-8 rounded bg-gray-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="text-lg font-bold group-hover:tracking-wide transition-all">
                <span className="bg-gradient-to-b from-green-500 from-50% to-blue-500 to-50% bg-clip-text text-transparent">S</span>UBRA
              </span>
            </Link>
            
            {/* Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              {['Features', 'How It Works', 'Dashboard'].map((item, i) => (
                <a 
                  key={item}
                  href={item === 'Dashboard' ? '/dashboard' : `#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-all relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>
            
            {/* Auth */}
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="hover:bg-gray-100">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="bg-gray-900 hover:bg-black text-white relative overflow-hidden group">
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Left: Content */}
          <div className="space-y-8 hero-content-appear">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 hover:border-gray-900 transition-all hover:shadow-lg group cursor-pointer">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping" />
              </div>
              <span className="text-xs font-semibold text-gray-700 tracking-wide">AI-POWERED COMMERCE</span>
            </div>
            
            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                Shop Smarter with{" "}
                <span className="relative inline-block group">
                  <span className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 bg-clip-text text-transparent animate-gradient-flow bg-[length:200%_auto]">
                    AI Agents
                  </span>
                  {/* Animated underline */}
                  <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                    <path 
                      d="M0 6 Q50 2, 100 6 T200 6" 
                      stroke="url(#gradient)" 
                      strokeWidth="4" 
                      fill="none" 
                      strokeLinecap="round"
                      className="animate-draw-line"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="50%" stopColor="#14b8a6" />
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
            </div>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              {['Autonomous Shopping', 'Price Negotiation', 'ZK Verification', 'Multi-Marketplace'].map((feature, i) => (
                <div 
                  key={i} 
                  className="px-4 py-2 rounded-full bg-white border-2 border-gray-200 text-sm font-medium text-gray-700 hover:border-gray-900 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {feature}
                </div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/auth/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-gray-900 hover:bg-black text-white px-8 py-6 text-lg group relative overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300">
                  <span className="relative z-10 flex items-center justify-center">
                    Deploy Your First Agent
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-teal-500/20 to-blue-500/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-blue-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full border-2 border-gray-900 hover:bg-gray-900 hover:text-white px-8 py-6 text-lg group relative overflow-hidden hover:scale-105 transition-all duration-300">
                  <span className="relative z-10 flex items-center justify-center">
                    View Dashboard
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gray-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </Button>
              </Link>
            </div>
            
            {/* Trust Badges */}
            <div className="flex items-center gap-6 pt-2 text-sm text-gray-600">
              {[
                { icon: Check, text: 'No credit card' },
                { icon: Check, text: 'Free to start' },
                { icon: Check, text: 'Deploy in 2 min' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: `${0.8 + i * 0.1}s` }}>
                  <item.icon className="w-4 h-4 text-green-500" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right: Animated Agent Demo */}
          <div className="relative hidden lg:block hero-visual-appear">
            {/* Glowing background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-3xl blur-3xl animate-pulse-glow" />
            
            {/* Main demo card */}
            <div className="relative bg-white rounded-3xl border-2 border-gray-200 shadow-2xl p-8 space-y-6 hover:border-gray-900 transition-all duration-500 hover:shadow-3xl">
              {/* Agent Header */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gray-900 rounded-full blur animate-pulse-smooth" />
                    <div className="relative w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white animate-float-subtle" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold">Explorer Agent</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Activity className="w-3 h-3 text-green-500" />
                      <span>Active now</span>
                    </div>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white text-xs font-semibold shadow-lg animate-pulse-badge">
                  Live
                </div>
              </div>
              
              {/* Activity Feed with stagger */}
              <div className="space-y-3">
                {[
                  { icon: ShoppingCart, text: 'Searching 47 marketplaces...', color: 'text-blue-600', delay: '0.3s' },
                  { icon: LineChart, text: 'Comparing 128 products...', color: 'text-green-600', delay: '0.6s' },
                  { icon: Cpu, text: 'Analyzing best deals...', color: 'text-purple-600', delay: '0.9s' },
                ].map((activity, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 hover:border-gray-900 transition-all duration-300 hover:shadow-lg animate-slide-in-right group cursor-pointer"
                    style={{ animationDelay: activity.delay }}
                  >
                    <div className={`p-2 rounded-lg bg-white border border-gray-200 group-hover:scale-110 transition-transform ${activity.color}`}>
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 flex-1">{activity.text}</span>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((dot) => (
                        <div 
                          key={dot}
                          className="w-1.5 h-1.5 rounded-full bg-gray-900 animate-bounce-dot" 
                          style={{ animationDelay: `${dot * 0.2}s` }} 
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t-2 border-gray-100">
                {[
                  { value: '$847', label: 'Saved', color: 'from-green-500 to-teal-500' },
                  { value: '23', label: 'Products', color: 'from-blue-500 to-cyan-500' },
                  { value: '2.4s', label: 'Speed', color: 'from-purple-500 to-pink-500' }
                ].map((stat, i) => (
                  <div key={i} className="text-center group cursor-pointer">
                    <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              {/* Scanning line effect */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/10 to-transparent animate-scan-vertical" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - KEPT YOUR FAVORITE EFFECTS */}
      <section id="features" className="relative z-10 py-24 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700">
              PLATFORM FEATURES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Built for Autonomous Commerce</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Enterprise-grade AI agents with cryptographic verification
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Bot, title: "AI Shopping Agents", desc: "Autonomous agents that search, compare, and purchase products across marketplaces", color: "from-blue-500 to-cyan-500" },
              { icon: Zap, title: "Instant Execution", desc: "Lightning-fast on-chain transactions with Solana's high-performance blockchain", color: "from-yellow-500 to-orange-500" },
              { icon: Shield, title: "ZK Proofs", desc: "Zero-knowledge cryptographic receipts for every transaction", color: "from-purple-500 to-pink-500" },
              { icon: TrendingUp, title: "Agent Marketplace", desc: "Discover and deploy specialized shopping agents for any product category", color: "from-green-500 to-teal-500" },
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
                
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`} />
                
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
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
            <div className="inline-block mb-4 px-4 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700">
              THREE SIMPLE STEPS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">From deployment to purchase in minutes</p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 opacity-20" />
            
            <div className="grid md:grid-cols-3 gap-12 relative">
              {[
                { 
                  step: "01", 
                  title: "Deploy Your Agent", 
                  desc: "Choose an agent type, set your preferences, and deploy in seconds. No code required.",
                  icon: Bot
                },
                { 
                  step: "02", 
                  title: "Agent Works 24/7", 
                  desc: "Your agent searches marketplaces, compares prices, and finds the best deals automatically.",
                  icon: Zap
                },
                { 
                  step: "03", 
                  title: "Secure Purchase", 
                  desc: "Agent executes purchase with crypto and generates cryptographic proof receipt.",
                  icon: Shield
                },
              ].map((item, i) => (
                <div key={i} className="relative group text-center space-y-4">
                  {/* Step circle */}
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-900 text-white text-2xl font-bold mb-4 group-hover:scale-110 group-hover:shadow-2xl transition-all duration-500">
                    <span className="relative z-10">{item.step}</span>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500 to-blue-500 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                  </div>
                  
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 mb-2 group-hover:bg-gray-900 transition-all duration-300">
                    <item.icon className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors" />
                  </div>
                  
                  <h3 className="text-xl font-bold group-hover:text-gray-900 transition-colors">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative z-10 py-16 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { value: '10K+', label: 'Products Tracked', gradient: 'from-blue-500 to-cyan-500' },
              { value: '500+', label: 'Marketplaces', gradient: 'from-green-500 to-teal-500' },
              { value: '24/7', label: 'Monitoring', gradient: 'from-purple-500 to-pink-500' },
              { value: '<1s', label: 'Avg Response', gradient: 'from-orange-500 to-red-500' },
            ].map((stat, i) => (
              <div key={i} className="space-y-2 group cursor-pointer">
                <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center p-12 md:p-16 rounded-3xl border-2 border-gray-900 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-teal-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Spotlight effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/50 to-transparent translate-y-full group-hover:translate-y-[-100%] transition-transform duration-1000" />
            
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">
                Start Saving with AI Agents Today
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join the future of autonomous commerce. Deploy your first agent in minutes.
              </p>
              <Link href="/auth/register">
                <Button size="lg" className="bg-gray-900 hover:bg-black text-white px-12 py-7 text-lg group hover:scale-105 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-blue-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 py-12 bg-white/80 backdrop-blur-sm">
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
