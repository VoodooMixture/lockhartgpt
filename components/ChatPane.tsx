"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useProjectChat } from "@/hooks/useProjectChat";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, User, Bot, Loader2, Sparkles, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Markdown from 'react-markdown';

export function ChatPane() {
    const { messages, input, setInput, addMessage, interviewMode, isLoading, thought } = useAppStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    useProjectChat();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading]);

    const handleSend = () => {
        if (!input.trim() || isLoading) return;
        addMessage({
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: Date.now()
        });
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex h-full flex-col bg-muted/5">
            {/* Header */}
            <div className="h-14 px-4 border-b border-border/40 flex items-center justify-between bg-background/50 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <h2 className="font-semibold text-sm tracking-tight">LockhartChat</h2>
                </div>
                {interviewMode && (
                    <Badge variant="outline" className="text-[10px] py-0 h-5 border-amber-500/50 text-amber-500 gap-1 bg-amber-500/5">
                        <Sparkles className="h-2 w-2" /> Interview
                    </Badge>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground/50">
                        <Bot className="h-12 w-12 mb-4 opacity-20" />
                        <p className="text-sm">Start the conversation...</p>
                    </div>
                )}
                {messages
                    // Filter out empty assistant messages when loading (they're placeholders)
                    .filter(m => !(m.role === 'assistant' && !m.content && isLoading))
                    .map((m) => (
                        <div key={m.id} className={cn("flex flex-col gap-1 max-w-[90%]", m.role === 'user' ? "ml-auto items-end" : "items-start")}>
                            <div className={cn("text-[10px] text-muted-foreground px-1", m.role === 'user' ? "text-right" : "text-left")}>
                                {m.role === 'user' ? "You" : "LockhartGPT"}
                            </div>
                            <div
                                className={cn(
                                    "rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed max-w-full",
                                    m.role === 'user'
                                        ? "bg-white text-zinc-900 font-medium rounded-tr-sm"
                                        : "bg-card border border-border/50 text-foreground rounded-tl-sm w-full"
                                )}
                            >
                                <div className={cn("prose prose-sm max-w-none prose-p:leading-relaxed prose-li:my-0.5", m.role === 'user' ? "prose-p:text-zinc-900 prose-headings:text-zinc-900 prose-strong:text-zinc-900" : "prose-invert")}>
                                    <Markdown>
                                        {m.content}
                                    </Markdown>
                                </div>

                                {/* Citation / Action Cards */}
                                {m.actions && m.actions.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {m.actions.map((action, i) => {
                                            if (action.type === 'open_file') {
                                                return (
                                                    <div
                                                        key={i}
                                                        className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary/80 border border-border/50 rounded-lg px-3 py-2 cursor-pointer transition-colors"
                                                        onClick={() => {
                                                            useAppStore.getState().setActiveTab(action.path);
                                                            useAppStore.getState().setLayout('split');
                                                        }}
                                                    >
                                                        <div className="h-8 w-8 rounded bg-background flex items-center justify-center border border-border/30">
                                                            <span className="text-xs">📄</span>
                                                        </div>
                                                        <div className="flex flex-col text-left">
                                                            <span className="text-xs font-medium text-foreground">{action.path}</span>
                                                            <span className="text-[10px] text-muted-foreground">Click to view</span>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                {isLoading && (
                    <div className="flex flex-col gap-1 items-start max-w-[90%]">
                        <div className="text-[10px] text-muted-foreground px-1">LockhartGPT</div>
                        <div className="bg-card border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{thought || "Thinking..."}</span>
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 pb-2 md:pb-4 bg-background/50 backdrop-blur-sm border-t border-border/40">
                <div className="relative shadow-sm rounded-xl overflow-hidden bg-card border border-border/50 focus-within:ring-1 focus-within:ring-ring transition-all">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="pr-12 border-0 bg-transparent h-12 text-sm focus-visible:ring-0 placeholder:text-muted-foreground/50"
                        disabled={isLoading}
                    />

                    <div className="absolute right-1 top-1 bottom-1 flex items-center gap-1">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="text-[10px] text-center text-muted-foreground/30 mt-2">
                    Press Enter to send
                </div>
            </div>
        </div>
    );
}
