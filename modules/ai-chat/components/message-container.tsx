import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Brain, Code, Copy, Loader2, MessageSquare, RefreshCw, Sparkles, User, Zap } from 'lucide-react';
import React from 'react'
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { cn } from '@/lib/utils';
import "katex/dist/katex.min.css";
import { useCurrentUser } from '@/hooks/use-current-user';
import moment from 'moment';

interface MessageContainerProps {
    filteredMessages: any[];
    isLoading: boolean;
    chatMode: "chat" | "review" | "fix" | "optimize";
    setInput: (value: string) => void;
    messagesEndRef?: React.RefObject<HTMLDivElement | null>;
    isStreaming?: boolean;
    currentStreamingMessageId?: string | null;
    streamedContent?: string;
}

const MessageTypeIndicator: React.FC<{
    type?: string;
    model?: string;
    tokens?: number;
}> = ({ type, model, tokens }) => {
    const getTypeConfig = (type?: string) => {
        switch (type) {
            case "code_review":
                return { icon: Code, color: "text-blue-400", label: "Code Review" };
            case "suggestion":
                return {
                    icon: Sparkles,
                    color: "text-purple-400",
                    label: "Suggestion",
                };
            case "error_fix":
                return { icon: RefreshCw, color: "text-red-400", label: "Error Fix" };
            case "optimization":
                return { icon: Zap, color: "text-yellow-400", label: "Optimization" };
            default:
                return { icon: MessageSquare, color: "text-zinc-400", label: "Chat" };
        }
    };

    const config = getTypeConfig(type);
    const Icon = config.icon;

    return (
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
                <Icon className={cn("h-3 w-3", config.color)} />
                <span className={cn("text-xs font-medium", config.color)}>
                    {config.label}
                </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
                {model && <span>{model}</span>}
                {tokens && <span>{tokens} tokens</span>}
            </div>
        </div>
    );
};

const MessageContainer: React.FC<MessageContainerProps> = ({
    filteredMessages,
    isLoading,
    chatMode,
    setInput,
    messagesEndRef,
    isStreaming,
    currentStreamingMessageId,
    streamedContent,
}) => {

    const currentUser = useCurrentUser()
    // console.log("Current user", currentUser);

    return (
        <div className="flex-1 overflow-y-auto bg-zinc-950">
            <div className="p-6 space-y-6">
                {filteredMessages.length === 0 && !isLoading && (
                    <div className="text-center text-zinc-500 py-16">
                        <div className="relative w-16 h-16 border rounded-full flex flex-col justify-center items-center mx-auto mb-4">
                            <Brain className="h-8 w-8 text-zinc-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-zinc-300">
                            Enhanced AI Assistant
                        </h3>
                        <p className="text-zinc-400 max-w-md mx-auto leading-relaxed mb-6">
                            Advanced AI coding assistant with comprehensive analysis
                            capabilities.
                        </p>
                        <div className="grid grid-cols-2 gap-2 max-w-lg mx-auto">
                            {[
                                "Review my React component for performance",
                                "Fix TypeScript compilation errors",
                                "Optimize database query performance",
                                "Add comprehensive error handling",
                                "Implement security best practices",
                                "Refactor code for better maintainability",
                            ].map((suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() => setInput(suggestion)}
                                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-zinc-300 transition-colors text-left"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {filteredMessages.map((msg) => (
                    <div key={msg.id} className="space-y-4">
                        <div
                            className={cn(
                                "flex items-start gap-4 group",
                                msg.role === "user" ? "justify-end" : "justify-start"
                            )}
                        >
                            {msg.role === "model" && (
                                <div className="relative w-10 h-10 border rounded-full flex flex-col justify-center items-center">
                                    <Brain className="h-5 w-5 text-zinc-400" />
                                </div>
                            )}

                            <div
                                className={cn(
                                    "max-w-[85%] rounded-xl shadow-sm",
                                    msg.role === "user"
                                        ? "bg-zinc-900/70 text-white p-4 rounded-br-md"
                                        : "bg-zinc-900/80 backdrop-blur-sm text-zinc-100 p-5 rounded-bl-md border border-zinc-800/50"
                                )}
                            >
                                {msg.role === "model" && (
                                    <MessageTypeIndicator
                                        type={msg.type}
                                        model={msg.model}
                                        tokens={msg.tokens}
                                    />
                                )}

                                <div className="prose prose-invert prose-sm max-w-none">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm, remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                        components={{
                                            //@ts-ignore
                                            code: ({ inline, className, children }) => {
                                                if (inline) return <code className="bg-zinc-800 px-1 py-0.5 rounded text-sm">{children}</code>;
                                                return (
                                                    <pre className="bg-zinc-800 rounded-lg p-4 my-4 overflow-x-auto text-sm text-zinc-100">
                                                        <code className={className}>{children}</code>
                                                    </pre>
                                                );
                                            }

                                        }}
                                    >
                                        {/* {msg.content} */}
                                        {isStreaming && msg.id === currentStreamingMessageId
                                            ? streamedContent
                                            : msg.content
                                        }
                                    </ReactMarkdown>
                                </div>

                                {/* Message actions */}
                                <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-700/30">
                                    <div className="text-xs text-zinc-500">
                                        {moment(msg.timestamp).fromNow()}
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                navigator.clipboard.writeText(msg.content)
                                            }
                                            className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-200"
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setInput(msg.content)}
                                            className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-200"
                                        >
                                            <RefreshCw className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {msg.role === "user" && (
                                <Avatar className="h-12 w-12 border border-zinc-700 bg-zinc-800 shrink-0">
                                    <AvatarImage
                                        src={currentUser?.image ?? ''}
                                        alt="user-avatar"
                                        className="object-fill h-12 w-12"
                                    />
                                    <AvatarFallback className="bg-zinc-700 text-zinc-300">
                                        {currentUser?.name?.[0] ?? <User className="h-10 w-10" />}
                                    </AvatarFallback>
                                </Avatar>

                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex items-start gap-4 justify-start">
                        <div className="relative w-10 h-10 border rounded-full flex flex-col justify-center items-center">
                            <Brain className="h-5 w-5 text-zinc-400" />
                        </div>
                        <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50 p-5 rounded-xl rounded-bl-md flex items-center gap-3">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                            <span className="text-sm text-zinc-300">
                                {chatMode === "review"
                                    ? "Analyzing code structure and patterns..."
                                    : chatMode === "fix"
                                        ? "Identifying issues and solutions..."
                                        : chatMode === "optimize"
                                            ? "Analyzing performance bottlenecks..."
                                            : "Processing your request..."}
                            </span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} className="h-1" />
            </div>
        </div>
    )
}

export default MessageContainer