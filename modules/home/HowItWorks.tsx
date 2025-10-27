import GlowingCards, { GlowingCard } from '@/components/lightswind/glowing-cards'
import React from 'react'
import {
    MousePointerClick, Binary, IdCard
} from 'lucide-react'
import { HyperText } from '@/components/ui/hyper-text'
import { TextAnimate } from '@/components/ui/text-animate'
import { BlurFade } from '@/components/ui/blur-fade'

const HowItWorks = () => {

    const steps = [
        {
            step: <MousePointerClick className='w-8 h-8' />,
            title: "Choose a Template",
            desc: "Select from React, Next.js, Hono, Angular, Vue or start from scratch",
            glowColor: "purple",
        },
        {
            step: <IdCard className='w-8 h-8' />,
            title: "Give your Project a Name",
            desc: "Name your project and let us set up the environment for you",
            glowColor: "green",
        },
        {
            step: <Binary className='w-8 h-8' />,
            title: "Code with AI Help",
            desc: "Use Monaco Editor with real-time AI suggestions and chat assistance",
            glowColor: "red",
        },
    ]

    return (
        <section className="w-full py-20 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <TextAnimate
                        animation="blurInUp"
                        duration={0.8}
                        delay={0.2}
                        once
                        by="word"
                        className="text-4xl md:text-5xl font-bold text-balance  mb-4">
                        How CuraVibe Works
                    </TextAnimate>
                    <TextAnimate
                        animation="blurInUp"
                        duration={0.8}
                        delay={0.3}
                        once
                        by="word"
                        className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Start coding in seconds with AI assistance
                    </TextAnimate>
                </div>
                <BlurFade duration={1} inView>

                    <GlowingCards
                        enableGlow
                        glowRadius={20}
                        glowOpacity={1.2}
                        borderRadius="1rem"
                        animationDuration={500}
                        responsive={true} // keep the library's glow layout active
                        gap="2rem"        // control spacing between cards
                    >
                        {steps.map((step, idx) => (
                            <GlowingCard
                                key={idx}
                                glowColor={step.glowColor}
                                className="p-6 rounded-xl border border-border bg-white/50 dark:bg-black/50 backdrop-blur-md flex flex-col justify-between min-h-[200px] transition-shadow hover:shadow-lg"
                            >
                                <div className="flex flex-col items-start space-y-3">
                                    <div className='text-4xl bg-muted p-5 rounded-full' style={{ color: step.glowColor }}>{step.step}</div>
                                    <h3 className="text-2xl font-bold">{step.title}</h3>
                                    <p className="text-muted-foreground font-semibold text-lg flex-grow line-clamp-3">
                                        {step.desc}
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

export default HowItWorks