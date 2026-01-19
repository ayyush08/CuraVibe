"use client";
import React from "react";
import { Loader2, Globe, CheckCircle2, WifiOff } from "lucide-react";

interface RemoteRunnerPreviewProps {
    serverUrl: string | null;
    isLoading: boolean;
    error: string | null;
    isConnected: boolean;
}

const RemoteRunnerPreview = ({
    serverUrl,
    isLoading,
    error,
    isConnected,
}: RemoteRunnerPreviewProps) => {

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-zinc-900 border-l">
                <div className="text-center space-y-4 max-w-md p-6">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
                    <h3 className="text-lg font-medium">Starting Remote Session</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Allocating remote resources and starting environment...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-zinc-900 border-l">
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg max-w-md text-center">
                    <WifiOff className="h-8 w-8 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Connection Failed</h3>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    if (!serverUrl || !isConnected) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-zinc-900 border-l">
                <div className="text-center space-y-4 max-w-md p-6">
                    <Globe className="h-10 w-10 text-gray-400 mx-auto" />
                    <h3 className="text-lg font-medium text-gray-500">Waiting for server...</h3>
                </div>
            </div>
        );
    }
    console.log("server url:",serverUrl);
    

    return (
        <div className="h-full w-full flex flex-col bg-white dark:bg-zinc-900 border-l">
            {/* Toolbar / Status Bar */}
            <div className="h-10 border-b flex items-center px-4 justify-between bg-gray-50 dark:bg-zinc-900">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Globe className="h-4 w-4" />
                    <span className=" flex text-wrap">{serverUrl}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
                        <CheckCircle2 className="h-3 w-3" />
                        Remote Active
                    </span>
                </div>
            </div>

            {/* Iframe Preview */}
            <div className="flex-1 relative">
                <iframe
                    src={serverUrl}
                    className="w-full h-full border-none"
                    title="Remote Runner Preview"
                    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                />
            </div>
        </div>
    );
};

export default RemoteRunnerPreview;
