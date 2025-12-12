"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { CreateWalletModal } from "@/components/create-wallet-modal";
import { Wallet, Plus, Mail } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateWalletModal, setShowCreateWalletModal] = useState(false);
  const { setAuth } = useAuthStore();
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
        setAuth(data.data.user, data.data.token);
        toast({ title: "Account created!" });
        router.push("/dashboard");
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to connect to server", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewWallet = () => {
    setShowCreateWalletModal(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <Card className="w-full max-w-md border-2 shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
          <CardDescription className="text-base">Choose how to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Connect Wallet */}
          <div className="space-y-3 text-center">
            <h3 className="text-base font-semibold">Have a Solana wallet?</h3>
            <Link href="/auth/wallet" passHref>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white" size="lg">
                <Wallet className="mr-2 h-5 w-5" /> Connect Wallet
              </Button>
            </Link>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative bg-white px-4 text-sm text-gray-500">Or</div>
          </div>

          {/* Create Wallet */}
          <div className="space-y-3 text-center">
            <h3 className="text-base font-semibold">New to crypto?</h3>
            <Button 
              className="w-full bg-black hover:bg-gray-900 text-white" 
              size="lg" 
              onClick={handleCreateNewWallet} 
              disabled={isLoading}
            >
              <Plus className="mr-2 h-5 w-5" /> Create New Wallet
            </Button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative bg-white px-4 text-sm text-gray-500">Or</div>
          </div>

          {/* Email Signup */}
          <form onSubmit={handleEmailRegister} className="space-y-4">
            <h3 className="text-base font-semibold text-center">Sign up with email</h3>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-2"
              />
            </div>
            <Button type="submit" className="w-full border-2 border-gray-900 bg-white text-gray-900 hover:bg-gray-50" variant="outline" disabled={isLoading}>
              <Mail className="mr-2 h-5 w-5" /> Sign Up with Email
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600 pt-4 border-t">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-purple-600 hover:text-purple-700">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>

      <CreateWalletModal
        open={showCreateWalletModal}
        onOpenChange={setShowCreateWalletModal}
      />
    </div>
  );
}
