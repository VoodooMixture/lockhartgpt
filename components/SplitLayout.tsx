"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatPane } from "./ChatPane";
import { WorkspacePane } from "./WorkspacePane";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageSquare, FileCode, X } from "lucide-react";

export function SplitLayout() {
    const { layout, setLayout, tabs } = useAppStore();
    const [mobileView, setMobileView] = useState<'chat' | 'workspace'>('chat');

    const hasOpenTabs = tabs.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex h-screen w-full overflow-hidden bg-background max-w-[1920px] mx-auto relative"
        >
            {/* Desktop View Toggle */}
            <div className="absolute top-4 right-4 z-50 hidden md:flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLayout(layout === 'split' ? 'chat' : 'split')}
                    className="bg-background/80 backdrop-blur shadow-sm"
                >
                    {layout === 'split' ? 'Focus Chat' : 'Show Workspace'}
                </Button>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
                <div className="bg-background/95 backdrop-blur-lg border-t border-border/50 px-4 py-2 flex items-center justify-around gap-2 safe-area-bottom">
                    <Button
                        variant={mobileView === 'chat' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setMobileView('chat')}
                        className={cn(
                            "flex-1 gap-2 transition-all",
                            mobileView === 'chat'
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground"
                        )}
                    >
                        <MessageSquare className="h-4 w-4" />
                        <span>Chat</span>
                    </Button>
                    <Button
                        variant={mobileView === 'workspace' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setMobileView('workspace')}
                        disabled={!hasOpenTabs}
                        className={cn(
                            "flex-1 gap-2 transition-all",
                            mobileView === 'workspace'
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground",
                            !hasOpenTabs && "opacity-50"
                        )}
                    >
                        <FileCode className="h-4 w-4" />
                        <span>Files</span>
                        {hasOpenTabs && (
                            <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded-full">
                                {tabs.length}
                            </span>
                        )}
                    </Button>
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="flex flex-col w-full h-full md:hidden pb-14">
                <AnimatePresence mode="wait">
                    {mobileView === 'chat' ? (
                        <motion.div
                            key="mobile-chat"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1 min-h-0"
                        >
                            <ChatPane />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="mobile-workspace"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1 min-h-0"
                        >
                            <WorkspacePane />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex w-full h-full">
                {/* Left Chat Pane - Dynamic Width */}
                <motion.div
                    layout
                    initial={false}
                    animate={{
                        width: layout === 'chat' ? "100%" : "380px",
                        maxWidth: layout === 'chat' ? "768px" : "100%",
                        marginInline: layout === 'chat' ? "auto" : "0"
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className={cn(
                        "flex flex-col z-10 shadow-sm relative border-r border-border/50 bg-card/50",
                        layout === 'chat' ? "border-x" : ""
                    )}
                >
                    <ChatPane />
                </motion.div>

                {/* Center Workspace Pane - Hidden in Chat Mode */}
                <AnimatePresence>
                    {layout === 'split' && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex-1 min-w-0 bg-background/50 flex flex-col relative z-0"
                        >
                            <WorkspacePane />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
