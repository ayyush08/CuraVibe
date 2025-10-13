"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
    Loader2,
    Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    TooltipProvider,
} from "@/components/ui/tooltip";

import ChatHeader from "./Chat-Header";
import MessageContainer from "./message-container";

interface ChatMessage {
    role: "user" | "model";
    content: string;
    id: string;
    timestamp: Date;
    type?: "chat" | "code_review" | "suggestion" | "error_fix" | "optimization";
    tokens?: number;
    model?: string;
}

interface AIChatSidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    theme?: "dark" | "light";
}



export const AIChatSidePanel: React.FC<AIChatSidePanelProps> = ({
    isOpen,
    onClose,
    theme = "dark",
}) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [chatMode, setChatMode] = useState<
        "chat" | "review" | "fix" | "optimize"
    >("chat");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<string>("all");
    const [autoSave, setAutoSave] = useState(true);
    const [streamResponse, setStreamResponse] = useState(true);
    const [streamedContent, setStreamedContent] = useState("");
    const [currentStreamingMessageId, setCurrentStreamingMessageId] = useState<string | null>(null);



    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            scrollToBottom();
        }, 100);
        return () => clearTimeout(timeoutId);
    }, [messages, isLoading]);
    const getChatModePrompt = (mode: string, content: string) => {
        switch (mode) {
            case "review":
                return `Please review this code and provide detailed suggestions for improvement, including performance, security, and best practices:\n\n**Request:** ${content}`;
            case "fix":
                return `Please help fix issues in this code, including bugs, errors, and potential problems:\n\n**Problem:** ${content}`;
            case "optimize":
                return `Please analyze this code for performance optimizations and suggest improvements:\n\n**Code to optimize:** ${content}`;
            default:
                return content
        }
    };
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.trim() || isLoading) return;


        const messageType =
            chatMode === "chat"
                ? "chat"
                : chatMode === "review"
                    ? "code_review"
                    : chatMode === "fix"
                        ? "error_fix"
                        : "optimization";

        const newMessage: ChatMessage = {
            role: "user",
            content: input.trim(),
            timestamp: new Date(),
            id: Date.now().toString(),
            type: messageType,
        };


        setMessages((prev) => [...prev, newMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const contextualMessage = getChatModePrompt(chatMode, input.trim());

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: contextualMessage,
                    history: messages.slice(-10).map((msg) => ({
                        role: msg.role,
                        content: msg.content,
                    })),
                    stream: streamResponse,
                }),
            });

            if (response.ok) {
                if (streamResponse) {
                    const reader = response.body?.getReader();
                    const decoder = new TextDecoder();
                    let chunkValue = "";

                    const id = Date.now().toString();
                    setCurrentStreamingMessageId(id);
                    setMessages(prev => [
                        ...prev,
                        { role: "model", content: "", timestamp: new Date(), id, type: messageType }
                    ]);

                    while (reader) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        chunkValue += decoder.decode(value, { stream: true });
                        setStreamedContent(chunkValue);
                        setMessages(prev => prev.map(msg =>
                            msg.id === id ? { ...msg, content: chunkValue } : msg
                        ));
                    }

                    setCurrentStreamingMessageId(null);
                    setStreamedContent("");
                } else {
                    const data = await response.json();
                    setMessages(prev => [
                        ...prev,
                        {
                            role: "model",
                            content: data.response,
                            timestamp: new Date(),
                            id: Date.now().toString(),
                            type: messageType,
                            tokens: data.tokens,
                            model: data.model || "AI Assistant",
                        }
                    ]);
                }

            } else {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "model",
                        content:
                            "Sorry, I encountered an error while processing your request. Please try again.",
                        timestamp: new Date(),
                        id: Date.now().toString(),
                    },
                ]);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "model",
                    content:
                        "I'm having trouble connecting right now. Please check your internet connection and try again.",
                    timestamp: new Date(),
                    id: Date.now().toString(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };


    const filteredMessages = messages.filter((msg) => {
        if (filterType === "all") return true;
        return msg.type === filterType;
    })
        .filter((msg) => {
            if (!searchTerm) return true;
            return msg.content.toLowerCase().includes(searchTerm.toLowerCase());
        })

    return (
        <TooltipProvider>
            <>
                {/* Backdrop */}
                <div
                    className={cn(
                        "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300",
                        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}
                    onClick={onClose}
                />

                {/* Side Panel */}
                <div
                    className={cn(
                        "fixed right-0 top-0 h-full w-full max-w-6xl bg-zinc-950 border-l border-zinc-800 z-50 flex flex-col transition-transform duration-300 ease-out shadow-2xl",
                        isOpen ? "translate-x-0" : "translate-x-full"
                    )}
                >
                    {/* Enhanced Header */}
                    <ChatHeader
                        messages={messages}
                        setMessages={setMessages}
                        autoSave={autoSave}
                        setAutoSave={setAutoSave}
                        streamResponse={streamResponse}
                        setStreamResponse={setStreamResponse}
                        chatMode={chatMode}
                        setChatMode={setChatMode}
                        filterType={filterType}
                        setFilterType={setFilterType}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        onClose={onClose}

                    />

                    {/* Messages Container */}
                    <MessageContainer
                        chatMode={chatMode}
                        isLoading={isLoading}
                        filteredMessages={filteredMessages}
                        setInput={setInput}
                        messagesEndRef={messagesEndRef}
                        isStreaming={currentStreamingMessageId !== null}
                    />

                    {/* Enhanced Input Form */}
                    <form
                        onSubmit={handleSendMessage}
                        className="shrink-0 p-4 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-sm"
                    >
                        <div className="flex items-end gap-3">
                            <div className="flex-1 relative">
                                <Textarea
                                    placeholder={
                                        chatMode === "chat"
                                            ? "Ask about your code, request improvements, or paste code to analyze..."
                                            : chatMode === "review"
                                                ? "Describe what you'd like me to review in your code..."
                                                : chatMode === "fix"
                                                    ? "Describe the issue you're experiencing..."
                                                    : "Describe what you'd like me to optimize..."
                                    }
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                                            handleSendMessage(e as any);
                                        }
                                    }}
                                    disabled={isLoading}
                                    className="min-h-[44px] max-h-32 bg-zinc-800/50 border-zinc-700/50 text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:ring-blue-500/20 resize-none pr-20"
                                    rows={1}
                                />
                                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 rounded">
                                        ⌘↵
                                    </kbd>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="h-11 px-4 bg-orange-600 hover:bg-orange-700 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </>
        </TooltipProvider>
    );
};