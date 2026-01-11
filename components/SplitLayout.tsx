"use client";

import { motion } from "framer-motion";
import { ChatPane } from "./ChatPane";
import { WorkspacePane } from "./WorkspacePane";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SplitLayout() {
    const { layout, setLayout } = useAppStore();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex h-screen w-full overflow-hidden bg-background max-w-[1920px] mx-auto"
        >
            {/* View Toggle (Floating or Header) */}
            <div className="absolute top-4 right-4 z-50 flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLayout(layout === 'split' ? 'chat' : 'split')}
                    className="bg-background/80 backdrop-blur shadow-sm"
                >
                    {layout === 'split' ? 'Focus Chat' : 'Show Workspace'}
                </Button>
            </div>

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

        </motion.div>
    );
}
