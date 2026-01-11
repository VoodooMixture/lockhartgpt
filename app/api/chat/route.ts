import { OpenAI } from "openai";
import { SYSTEM_PROMPT } from "@/lib/prompts/system";
import { getSpreadsheetValues } from "@/lib/google/sheets";

// Google APIs require Node.js runtime
export const runtime = "nodejs";

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
    {
        type: "function",
        function: {
            name: "read_google_sheet",
            description: "Fetch data from a Google Sheet. Use this when the user asks about specific numbers, financial models, or spreadsheets.",
            parameters: {
                type: "object",
                properties: {
                    sheetId: {
                        type: "string",
                        description: "The ID of the Google Sheet (from the URL)",
                    },
                },
                required: ["sheetId"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "search_knowledge_base",
            description: "Search the offline 'Archive' (Vector Database). Use this for questions about specific documents, PDFs, historical records, or unstructured knowledge not in your active memory.",
            parameters: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description: "The search query to send to the Archive.",
                    },
                },
                required: ["query"],
            },
        },
    },
];

// Helper to push events to stream
const sendEvent = (controller: ReadableStreamDefaultController, data: any) => {
    controller.enqueue(new TextEncoder().encode(JSON.stringify(data) + "\n"));
};

export async function POST(req: Request) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY!,
    });

    // Create a streaming response immediately
    const stream = new ReadableStream({
        async start(controller) {
            try {
                const { messages, interviewMode } = await req.json();

                // 1. Send initial thought
                sendEvent(controller, { type: "thought", content: "Analyzing Request..." });

                const modePrompt = interviewMode
                    ? "INTERVIEW MODE IS ACTIVE. Start with a broad, open-ended question to understand the user's goal."
                    : "STANDARD MODE. Answer questions about the portfolio.";

                const systemMessage = {
                    role: "system" as const,
                    content: SYSTEM_PROMPT + "\n\n" + modePrompt,
                };

                const mkMessages = [systemMessage, ...messages];

                // 2. First Pass: Check for Tool Calls
                const firstRunner = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: mkMessages,
                    tools: tools,
                    tool_choice: "auto",
                    response_format: { type: "json_object" },
                });

                const firstMsg = firstRunner.choices[0].message;

                // If no tool calls, simulate final stream right away
                if (!firstMsg.tool_calls || firstMsg.tool_calls.length === 0) {
                    sendEvent(controller, { type: "thought", content: "Generating Response..." });

                    const finalRes = await openai.chat.completions.create({
                        model: "gpt-4o-mini",
                        messages: mkMessages,
                        response_format: { type: "json_object" },
                    });

                    // Send final result
                    const content = finalRes.choices[0].message.content;
                    if (content) {
                        sendEvent(controller, { type: "final", content: JSON.parse(content) });
                    }
                    controller.close();
                    return;
                }

                // 3. Handle Tool Calls
                const toolMessages = [...mkMessages, firstMsg];

                for (const toolCall of firstMsg.tool_calls) {
                    if (toolCall.function.name === "read_google_sheet") {
                        const args = JSON.parse(toolCall.function.arguments);

                        // Notify Frontend: reading sheet
                        sendEvent(controller, { type: "thought", content: `Reading Google Sheet (${args.sheetId})...` });

                        let toolResult = "";
                        try {
                            const data = await getSpreadsheetValues(args.sheetId);
                            // Compress data: key-value pairs or CSV text
                            toolResult = JSON.stringify(data).slice(0, 100000); // Safety cap
                        } catch (e: any) {
                            toolResult = "Error: " + e.message;
                        }

                        // Notify Frontend: Synthesizing
                        sendEvent(controller, { type: "thought", content: "Synthesizing Financial Data..." });

                        toolMessages.push({
                            role: "tool",
                            tool_call_id: toolCall.id,
                            content: toolResult,
                        });
                    }

                    if (toolCall.function.name === "search_knowledge_base") {
                        const args = JSON.parse(toolCall.function.arguments);

                        // Notify Frontend
                        sendEvent(controller, { type: "thought", content: `Searching Archive for "${args.query}"...` });

                        let toolResult = "";
                        try {
                            // Call Python Backend (The Archive)
                            const archiveUrl = process.env.ARCHIVE_URL || "http://localhost:8002";

                            const res = await fetch(`${archiveUrl}/search`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ query: args.query, limit: 3 })
                            });

                            const data = await res.json();
                            toolResult = JSON.stringify(data.results);
                        } catch (e: any) {
                            toolResult = "Archive Error: " + e.message;
                            console.error("Vector RAG Error", e);
                        }

                        sendEvent(controller, { type: "thought", content: "Analyzing Archived Documents..." });

                        toolMessages.push({
                            role: "tool",
                            tool_call_id: toolCall.id,
                            content: toolResult,
                        });
                    }
                }

                // 4. Final Generation
                sendEvent(controller, { type: "thought", content: "Drafting Final Analysis..." });

                const finalRes = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: toolMessages,
                    response_format: { type: "json_object" },
                });

                const content = finalRes.choices[0].message.content;
                if (content) {
                    sendEvent(controller, { type: "final", content: JSON.parse(content) });
                }

                controller.close();

            } catch (error) {
                console.error("Stream Error", error);
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    });
}
