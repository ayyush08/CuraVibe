import React, { useEffect, useRef, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Code, Download, Filter, MessageSquare, RefreshCw, Search, Settings, X, Zap, Check, Cloud, CloudOff } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Logo } from '@/modules/home/Logo';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { autosaveChatMessages } from '../actions';

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
    playgroundId: string;
    historyMessageCount: number;
    hasHydratedHistory: boolean;
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
    playgroundId,
    historyMessageCount,
    hasHydratedHistory
}: ChatHeaderProps) => {
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [unsavedMessages, setUnsavedMessages] = useState<any[]>([]);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSavedCountRef = useRef(0);
    const hasSyncedHistoryRef = useRef(false);
    const skipNextAutosaveRef = useRef(false);

    useEffect(() => {
        if (!hasHydratedHistory || hasSyncedHistoryRef.current) return;

        lastSavedCountRef.current = historyMessageCount;
        setUnsavedMessages([]);
        setSaveStatus('idle');
        hasSyncedHistoryRef.current = true;
        skipNextAutosaveRef.current = true;
    }, [hasHydratedHistory, historyMessageCount]);

    useEffect(() => {
        lastSavedCountRef.current = 0;
        hasSyncedHistoryRef.current = false;
    }, [playgroundId]);

    // Autosave logic
    useEffect(() => {
        if (!hasHydratedHistory || !hasSyncedHistoryRef.current) return;
        if (!autoSave) return;
        if (messages.length === 0) {
            lastSavedCountRef.current = 0;
            setUnsavedMessages([]);
            return;
        }

        if (skipNextAutosaveRef.current) {
            skipNextAutosaveRef.current = false;
            return;
        }

        // Check if there are new messages to save
        const newMessages = messages.slice(lastSavedCountRef.current);
        if (newMessages.length === 0) return;

        setUnsavedMessages(newMessages);

        // Clear existing timeout
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Debounce autosave by 2 seconds
        saveTimeoutRef.current = setTimeout(async () => {
            setSaveStatus('saving');
            
            try {
                const messagesToSave = newMessages.map(msg => ({
                    role: msg.role as "user" | "model",
                    content: msg.content,
                    type: msg.type
                }));

                await autosaveChatMessages(messagesToSave,playgroundId);
                
                lastSavedCountRef.current = messages.length;
                setUnsavedMessages([]);
                setSaveStatus('saved');

                // Reset to idle after 2 seconds
                setTimeout(() => setSaveStatus('idle'), 2000);
            } catch (error) {
                console.error('Autosave error:', error);
                setSaveStatus('error');
                
                // Reset error status after 3 seconds
                setTimeout(() => setSaveStatus('idle'), 3000);
            }
        }, 2000);

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [messages, autoSave, playgroundId, hasHydratedHistory]);

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

    const getAutosaveIndicator = () => {
        if (!autoSave) return null;

        switch (saveStatus) {
            case 'saving':
                return (
                    <div className="flex items-center gap-2 text-xs text-orange-400 animate-pulse">
                        <Cloud className="h-3 w-3 animate-pulse" />
                        <span>Saving...</span>
                    </div>
                );
            case 'saved':
                return (
                    <div className="flex items-center gap-2 text-xs text-green-500">
                        <Check className="h-3 w-3" />
                        <span>Saved</span>
                    </div>
                );
            case 'error':
                return (
                    <div className="flex items-center gap-2 text-xs text-red-500">
                        <CloudOff className="h-3 w-3" />
                        <span>Save failed</span>
                    </div>
                );
            default:
                if (unsavedMessages.length > 0) {
                    return (
                        <div className="flex items-center gap-2 text-xs text-orange-500">
                            <Cloud className="h-3 w-3" />
                            <span>Pending...</span>
                        </div>
                    );
                }
                // Show "Connected" when autosave is enabled but idle
                return (
                    <div className="flex items-center gap-2 text-xs text-emerald-500/70">
                        <Cloud className="h-3 w-3" />
                        <span>Auto-Save On</span>
                    </div>
                );
        }
    };

    

    return (
        <div className="shrink-0 border-b border-orange-800 bg-white dark:bg-neutral-900/80 backdrop-blur-sm">
            <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-3">
                    <div className="relative flex flex-col justify-center items-center">
                        <Logo/>
                    </div>
                    <div>
                        <h2 className="font-mono tracking-wide font-bold text-orange-500 text-2xl">
                            Enhanced AI Assistant
                        </h2>
                        <div className="flex items-center gap-3">
                            <p className="text-sm text-orange-400">
                                {messages.length} messages
                            </p>
                            {getAutosaveIndicator()}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <AnimatedThemeToggler/>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-orange-400 hover:text-orange-500 hover:bg-orange-800"
                            >
                                <Settings className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className=' font-semibold'>
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
                        className="h-8 w-8 p-0 text-orange-400 hover:text-orange-500 hover:bg-orange-800"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Enhanced Controls */}
            <Tabs
                value={chatMode}
                onValueChange={(value) => {
                    const nextMode = value as "chat" | "review" | "fix" | "optimize";
                    setChatMode(nextMode);
                    setFilterType(
                        nextMode === "chat"
                            ? "chat"
                            : nextMode === "review"
                            ? "code_review"
                            : nextMode === "fix"
                            ? "error_fix"
                            : "optimization"
                    );
                }}
                className="px-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <TabsList className="grid w-full grid-cols-4 max-w-md bg-orange-700/80 transition-all duration-300 dark:bg-orange-900/50 border border-orange-800 rounded-md">
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
                                <Button variant="outline"  className=" transition-all duration-300 px-2 flex items-center justify-center gap-2 border border-orange-800 bg-orange-700/10 hover:bg-orange-700/20 dark:border-orange-900 dark:bg-orange-900/10 dark:hover:bg-orange-900/20">
                                    <Filter className="h-4 w-4 " />
                                    <span className="text-[15px] tracking-wide ">
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
                            <DropdownMenuContent align="end" className='font-semibold'>
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