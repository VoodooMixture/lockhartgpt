import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { executeAction } from '@/lib/actions/executor';
import { UIAction } from "@/lib/actions/schema";

export function useProjectChat() {
    const { messages, addMessage, updateMessage, setIsLoading, mode, interviewMode } = useAppStore();
    const processedMessageIds = useRef<Set<string>>(new Set());
    const isFetching = useRef(false); // Prevent double-fetch
    const lastProcessedCount = useRef(0); // Track last processed message count

    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        const isInterviewStart = interviewMode && messages.length === 0 && mode === 'app';

        // Determine if we should trigger
        const shouldTriggerForUser = lastMessage?.role === 'user' && !processedMessageIds.current.has(lastMessage.id);
        const shouldTriggerForInterview = isInterviewStart && !processedMessageIds.current.has('interview-start');

        if (!shouldTriggerForUser && !shouldTriggerForInterview) {
            return;
        }

        // Mark as processed IMMEDIATELY to prevent double-execution
        if (shouldTriggerForUser && lastMessage) {
            // Extra safety: Check if we've already processed this ID in this run
            if (processedMessageIds.current.has(lastMessage.id)) return;
            processedMessageIds.current.add(lastMessage.id);
        }
        if (shouldTriggerForInterview) {
            processedMessageIds.current.add('interview-start');
        }

        // Additional guard: Check if we've already processed this message count
        const currentCount = messages.length;
        if (currentCount === lastProcessedCount.current && !isInterviewStart) {
            return;
        }
        lastProcessedCount.current = currentCount;

        // Prevent simultaneous fetches - set flag IMMEDIATELY before any async work
        if (isFetching.current) {
            return;
        }
        isFetching.current = true; // Set BEFORE defining async function

        const fetchResponse = async () => {
            setIsLoading(true);

            // Create placeholder BEFORE any async work
            const assistantMsgId = `assistant-${Date.now()}`;

            try {
                // Add placeholder assistant message
                addMessage({
                    id: assistantMsgId,
                    role: 'assistant',
                    content: '',
                    timestamp: Date.now()
                });

                // Build the messages to send
                const messagesToSend = shouldTriggerForInterview
                    ? [{ role: 'user' as const, content: '[INTERVIEW_START] The user clicked "Tailor to you". Begin the interview by introducing yourself briefly as Rob\'s AI clone and asking an open-ended question to understand their goals (hiring, exploring, investing, etc.).' }]
                    : messages.map(m => ({ role: m.role, content: m.content }));

                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: messagesToSend,
                        interviewMode
                    })
                });

                if (!response.ok) {
                    throw new Error(`API returned ${response.status}: ${response.statusText}`);
                }

                if (!response.body) {
                    throw new Error("No response body");
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = "";
                let receivedFinal = false;

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
                                receivedFinal = true;
                                const parsed = event.content;

                                // Safely extract message
                                const messageContent = parsed?.assistant_message || parsed?.message || "I received your message but couldn't generate a proper response.";
                                const actions = parsed?.ui_actions || [];

                                updateMessage(assistantMsgId, messageContent, actions);

                                if (actions && Array.isArray(actions)) {
                                    actions.forEach((action: UIAction) => {
                                        executeAction(action);
                                    });
                                }
                            }
                        } catch (e) {
                            console.error("Stream Parse Error", line, e);
                        }
                    }
                }

                // If we never received a final event, show an error
                if (!receivedFinal) {
                    const currentMsg = useAppStore.getState().messages.find(m => m.id === assistantMsgId);
                    if (currentMsg && !currentMsg.content) {
                        updateMessage(assistantMsgId, "I didn't receive a complete response. Please try again.", []);
                    }
                }

            } catch (error: any) {
                console.error("Chat Error", error);
                // Update the placeholder message with error
                updateMessage(assistantMsgId, `Sorry, I encountered an error: ${error.message || "Unknown error"}. Please try again.`, []);
            } finally {
                isFetching.current = false;
                setIsLoading(false);
                useAppStore.getState().setThought(""); // Clear thought
            }
        };

        fetchResponse();

    }, [messages, addMessage, updateMessage, setIsLoading, mode, interviewMode]);
}
