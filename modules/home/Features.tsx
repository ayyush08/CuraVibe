import GlowingCards, { GlowingCard } from '@/components/lightswind/glowing-cards'
import { BlurFade } from '@/components/ui/blur-fade'
import { TextAnimate } from '@/components/ui/text-animate'
import { Code2, Layers, MessageSquare, Rocket, Sparkles, Zap } from 'lucide-react'
import React from 'react'

const Features = () => {
    const features = [
        {
            icon: <Code2 className="w-6 h-6" />,
            title: "Monaco Editor",
            description: "Professional-grade code editor with syntax highlighting and intelligent autocomplete",

            glowColor: "#6366F1",
        },
        {
            icon: <Sparkles className="w-6 h-6" />,
            title: "AI Code Suggestions",
            description: "Get real-time AI-powered suggestions as you type to accelerate development",
            glowColor: "#A855F7",
        },
        {
            icon: <MessageSquare className="w-6 h-6" />,
            title: "AI Chat Assistant",
            description: "Ask questions, debug code, and get explanations from your AI coding partner",
            glowColor: "#22C55E",
        },
        {
            icon: <Layers className="w-6 h-6" />,
            title: "Custom Environments",
            description: "Spin up isolated sandboxes for each project with one click.",
            glowColor: "#0EA5E9",
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Instant Preview",
            description: "See your changes live in real-time without leaving the browser",
            glowColor: "#F59E0B",

        },
        {
            icon: <Rocket className="w-6 h-6" />,
            title: "Save your work in Database",
            description: "Save your projects instantly to the database with a single click to avoid losing your progress",
            glowColor: "#F97316",
        },
    ]
    return (
        <section className="w-full py-20 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <TextAnimate
                        animation="blurInUp"
                        once
                        duration={0.8}
                        by="word"
                        className="text-4xl md:text-5xl font-bold mb-4 text-wrap">All You Need to Code - Right In Your Browser</TextAnimate>
                    <TextAnimate
                        animation="blurInUp"
                        duration={0.8}
                        delay={0.2}
                        once
                        by="word"
                        className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Professional development tools combined with AI assistance, all in your browser
                    </TextAnimate>
                </div>
                <BlurFade
                duration={1}
                
                inView
                >

                    <GlowingCards
                        enableGlow
                        glowRadius={20}
                        glowOpacity={1.2}
                        borderRadius="1rem"
                        animationDuration={500}
                        responsive={true} // keep the library's glow layout active
                        gap="2rem"        // control spacing between cards
                    >
                        {features.map((feature, idx) => (
                            <GlowingCard
                                key={idx}
                                glowColor={feature.glowColor}
                                className="p-6 rounded-xl border border-border bg-white/50 dark:bg-black/50 backdrop-blur-md flex flex-col justify-between min-h-[200px] transition-shadow hover:shadow-lg"
                            >
                                <div className="flex flex-col items-start space-y-3">
                                    <div style={{ color: feature.glowColor }}>{feature.icon}</div>
                                    <h3 className="text-xl font-bold">{feature.title}</h3>
                                    <p className="text-muted-foreground font-semibold text-base flex-grow line-clamp-3">
                                        {feature.description}
                                    </p>
                                </div>
                            </GlowingCard>
                        ))}
                    </GlowingCards>
                </BlurFade>

            </div>
        </section>
    )
}

export default Features