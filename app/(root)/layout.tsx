

import BeamGridBackground from "@/components/lightswind/beam-grid-background"
import Navbar from "@/modules/home/Navbar"
import { Metadata } from "next"


export const metadata:Metadata = {
    title: "CuraVibe - Code Editor for Vibe Coders",
    description: "CuraVibe is an AI-powered code editor designed for Vibe coders. Start coding in seconds with templates, real-time AI suggestions, and chat assistance.",
    keywords: ["CuraVibe", "code editor", "Vibe Coders", "AI-powered", "coding", "templates", "real-time suggestions", "chat assistance"]

}
export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <div className="fixed inset-0 w-full h-full overflow-hidden">
                <BeamGridBackground
                    className="absolute inset-0 "
                    gridSize={10}
                    gridColor="rgba(243, 110, 6)"
                    darkGridColor="rgba(243, 110, 6, 0.05)"
                    beamColor="rgba(243, 110, 6)"
                    darkBeamColor="rgba(243, 110, 6)"
                    beamSpeed={0.05}
                    beamThickness={2}
                    beamGlow={true}
                    glowIntensity={20}
                    beamCount={10}
                    extraBeamCount={5}
                    idleSpeed={0.5}
                    interactive={true}
                    asBackground={true}
                    showFade={true}
                    fadeIntensity={25}
                />
                <div className="absolute inset-0 z-0" />
            </div>

            <div className="relative z-10"><Navbar />
                {children}</div>
        </>
    )
}
