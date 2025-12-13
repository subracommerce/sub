"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Mail, Wallet, Plus, ArrowLeft } from "lucide-react";
import { CreateWalletModal } from "@/components/create-wallet-modal";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateWallet, setShowCreateWallet] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        toast({ title: "Account created!", description: "Please sign in" });
        router.push("/auth/login");
      } else {
        toast({
          title: "Registration failed",
          description: data.error || "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:3rem_3rem] animate-grid-slow" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl animate-float-1" />

      {/* Back Button - Top Left */}
      <Button
        onClick={handleGoBack}
        variant="outline"
        className="absolute top-4 left-4 z-20 border-2 hover:bg-gray-100"
        size="sm"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      <Card className="w-full max-w-md border-2 border-gray-900 shadow-2xl relative z-10 bg-white">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Get Started</CardTitle>
          <CardDescription className="text-base">Create your SUBRA account</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Wallet Options */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-5 w-5 text-gray-700" />
              <h3 className="text-base font-semibold">Sign Up with Wallet</h3>
            </div>

            <Link href="/auth/wallet" className="block">
              <Button
                className="w-full bg-gray-900 hover:bg-black text-white border-2 border-gray-900 py-6 text-base font-semibold hover:scale-105 transition-all"
                size="lg"
              >
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet
              </Button>
            </Link>

            <Button
              onClick={() => setShowCreateWallet(true)}
              variant="outline"
              className="w-full border-2 border-gray-900 py-6 text-base font-semibold hover:scale-105 transition-all"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create New Wallet
            </Button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t-2 border-gray-300" />
            </div>
            <div className="relative bg-white px-4 text-sm text-gray-500 font-medium">
              Or sign up with email
            </div>
          </div>

          {/* Email Registration Form */}
          <form onSubmit={handleEmailRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="border-2"
              />
            </div>

            <Button
              type="submit"
              className="w-full border-2 border-gray-900 bg-white text-gray-900 hover:bg-gray-900 hover:text-white py-3"
              size="lg"
              disabled={isLoading}
            >
              <Mail className="mr-2 h-5 w-5" />
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600 pt-4 border-t-2">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-gray-900 hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Create Wallet Modal */}
      <CreateWalletModal open={showCreateWallet} onOpenChange={setShowCreateWallet} />
    </div>
  );
}
