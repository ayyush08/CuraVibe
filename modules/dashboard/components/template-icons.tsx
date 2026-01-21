import Image from "next/image";

export const templateToIconMap: { name: string; icon: React.ReactNode }[] = [
        {
            name: "React",
            icon: (<Image src="/react.svg" alt="React" className="w-12 h-12" width={100} height={100} />)
        },
        {
            name: "Nextjs",
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
            name: "Vuejs",
            icon: (<Image src="/vuejs-icon.svg" alt="Vue.js" className="w-12 h-12" width={100} height={100} />)
        },
        {
            name: "Angular",
            icon: (<Image src="/angular-2.svg" alt="Angular" className="w-12 h-12" width={100} height={100} />)
        }
    ]