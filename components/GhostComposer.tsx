"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const GHOST_PROMPTS = [
    "How did you cut OpEx by 40%?",
    "Tell me about your experience with event-driven architecture.",
    "What is your approach to technical leadership?",
    "Show me the 'OnePager' for the fintech project.",
    "Why is Next.js your preferred framework?",
];

export function GhostComposer() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % GHOST_PROMPTS.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="pointer-events-none absolute inset-0 flex items-center px-4 text-muted-foreground/50">
            <AnimatePresence mode="wait">
                <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="truncate"
                >
                    {GHOST_PROMPTS[index]}
                </motion.span>
            </AnimatePresence>
        </div>
    );
}
