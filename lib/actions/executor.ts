import { UIAction } from "./schema";
import { useAppStore } from "@/store/useAppStore";
import { SEED_CONTENT } from "@/lib/portfolio/content";

export function executeAction(action: UIAction) {
    const store = useAppStore.getState();

    console.log("Executing Action:", action);

    switch (action.type) {
        case "set_mode":
            store.setMode(action.mode);
            break;

        case "open_file":
            // Check if file exists in seed content, if so, load it
            const content = SEED_CONTENT[action.path];
            if (content) {
                // Simplification: "open_file" just upserts a tab with that content
                store.upsertTab({
                    id: action.path,
                    title: action.path,
                    content: content,
                    type: 'file',
                    language: 'markdown' // helper to guess later
                });
                store.setActiveTab(action.path);
                store.setLayout('split');
            }
            break;

        case "open_sheet":
            store.upsertTab({
                id: action.sheetId,
                title: action.title || "Google Sheet",
                content: "", // No text content needed for embed
                type: 'sheet',
                metadata: { sheetId: action.sheetId }
            });
            store.setActiveTab(action.sheetId);
            store.setLayout('split');
            break;

        case "upsert_tab":
            store.upsertTab({
                id: action.tabId,
                title: action.title,
                content: action.content,
                type: 'generated',
                language: action.language || 'markdown'
            });
            store.setActiveTab(action.tabId);
            store.setLayout('split');
            break;

        case "set_active_tab":
            store.setActiveTab(action.tabId);
            break;

        case "update_context":
            // Merge with existing context
            store.updateContext(action);
            break;

        case "set_suggestions":
            // Store suggestions in state (we need to add this to store)
            // store.setSuggestions(action.suggestions);
            break;

        case "toast":
            // Placeholder for toast
            console.log("TOAST:", action.message);
            break;
    }
}
