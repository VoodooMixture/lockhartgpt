import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { executeAction } from '@/lib/actions/executor';
import { UIAction } from "@/lib/actions/schema";

export function useProjectChat() {
    const { messages, addMessage, updateMessage, setIsLoading, mode, interviewMode } = useAppStore();
    const processedMessageIds = useRef<Set<string>>(new Set());

    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        const isInterviewStart = interviewMode && messages.length === 0 && mode === 'app';

        // Trigger if:
        // 1. User just sent a message (standard flow)
        // 2. We just entered Interview Mode with no messages (AI starts)
        const shouldTrigger = (lastMessage?.role === 'user' && !processedMessageIds.current.has(lastMessage.id)) ||
            (isInterviewStart && !processedMessageIds.current.has('interview-start'));

        if (!shouldTrigger) {
            return;
        }

        const fetchResponse = async () => {
            setIsLoading(true);

            if (lastMessage?.role === 'user') {
                processedMessageIds.current.add(lastMessage.id);
            } else if (isInterviewStart) {
                processedMessageIds.current.add('interview-start');
            }

            try {
                // Add placeholder assistant message
                const assistantMsgId = Date.now().toString();
                addMessage({
                    id: assistantMsgId,
                    role: 'assistant',
                    content: '',
                    timestamp: Date.now()
                });

                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        // For interview mode start, send a synthetic message to prompt the AI
                        messages: isInterviewStart && messages.length === 0
                            ? [{ role: 'user', content: '[INTERVIEW_START] The user has clicked "Tailor to you". Begin the interview by introducing yourself and asking an open-ended question to understand their goals.' }]
                            : messages.map(m => ({ role: m.role, content: m.content })),
                        interviewMode
                    })
                });

                if (!response.body) return;

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    buffer += chunk;

                    // Split by newline to handle NDJSON
                    const lines = buffer.split("\n");
                    buffer = lines.pop() || ""; // Keep incomplete line in buffer

                    for (const line of lines) {
                        if (!line.trim()) continue;
                        try {
                            const event = JSON.parse(line);

                            if (event.type === 'thought') {
                                // Update "Thinking..." text
                                useAppStore.getState().setThought(event.content);
                            }

                            if (event.type === 'final') {
                                // Final Answer Received
                                const parsed = event.content;
                                updateMessage(assistantMsgId, parsed.assistant_message, parsed.ui_actions);

                                if (parsed.ui_actions && Array.isArray(parsed.ui_actions)) {
                                    parsed.ui_actions.forEach((action: UIAction) => {
                                        executeAction(action);
                                    });
                                }
                            }
                        } catch (e) {
                            console.error("Stream Parse Error", line);
                        }
                    }
                }
            } catch (error) {
                console.error("Chat Error", error);
                // Update the last message with an error if we have one
                const lastMsg = useAppStore.getState().messages[useAppStore.getState().messages.length - 1];
                if (lastMsg && lastMsg.role === 'assistant' && !lastMsg.content) {
                    updateMessage(lastMsg.id, "Sorry, I encountered an error connecting to the AI. Please try again.", []);
                }
            } finally {
                setIsLoading(false);
                useAppStore.getState().setThought(""); // Clear thought
            }
        };

        fetchResponse();

    }, [messages, addMessage, updateMessage, setIsLoading, mode, interviewMode]);
}
