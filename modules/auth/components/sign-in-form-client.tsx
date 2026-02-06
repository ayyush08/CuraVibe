
import React from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Chrome, Github } from "lucide-react";
import { signIn } from "@/auth";

async function handleGoogleSignIn() {
    "use server"
    await signIn("google")
}

async function handleGithubSignIn() {
    "use server"
    await signIn("github")
}

const SignInFormClient = () => {
    return (
        <Card className="w-full max-w-xl bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-2 border-orange-200/50 dark:border-orange-900/30 shadow-[0_20px_70px_-15px_rgba(251,146,60,0.3)] dark:shadow-[0_20px_70px_-15px_rgba(251,146,60,0.4)] hover:shadow-[0_25px_80px_-15px_rgba(251,146,60,0.4)] dark:hover:shadow-[0_25px_80px_-15px_rgba(251,146,60,0.5)] transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
            <CardHeader className="space-y-3 p-8 pb-6">
                <CardTitle className="text-4xl font-bold text-orange-600 dark:text-orange-500">
                    Welcome Back
                </CardTitle>
                <CardDescription className="text-base text-gray-700 dark:text-gray-300">
                    Sign in to continue to your account
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 px-8 pb-6">
                <form action={handleGoogleSignIn} className="w-full">
                    <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 dark:from-orange-500 cursor-pointer dark:to-orange-400 dark:hover:from-orange-600 dark:hover:to-orange-500 text-white font-semibold py-6 transition-all duration-200 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40"
                    >
                        <Chrome className="mr-3 h-5 w-5" />
                        <span>Continue with Google</span>
                    </Button>
                </form>
                
                <div className="relative flex items-center justify-center my-2">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-orange-200 dark:border-orange-900"></div>
                    </div>
                    <div className="relative px-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm">
                        <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
                    </div>
                </div>

                <form action={handleGithubSignIn} className="w-full">
                    <Button 
                        type="submit" 
                        className="w-full bg-white/90 hover:bg-orange-50 cursor-pointer dark:bg-black/90 dark:hover:bg-zinc-900 text-orange-600 dark:text-orange-400 border-2 border-orange-600 dark:border-orange-500 font-semibold py-6 transition-all duration-200 backdrop-blur-sm hover:border-orange-700 dark:hover:border-orange-400"
                    >
                        <Github className="mr-3 h-5 w-5" />
                        <span>Continue with GitHub</span>
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="px-8 pb-8 pt-4">
                <p className="text-xs text-center text-gray-600 dark:text-gray-400 w-full leading-relaxed">
                    By signing in, you agree to our{" "}
                    <a href="#" className="underline text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 font-medium">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="underline text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 font-medium">
                        Privacy Policy
                    </a>
                    .
                </p>
            </CardFooter>
        </Card>
    );
};

export default SignInFormClient;


