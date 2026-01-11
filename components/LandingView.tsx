"use client";

import { useAppStore } from "@/store/useAppStore";
import { GhostComposer } from "@/components/GhostComposer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowUp, Sparkles } from "lucide-react";

export default function LandingView() {
    const { input, setInput, interviewMode, setInterviewMode, setMode, addMessage } =
        useAppStore();

    const handleSend = () => {
        if (!input.trim()) return;

        // If input exists, add it. If not (interview start), just switch mode.
        if (input.trim()) {
            addMessage({
                id: Date.now().toString(),
                role: 'user',
                content: input,
                timestamp: Date.now()
            });
        }

        setInput('');
        setMode('app');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const SUGGESTIONS = [
        "How did you cut OpEx by 40% at Fathom?",
        "Show me your financial modeling work.",
        "How does your AI automation stack work?",
        "Tell me about bootstrapping Top Hat to $1M.",
    ];

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex w-full max-w-2xl flex-col items-center gap-8"
            >
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight mb-2">LockhartGPT</h1>
                    <p className="text-muted-foreground">
                        Interactive AI Portfolio. Ask anything or start an interview.
                    </p>
                </div>

                <div className="w-full relative">
                    <div className="relative flex items-center">
                        <Input
                            className="h-14 pl-4 pr-12 text-lg rounded-xl bg-secondary/50 border-transparent focus-visible:ring-1 focus-visible:ring-primary/20 transition-all hover:bg-secondary/80"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        {!input && <GhostComposer />}
                        <Button
                            size="icon"
                            className="absolute right-2 h-10 w-10 rounded-lg"
                            onClick={handleSend}
                            disabled={!input.trim()}
                        >
                            <ArrowUp className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                    {SUGGESTIONS.map((s) => (
                        <Badge
                            key={s}
                            variant="secondary"
                            className="cursor-pointer hover:bg-primary/10 px-3 py-1.5 text-sm font-normal"
                            onClick={() => setInput(s)}
                        >
                            {s}
                        </Badge>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-4 mt-8">
                    <div className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Or</div>
                    <Button
                        variant="outline"
                        size="lg"
                        className="gap-2 rounded-full px-8 border-primary/20 hover:bg-primary/5 hover:border-primary/50 transition-all group"
                        onClick={() => {
                            setInterviewMode(true);
                            setMode('app');
                        }}
                    >
                        <Sparkles className="h-4 w-4 text-amber-500 group-hover:text-amber-400" />
                        <span>Tailor to you</span>
                    </Button>
                    <p className="text-[10px] text-muted-foreground/50">
                        I'll ask the questions to customize your experience.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
