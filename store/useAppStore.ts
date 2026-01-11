import { create } from 'zustand';
import { UIAction } from "@/lib/actions/schema";

export type Role = 'user' | 'assistant';

export interface Message {
    id: string;
    role: Role;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
    actions?: any[]; // Store UI actions for display
}

export type AppMode = 'landing' | 'app';

export interface Tab {
    id: string;
    title: string;
    type: 'file' | 'generated' | 'sheet';
    content: string;
    language?: string;
    metadata?: {
        sheetId?: string;
        [key: string]: any;
    };
}

interface AppState {
    mode: AppMode;
    messages: Message[];
    input: string;
    interviewMode: boolean;
    isLoading: boolean;

    // Workspace State
    tabs: Tab[];
    activeTabId: string | null;
    context: {
        role?: string;
        outcome90?: string;
        constraints?: string[];
        evidence?: string[];
    };

    // Actions
    setMode: (mode: AppMode) => void;
    setLayout: (layout: 'split' | 'chat') => void;
    setInput: (input: string) => void;
    setInterviewMode: (enabled: boolean) => void;
    addMessage: (message: Message) => void;
    updateMessage: (id: string, content: string) => void; // For streaming
    setIsLoading: (loading: boolean) => void;
    setThought: (text: string) => void;

    // Workspace Actions
    upsertTab: (tab: Tab) => void;
    setActiveTab: (id: string) => void;
    updateContext: (context: Partial<AppState['context']>) => void;
}

export const useAppStore = create<AppState>((set) => ({
    mode: 'landing',
    messages: [],
    input: '',
    interviewMode: false,
    isLoading: false,
    thought: "",
    layout: 'chat', // Changed default layout to 'chat'

    tabs: [],
    activeTabId: null,
    context: {
        role: 'Virtual Clone',
        outcome90: '',
        constraints: [],
        evidence: []
    },

    setMode: (mode) => set({ mode }),
    setLayout: (layout) => set({ layout }),
    setInput: (input) => set({ input }),
    setInterviewMode: (enabled) => set({ interviewMode: enabled }),
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

    updateMessage: (id, content, actions) => set((state) => ({
        messages: state.messages.map((m) =>
            m.id === id ? { ...m, content, actions: actions || m.actions } : m
        )
    })),

    setIsLoading: (loading) => set({ isLoading: loading }),
    setThought: (text) => set({ thought: text }),

    upsertTab: (tab) => set((state) => {
        const exists = state.tabs.find(t => t.id === tab.id);
        if (exists) {
            return { tabs: state.tabs.map(t => t.id === tab.id ? tab : t) };
        }
        return { tabs: [...state.tabs, tab] };
    }),

    setActiveTab: (id) => set({ activeTabId: id }),

    updateContext: (ctx) => set((state) => ({
        context: { ...state.context, ...ctx }
    }))
}));
