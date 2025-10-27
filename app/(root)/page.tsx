'use client'

import { AuroraText } from "@/components/ui/aurora-text"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useCurrentUser } from "@/hooks/use-current-user"
import { APP_NAME } from "@/lib/constants"
import { cn } from "@/lib/utils"
import Features from "@/modules/home/Features"
import { Footer } from "@/modules/home/Footer"
import Frameworks from "@/modules/home/Frameworks"
import HowItWorks from "@/modules/home/HowItWorks"
import { MoveUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function LandingPage() {
    const currentUser = useCurrentUser()
    const techComponents: { name: string; icon: React.ReactNode }[] = [
        {
            name: "React",
            icon: (<Image src="/react.svg" alt="React" className="w-12 h-12" width={100} height={100} />)

        },
        {
            name: "Next.js",
            icon: (<Image src="/nextjs-icon.svg" alt="Next.js" className="w-12 h-12" width={100} height={100} />)
        },
        {
            name: "Hono",
            icon: (<Image src="/hono.svg" alt="Hono" className="w-12 h-12" width={100} height={100} />)
        },
        {
            name: "Express",
            icon: (<Image src="/expressjs.svg" alt="Express" className="w-12 h-12" width={100} height={100} />)
        },
        {
            name: "Vue.js",
            icon: (<Image src="/vuejs-icon.svg" alt="Vue.js" className="w-12 h-12" width={100} height={100} />)
        },
        {
            name: "Angular",
            icon: (<Image src="/angular-2.svg" alt="Angular" className="w-12 h-12" width={100} height={100} />)
        }
    ]


    return (
        <>

            <div className="w-full min-h-screen flex flex-col gap-5 items-center justify-center px-6" suppressHydrationWarning>
                <div className="relative flex flex-col gap-4 md:items-center lg:flex-row">
                    <h1
                        className={cn(
                            "text-black dark:text-white",
                            "relative max-w-[43.5rem] pt-5 px-4 py-2",
                            "font-semibold tracking-tighter text-balance text-center", // ✅ center on all screens
                            "text-5xl sm:text-6xl md:text-7xl lg:text-6xl mx-auto"     // ✅ responsive sizing + centering
                        )}
                    >
                        <AuroraText
                            className="font-bold inline-block" // ✅ keep inline to center with text
                            speed={1}
                            colors={["#f36e06", "#de5114", "#d7de14"]}
                        >
                            {`${APP_NAME}`}
                        </AuroraText>{" "}
                        <br />
                        AI-powered coding, right in your browser.
                    </h1>


                </div>
                <div className={cn("flex flex-row gap-2 space-x-2")}>
                    {techComponents.map((tech) => (
                        <Tooltip key={tech.name}>
                            <TooltipTrigger>{tech.icon}</TooltipTrigger>
                            <TooltipContent>
                                <p>{tech.name}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}

                </div>
                <Link href={'/dashboard'}>
                    <RainbowButton className="px-15 py-5 text-xl text-balance mt-4 group flex items-center gap-2 transition-all">
                        {currentUser ? 'Go to Dashboard' : 'Start Coding Now'}
                        <MoveUpRight className="w-5 h-5 stroke-[3] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </RainbowButton>
                </Link>
            </div>
            <Features />
            <Frameworks />
            <HowItWorks />
            <Footer />
        </>

    )
}

