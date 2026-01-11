"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useAppStore } from "@/store/useAppStore";
import { FileCode, MoreHorizontal } from "lucide-react";
import { GoogleSheetEmbed } from "./GoogleSheetEmbed";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import Markdown from 'react-markdown';

export function WorkspacePane() {
    const { tabs, activeTabId, setActiveTab } = useAppStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const activeTab = tabs.find(t => t.id === activeTabId);

    return (
        <div className="flex h-full font-sans">



            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-background relative">
                {/* Cleaner Header / Tabs */}
                <div className="h-14 border-b border-border/40 flex items-center justify-between px-4 bg-background/80 backdrop-blur-sm">
                    {/* Minimal Tabs */}
                    {tabs.length > 0 && (
                        <div className="flex items-center gap-1 mx-4 overflow-x-auto no-scrollbar mask-gradient">
                            {tabs.map(tab => (
                                <div
                                    key={tab.id}
                                    className={cn(
                                        "px-3 py-1.5 text-xs flex items-center gap-2 rounded-md cursor-pointer transition-all border shrink-0",
                                        activeTabId === tab.id
                                            ? "bg-card border-border shadow-sm text-foreground font-medium"
                                            : "border-transparent text-muted-foreground hover:bg-muted/10 hover:text-foreground"
                                    )}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <FileCode className={cn("h-3 w-3", activeTabId === tab.id ? "text-blue-500" : "opacity-50")} />
                                    {tab.title}
                                </div>
                            ))}
                        </div>
                    )}

                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>

                {/* Editor Container with Padding */}
                <div className="flex-1 relative bg-background overflow-hidden">
                    {activeTab && mounted ? (
                        <div className="absolute inset-0 pt-0 flex flex-col">
                            {activeTab.type === 'sheet' && activeTab.metadata?.sheetId ? (
                                <GoogleSheetEmbed
                                    sheetId={activeTab.metadata.sheetId}
                                    title={activeTab.title}
                                />
                            ) : activeTab.language === 'markdown' ? (
                                <div className="flex-1 overflow-y-auto w-full no-scrollbar">
                                    <article className="prose prose-sm prose-invert max-w-none p-8 prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-2xl prose-h2:text-xl prose-p:leading-relaxed prose-li:my-1 prose-strong:text-foreground prose-strong:font-bold prose-code:bg-muted/50 prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground">
                                        <Markdown>{activeTab.content}</Markdown>
                                    </article>
                                </div>
                            ) : (
                                <div className="flex-1 pt-6">
                                    <Editor
                                        height="100%"
                                        defaultLanguage={activeTab.language || 'markdown'}
                                        theme="vs-dark"
                                        value={activeTab.content}
                                        path={activeTab.id}
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: 13,
                                            fontFamily: "var(--font-mono)",
                                            readOnly: true,
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            lineNumbers: 'on',
                                            folding: true,
                                            renderLineHighlight: 'none',
                                            padding: { top: 16, bottom: 16 },
                                            scrollbar: {
                                                vertical: 'hidden',
                                                horizontal: 'auto',
                                                useShadows: false
                                            },
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center text-muted-foreground/30 gap-2">
                            <div className="h-16 w-16 rounded-2xl bg-muted/10 flex items-center justify-center">
                                <FileCode className="h-8 w-8 opacity-20" />
                            </div>
                            <span className="text-sm">Select a file to view</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
