
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

export const metadata = {
    title: "Playground - CuraVibe",
    description: "Your AI-powered project playground.",
};

export default function PlaygroundLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            {children}
        </SidebarProvider>
    );
}
