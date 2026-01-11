"use client";

import LandingView from "@/components/LandingView";
import { SplitLayout } from "@/components/SplitLayout";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
    const { mode } = useAppStore();

    return (
        <main className="h-screen w-full bg-background text-foreground overflow-hidden">
            <AnimatePresence mode="wait">
                {mode === 'landing' ? (
                    <motion.div
                        key="landing"
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                        className="h-full w-full"
                    >
                        <LandingView />
                    </motion.div>
                ) : (
                    <motion.div
                        key="app"
                        className="h-full w-full"
                    >
                        <SplitLayout />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
