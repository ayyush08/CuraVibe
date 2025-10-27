import Link from "next/link";
import { Heart, Github as LucideGithub, LucideTwitter, MoveUpRight } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { RainbowButton } from "@/components/ui/rainbow-button";




export function Footer() {
    const socialLinks = [
        {
            href: "https://github.com/ayyush08/CuraVibe",
            icon: (
                <LucideGithub className="w-5 h-5 text-orange-500 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-100 transition-colors" />
            ),
        },
        {
            href: "https://twitter.com/curavibeai",
            icon: (
                <LucideTwitter className="w-5 h-5 text-orange-500 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-100 transition-colors" />
            ),
        }
    ];

    return (
        <>
            <section className="w-full py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-balance mb-6">Start Building with AI Today</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Join developers worldwide who are shipping faster with Curavibe. No setup required, start coding in seconds.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={"/dashboard"}>
                            <RainbowButton className="px-8 py-3 text-lg group mx-auto flex items-center gap-2 transition-all">
                                Start Coding Now
                                <MoveUpRight className="w-5 h-5 stroke-[3] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </RainbowButton>
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="w-full border-t border-border py-10 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground gap-4 text-center md:text-left">

                        {/* Left side */}
                        <p className="order-1 md:order-none">
                            &copy; 2025 <span className="font-semibold text-orange-500">CuraVibe</span>. All rights reserved.
                        </p>

                        {/* Middle (built with love) */}
                        <h3 className="order-3 md:order-none flex items-center gap-2 text-base">
                            Built with
                            <Heart className="w-4 h-4 fill-orange-500 outline-none text-orange-500" />
                        </h3>


                        {/* Right side (social links) */}
                        <div className="flex gap-5 order-2 md:order-none">
                            {socialLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:opacity-80 transition-opacity text-orange-500 text-lg"
                                >
                                    {link.icon}
                                </Link>
                            ))}
                        </div>

                    </div>
                </div>
            </footer>

        </>
    );
}
