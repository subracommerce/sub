import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, Zap, Shield, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_40%,transparent_100%)] opacity-30" />
      
      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
            <Zap className="w-4 h-4 text-purple-600 animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Autonomous AI Commerce
            </span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-bold mb-6 tracking-tight">
            SUBRA
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl font-light">
            AI agents that shop, negotiate, and transact on Solana
          </p>
          
          <div className="flex gap-4">
            <Link href="/auth/register">
              <Button 
                size="lg" 
                className="bg-black hover:bg-gray-900 text-white font-medium px-8 py-6 text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
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

      {/* Features Grid */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Bot, title: "AI Agents", desc: "Autonomous shopping agents", gradient: "from-purple-500 to-blue-500" },
            { icon: Zap, title: "Instant", desc: "Real-time transactions", gradient: "from-blue-500 to-cyan-500" },
            { icon: Shield, title: "Secure", desc: "Encrypted & verified", gradient: "from-cyan-500 to-teal-500" },
            { icon: TrendingUp, title: "Smart", desc: "Optimize every purchase", gradient: "from-teal-500 to-green-500" },
          ].map((feature, i) => (
            <div
              key={i}
              className="group relative p-8 rounded-2xl bg-white border-2 border-gray-200 hover:border-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-600 font-light">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative container mx-auto px-4 py-12 text-center text-gray-500 text-sm border-t border-gray-200">
        <p>Built on Solana • Powered by AI</p>
      </div>
    </div>
  );
}
