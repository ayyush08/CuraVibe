import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Code, Download, Filter, MessageSquare, RefreshCw, Search, Settings, X, Zap } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

interface ChatHeaderProps {
    messages: any[];
    setMessages: (messages: any[]) => void;
    autoSave: boolean;
    setAutoSave: (value: boolean) => void;
    streamResponse: boolean;
    setStreamResponse: (value: boolean) => void;
    onClose: () => void;
    chatMode: "chat" | "review" | "fix" | "optimize";
    setChatMode: (mode: "chat" | "review" | "fix" | "optimize") => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterType: string;
    setFilterType: (type: string) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
    messages,
    setMessages,
    autoSave,
    setAutoSave,
    streamResponse,
    setStreamResponse,
    onClose,
    chatMode,
    setChatMode,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
}: ChatHeaderProps) => {
    const exportChat = () => {
        const chatData = {
            messages,
            timestamp: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(chatData, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ai-chat-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="shrink-0 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
            <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 border rounded-full flex flex-col justify-center items-center">
                        <Image src={"/logo.svg"} alt="Logo" width={28} height={28} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-100">
                            Enhanced AI Assistant
                        </h2>
                        <p className="text-sm text-zinc-400">
                            {messages.length} messages
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                            >
                                <Settings className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuCheckboxItem
                                checked={autoSave}
                                onCheckedChange={setAutoSave}
                            >
                                Auto-save conversations
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={streamResponse}
                                onCheckedChange={setStreamResponse}
                            >
                                Stream responses
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={exportChat}>
                                <Download className="h-4 w-4 mr-2" />
                                Export Chat
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setMessages([])}>
                                Clear All Messages
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Enhanced Controls */}
            <Tabs
                value={chatMode}
                onValueChange={(value) => setChatMode(value as any)}
                className="px-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <TabsList className="grid w-full grid-cols-4 max-w-md">
                        <TabsTrigger value="chat" className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            Chat
                        </TabsTrigger>
                        <TabsTrigger
                            value="review"
                            className="flex items-center gap-1"
                        >
                            <Code className="h-3 w-3" />
                            Review
                        </TabsTrigger>
                        <TabsTrigger value="fix" className="flex items-center gap-1">
                            <RefreshCw className="h-3 w-3" />
                            Fix
                        </TabsTrigger>
                        <TabsTrigger
                            value="optimize"
                            className="flex items-center gap-1"
                        >
                            <Zap className="h-3 w-3" />
                            Optimize
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-2">
                        {/* <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-zinc-500" />
                            <Input
                                placeholder="Search messages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-7 h-8 w-40 bg-zinc-800/50 border-zinc-700/50"
                            />
                        </div> */}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 w-fit transition-all duration-300 px-2 flex items-center justify-center gap-2">
                                    <Filter className="h-4 w-4 " />
                                    <span className="text-[13px]">
                                        {filterType === "all"
                                            ? "Filter Messages"
                                            : filterType === "chat"
                                            ? "Chat Only"
                                            : filterType === "code_review"
                                            ? "Code Reviews"
                                            : filterType === "error_fix"
                                            ? "Error Fixes"
                                            : filterType === "optimization"
                                            ? "Optimizations"
                                            : "Filter"}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setFilterType("all")}>
                                    All Messages
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilterType("chat")}>
                                    Chat Only
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setFilterType("code_review")}
                                >
                                    Code Reviews
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setFilterType("error_fix")}
                                >
                                    Error Fixes
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setFilterType("optimization")}
                                >
                                    Optimizations
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </Tabs>
        </div>
    )
}

export default ChatHeader