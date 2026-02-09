import React from "react";

export const metadata = {
    title: "Sign In - CuraVibe",
    description: "Authenticate to access your personalized playgrounds and remote runners on CuraVibe. Log in to manage your coding environments, save your progress, and securely run your code in the cloud. Experience seamless access to your projects from anywhere with CuraVibe's authentication system."
}

const AuthLayout = ({ children }: {
    children: React.ReactNode
}) => {
    return (
        <main className="flex justify-center items-center h-screen flex-col bg-zinc-900">
            {children}
        </main>
    )
}


export default AuthLayout;