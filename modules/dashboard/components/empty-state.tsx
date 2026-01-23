import Image from 'next/image'
import React from 'react'

interface EmptyStateProps{
    message?:string
    messageDescription?:string
}
const EmptyState = ({ message, messageDescription }: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-16">
            
            <Image src="/empty-state.svg" alt="No projects" width={192} height={192} className="mb-4" />
            <h2 className="text-xl font-semibold text-gray-500">{message || "No projects found"}</h2>
            <p className="text-gray-400">{messageDescription || "Create a new project to get started!"}</p>
        </div>
    )
}

export default EmptyState