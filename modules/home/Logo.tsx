'use client';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Player } from '@lordicon/react';

import darkLogo from "@/lib/logo-dark.json";
import lightLogo from "@/lib/logo-light.json";
import { useTheme } from 'next-themes';

export const Logo: FC<{ size?: number }> = ({ size = 45 }) => {
    const playerRef = useRef<Player>(null);
    const theme = useTheme();
    const logo = theme.resolvedTheme === 'dark' ? darkLogo : lightLogo;
    useEffect(() => {
        playerRef.current?.playFromBeginning();
    }, []);

    const handleComplete = () => {
        setTimeout(() => {
            playerRef.current?.playFromBeginning();
        }, 3000); // ⏳ wait 2s before replay
    };

    return (
        <div>
            <Player
                ref={playerRef}
                size={size}
                icon={logo}
                onComplete={handleComplete}
            />
        </div>
    );
};