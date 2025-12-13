"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wallet } from "lucide-react";
import Link from "next/link";

export default function WalletAuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to register page - we're using embedded wallets only
    router.push("/auth/register");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="absolute inset-0 bg-agentic-grid opacity-40" />
      
      <Card className="relative z-10 w-full max-w-md border-2 border-gray-200 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">Connect Wallet</CardTitle>
          <CardDescription className="text-gray-600">
            We're using embedded wallets for security and simplicity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
            <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-4">
              External wallet connection is coming soon. For now, create a secure embedded wallet.
            </p>
          </div>
          
          <Link href="/auth/register">
            <Button className="w-full bg-gray-900 hover:bg-black text-white" size="lg">
              Create Embedded Wallet
            </Button>
          </Link>
          
          <Link href="/">
            <Button variant="outline" className="w-full border-2" size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
