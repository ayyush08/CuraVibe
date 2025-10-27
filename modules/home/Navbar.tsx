'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
} from '@/components/lightswind/navigation-menu'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
import { useCurrentUser } from '@/hooks/use-current-user'
import UserButton from '../auth/components/user-button'
import { APP_NAME } from '@/lib/constants'
import { Logo } from './Logo'
import { RainbowButton } from '@/components/ui/rainbow-button'
import { AuroraText } from '@/components/ui/aurora-text'

export default function Navbar() {
    const currentUser = useCurrentUser()
    const isAuthenticated = !!currentUser

    return (
        <div
            className={cn(
                'fixed top-4 left-1/2 -translate-x-1/2 z-50',
                'w-[90%] max-w-7xl rounded-2xl backdrop-blur-xl border border-white/10',
                'bg-white/10 dark:bg-black/10 shadow-md transition-colors'
            )}
        >
            <div className="flex w-full items-center justify-between px-6 py-3">

                <Link
                    href="/"
                    className="text-lg font-extrabold tracking-wide hover:text-primary transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <Logo />
                        <AuroraText
                            className="font-extrabold inline-block" // ✅ keep inline to center with text
                            speed={1}
                            colors={["#f36e06", "#de5114"]}
                        >
                            {`${APP_NAME}`}
                        </AuroraText>
                    </span>
                </Link>

                {/* RIGHT: Navigation */}
                <NavigationMenu>
                    <NavigationMenuList className="flex items-center gap-3">
                        <NavigationMenuItem>
                            <AnimatedThemeToggler />
                        </NavigationMenuItem>
                        {isAuthenticated ? (
                            <>
                                {/* <NavigationMenuItem>
                                    <NavigationMenuLink
                                        href="/dashboard"
                                        className="px-4 py-2 text-sm hover:bg-accent/30 rounded-md"
                                    >
                                        Dashboard
                                    </NavigationMenuLink>
                                </NavigationMenuItem> */}
                                <NavigationMenuItem>
                                    <UserButton />
                                </NavigationMenuItem>
                            </>
                        ) : (
                            <>
                                <NavigationMenuItem>
                                    <RainbowButton variant={'outline'} asChild size={'lg'}>
                                        <NavigationMenuLink
                                            href="/login"
                                            className="px-5 py-2 font-bold tracking-wider italic "
                                        >
                                            Login
                                        </NavigationMenuLink>
                                    </RainbowButton>
                                </NavigationMenuItem>
                            </>
                        )}


                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </div>
    )
}
