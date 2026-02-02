"use client";

import { APP_NAME } from '@/lib/constants';
import { Logo } from '@/modules/home/Logo';
import React from 'react';

export const SignInLogoSection = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-10">
            <div className="scale-200 lg:scale-200 mb-5">
                <Logo size={150}/>
            </div>
            <div className="text-center space-y-2">
                <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 dark:from-orange-500 dark:to-orange-400 bg-clip-text text-transparent">
                    {APP_NAME}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                    Code with AI right in your Browser
                </p>
            </div>
        </div>
    );
};
