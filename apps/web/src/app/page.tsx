import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, Zap, Shield, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm animate-fade-in">
            <Zap className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Autonomous AI Commerce
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent animate-slide-up">
            SUBRA
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl animate-slide-up-delay">
            AI agents that shop, negotiate, and transact on Solana
          </p>
          
          <div className="flex gap-4 animate-fade-in-delay">
            <Link href="/auth/register">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary via-purple-500 to-primary hover:from-primary/90 hover:via-purple-400 hover:to-primary/90 text-white font-semibold px-8 py-6 text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] animate-bg-shimmer bg-[length:200%_auto]"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary/30 text-white hover:bg-primary/10 hover:border-primary hover:scale-105 transition-all duration-300 px-8 py-6 text-lg backdrop-blur"
              >
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Bot, title: "AI Agents", desc: "Autonomous shopping agents" },
            { icon: Zap, title: "Instant", desc: "Real-time transactions" },
            { icon: Shield, title: "Secure", desc: "Encrypted & verified" },
            { icon: TrendingUp, title: "Smart", desc: "Optimize every purchase" },
          ].map((feature, i) => (
            <div
              key={i}
              className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800 hover:border-primary/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <feature.icon className="w-10 h-10 mb-4 text-primary group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative container mx-auto px-4 py-12 text-center text-gray-500 text-sm border-t border-gray-800">
        <p>Built on Solana • Powered by AI</p>
      </div>
    </div>
  );
}
