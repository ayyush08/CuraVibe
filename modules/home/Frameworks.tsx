import { AuroraText } from '@/components/ui/aurora-text'
import { OrbitingCircles } from '@/components/ui/orbiting-circles';
import { useTheme } from 'next-themes'
import Image from 'next/image';
import React, { useEffect } from 'react'


const colors = ["#FF6A00", "#FFA500"];



const Frameworks = () => {
    const Icons: { icon: React.ReactNode }[] = [
        {
            icon: (<Image src="/react.svg" alt="React"  width={250} height={250} />)

        },
        {
            icon: (<Image src="/nextjs-icon.svg" alt="Next.js"  width={100} height={100} />)
        },
        {
            icon: (<Image src="/hono.svg" alt="Hono"  width={100} height={100} />)
        },
        {
            icon: (<Image src="/expressjs.svg" alt="Express"  width={100} height={100} />)
        },
        {
            icon: (<Image src="/vuejs-icon.svg" alt="Vue.js"  width={100} height={100} />)
        },
        {
            icon: (<Image src="/angular-2.svg" alt="Angular"  width={100} height={100} />)
        }
    ]

    return (
        <section className="w-full py-20 px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
                <div className="space-y-6">
                    <AuroraText
                        colors={colors}
                        speed={0.8}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-orange-500">
                        Multiple Frameworks. <br />
                        One Unified Workspace.
                    </AuroraText>
                    <p className="text-lg max-w-md">
                        Build with your favorite tech stack — from <strong>React</strong> and <strong>Next.js </strong>
                        to  <strong>Vue</strong>, <strong>Angular</strong>, and <strong>Hono</strong>.
                        No setup. No installs. Just start coding instantly.
                    </p>
                </div>

                {/* RIGHT SIDE - Animation Placeholder */}
                <div className="relative flex justify-center items-center w-full h-[300px] md:h-[400px]">
                    <OrbitingCircles iconSize={50} speed={1.5} >
                        {Icons.map((item, idx) => (
                            <div key={idx}>
                                {item.icon}
                            </div>
                        ))}
                    </OrbitingCircles>
                </div>
            </div>
        </section>

    )
}

export default Frameworks