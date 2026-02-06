import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import SignInFormClient from "@/modules/auth/components/sign-in-form-client";
import { SignInLogoSection } from "@/modules/auth/components/sign-in-logo-section";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-black dark:via-zinc-950 dark:to-orange-950/20 p-4">
      {/* Back to Home - Top Left */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 z-50 backdrop-blur-sm bg-white/50 dark:bg-black/50 p-3 rounded-full border border-orange-200/50 dark:border-orange-900/30 shadow-lg shadow-orange-500/10 dark:shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/20 dark:hover:shadow-orange-500/30 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center text-xs font-mono font-semibold"
      >
        <MoveLeft className="h-5 w-5 text-orange-600 dark:text-orange-500 mr-3" />
        Back to Home
      </Link>

      {/* Theme Toggler - Top Right */}
      <div className="absolute top-6 right-6 z-50 backdrop-blur-sm bg-white/50 dark:bg-black/50 p-2 rounded-full border border-orange-200/50 dark:border-orange-900/30 shadow-lg shadow-orange-500/10 dark:shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/20 dark:hover:shadow-orange-500/30 transition-all duration-300">
        <AnimatedThemeToggler />
      </div>

      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        {/* Left Section - Logo and App Name */}
        <SignInLogoSection />

        {/* Right Section - Form */}
        <div className="flex-1 w-full flex items-center justify-center">
          <div className="animate-float">
            <SignInFormClient />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
