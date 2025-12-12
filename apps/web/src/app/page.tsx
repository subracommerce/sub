import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, Zap, Shield, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      {/* Agentic grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.03),transparent_50%)]" />
      
      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-4 py-32 flex flex-col items-center text-center">
          {/* Animated Badge */}
          <div className="mb-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-gray-900 bg-white shadow-lg animate-fade-in backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-gray-900 animate-pulse" />
            <span className="text-sm font-semibold tracking-wide text-gray-900">
              AUTONOMOUS COMMERCE INFRASTRUCTURE
            </span>
          </div>
          
          {/* Main Heading with Advanced Animation */}
          <div className="relative mb-6">
            <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-bold tracking-tighter animate-slide-up relative z-10">
              SUBRA
            </h1>
            {/* Animated underline */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-900 animate-expand-width" />
          </div>
          
          {/* Animated Subheading with Advanced Effects */}
          <div className="mb-12 max-w-3xl">
            <p className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed animate-slide-up-delay-1">
              AI agents that autonomously discover, negotiate, and execute
            </p>
            <p className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed animate-slide-up-delay-2">
              transactions on Solana with cryptographic receipts
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 animate-fade-in-delay-3">
            <Link href="/auth/register">
              <Button 
                size="lg" 
                className="bg-gray-900 hover:bg-black text-white font-semibold px-10 py-7 text-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl border-2 border-gray-900"
              >
                Deploy Agent
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
              title: "AI Agents", 
              desc: "Autonomous shopping, negotiation, and execution"
            },
            { 
              icon: Zap, 
              title: "Solana Native", 
              desc: "SOL, USDC, and SPL token payments"
            },
            { 
              icon: Shield, 
              title: "Zero-Knowledge", 
              desc: "Cryptographic purchase verification"
            },
            { 
              icon: TrendingUp, 
              title: "Marketplace", 
              desc: "Agent discovery and reputation"
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group relative p-8 rounded-xl bg-white border-2 border-gray-200 hover:border-gray-900 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in cursor-pointer"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="w-14 h-14 mb-6 rounded-lg bg-gray-900 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative container mx-auto px-4 py-20 border-t-2 border-gray-200">
        <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto text-center">
          {[
            { number: "01", label: "Deploy AI Agent", desc: "Set preferences & budget" },
            { number: "02", label: "Agent Operates", desc: "Search, compare, negotiate" },
            { number: "03", label: "Execute & Verify", desc: "Transaction + ZK receipt" },
          ].map((item, i) => (
            <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 200}ms` }}>
              <div className="text-6xl font-bold text-gray-200 mb-4 transition-all duration-500 hover:text-gray-900">
                {item.number}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">{item.label}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative container mx-auto px-4 py-16 text-center border-t-2 border-gray-200">
        <p className="text-sm text-gray-500 font-medium mb-3">
          Built on Solana • Zero-Knowledge Proofs • Agent Marketplace
        </p>
        <div className="flex items-center justify-center gap-8 text-xs text-gray-400">
          <span>Autonomous Commerce</span>
          <span>•</span>
          <span>Cryptographic Receipts</span>
          <span>•</span>
          <span>Decentralized</span>
        </div>
      </div>
    </div>
  );
}
