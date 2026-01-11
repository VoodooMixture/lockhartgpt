import { z } from "zod";

export const ActionSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("set_mode"),
        mode: z.enum(["landing", "app"]),
    }),
    z.object({
        type: z.literal("set_active_tab"),
        tabId: z.string(),
    }),
    z.object({
        type: z.literal("upsert_tab"),
        tabId: z.string(),
        title: z.string(),
        content: z.string(),
        language: z.enum(["markdown", "json", "javascript", "typescript", "text"]).optional(),
    }),
    z.object({
        type: z.literal("update_context"),
        role: z.string().optional(),
        outcome90: z.string().optional(),
        constraints: z.array(z.string()).optional(),
        evidence: z.array(z.string()).optional(),
    }),
    z.object({
        type: z.literal("set_suggestions"),
        suggestions: z.array(z.string()),
    }),
    z.object({
        type: z.literal("open_file"),
        path: z.string(),
    }),
    z.object({
        type: z.literal("open_sheet"),
        sheetId: z.string(),
        title: z.string().optional(),
    }),
    z.object({
        type: z.literal("toast"),
        message: z.string(),
        variant: z.enum(["default", "destructive"]).optional(),
    }),
]);

export type UIAction = z.infer<typeof ActionSchema>;

export const LLMOutputSchema = z.object({
    assistant_message: z.string(),
    ui_actions: z.array(ActionSchema),
});
